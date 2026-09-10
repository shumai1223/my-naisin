import { normalizeExtractedText, normalizeDepartmentText, type PdfPageGeometry, type ParsedCompetitionRow } from '../parse-table-pdf';
import { roundHalfUpScaled } from '../../finalrate-convention';

/**
 * T-Y11E E-1: yamagata(山形県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-yamagata.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。倍率は資料に印字されているが浮動小数の丸め誤差を避けるため`roundHalfUpScaled`で
 * 自前算出して突合する。カテゴリ列の「持ち越し専用ラベル行」と「行内完結の重複」の判別
 * （同じ行に数値まで揃っているかで機械的に区別）・業種学校の冗長ラベルoverride・脚注数字の
 * 除去・数値だけの行の誤帰属renameを含む（詳細はテストファイル側のコメントを参照）。
 */

// 0 NO(未使用), 1 schoolName, 2 category(タイト詰め2文字ゾーン), 3 specific(具体名)
const boundaries = [50, 70, 196, 226, 390];
const numCols = boundaries.length - 1;
const fullLineX0Max = 65;

function columnIndexForX(x: number): number {
  for (let i = 0; i < numCols; i++) {
    if (x >= boundaries[i] - 1 && x < boundaries[i + 1] - 1) return i;
  }
  return -1;
}

function cellTextFromChars(chars: PdfPageGeometry['chars'], colIdx: number): string {
  const inCol = chars.filter((c) => c.x0 < 390 && columnIndexForX((c.x0 + c.x1) / 2) === colIdx);
  inCol.sort((a, b) => a.x0 - b.x0);
  return inCol.map((c) => c.c).join('').trim();
}

// 数値は右揃えのため、桁の並び（隙間3pt未満で連結）を1トークンとみなし右端x1で列判定する
// （kochiで確立した技法）。0=入学定員(未使用),1=前期選抜内定者数等(未使用),2=quota,
// 3=applicants,4=rate(未使用・自前算出)
const numericRightEdges = [410, 475, 535, 600, 660];
function numericTokensFromChars(chars: PdfPageGeometry['chars']): { quotaText: string; applicantsText: string } {
  const inRegion = [...chars].filter((c) => c.x0 >= 390).sort((a, b) => a.x0 - b.x0);
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
  const cols = ['', '', '', '', ''];
  for (const t of tokens) {
    let idx = numericRightEdges.findIndex((edge) => t.x1 <= edge);
    if (idx === -1) idx = numericRightEdges.length - 1;
    cols[idx] = t.text.trim();
  }
  return { quotaText: cols[2], applicantsText: cols[3] };
}

