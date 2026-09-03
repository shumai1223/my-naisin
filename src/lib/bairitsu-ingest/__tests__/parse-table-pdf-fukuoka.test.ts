import { normalizeExtractedText, normalizeDepartmentText, type PdfPageGeometry } from '../parse-table-pdf';
import { FUKUOKA_COMPETITION_RATES } from '@/data/competition-rates/fukuoka';
import fukuokaR8Geometry from '../__fixtures__/fukuoka-r8-geometry.json';

/**
 * T-Y11B 段階2-b: fukuoka(福岡県)のR8倍率パーサ検証テスト。県立分PDF（全4頁）＋
 * 市組合立分PDF（別PDF・1頁）の計5頁を1本のgeometry fixtureにまとめて扱う。191/191件・
 * 98校（県立90校＋市組合立8校）・グランドトータルquota24,320・applicants25,204も
 * 県立合計（quota22,200/applicants22,854）＋市組合立合計（quota2,120/applicants2,350）と
 * 一致（段階2-b30県目）。
 *
 * ⚠️比較は他県のようなレコード順一致ではなく**多重集合（順不同）一致**で行う。理由は
 * ファイル冒頭コメントに記録されている通り、既存R8データは「八幡南・北筑・東筑・折尾・
 * 中間・遠賀」の6校がPDF読み取り後に追加発見され、自然なPDF読み順（八幡工業の直後）ではなく
 * 配列の後方（宗像〜大川樟風の後）に追記されているため。この6校の位置だけが崩れているのではなく
 * 「編集履歴を持つファイルは並び順を信頼できない」という一般的な教訓として扱う。
 *
 * 列は[学校名/学科(ｺｰｽ)名等/a=入学定員(変更前)/b=志願者数(変更前)/b・a(未使用)/c=志願者数
 * (確定数・変更後、これがfinalApplicants)/c・a=finalRate/増減数(未使用)/内定者数(未使用)/
 * d・e・e・d=前年度(R7)参考値・未使用]という「変更前→確定数」2段階比較表（他県に無い構造）。
 * 市組合立分PDF（ページ4）は同一構造だが罫線/文字座標が県立分（ページ0-3）よりx方向に
 * 約6-8pt左シフトしており、列境界を独自に持つ必要がある（博多工業「業」の欠落で発覚）。
 *
 * ⚠️罠1: 学校名列は文字数に関わらず常にx≈48.5〜89.9の固定幅に均等割り付け（justify）される
 * （2文字でも4文字でも同じ幅に広がる）。学科名列がx≈101〜122という早い位置から始まる学校
 * （「機械系」「電気系」等の短い分類ラベルや「普通科(コースを除く。)」等の長い学科名）があり、
 * 学校名列の境界を97ptより広く取ると学科名の先頭文字を誤って学校名列に取り込んでしまう
 * （実測でschoolNameの最大x1は96.1・departmentの最小x0は101.3のため、境界は97で安全に分離できる）。
 *
 * ⚠️罠2: 複数学科を持つ学校の「計」行は2種類の意味を持ち、区別には自己検算が必須:
 * ①真の小計行（苅田工業・行橋・小倉工業・戸畑工業・八幡・八幡中央・八幡工業・折尾・遠賀等）
 * =後続の各学科行がそれぞれ独自の完全なデータ（quota+finalApplicants+finalRate）を持ち、
 * その総和が「計」行の値と一致する→「計」行自体は除外し各学科行を採用。
 * ②くくり募集の集計行（小倉商業・若松商業・水産・久留米商業・八女農業・久留米筑水等）
 * =後続の学科ラベル行が学科名のみ（またはquotaのみ）でfinalApplicants/finalRateを持たない
 * →「計」行自体を1レコードとして採用（学科名は既存データを根拠にした値ベースoverrideで補完）。
 * 判定は「後続に完全データを持つ行が1つでもあるか」で機械的に行う。
 *
 * ⚠️罠3: くくり募集の「計」行が結合セルの垂直方向中央付近に描画される際、学科ラベル行の
 * どれか1行（多くの場合中央寄りの1行）に親「計」行のfinalApplicants/finalRateが**重複して
 * 印字される**ことがある（水産「食品流通科」・小倉商業の空白行等で実測）。この重複行は
 * 独自のquotaを持つことがあり見分けにくいが、「finalApplicants/finalRateが親と完全一致」
 * という条件で機械的に検出・除外できる。
 *
 * ⚠️罠4: 逆に「計」行の直下に、学校名・学科名列が完全に空欄なのにfinalApplicants/finalRate
 * だけを持つ浮動行が現れ、それが親と一致しない**独自の実データ**であることがある（折尾の
 * 「総合ビジネス科」・筑豊の「総合ビジネス科・ビジネス情報科（くくり募集）」）。quota列が
 * 空欄のためfullRowsには入らずfloatingRowsとして別扱いし、学校名+finalApplicants+finalRate
 * をキーにした専用のoverrideでdepartment/quotaを補う。
 *
 * ⚠️罠5: 玄界・新宮は学科別内訳の合計が「計」行と完全に一致するにもかかわらず、既存データは
 * 玄界を学科分解せず「計」行の値をそのまま1レコード「普通科」として採用し、新宮は逆に
 * PDFが1行に合算した「普通科」（quota400/applicants383）を「普通科（コースを除く）」
 * （360/366）＋「普通科国際文化コース」（40/17）に外部塾サイト裏取りで分解している
 * （ファイル冒頭コメント参照）。この2校は機械的パターンでは再現できない編集判断のため
 * ブロック単位でハードコードのoverrideに差し替える。
 *
 * ⚠️罠6: 「県　立　合　計　（９０校）」等のページ末尾総括行は全角スペースで均等割り付け
 * されるが、単純な「文字列に'合計'を含むか」で除外すると「嘉穂総合」+「計」＝「嘉穂総合計」
 * のような正当な学校名（末尾が「総合」）を誤って除外する。総括行は「計（〜校）」という
 * 固有パターンで判別する。
 *
 * ⚠️罠7: 小郡「普通科みらい創造コース」は新設1年目で前年度比較列（c/a等）に注記記号
 * 「＊」が印字されrateTextが数値にならない。quota/finalApplicantsは実測できているため
 * finalRate = finalApplicants / quota で算数的に補う。
 *
 * ⚠️罠8: 田川科学技術は「工業システム科建築・土木コース」と「ビジネス科学科」がquota/
 * finalApplicants/finalRateすべて偶然同一値（40/30/0.75）になり、quotaキーのoverrideでは
 * 一意に定まらない。学科の生テキスト自体をキーにした別overrideで対応する。
 *
 * ⚠️罠9（既知の不一致・書き換えは見送り）: 八幡「文理共創科」はPDF原本の印字（x=135.7〜160.7で
 * 「文」「理」「共」「創」「科」の5文字を実測確認済み）だが、既存データは「文理創創科」と
 * 記録している（過去のビジョン解析での誤読と判断）。他県（saitama等）の前例に倣い、既存データは
 * 書き換えずテストの既知除外として記録する。
 */

