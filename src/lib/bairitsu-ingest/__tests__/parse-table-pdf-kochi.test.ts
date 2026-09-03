import { normalizeExtractedText, type PdfPageGeometry } from '../parse-table-pdf';
import { roundHalfUpScaled } from '../../finalrate-convention';
import { KOCHI_COMPETITION_RATES } from '@/data/competition-rates/kochi';
import kochiR8Geometry from '../__fixtures__/kochi-r8-geometry.json';

/**
 * T-Y11B 段階2-b: kochi(高知県)のR8倍率パーサ検証テスト。75/75件・完全一致（順序も含む）。
 * 2026-09-02に「罫線が表の途中で不規則に欠落する」という致命的な罠で次点扱いになっていたが、
 * shiga/oitaで確立した技法（罫線でブロックのy範囲を求めた後ブロック内はy座標だけで細分・
 * 数値の右揃え右端判定）で2026-09-04に再挑戦し解決した（段階2-b33県目）。倍率は資料に
 * 印字されているが浮動小数の丸め誤差を避けるため`roundHalfUpScaled`で自前算出し突合する。
 *
 * 列は[学校名/学科カテゴリ/コース略称(括弧書き)/具体名/入学定員(未使用)/募集定員(quota)/
 * 第1志望者数(finalApplicants)/学校計(未使用)/志願率(未使用・自前算出)/第2志望者数(未使用)]。
 * 学科名は「カテゴリ」「コース略称」「具体名」の3つの副列に分裂して印字される。
 *
 * ⚠️罠1（前回セッションの真因判明）: 「高知追手前」→「吾北」の間だけ罫線が1本欠落しており、
 * 罫線だけでブロック（学校）境界を判定すると2校が1ブロックに誤って合体する。しかし両校とも
 * **schoolName列自体には正しく自分の名前が印字されている**ため、罫線ベースの粗いブロック内で
 * 複数の異なる学校名が現れた場合は「先頭に見つかった名前をブロック全体に適用する」旧来の
 * 方式ではなく、**各行が自分の学校名を持つ場合はそれを優先し、学校名を持たない行だけ
 * 直前（無ければブロック内で最初に見つかる名前）から引き継ぐ**方式に変更して解決した
 * （安芸のように学科の1行目に学校名が無く2行目に初めて現れるケースは、ブロック内で
 * 最初に見つかった名前をその手前の行まで遡って適用することで両立する）。
 *
 * ⚠️罠2: 数値（入学定員/募集定員/第1志望者数）が右揃え印字のため、桁数の異なる隣接列が
 * 密接すると文字単位の中心x判定では桁が隣の列に混入する（岡豊「普通」入学定員200・
 * 募集定員200・第1志望者数212の実例）。数字の並び（隙間3pt未満で連結）を1トークンとみなし、
 * トークンの右端x1がどの列の右端境界に収まるかで判定する方式に変更して解決した。
 *
 * ⚠️罠3: 学科名の3列合成規則は学校によって異なり単一ルールでは再現できない（安芸は
 * 「カテゴリ(具体名)」・須崎総合/宿毛工業は「カテゴリ(コース略称)具体名」という真逆の
 * 合成で、既存データの転記方針が学校ごとに異なる）。カテゴリと具体名/コース略称が完全一致
 * する場合の重複括弧除去（理数(理数)→理数等）は機械的に解決できるが、それ以外の学校固有の
 * 合成は既存データを根拠にした値ベースoverrideで対応した。また高知東工業「機械システム」・
 * 幡多農業「園システム」はPDF自体が省略表記（機械シス/園シス）のため、既存データの正式名称
 * 展開は機械的に再現不能でoverride必須。
 *
 * ⚠️罠4: カテゴリ列が空の行（「チャレンジＡ」等、カテゴリを持たない独立学科名）は、
 * コース略称/具体名の列境界(x=258)を字がまたぐことがあり、機械的に2列へ分割すると先頭
 * 文字が欠落する（「チャレンジＡ」→「ャレンジＡ」）。カテゴリが空の行は分割せず2列を
 * 単純連結することで解決した。
 *
 * ⚠️罠5: 「多部制単位制」（フレックス課程）以降、続く「連携型中高一貫教育校に係る特別選抜」
 * 節まで、Ａ日程全日制本体とは別の選抜区分が2ページ目末尾に続く（中芸・高知北・嶺北・
 * 檮原・四万十・清水が本体と別の数値で再登場する）。「多部制」の見出しに到達したら
 * 打ち切る。
 */