interface FineRow {
  y: number;
  page: number;
  schoolNameRaw: string;
  categoryRaw: string;
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
      schoolNameRaw: cellTextFromChars(r.chars, 1),
      categoryRaw: cellTextFromChars(r.chars, 2),
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

// 学校名列は結合セルの任意の行にだけラベルが乗り、他の行は空欄のままキャリーフォワードされる。
// 前方伝播しつつ、ラベルが現れる前の先頭側の行は最初に見つかったラベルまで遡って適用する
// （kochi「安芸」と同型）。
function forwardCarryWithBackfill(rows: FineRow[]): (FineRow & { schoolName: string })[] {
  let firstIdx = -1;
  let current = '';
  const out: (FineRow & { schoolName: string })[] = rows.map((r, idx) => {
    const v = normalizeExtractedText(r.schoolNameRaw);
    if (v) {
      current = v;
      if (firstIdx === -1) firstIdx = idx;
    }
    return { ...r, schoolName: current };
  });
  if (firstIdx > 0) {
    const first = out[firstIdx].schoolName;
    for (let i = 0; i < firstIdx; i++) out[i].schoolName = first;
  }
  return out;
}

// カテゴリ列は「持ち越し専用ラベル行」（category有り・specific無し・数値も無し）と
// 「行内完結の重複」（同じ行にcategory・specific・数値が同居）の2種類がある。前者だけを
// 後続行へキャリーフォワードし、後者はその行だけに閉じることで区別する。
function carryCategoryLabelOnly(rows: (FineRow & { schoolName: string })[]): (FineRow & { schoolName: string; category: string; isLabelOnly: boolean })[] {
  let pending = '';
  let firstLabelIdx = -1;
  const out = rows.map((r, idx) => {
    const category = normalizeExtractedText(r.categoryRaw);
    const specific = normalizeExtractedText(r.specificRaw);
    const isLabelOnly = Boolean(category) && !specific && !r.quotaText && !r.applicantsText;
    if (isLabelOnly) {
      pending = category;
      if (firstLabelIdx === -1) firstLabelIdx = idx;
      return { ...r, category, isLabelOnly: true };
    }
    return { ...r, category: category || pending, isLabelOnly: false };
  });
  if (firstLabelIdx > 0) {
    const first = out[firstLabelIdx].category;
    for (let i = 0; i < firstLabelIdx; i++) {
      if (!normalizeExtractedText(out[i].categoryRaw)) out[i].category = first;
    }
  }
  return out;
}

function composeDepartment(categoryRaw: string, specificRaw: string): string {
  const category = normalizeExtractedText(categoryRaw);
  const specificPlain = normalizeExtractedText(specificRaw);
  const specific = normalizeDepartmentText(specificRaw);
  if (!specific) return category;
  if (!category) return specific;
  // 具体名列が既にカテゴリと同じ文字で始まる場合（置賜農業「農業資源活用」等）は、
  // カテゴリ自体が具体名の先頭部分と重複しているだけなので具体名側をそのまま採用する。
  if (specificPlain === category || specificPlain.startsWith(category)) return specific;
  return category + specific;
}

// 業種を表す学校名の学校（○○工業・○○商業等）はcategoryが具体名と無関係な冗長ラベルに
// なるため値ベースoverrideで対応する（キーは学校名|composeDepartmentの生出力）。
const DEPARTMENT_OVERRIDE = new Map<string, string>([
  ['山形工業|工業情報技術', '情報技術'],
  ['山形東|探究理数探究・国際探究', '探究(理数探究,国際探究)'],
  ['新庄志誠館|探究理数探究・国際探究', '探究(理数探究,国際探究)'],
  ['米沢興譲館|探究理数探究・国際探究', '探究(理数探究,国際探究)'],
  ['酒田東|探究理数探究・国際探究', '探究(理数探究,国際探究)'],
  ['寒河江工業|工業ロボットエンジニア', 'ロボットエンジニア'],
  ['寒河江工業|工業ＩＴエンジニア', 'ITエンジニア'],
  ['村山産業|商業流通ビジネス', '流通ビジネス'],
  ['新庄神室産業|商業ビジネス創造', 'ビジネス創造'],
  ['米沢鶴城|工業電気情報', '電気情報'],
  ['米沢鶴城|商業総合ビジネス・会計情報', '総合ビジネス・会計情報'],
  ['長井工業|工業電子', '電子'],
  ['鶴岡工業|工業情報通信', '情報通信'],
  ['加茂水産|水産水産', '水産'],
  ['酒田光陵|工業電気電子', '電気電子'],
  ['山形市立商業|商業情報', '情報'],
  ['寒河江工業|ＩＴエンジニア', 'ITエンジニア'],
  ['村山産業|農業みどり活用', 'みどり活用'],
  ['村山産業|農業機械', '機械'],
  ['村山産業|工業電子情報', '電子情報'],
  ['新庄神室産業|農業食料生産', '食料生産'],
  ['新庄神室産業|農業農産活用', '農産活用'],
  ['新庄神室産業|農業機械電気', '機械電気'],
  ['新庄神室産業|工業環境デザイン', '環境デザイン'],
  ['置賜農業|農業食料生産経営', '食料生産経営'],
  ['庄内農業|農業食料生産', '食料生産'],
  ['庄内農業|農業食品科学', '食品科学'],
  ['酒田光陵|商業機械制御', '機械制御'],
  ['酒田光陵|商業環境技術', '環境技術'],
  ['酒田光陵|商業ビジネス流通', 'ビジネス流通'],
  ['酒田光陵|商業ビジネス会計', 'ビジネス会計'],
]);

// 数値だけの行が前の学校名を誤って引き継ぎ、直後に現れる真の学校名（真室川校）より前の
// 学校名（金山校）に誤帰属することがある。個別renameで対応する。
const SCHOOL_RENAME_ON_VALUE = new Map<string, string>([['新庄神室産業金山校|36|2', '新庄神室産業真室川校']]);

const HEADER_MARKERS = ['学校名', '学科名', '入学定員', '募集人員', '志願者数', '志願倍率', '前期', '連携型', '併設型', '内定者数', '入学予定者数', '合計', '注)', '注１', '注２'];

/**
 * 山形県R8倍率PDFの学校別データ全頁分（`yamagata-r8-geometry.json`）を解析する。ページ0は
 * 表紙、ページ4は【定時制の課程】専用のため呼び出し側でスコープ外とすること。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: geometry配列3頁は生PDF全5頁中の物理ページ2〜4
 * （1頁目=表紙・5頁目=定時制のためスコープ外。2026-09-11にpdftotext -f 2で山形東
 * 「普通」quota152/applicants69/finalRate0.45が物理ページ2に実在することを確認）。
 * オフセットは配列添字+2。
 */
export function parseYamagata(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRows: (FineRow & { schoolName: string; category: string; isLabelOnly: boolean })[] = [];
  geometries.forEach((geom, pageIdx) => {
    const page = pageIdx + 2;
    const ranges = blockRangesForPage(geom);
    for (const { yTop, yBottom } of ranges) {
      const fine = fineRowsInRange(geom.chars, yTop, yBottom, page);
      const withNames = forwardCarryWithBackfill(fine);
      const withCategory = carryCategoryLabelOnly(withNames);
      for (const r of withCategory) allRows.push(r);
    }
  });

  const records: ParsedCompetitionRow[] = [];
  const rowIndexByPage = new Map<number, number>();
  for (const r of allRows) {
    const combined = normalizeExtractedText(r.schoolNameRaw + r.categoryRaw + r.specificRaw);
    if (HEADER_MARKERS.some((m) => combined.includes(m))) continue;
    if (!r.schoolName) continue;
    if (r.isLabelOnly) continue;
    const rawDepartment = composeDepartment(r.category, r.specificRaw);
    if (!rawDepartment || rawDepartment === '計') continue;
    // 学科名と数値列の間に混入する孤立した脚注数字を末尾から除去する。
    const cleanedDepartment = rawDepartment.replace(/[0-9０-９]+$/, '');
    const department = DEPARTMENT_OVERRIDE.get(`${r.schoolName}|${cleanedDepartment}`) ?? cleanedDepartment;
    const quota = Number(r.quotaText.replace(/,/g, ''));
    const finalApplicants = Number(r.applicantsText.replace(/,/g, ''));
    if (!Number.isFinite(quota) || quota <= 0 || !Number.isFinite(finalApplicants)) continue;
    const schoolName = SCHOOL_RENAME_ON_VALUE.get(`${r.schoolName}|${quota}|${finalApplicants}`) ?? r.schoolName;
    const finalRate = Number(roundHalfUpScaled(finalApplicants, quota, 2)) / 100;
    const rowIndex = rowIndexByPage.get(r.page) ?? 0;
    rowIndexByPage.set(r.page, rowIndex + 1);
    records.push({ schoolName, department, quota, finalApplicants, finalRate, page: r.page, rowIndex });
  }
  return records;
}
