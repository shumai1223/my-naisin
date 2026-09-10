import { normalizeExtractedText, type PdfPageGeometry, type ParsedCompetitionRow } from '../parse-table-pdf';
import { roundHalfUpScaled } from '../../finalrate-convention';

/**
 * T-Y11E E-1: kochi(高知県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-kochi.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。倍率は資料に印字されているが浮動小数の丸め誤差を避けるため`roundHalfUpScaled`で
 * 自前算出して突合する。罫線欠落による誤合体対策（各行のschoolNameを優先する方式）・
 * 右揃え数値のトークン化と右端x1判定・学科名3列合成の学校ごとの規則差・多部制単位制以降の
 * 打ち切りを含む（詳細はテストファイル側のコメントを参照）。
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
// どの列の右端境界に収まるかで判定する。
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
  page: number;
  schoolNameRaw: string;
  categoryRaw: string;
  courseCodeRaw: string;
  specificRaw: string;
  quotaText: string;
  applicantsText: string;
}

function fineRowsInRange(chars: PdfPageGeometry['chars'], yTop: number, yBottom: number, page: number): FineRow[] {
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
      page,
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
  // カテゴリが無い行（例:「チャレンジＡ」）はコース略称/具体名の列境界を字がまたぐため分割しない。
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

// 学科名の3列合成規則が学校ごとに異なり機械的な単一ルールでは再現できないため
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

/**
 * 高知県R8倍率PDFの学校別データ全頁分（`kochi-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: geometry配列2頁は生PDF全2頁と完全一致（概要ページ無し）
 * のためオフセットは配列添字+1（2026-09-11にpdftotext -f 1で室戸「総合」quota44/
 * applicants5/finalRate0.11が物理ページ1に実在することを確認）。
 */
export function parseKochi(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRows: (FineRow & { schoolName: string })[] = [];
  geometries.forEach((geom, pageIdx) => {
    const page = pageIdx + 1;
    const ranges = blockRangesForPage(geom);
    for (const { yTop, yBottom } of ranges) {
      const fine = fineRowsInRange(geom.chars, yTop, yBottom, page);
      // 罫線欠落による誤合体対策: ブロック内でschoolNameを前方伝播し、先頭に名前の無い行は
      // ブロック内で最初に見つかった名前まで遡って適用する（安芸の実例）。
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
  });

  // 「多部制単位制」以降（連携型中高一貫教育校の特別選抜を含む）はスコープ外。
  const cutIdx = allRows.findIndex((r) => normalizeExtractedText(r.schoolNameRaw + r.categoryRaw + r.courseCodeRaw + r.specificRaw).includes('多部制'));
  const scopedRows = cutIdx === -1 ? allRows : allRows.slice(0, cutIdx);

  const records: ParsedCompetitionRow[] = [];
  const rowIndexByPage = new Map<number, number>();
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
    const rowIndex = rowIndexByPage.get(r.page) ?? 0;
    rowIndexByPage.set(r.page, rowIndex + 1);
    records.push({ schoolName: r.schoolName, department, quota, finalApplicants, finalRate, page: r.page, rowIndex });
  }
  return records;
}