// 0 schoolName, 1 category(学科カテゴリ), 2 courseCode(コース略称・括弧書き), 3 specific(具体名)
const boundaries = [70, 156, 207, 258, 300];
const numCols = boundaries.length - 1;
const fullLineX0Max = 90;

function columnIndexForX(x: number): number {
  for (let i = 0; i < numCols; i++) {
    if (x >= boundaries[i] - 1 && x < boundaries[i + 1] - 1) return i;
  }
  return -1;
}

function cellTextFromChars(chars: PdfPageGeometry['chars'], colIdx: number): string {
  const inCol = chars.filter((c) => c.x0 < 300 && columnIndexForX((c.x0 + c.x1) / 2) === colIdx);
  inCol.sort((a, b) => a.x0 - b.x0);
  return inCol.map((c) => c.c).join('').trim();
}

// 数値は右揃えのため、桁の並び（隙間3pt未満で連結）を1トークンとみなし、トークンの右端x1が
// どの列の右端境界に収まるかで判定する（罠2）。
// 0=入学定員(未使用), 1=quota, 2=applicants, 3=学校計(未使用), 4=rate(未使用), 5=第2志望(未使用)
const numericRightEdges = [322, 358, 385, 436, 458, 510];
function numericTokensFromChars(chars: PdfPageGeometry['chars']): { quotaText: string; applicantsText: string } {
  const inRegion = [...chars].filter((c) => c.x0 >= 300).sort((a, b) => a.x0 - b.x0);
  const tokens: { text: string; x0: number; x1: number }[] = [];
  for (const c of inRegion) {
    const last = tokens[tokens.length - 1];
    if (last && c.x0 - last.x1 < 3.0) {
      last.text += c.c;
      last.x1 = c.x1;
    } else {
      tokens.push({ text: c.c, x0: c.x0, x1: c.x1 });
    }
  }
  const cols = ['', '', '', '', '', ''];
  for (const t of tokens) {
    let idx = numericRightEdges.findIndex((edge) => t.x1 <= edge);
    if (idx === -1) idx = numericRightEdges.length - 1;
    cols[idx] = t.text.trim();
  }
  return { quotaText: cols[1], applicantsText: cols[2] };
}

interface FineRow {
  y: number;
  schoolNameRaw: string;
  categoryRaw: string;
  courseCodeRaw: string;
  specificRaw: string;
  quotaText: string;
  applicantsText: string;
}

function fineRowsInRange(chars: PdfPageGeometry['chars'], yTop: number, yBottom: number): FineRow[] {
  const inRange = [...chars].filter((c) => c.y0 >= yTop - 0.5 && c.y0 < yBottom - 0.5).sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
  const rows: { y: number; chars: PdfPageGeometry['chars'] }[] = [];
  for (const c of inRange) {
    const row = rows.find((r) => Math.abs(r.y - c.y0) < 1.5);
    if (row) row.chars.push(c);
    else rows.push({ y: c.y0, chars: [c] });
  }
  rows.sort((a, b) => a.y - b.y);
  return rows.map((r) => {
    const { quotaText, applicantsText } = numericTokensFromChars(r.chars);
    return {
      y: r.y,
      schoolNameRaw: cellTextFromChars(r.chars, 0),
      categoryRaw: cellTextFromChars(r.chars, 1),
      courseCodeRaw: cellTextFromChars(r.chars, 2),
      specificRaw: cellTextFromChars(r.chars, 3),
      quotaText,
      applicantsText,
    };
  });
}