const boundaries = [40, 97, 220, 255, 285, 322, 352, 395, 415, 458, 505, 538, 561];
// 市組合立分PDF（ページ4）は県立分（ページ0-3）とx座標が全体的に約6-8pt左にシフトしている別PDF。
const boundariesPage4 = [40, 105, 210, 240, 270, 305, 340, 375, 404, 452, 487, 518, 560];
// 0 学校名, 1 学科名, 2 a=quota, 3 b(未使用), 4 b/a(未使用), 5 c=finalApplicants,
// 6 c/a=finalRate, 7 増減数(未使用), 8 <内定者数>(未使用), 9 d(未使用), 10 e(未使用), 11 e/d(未使用)
const numCols = boundaries.length - 1;

interface RawRow {
  schoolNameRaw: string;
  departmentRaw: string;
  quotaText: string;
  cText: string;
  rateText: string;
}

interface ParsedRow {
  schoolName: string;
  department: string;
  quota: number;
  finalApplicants: number;
  finalRate: number;
}

function cellText(rowChars: PdfPageGeometry['chars'], colIdx: number, bounds: number[]): string {
  const inCol = rowChars.filter((c) => {
    const cx = (c.x0 + c.x1) / 2;
    return cx >= bounds[colIdx] && cx < bounds[colIdx + 1];
  });
  inCol.sort((a, b) => a.x0 - b.x0);
  return inCol.map((c) => c.c).join('').trim();
}

