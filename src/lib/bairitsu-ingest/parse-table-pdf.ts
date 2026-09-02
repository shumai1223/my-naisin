/**
 * T-Y11B 段階2-b: 「校数×学科」表形式の倍率PDFを、罫線＋文字座標から機械的に構造化する。
 *
 * 入力は`scripts/bairitsu-ingest/extract-pdf-geometry.py`（PyMuPDF）がページ単位で出力する
 * 文字座標（`chars`）と水平罫線（`hlines`）のJSON。このモジュール自体はPDF/ファイルI/Oを
 * 一切扱わない純粋関数群（呼び出し側がgeometryを用意する）。
 *
 * 【なぜ文字単位（word単位ではない）か】
 * PDFの`get_text("words")`はスペース区切りで単語分割するため、学校名と学科名の間に実際の
 * スペース文字が無いPDF（例:「水戸桜ノ牧常北校」+「普通」がスペース無しで隣接）では1つの
 * wordとして結合され、列の取り違えが起きる（ibarakiR8で実際に発生・原因特定済み）。文字
 * 単位のbboxを列のx範囲で振り分ければ、単語境界に依存せず正しく列を分離できる。
 *
 * 【なぜ罫線が必要か（quota定義だけでは解けない理由）】
 * 学校名セルが複数の学科行にまたがる「結合セル」を持つ表では、学校名ラベルは結合セル内の
 * どこか1行（多くの場合ほぼ中央の行）にだけ出現し、先頭行には出現しない。このため
 * 「ラベルが出たら以降を新しい学校として扱う」という単純な逐次スキャンでは、ラベル出現前
 * の行が前の学校に誤帰属する。一方、結合セルの内部境界を表す罫線は「学校名列（x0が小さい
 * 側）をまたがず、学科名列より右からしか引かれていない」という形で区別できるため、真の
 * ブロック境界（＝学校の切れ目）を罫線のx0だけで機械的に判定できる
 * （ibarakiのR8で149/149件・完全一致・順序も含め検証済み。2026-09-02）。
 */

export interface PdfChar {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  c: string;
}

export interface PdfHLine {
  y: number;
  x0: number;
  x1: number;
}

export interface PdfPageGeometry {
  chars: PdfChar[];
  hlines: PdfHLine[];
}

/**
 * 列レイアウト定義。boundaries[0..4]の4区間が [学校名, 学科名, 募集定員, 志願者数, 倍率] の
 * 5列に対応する（boundaries.length は5以上・6要素目以降の列（内数等）は本モジュールでは
 * 読み捨てる。将来的に必要になれば拡張する）。
 */
export interface TableColumnLayout {
  /** 例: [60.1, 114.6, 182.2, 223.6, 265.0, 306.4] （6要素why=5列分の区切り+右端） */
  boundaries: number[];
  /** この値以下のx0を持つ罫線は「学校名列をまたぐ完全な行/ブロック区切り」とみなす。 */
  fullLineX0Max: number;
}

export interface RawTableRow {
  yTop: number;
  yBottom: number;
  schoolName: string;
  department: string;
  quotaText: string;
  applicantsText: string;
  rateText: string;
  /** この行の下端の罫線が「完全な区切り」＝ここでブロック（学校）が終わる。 */
  isBlockEnd: boolean;
}

export interface ParsedCompetitionRow {
  schoolName: string;
  department: string;
  quota: number;
  finalApplicants: number;
  finalRate: number;
}

function columnIndexForX(x: number, boundaries: number[], numDataColumns: number): number {
  for (let i = 0; i < numDataColumns; i++) {
    if (x >= boundaries[i] - 1 && x < boundaries[i + 1] - 1) return i;
  }
  return -1;
}

/**
 * 半角カタカナ→全角・半角濁点/半濁点の合成を含む正規化（NFKCで一括対応できる）に加え、
 * 内部の空白（全角スペース含む）も除去する。
 *
 * 【なぜ内部空白まで除去するか】多くの県のPDFは学校名・学科名を「宇　都　宮」のように
 * 1文字ずつ均等割り付け（トラッキング）で組版しており、実際の空白文字が文字間に挿入
 * されている（tochigiのR8で実際に確認・2026-09-02）。日本語の学校名・学科名がこの
 * ドメインで実際に空白を含むことは無いため、`.trim()`（前後のみ）ではなく全角/半角
 * 空白を丸ごと除去してよい。ibarakiのように元々内部空白の無い県ではこの処理は無害
 * （no-op）。
 */
export function normalizeExtractedText(s: string): string {
  return s.normalize('NFKC').replace(/[\s　]+/g, '');
}

