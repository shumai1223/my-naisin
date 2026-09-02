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

/** 半角カタカナ→全角・半角濁点/半濁点の合成を含む正規化（NFKCで一括対応できる）。 */
export function normalizeExtractedText(s: string): string {
  return s.normalize('NFKC').trim();
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