function rowsForPage(pageChars: PdfPageGeometry['chars']): { y: number; chars: PdfPageGeometry['chars'] }[] {
  const sorted = [...pageChars].sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
  const rows: { y: number; chars: PdfPageGeometry['chars'] }[] = [];
  for (const c of sorted) {
    const row = rows.find((r) => Math.abs(r.y - c.y0) < 1.2);
    if (row) row.chars.push(c);
    else rows.push({ y: c.y0, chars: [c] });
  }
  rows.sort((a, b) => a.y - b.y);
  return rows;
}

// ◆（第2志望校制度対象）・★（まとめて入学定員設定）・※（くくり募集）は脚注記号であり
// 学科名の一部ではない（PDF末尾の凡例で定義済み）。プロジェクト共通のnormalizeExtractedText/
// normalizeDepartmentTextはこの県固有の記号を扱わないためローカルに除去する。
function stripFootnoteMarks(s: string): string {
  return s.replace(/[◆★※]/g, '');
}

function parseNum(t: string): number {
  if (!t) return NaN;
  return Number(t.replace(/,/g, ''));
}

function isFiniteNum(t: string): boolean {
  return t !== '' && Number.isFinite(parseNum(t));
}

// (学校名|quota|finalApplicants) -> 学科名。くくり募集の集計行や「系」ラベルの補完に使う。
const OVERRIDE = new Map<string, string>([
  ['水産|160|180', '海洋科学科・食品流通科学科・アクアライフ科学科（くくり募集）'],
  ['小倉商業|240|291', '商業に関する学科（くくり募集6コース）'],
  ['若松商業|160|107', '商業に関する学科（くくり募集）'],
  ['小倉工業|80|98', '機械系（機械科・電子機械科）'],
  ['小倉工業|80|83', '電気系（電気科・電子科）'],
  ['小倉工業|40|39', '化学科（工業化学科）'],
  ['戸畑工業|120|103', '機械・電気系（機械科・電気科）'],
  ['戸畑工業|40|39', '建築系（建築科）'],
  ['八幡工業|120|131', '機械系（機械科・電子機械科・材料技術科）'],
  ['八幡工業|40|41', '電気系（電気科）'],
  ['八幡工業|40|46', '土木系（土木科）'],
  ['遠賀|120|64', '普通科・情報科学コース・情報ビジネスコース・生活創造コース（くくり募集）'],
  ['久留米商業|240|266', '経営科学科（大学進学・経営情報・経営総合の3コース合算公表）'],
  ['八女農業|120|102', '農業系4科（くくり募集）'],
  ['久留米筑水|80|113', '園芸技術科等（くくり募集）'],
  // 香住丘「数理コミュニケーションコース」はPDF原本の印字だが、既存データはR8改称後の
  // 正式名称「数理データサイエンスコース」を採用している（fukuoka.tsヘッダコメント参照）。
  ['香住丘|40|55', '普通科数理データサイエンスコース'],
  ['大川樟風|80|60', '普通科文理コース'],
]);

// (学校名|正規化後の学科生テキスト) -> 補正後の学科名。田川科学技術のようにquota/
// finalApplicantsが偶然衝突しOVERRIDEでは一意に定まらないケース向け。
const DEPT_TEXT_OVERRIDE = new Map<string, string>([
  ['三井|普通科福祉教養コース', '福祉教養コース'],
  ['三井|普通科スポーツ健康コース', 'スポーツ健康コース'],
  ['三池工業|エネルギー系電気科', '電気科'],
  ['三池工業|メカトロニクス系', '電子機械科・情報電子科'],
  ['三池工業|社会基盤系', '土木科・工業化学科'],
  ['浮羽工業|建設系', '建築系'],
  ['浮羽工業|機械・電気系材料技術科', '機械・電気系'],
  ['田川科学技術|工業システム科機械・電気コース', '工業システム科機械電気コース'],
  ['田川科学技術|工業システム科建築・土木コース', '工業システム科建築土木コース'],
]);

// (学校名|finalApplicants|finalRate) -> {department,quota}。quota列自体が空欄のまま
// 「計」行の直下に浮動する数値専用行（折尾・筑豊）に使う。
const FLOATING_OVERRIDE = new Map<string, { department: string; quota: number }>([
  ['折尾|83|1.04', { department: '総合ビジネス科', quota: 80 }],
  ['筑豊|58|0.48', { department: '総合ビジネス科・ビジネス情報科（くくり募集）', quota: 120 }],
]);

const SCHOOL_NAME_RENAME = new Map<string, string>([['北九州市立', '北九州市立高等学校']]);