/**
 * 学科名の表記ゆれ正規化。教委PDFは複数学科を「普通、サイエンス」のように読点で列挙するが、
 * 本プロジェクトの既存47都道府県データ（`src/data/competition-rates/`）は一貫して読点でなく
 * 中黒「・」で表記する既存の転記慣行がある（多年度データの表記統一のため。ibarakiの
 * ヘッダコメント参照）。これはPDF側の文字化け等の不具合ではなく、本プロジェクト独自の
 * 表記統一ルールなので、正規化ロジックとして明示的に持つ。
 */
export function normalizeDepartmentText(s: string): string {
  return normalizeExtractedText(s).replace(/、/g, '・');
}

/**
 * 1ページ分のgeometryから、罫線で区切られた行（学科1行単位）を再構成する。
 * `isBlockEnd`は次のステップ（`assembleCompetitionRateRows`）でブロック（学校）の
 * 境界判定に使う。
 */
export function parseTablePdfPageRows(geom: PdfPageGeometry, layout: TableColumnLayout): RawTableRow[] {
  const { chars, hlines } = geom;
  const { boundaries, fullLineX0Max } = layout;
  const numDataColumns = Math.min(5, boundaries.length - 1);

  const sortedLines = [...hlines].sort((a, b) => a.y - b.y);
  const mergedLines: { y: number; x0: number }[] = [];
  for (const h of sortedLines) {
    const last = mergedLines[mergedLines.length - 1];
    if (last && Math.abs(last.y - h.y) < 1.0) {
      last.x0 = Math.min(last.x0, h.x0);
    } else {
      mergedLines.push({ y: h.y, x0: h.x0 });
    }
  }

  const rows: RawTableRow[] = [];
  for (let i = 0; i < mergedLines.length - 1; i++) {
    const yTop = mergedLines[i].y;
    const yBottom = mergedLines[i + 1].y;
    if (yBottom - yTop < 3) continue; // 罫線の重複等による退化した行は無視

    const rowChars = chars.filter((c) => c.y0 >= yTop - 0.5 && c.y0 < yBottom - 0.5);
    if (rowChars.length === 0) continue;

    const cellChars: PdfChar[][] = Array.from({ length: numDataColumns }, () => []);
    for (const c of rowChars) {
      const cx = (c.x0 + c.x1) / 2;
      const ci = columnIndexForX(cx, boundaries, numDataColumns);
      if (ci >= 0) cellChars[ci].push(c);
    }
    for (const arr of cellChars) arr.sort((a, b) => a.x0 - b.x0);
    const joinCol = (arr: PdfChar[]) => arr.map((c) => c.c).join('').trim();

    rows.push({
      yTop,
      yBottom,
      schoolName: joinCol(cellChars[0]),
      department: joinCol(cellChars[1]),
      quotaText: joinCol(cellChars[2]),
      applicantsText: joinCol(cellChars[3]),
      rateText: joinCol(cellChars[4]),
      isBlockEnd: mergedLines[i + 1].x0 <= fullLineX0Max,
    });
  }
  return rows;
}

/**
 * 複数ページの行を通しで受け取り、結合セル（学校名の中央行配置）を解決してレコード化する。
 * `summaryMarker`（例: '全日制計'）を含む行に到達したら、そこで打ち切る（全日制の本体表
 * より後ろの定時制・連携型・別表セクションは対象外）。
 *
 * ⚠️集計行自体がPDF内で学校名列と学科名列の境界をまたいで1文字ずつ分割されることがある
 * （例:「全日制計」の「全」だけが学校名列に、「日制計」が学科名列に入る）ため、判定は
 * schoolName単体・department単体の完全一致ではなく、両者を連結した文字列への部分一致で行う。
 */
export function assembleCompetitionRateRows(
  pageRows: RawTableRow[][],
  summaryMarker: string
): ParsedCompetitionRow[] {
  const allRows = pageRows.flat();
  const cutIdx = allRows.findIndex((r) => (r.schoolName + r.department).includes(summaryMarker));
  const scoped = cutIdx === -1 ? allRows : allRows.slice(0, cutIdx);

  const records: ParsedCompetitionRow[] = [];
  let blockRows: RawTableRow[] = [];
  for (const row of scoped) {
    blockRows.push(row);
    if (row.isBlockEnd) {
      const schoolName = blockRows.map((r) => r.schoolName).find((s) => s.length > 0) ?? '';
      for (const r of blockRows) {
        const quota = Number(r.quotaText.replace(/,/g, ''));
        const finalApplicants = Number(r.applicantsText.replace(/,/g, ''));
        const finalRate = Number(r.rateText);
        if (!r.department || !Number.isFinite(quota) || !Number.isFinite(finalApplicants) || !Number.isFinite(finalRate)) {
          continue; // 数値化できない行（脚注・空行の混入等）は正直にスキップする
        }
        records.push({
          schoolName: normalizeExtractedText(schoolName),
          department: normalizeDepartmentText(r.department),
          quota,
          finalApplicants,
          finalRate,
        });
      }
      blockRows = [];
    }
  }
  return records;
}

