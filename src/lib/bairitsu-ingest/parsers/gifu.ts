import { normalizeExtractedText, type PdfPageGeometry, type ParsedCompetitionRow } from '../parse-table-pdf';

/**
 * T-Y11E E-1: gifu(岐阜県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-gifu.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。tochigi型（単純carry-forward）をそのまま流用できるが、唯一の罠は全日制の後に
 * 「２　定時制」「３　通信制」という別セクションが続き、同じ学校名・学科名で別のquota/
 * applicantsを持つ行として再登場すること。この見出し行を検知した時点で以降の行を丸ごと
 * 処理打ち切りとする（詳細はテストファイル側のコメントを参照）。
 */

const boundaries = [105, 205, 415, 480, 545, 570];
const numCols = boundaries.length - 1;
// 0 学校名, 1 学科(群)名, 2 募集人員(=quota), 3 出願者数(=finalApplicants), 4 倍率(=finalRate)

function normalizeDepartmentTextFullwidth(s: string): string {
  return normalizeExtractedText(s).replace(/、/g, '・').replace(/\(/g, '（').replace(/\)/g, '）');
}

/**
 * 岐阜県R8倍率PDFの学校別データ全頁分（`gifu-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: pageオフセットは県ごとに異なるため生PDFで毎回実測する
 * （2026-09-10確認: 詳細は本ファイルの変更コミット参照）。
 */
export function parseGifu(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRecords: ParsedCompetitionRow[] = [];
  const rowIndexByPage = new Map<number, number>();
  let currentSchool = '';
  let stopped = false;
  for (let pageIdx = 0; pageIdx < geometries.length; pageIdx++) {
    const geom = geometries[pageIdx];
    const page = pageIdx + 1;
    if (stopped) break;
    const { chars } = geom;
    const sorted = [...chars].sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
    const rows: { y: number; chars: PdfPageGeometry['chars'] }[] = [];
    for (const c of sorted) {
      const row = rows.find((r) => Math.abs(r.y - c.y0) < 3.0);
      if (row) {
        row.chars.push(c);
        row.y = (row.y * (row.chars.length - 1) + c.y0) / row.chars.length;
      } else {
        rows.push({ y: c.y0, chars: [c] });
      }
    }
    rows.sort((a, b) => a.y - b.y);

    for (const row of rows) {
      const cell: PdfPageGeometry['chars'][] = Array.from({ length: numCols }, () => []);
      for (const c of row.chars) {
        const cx = (c.x0 + c.x1) / 2;
        for (let i = 0; i < numCols; i++) {
          if (cx >= boundaries[i] - 1 && cx < boundaries[i + 1] - 1) {
            cell[i].push(c);
            break;
          }
        }
      }
      for (const arr of cell) arr.sort((a, b) => a.x0 - b.x0);
      const join = (arr: PdfPageGeometry['chars']) => arr.map((c) => c.c).join('').trim();
      const schoolNameRaw = join(cell[0]);
      const departmentRaw = join(cell[1]);
      const quotaText = join(cell[2]);
      const applicantsText = join(cell[3]);
      const rateText = join(cell[4]);

      const sn = normalizeExtractedText(schoolNameRaw);
      if (/定時制|通信制/.test(sn)) {
        stopped = true;
        break;
      }
      if (sn) currentSchool = sn;
      if (!departmentRaw) continue;
      const deptNorm = normalizeExtractedText(departmentRaw);
      if (deptNorm.includes('合計')) continue;
      if (/^[ⅠⅡ連携－]/.test(deptNorm)) continue; // 独自検査Ⅰ/Ⅱ・連携型選抜の内訳行を除外

      const department = normalizeDepartmentTextFullwidth(deptNorm);
      const quota = Number(quotaText.replace(/,/g, ''));
      const finalApplicants = Number(applicantsText.replace(/,/g, ''));
      const finalRate = Number(rateText);
      if (!Number.isFinite(quota) || quota <= 0) continue;
      if (!Number.isFinite(finalApplicants) || !Number.isFinite(finalRate)) continue;
      const rowIndex = rowIndexByPage.get(page) ?? 0;
      rowIndexByPage.set(page, rowIndex + 1);
      allRecords.push({ schoolName: currentSchool, department, quota, finalApplicants, finalRate, page, rowIndex });
    }
  }
  return allRecords;
}