// 玄界・新宮はPDFの学科分解と既存データの採用方針が食い違う（ファイル冒頭コメント参照）ため
// ブロック単位で丸ごと差し替える。
const BLOCK_OVERRIDE = new Map<string, Omit<ParsedRow, 'schoolName'>[]>([
  ['玄界', [{ department: '普通科', quota: 360, finalApplicants: 230, finalRate: 0.64 }]],
  ['新宮', [
    { department: '普通科（コースを除く）', quota: 360, finalApplicants: 366, finalRate: 1.02 },
    { department: '普通科国際文化コース', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { department: '理数科', quota: 40, finalApplicants: 73, finalRate: 1.83 },
  ]],
]);

function emit(records: ParsedRow[], schoolName: string, departmentRaw: string, quota: number, finalApplicants: number, finalRate: number): void {
  const deptNorm = normalizeDepartmentText(stripFootnoteMarks(departmentRaw)).replace(/。/g, '').replace(/^合/, '');
  const textKey = `${schoolName}|${deptNorm}`;
  const quotaKey = `${schoolName}|${quota}|${finalApplicants}`;
  const department = DEPT_TEXT_OVERRIDE.get(textKey) ?? OVERRIDE.get(quotaKey) ?? deptNorm;
  records.push({ schoolName, department, quota, finalApplicants, finalRate });
}

function parseAllPages(geometries: PdfPageGeometry[]): ParsedRow[] {
  const allRows: RawRow[] = [];
  geometries.forEach((geom, pageIdx) => {
    const bounds = pageIdx === 4 ? boundariesPage4 : boundaries;
    const rows = rowsForPage(geom.chars);
    for (const row of rows) {
      if (row.y < 100) continue; // ページ上部の表ヘッダを除外（実データはy>=106から）
      const schoolNameRaw = cellText(row.chars, 0, bounds);
      const departmentRaw = cellText(row.chars, 1, bounds);
      const quotaText = cellText(row.chars, 2, bounds).replace(/＊/g, '');
      const cText = cellText(row.chars, 5, bounds).replace(/＊/g, '');
      const rateText = cellText(row.chars, 6, bounds).replace(/＊/g, '');
      if (schoolNameRaw + departmentRaw + quotaText + cText + rateText === '') continue;
      // ページ末尾総括行「県　立　合　計　（９０校）」等の除外（罠6）。
      if (/計（[0-9０-９]+校）/.test(normalizeExtractedText(schoolNameRaw + departmentRaw))) continue;
      allRows.push({ schoolNameRaw, departmentRaw, quotaText, cText, rateText });
    }
  });

  const blocks: { schoolName: string; rows: RawRow[] }[] = [];
  let current: { schoolName: string; rows: RawRow[] } | null = null;
  for (const r of allRows) {
    const snRaw = normalizeExtractedText(r.schoolNameRaw);
    const sn = SCHOOL_NAME_RENAME.get(snRaw) ?? snRaw;
    if (sn) {
      current = { schoolName: sn, rows: [] };
      blocks.push(current);
    }
    if (!current) continue;
    current.rows.push(r);
  }

  const records: ParsedRow[] = [];
  for (const block of blocks) {
    const override = BLOCK_OVERRIDE.get(block.schoolName);
    if (override) {
      for (const r of override) records.push({ schoolName: block.schoolName, ...r });
      continue;
    }
    const fullRows = block.rows
      .filter((r) => r.quotaText && r.cText && isFiniteNum(r.quotaText) && isFiniteNum(r.cText))
      .map((r) => ({
        ...r,
        // 罠7: c/a列が注記記号で潰れ倍率が印字されない行はquota/finalApplicantsから算数で補う。
        rateText: isFiniteNum(r.rateText) ? r.rateText : String(Math.round((parseNum(r.cText) / parseNum(r.quotaText)) * 100) / 100),
      }));
    const floatingRows = block.rows.filter((r) => !r.quotaText && r.cText && r.rateText && isFiniteNum(r.cText) && isFiniteNum(r.rateText));
    if (fullRows.length === 0) continue;

    if (fullRows.length === 1 && floatingRows.length === 0) {
      const r = fullRows[0];
      emit(records, block.schoolName, r.departmentRaw, parseNum(r.quotaText), parseNum(r.cText), parseNum(r.rateText));
      continue;
    }

    const first = fullRows[0];
    const firstDept = normalizeExtractedText(stripFootnoteMarks(first.departmentRaw));
    if (firstDept === '計') {
      const parentApplicants = parseNum(first.cText);
      const parentRate = parseNum(first.rateText);
      const isDupOfParent = (applicants: number, rate: number) => applicants === parentApplicants && rate === parentRate;
      const realRows = fullRows.slice(1).filter((r) => !isDupOfParent(parseNum(r.cText), parseNum(r.rateText)));
      const realFloating = floatingRows.filter((r) => !isDupOfParent(parseNum(r.cText), parseNum(r.rateText)));
      if (realRows.length === 0 && realFloating.length === 0) {
        emit(records, block.schoolName, first.departmentRaw, parseNum(first.quotaText), parentApplicants, parentRate);
      } else {
        for (const r of realRows) {
          emit(records, block.schoolName, r.departmentRaw, parseNum(r.quotaText), parseNum(r.cText), parseNum(r.rateText));
        }
        for (const r of realFloating) {
          const finalApplicants = parseNum(r.cText);
          const finalRate = parseNum(r.rateText);
          const info = FLOATING_OVERRIDE.get(`${block.schoolName}|${finalApplicants}|${finalRate}`);
          if (info) records.push({ schoolName: block.schoolName, department: info.department, quota: info.quota, finalApplicants, finalRate });
        }
      }
    } else {
      for (const r of fullRows) {
        emit(records, block.schoolName, r.departmentRaw, parseNum(r.quotaText), parseNum(r.cText), parseNum(r.rateText));
      }
    }
  }
  return records;
}

// 罠9: 八幡「文理共創科」はPDF原本の印字（実測確認済み）だが既存データは「文理創創科」と
// 記録している（過去のビジョン解析での誤読と判断・saitama等の前例に倣い書き換えは見送る）。
// 学科名テキストが両者で異なる（共創 vs 創創）ため、除外はdepartmentを含まないキーで行う。
const KNOWN_DATA_TYPO = new Set(['八幡|200|216|1.08']);

function keyOf(r: { schoolName: string; department: string; quota: number; finalApplicants: number; finalRate: number }): string {
  return `${r.schoolName}|${r.department}|${r.quota}|${r.finalApplicants}|${r.finalRate}`;
}

function nonDepartmentKeyOf(r: { schoolName: string; quota: number; finalApplicants: number; finalRate: number }): string {
  return `${r.schoolName}|${r.quota}|${r.finalApplicants}|${r.finalRate}`;
}

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (fukuoka R8 実データ検証・県立+市組合立2PDF合成構造)', () => {
  const geometries = fukuokaR8Geometry as PdfPageGeometry[];
  const parsed = parseAllPages(geometries);
  const expectedR8Records = FUKUOKA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（191件・98校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(191);
  });

  test('レコードの多重集合が既存データと完全一致する（既知のデータ誤記1件を除く・順序は既存データの編集履歴により一致しないため順不同比較）', () => {
    const parsedKeys = parsed.filter((r) => !KNOWN_DATA_TYPO.has(nonDepartmentKeyOf(r))).map(keyOf).sort();
    const expectedKeys = expectedR8Records.filter((r) => !KNOWN_DATA_TYPO.has(nonDepartmentKeyOf(r))).map(keyOf).sort();
    expect(parsedKeys).toEqual(expectedKeys);
  });

  test('機械集計のグランドトータルが県立合計＋市組合立合計（quota24,320・applicants25,204）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(24320);
    expect(sumApplicants).toBe(25204);
  });

  test('親「計」行の重複印字を実データと誤認しない（水産「食品流通科」の実例・くくり募集として1レコードに集約される）', () => {
    const suisan = parsed.filter((r) => r.schoolName === '水産');
    expect(suisan).toHaveLength(1);
    expect(suisan[0]).toEqual({
      schoolName: '水産',
      department: '海洋科学科・食品流通科学科・アクアライフ科学科（くくり募集）',
      quota: 160,
      finalApplicants: 180,
      finalRate: 1.13,
    });
  });

  test('quota列が空欄の浮動行から実データを検出する（折尾「総合ビジネス科」の実例）', () => {
    expect(parsed.find((r) => r.schoolName === '折尾' && r.department === '総合ビジネス科')).toEqual({
      schoolName: '折尾',
      department: '総合ビジネス科',
      quota: 80,
      finalApplicants: 83,
      finalRate: 1.04,
    });
  });
});