/**
 * 【もう一方のパターン: 学校名セルの結合が無い県向け】
 * ibaraki型（学校名ラベルが結合セルの中央行に出現）は少数派で、多くの県は学校名ラベルが
 * その学校の**先頭**の学科行にだけ印字され、継続行は単に空欄になるだけ（セル結合の罫線も
 * 学校名列を割らない）。この場合は罫線を見る必要が無く、**文字のy座標だけで行をクラスタ
 * リングし、schoolNameが空でない行が来るたびに「新しい学校」として単純にcarry-forward**
 * すれば正しく組み立てられる（tochigiのR8で107/107件・完全一致で検証済み。2026-09-02）。
 *
 * また、tochigiのように列数が多い県（募集定員・特色選抜内定者数・複数時点の出願人員/倍率
 * 等）ではquota/applicants/rateが学校名・学科名に隣接する列とは限らないため、列の役割を
 * インデックスで明示的に指定できるようにしている（`GeneralColumnLayout.roles`）。
 */

/** 罫線に頼らず、文字のy座標の近さだけで「同じ行」をクラスタリングする（汎用・堅牢）。 */
export function groupCharsIntoRows(chars: PdfChar[], yTolerance: number): { y: number; chars: PdfChar[] }[] {
  const sorted = [...chars].sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
  const rows: { y: number; chars: PdfChar[] }[] = [];
  for (const c of sorted) {
    const row = rows.find((r) => Math.abs(r.y - c.y0) < yTolerance);
    if (row) {
      row.chars.push(c);
      row.y = (row.y * (row.chars.length - 1) + c.y0) / row.chars.length; // 移動平均でクラスタの重心を更新
    } else {
      rows.push({ y: c.y0, chars: [c] });
    }
  }
  rows.sort((a, b) => a.y - b.y);
  return rows;
}

/** 列の役割をインデックスで指定する汎用レイアウト（列数・並びが県ごとに異なることに対応）。 */
export interface GeneralColumnLayout {
  /** N列ならN+1要素の境界x座標配列。 */
  boundaries: number[];
  /** `number`（№列）は任意。指定すると`assembleNumberedBlockRows`のブロック境界判定に使える。 */
  roles: { number?: number; schoolName: number; department: number; quota: number; finalApplicants: number; finalRate: number };
}

interface SimpleRowFields {
  numberText: string;
  schoolName: string;
  department: string;
  quotaText: string;
  applicantsText: string;
  rateText: string;
}

export function extractRowFields(rowChars: PdfChar[], layout: GeneralColumnLayout): SimpleRowFields {
  const { boundaries, roles } = layout;
  const numCols = boundaries.length - 1;
  const cellChars: PdfChar[][] = Array.from({ length: numCols }, () => []);
  for (const c of rowChars) {
    const cx = (c.x0 + c.x1) / 2;
    for (let i = 0; i < numCols; i++) {
      if (cx >= boundaries[i] - 1 && cx < boundaries[i + 1] - 1) {
        cellChars[i].push(c);
        break;
      }
    }
  }
  for (const arr of cellChars) arr.sort((a, b) => a.x0 - b.x0);
  const join = (idx: number) => cellChars[idx].map((c) => c.c).join('');
  return {
    numberText: roles.number !== undefined ? join(roles.number).trim() : '',
    schoolName: join(roles.schoolName),
    department: join(roles.department),
    quotaText: join(roles.quota).trim(),
    applicantsText: join(roles.finalApplicants).trim(),
    rateText: join(roles.finalRate).trim(),
  };
}

export interface AssembleSimpleOptions {
  /** この述語がtrueを返す行（例: 集計行「合計」）はスキップする。schoolNameは直前の
   *  carry-forward値、departmentはその行自身の値で判定する。 */
  excludeRow?: (schoolName: string, department: string) => boolean;
  /** quotaがこの値以下の行は除外する（既定0＝quota>0の不変条件。一般選抜非実施等）。 */
  minQuota?: number;
}

