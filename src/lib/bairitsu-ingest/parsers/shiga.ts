import { normalizeExtractedText, normalizeDepartmentText, type PdfPageGeometry, type ParsedCompetitionRow } from '../parse-table-pdf';
import { roundHalfUpScaled } from '../../finalrate-convention';

/**
 * T-Y11E E-1: shiga(滋賀県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-shiga.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。倍率は資料に印字されておらず`roundHalfUpScaled`で自前算出する（nara/oita型）。
 * 罫線ベースの粗いブロック分割＋y座標ベースの細かい行復元の2段階構成・一般型行を括弧の
 * 有無で判別・「両方の学科」行の合算・学科名+科名結合の前半重複dedup・定時制セクション
 * 打ち切りを含む（詳細はテストファイル側のコメントを参照）。
 */

const boundaries = [45, 85, 148, 196, 240, 267, 305, 340];
// 0 学校名, 1 学科名+科名(結合), 2 選抜名, 3 推薦の種類(未使用),
// 4 quota(確定募集人数a'・括弧書き), 5 学力検査受検者数(未使用), 6 入学許可予定者数b(=finalApplicants)
const numCols = boundaries.length - 1;
const fullLineX0Max = 60;

interface FineRow {
  y: number;
  schoolName: string;
  department: string;
  senbatsu: string;
  quotaText: string;
  num2Text: string;
}

function columnIndexForX(x: number): number {
  for (let i = 0; i < numCols; i++) {
    if (x >= boundaries[i] - 1 && x < boundaries[i + 1] - 1) return i;
  }
  return -1;
}

function cellTextFromChars(chars: PdfPageGeometry['chars'], colIdx: number): string {
  const inCol = chars.filter((c) => columnIndexForX((c.x0 + c.x1) / 2) === colIdx);
  inCol.sort((a, b) => a.x0 - b.x0);
  return inCol.map((c) => c.c).join('').trim();
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
  return rows.map((r) => ({
    y: r.y,
    schoolName: cellTextFromChars(r.chars, 0),
    department: cellTextFromChars(r.chars, 1),
    senbatsu: cellTextFromChars(r.chars, 2),
    quotaText: cellTextFromChars(r.chars, 4),
    num2Text: cellTextFromChars(r.chars, 6),
  }));
}

// フェーズ1: 罫線（学校名列をまたぐ完全な行のみ）でブロック（学校）境界のy範囲を求める。
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

function dedupDoubledText(s: string): string {
  for (let len = Math.floor(s.length / 2); len >= 1; len--) {
    const a = s.slice(0, len);
    const rest = s.slice(len);
    if (rest.startsWith(a)) return rest;
  }
  return s;
}

function normalizeDept(s: string): string {
  return normalizeDepartmentText(dedupDoubledText(normalizeExtractedText(s)));
}

/** 滋賀県R8倍率PDFの学校別データ全頁分（`shiga-r8-geometry.json`）を解析する。 */
export function parseShiga(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  type RowWithBlockEnd = FineRow & { isBlockEnd: boolean; effectiveDepartment: string };
  const allRows: RowWithBlockEnd[] = [];
  for (const geom of geometries) {
    const ranges = blockRangesForPage(geom);
    for (const { yTop, yBottom } of ranges) {
      const fine = fineRowsInRange(geom.chars, yTop, yBottom);
      for (const r of fine) allRows.push({ ...r, isBlockEnd: false, effectiveDepartment: '' });
      if (allRows.length) allRows[allRows.length - 1].isBlockEnd = true;
    }
  }

  // 【定時制】は他県の定時制と同じ理由でスコープ外（能登川が定時制に再登場し重複する事故を実測で発見）。
  const cutIdx = allRows.findIndex((r) => (r.schoolName + r.department).includes('定時制'));
  const scopedRows = cutIdx === -1 ? allRows : allRows.slice(0, cutIdx);

  const blocks: RowWithBlockEnd[][] = [];
  let currentBlock: RowWithBlockEnd[] = [];
  for (const r of scopedRows) {
    currentBlock.push(r);
    if (r.isBlockEnd) {
      blocks.push(currentBlock);
      currentBlock = [];
    }
  }
  if (currentBlock.length) blocks.push(currentBlock);

  const records: ParsedCompetitionRow[] = [];
  for (const block of blocks) {
    const schoolNameRaw = block.map((r) => r.schoolName).find((s) => s.length > 0) ?? '';
    const schoolName = normalizeExtractedText(schoolNameRaw);
    if (!schoolName) continue;

    // 単科校は一般型行自身のdepartment列が空欄（学科名は学校独自型セクションの行にしか
    // 印字されない）ため、ブロック内で直前に見えた非空の学科名をcarry-forwardする。
    let lastDept = '';
    for (const r of block) {
      if (r.department) lastDept = r.department;
      r.effectiveDepartment = r.department || lastDept;
    }

    const targetRows = block.filter((r) => /\([0-9,]+\)/.test(r.quotaText) || normalizeExtractedText(r.department).includes('両方の学科'));
    if (targetRows.length === 0) continue;

    const parsed = targetRows.map((r) => {
      const quotaMatch = r.quotaText.match(/\(([0-9,]+)\)/);
      const quota = quotaMatch ? Number(quotaMatch[1].replace(/,/g, '')) : 0;
      const finalApplicants = Number(r.num2Text.replace(/,/g, ''));
      return { department: normalizeDept(r.effectiveDepartment), quota, finalApplicants };
    });

    const hasBothDepartments = parsed.some((p) => p.department.includes('両方の学科'));
    if (hasBothDepartments) {
      const quota = parsed.reduce((acc, p) => acc + (Number.isFinite(p.quota) ? p.quota : 0), 0);
      const finalApplicants = parsed.reduce((acc, p) => acc + (Number.isFinite(p.finalApplicants) ? p.finalApplicants : 0), 0);
      const deptNames = [...new Set(parsed.filter((p) => !p.department.includes('両方の学科')).map((p) => p.department))];
      const department = `${deptNames.join('・')}(一般型・両方の学科含む)`;
      records.push({ schoolName, department, quota, finalApplicants, finalRate: Number(roundHalfUpScaled(finalApplicants, quota, 2)) / 100 });
    } else {
      for (const p of parsed) {
        if (!Number.isFinite(p.quota) || !Number.isFinite(p.finalApplicants) || p.quota <= 0) continue;
        records.push({ schoolName, department: p.department, quota: p.quota, finalApplicants: p.finalApplicants, finalRate: Number(roundHalfUpScaled(p.finalApplicants, p.quota, 2)) / 100 });
      }
    }
  }
  return records;
}