function blockRangesForPage(geom: PdfPageGeometry): { yTop: number; yBottom: number }[] {
  const sortedLines = [...geom.hlines].sort((a, b) => a.y - b.y);
  const mergedLines: { y: number; x0: number }[] = [];
  for (const h of sortedLines) {
    const last = mergedLines[mergedLines.length - 1];
    if (last && Math.abs(last.y - h.y) < 1.0) {
      last.x0 = Math.min(last.x0, h.x0);
    } else {
      mergedLines.push({ y: h.y, x0: h.x0 });
    }
  }
  const fullLines = mergedLines.filter((l) => l.x0 <= fullLineX0Max);
  const ranges: { yTop: number; yBottom: number }[] = [];
  for (let i = 0; i < fullLines.length - 1; i++) {
    ranges.push({ yTop: fullLines[i].y, yBottom: fullLines[i + 1].y });
  }
  return ranges;
}

function composeDepartment(categoryRaw: string, courseCodeRaw: string, specificRaw: string): string {
  const category = normalizeExtractedText(categoryRaw);
  const specific = normalizeExtractedText(specificRaw);
  const courseInner = normalizeExtractedText(courseCodeRaw).replace(/[（）()]/g, '');
  // 罠4: カテゴリが無い行（例:「チャレンジＡ」）はコース略称/具体名の列境界を字がまたぐため分割しない。
  if (!category) return normalizeExtractedText(courseCodeRaw + specificRaw).replace(/[（）()]/g, '');
  if (specific) {
    if (category === specific) return category;
    return `${category}(${specific})`;
  }
  if (courseInner) {
    if (category === courseInner) return category;
    return `${category}(${courseInner})`;
  }
  return category;
}

// 罠3: 学科名の3列合成規則が学校ごとに異なり機械的な単一ルールでは再現できないため
// 値ベースoverrideで対応（キーは学校名|composeDepartmentの生出力）。
const DEPARTMENT_OVERRIDE = new Map<string, string>([
  ['高知東工業|工業(機械シス)', '工業(機械システム)'],
  ['須崎総合|工業(機械)', '工業(機械系)機械'],
  ['須崎総合|工業(電気)', '工業(電情系)電気'],
  ['須崎総合|工業(機制)', '工業(シ工系)機制'],
  ['幡多農業|農業(園シス)', '農業(園システム)'],
  ['宿毛工業|工業(機械)', '工業(機械系)機械'],
  ['宿毛工業|工業(土木)', '工業(建設系)土木'],
]);

const HEADER_MARKERS = ['学校名', '学　校', '学科（科）名', '入学定員', '募集定員', '志願率', '第１志望者数', '第２志望者数', '（注', '志願者なし', 'No.', '令和'];

interface ParsedRow {
  schoolName: string;
  department: string;
  quota: number;
  finalApplicants: number;
  finalRate: number;
}