/** 学校名セルの結合が無い県向けの組み立て（先頭行にラベル・継続行は空欄・単純carry-forward）。 */
export function assembleSimpleTableRows(rowFields: SimpleRowFields[], options: AssembleSimpleOptions = {}): ParsedCompetitionRow[] {
  const minQuota = options.minQuota ?? 0;
  const records: ParsedCompetitionRow[] = [];
  let currentSchool = '';
  for (const r of rowFields) {
    const schoolName = normalizeExtractedText(r.schoolName);
    if (schoolName) currentSchool = schoolName;
    const department = normalizeDepartmentText(r.department);
    if (!department) continue;
    if (options.excludeRow?.(currentSchool, department)) continue;

    const quota = Number(r.quotaText.replace(/,/g, ''));
    const finalApplicants = Number(r.applicantsText.replace(/,/g, ''));
    const finalRate = Number(r.rateText);
    if (!Number.isFinite(quota) || quota <= minQuota) continue;
    if (!Number.isFinite(finalApplicants) || !Number.isFinite(finalRate)) continue;

    records.push({ schoolName: currentSchool, department, quota, finalApplicants, finalRate });
  }
  return records;
}

/**
 * 【3つ目のパターン: 学校名が複数行に折り返して分裂する県向け】
 * akita型: `№`（通し番号）列を持つ表で、学校名が長いと2行に折り返され、2行目の断片が
 * schoolName列に単独で出現する（例:「4　大館国際」の次の行に単独で「情報学院」＝
 * 正しくは「大館国際情報学院」1校）。tochigi型の単純carry-forwardでは「情報学院」を
 * 別の新しい学校と誤認してしまう（№列が空＝継続行という判断ができないため）。
 *
 * 解法: `№`列（`roles.number`）の有無でブロック境界を判定する（№が埋まっている行が
 * ブロックの先頭）。ブロック内の全schoolName断片を連結したものを、そのブロックに属する
 * 全レコードのschoolNameとして採用する（akitaのR8で78/78件・完全一致で検証済み。
 * 2026-09-02）。
 *
 * ⚠️地区計・県北計・中央計・県南計・県合計等の小計行は独立した№を持たないため、直前の
 * 学校ブロックに紛れ込む。この小計ラベルはdepartment列に出現する（schoolName列ではない）
 * ため、`excludeRow`はブロック単位ではなく**行単位**で判定する。「県合計」（総計行）に
 * 到達したら、それ以降は別表（定時制等）とみなし処理を打ち切ってよい（`stopMarker`）。
 *
 * ⚠️分校（本校と統合募集だが独立した番号を持たない）のように、1つのブロック内で特定の
 * 行だけ別の学校として扱いたい例外は`renameOverrides`で対応する（akitaの太田分校/雄勝校）。
 */
export interface AssembleNumberedBlockOptions {
  /** この述語がtrueを返す行（例: 小計行）はスキップする。department列の文字列で判定する。 */
  excludeRow?: (department: string) => boolean;
  /** この述語がtrueを返す行に到達したら、それ以降の全ブロックの処理を打ち切る（例: 総計行）。 */
  stopAt?: (department: string) => boolean;
  /**
   * ブロック内の特定の行（そのschoolName列の生テキストで判定）を、ブロック全体の連結名
   * ではなく個別の名前に差し替える（分校等）。連結名の計算からもこの行は除外される。
   */
  renameOverrides?: Record<string, string>;
  minQuota?: number;
}

/** akita型（№列でブロック境界・学校名は複数行断片の連結）の組み立て。 */
export function assembleNumberedBlockRows(rowFields: SimpleRowFields[], options: AssembleNumberedBlockOptions = {}): ParsedCompetitionRow[] {
  const minQuota = options.minQuota ?? 0;
  const overrides = options.renameOverrides ?? {};

  const blocks: SimpleRowFields[][] = [];
  let current: SimpleRowFields[] | null = null;
  for (const r of rowFields) {
    if (r.numberText) {
      current = [];
      blocks.push(current);
    }
    if (!current) continue; // 最初の番号付き行より前（見出し等）は対象外
    current.push(r);
  }

  const records: ParsedCompetitionRow[] = [];
  outer: for (const block of blocks) {
    const nameFragments = block
      .map((r) => normalizeExtractedText(r.schoolName))
      .filter((s) => s.length > 0 && !(s in overrides));
    const blockSchoolName = nameFragments.join('');

    for (const r of block) {
      const department = normalizeDepartmentText(r.department);
      if (!department) continue;
      if (options.stopAt?.(department)) break outer;
      if (options.excludeRow?.(department)) continue;

      const quota = Number(r.quotaText.replace(/,/g, ''));
      const finalApplicants = Number(r.applicantsText.replace(/,/g, ''));
      const finalRate = Number(r.rateText);
      if (!Number.isFinite(quota) || quota <= minQuota) continue;
      if (!Number.isFinite(finalApplicants) || !Number.isFinite(finalRate)) continue;

      const rowOwnName = normalizeExtractedText(r.schoolName);
      const schoolName = overrides[rowOwnName] ?? blockSchoolName;
      records.push({ schoolName, department, quota, finalApplicants, finalRate });
    }
  }
  return records;
}