function parseAllPages(geometries: PdfPageGeometry[]): ParsedRow[] {
  const allRows: (FineRow & { schoolName: string })[] = [];
  for (const geom of geometries) {
    const ranges = blockRangesForPage(geom);
    for (const { yTop, yBottom } of ranges) {
      const fine = fineRowsInRange(geom.chars, yTop, yBottom);
      // 罠1: ブロック内でschoolNameを前方伝播し、先頭に名前の無い行はブロック内で
      // 最初に見つかった名前まで遡って適用する（安芸の実例）。
      let firstNameIdx = -1;
      let currentName = '';
      const withNames = fine.map((r, idx) => {
        const sn = normalizeExtractedText(r.schoolNameRaw);
        if (sn) {
          currentName = sn;
          if (firstNameIdx === -1) firstNameIdx = idx;
        }
        return { ...r, schoolName: currentName };
      });
      if (firstNameIdx > 0) {
        const firstName = withNames[firstNameIdx].schoolName;
        for (let i = 0; i < firstNameIdx; i++) withNames[i].schoolName = firstName;
      }
      for (const r of withNames) allRows.push(r);
    }
  }

  // 罠5: 「多部制単位制」以降（連携型中高一貫教育校の特別選抜を含む）はスコープ外。
  const cutIdx = allRows.findIndex((r) => normalizeExtractedText(r.schoolNameRaw + r.categoryRaw + r.courseCodeRaw + r.specificRaw).includes('多部制'));
  const scopedRows = cutIdx === -1 ? allRows : allRows.slice(0, cutIdx);

  const records: ParsedRow[] = [];
  for (const r of scopedRows) {
    const combined = r.schoolNameRaw + r.categoryRaw + r.courseCodeRaw + r.specificRaw;
    if (HEADER_MARKERS.some((m) => combined.includes(m))) continue;
    if (!r.schoolName) continue;
    const rawDepartment = composeDepartment(r.categoryRaw, r.courseCodeRaw, r.specificRaw);
    if (!rawDepartment || rawDepartment === '計') continue;
    const department = DEPARTMENT_OVERRIDE.get(`${r.schoolName}|${rawDepartment}`) ?? rawDepartment;
    const quota = Number(r.quotaText.replace(/,/g, ''));
    const finalApplicants = Number(r.applicantsText.replace(/,/g, ''));
    if (!Number.isFinite(quota) || quota <= 0 || !Number.isFinite(finalApplicants)) continue;
    const finalRate = Number(roundHalfUpScaled(finalApplicants, quota, 2)) / 100;
    records.push({ schoolName: r.schoolName, department, quota, finalApplicants, finalRate });
  }
  return records;
}

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (kochi R8 実データ検証・罫線ブロック境界のschoolName優先解決＋数値右端判定)', () => {
  const geometries = kochiR8Geometry as PdfPageGeometry[];
  const parsed = parseAllPages(geometries);
  const expectedR8Records = KOCHI_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（75件）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(75);
  });

  test('レコード単位で既存データと完全一致する（順序も含む）', () => {
    for (let i = 0; i < expectedR8Records.length; i++) {
      const p = parsed[i];
      const e = expectedR8Records[i];
      expect({ schoolName: p?.schoolName, department: p?.department, quota: p?.quota, finalApplicants: p?.finalApplicants, finalRate: p?.finalRate }).toEqual({
        schoolName: e.schoolName,
        department: e.department,
        quota: e.quota,
        finalApplicants: e.finalApplicants,
        finalRate: e.finalRate,
      });
    }
  });

  test('罫線欠落で隣接する2校（高知追手前・吾北）が誤って合体しない', () => {
    expect(parsed.find((r) => r.schoolName === '高知追手前')).toEqual({ schoolName: '高知追手前', department: '普通', quota: 240, finalApplicants: 206, finalRate: 0.86 });
    expect(parsed.find((r) => r.schoolName === '吾北')).toEqual({ schoolName: '吾北', department: '普通', quota: 40, finalApplicants: 6, finalRate: 0.15 });
  });

  test('学科の1行目に学校名が無く2行目に初めて現れる安芸の4学科が正しく合体する', () => {
    const aki = parsed.filter((r) => r.schoolName === '安芸');
    expect(aki).toEqual([
      { schoolName: '安芸', department: '普通', quota: 95, finalApplicants: 34, finalRate: 0.36 },
      { schoolName: '安芸', department: '工業(機械)', quota: 20, finalApplicants: 4, finalRate: 0.2 },
      { schoolName: '安芸', department: '工業(土木)', quota: 20, finalApplicants: 0, finalRate: 0 },
      { schoolName: '安芸', department: '商業(ビジネス)', quota: 34, finalApplicants: 27, finalRate: 0.79 },
    ]);
  });

  test('右揃え数値の桁混入が起きない（岡豊「普通」入学定員200・募集定員200・第1志望者数212）', () => {
    expect(parsed.find((r) => r.schoolName === '岡豊' && r.department === '普通')).toEqual({
      schoolName: '岡豊',
      department: '普通',
      quota: 200,
      finalApplicants: 212,
      finalRate: 1.06,
    });
  });

  test('「多部制単位制」以降が打ち切られ嶺北・檮原・四万十・清水・中芸・高知北が全日制本体の値のみになる', () => {
    expect(parsed.some((r) => r.schoolName === '中芸')).toBe(false);
    expect(parsed.some((r) => r.schoolName === '高知北')).toBe(false);
    expect(parsed.filter((r) => r.schoolName === '嶺北')).toHaveLength(1);
    expect(parsed.filter((r) => r.schoolName === '四万十')).toHaveLength(2);
  });
});
