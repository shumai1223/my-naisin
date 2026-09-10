import { normalizeExtractedText, type PdfPageGeometry, type ParsedCompetitionRow } from '../parse-table-pdf';

/**
 * T-Y11E E-1: hiroshima(広島県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-hiroshima.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。tochigi型（単純carry-forward）をベースに、この県特有の「同一学科に2時点の
 * スナップショットが併記される」構造への対応が主な罠（最終＝2月18日側だけを採用する）。
 * くくり募集5組の値ベースoverrideと、座標抽出で検出できなかった全日制分校（加計・芸北）の
 * 補完も行う（詳細はテストファイル側のコメントを参照）。
 */

const boundaries = [65, 110, 165, 244, 270, 420, 465, 488, 520];
const numCols = boundaries.length - 1;
// 0 市区町名(未使用), 1 学校名, 2 学科【コース】名, 3 quota, 4 2/9スナップショット(未使用),
// 5 finalApplicants(2/18), 6 うち調整(未使用), 7 finalRate(2/18)

function normalizeDepartmentTextFullwidth(s: string): string {
  return normalizeExtractedText(s).replace(/、/g, '・').replace(/\(/g, '（').replace(/\)/g, '）');
}

const KUKURI_OVERRIDE = new Map<string, string>([
  ['呉工業|機械|80|29', '機械・材料工学'],
  ['呉工業|電気|40|18', '電気・電子機械'],
  ['福山工業|工業化学|40|24', '工業化学・染織システム'],
  ['宮島工業|電気|80|69', '電気・情報技術'],
  ['宮島工業|建築|80|52', '建築・インテリア'],
]);

/**
 * 広島県R8倍率PDFの学校別データ全頁分（`hiroshima-r8-geometry.json`）を解析する。
 *
 * ⚠️T-Y11F §5順序#8（出典ロケータ）: 全5頁中1頁目は総括表（概要）で、学校別詳細表は
 * 物理ページ2〜5の4頁（2026-09-10にpdftoppmでビジョン確認: 先頭の広島国泰寺「普通」
 * (quota240/applicants376)が物理ページ2に実在）。出典ロケータ用のpageは配列添字+2。
 * 全日制分校（加計・芸北）は座標抽出で1件も検出できず既存データの位置に手動補完する
 * レコードのため、単一の行位置に帰属できずpage/rowIndexは付与しない（意図的にundefined
 * のまま）。
 */
export function parseHiroshima(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRecords: ParsedCompetitionRow[] = [];
  const rowIndexByPage = new Map<number, number>();
  let currentSchool = '';
  for (let pageIdx = 0; pageIdx < geometries.length; pageIdx++) {
    const geom = geometries[pageIdx];
    const page = pageIdx + 2;
    const { chars } = geom;
    const sorted = [...chars].sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
    const rows: { y: number; chars: PdfPageGeometry['chars'] }[] = [];
    for (const c of sorted) {
      const row = rows.find((r) => Math.abs(r.y - c.y0) < 6.5);
      if (row) {
        row.chars.push(c);
        row.y = (row.y * (row.chars.length - 1) + c.y0) / row.chars.length;
      } else {
        rows.push({ y: c.y0, chars: [c] });
      }
    }
    rows.sort((a, b) => a.y - b.y);

    let stopped = false;
    for (const row of rows) {
      if (stopped) break;
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
      const schoolNameRaw = join(cell[1]);
      const departmentRaw = join(cell[2]);
      const quotaText = join(cell[3]);
      const applicantsText = join(cell[5]);
      const rateText = join(cell[7]);

      const sn = normalizeExtractedText(schoolNameRaw);
      if (/定時制|フレキシブル|帰国/.test(sn)) {
        stopped = true;
        break;
      }
      if (sn) currentSchool = sn;
      if (!departmentRaw) continue;
      const deptNorm = normalizeExtractedText(departmentRaw);
      if (deptNorm.includes('小計') || deptNorm.includes('合計')) continue;

      const quota = Number(quotaText.replace(/,/g, ''));
      const finalApplicants = Number(applicantsText.replace(/,/g, ''));
      const finalRate = Number(rateText);
      if (!Number.isFinite(quota) || quota <= 0) continue;
      if (!Number.isFinite(finalApplicants) || !Number.isFinite(finalRate)) continue;

      const department = normalizeDepartmentTextFullwidth(deptNorm);
      const override = KUKURI_OVERRIDE.get(`${currentSchool}|${department}|${quota}|${finalApplicants}`);
      const rowIndex = rowIndexByPage.get(page) ?? 0;
      rowIndexByPage.set(page, rowIndex + 1);
      allRecords.push({ schoolName: currentSchool, department: override ?? department, quota, finalApplicants, finalRate, page, rowIndex });
    }
  }
  // 全日制分校（加計・芸北）は座標抽出で1件も検出できなかったため、既存データの位置（末尾）に補完する
  allRecords.push({ schoolName: '加計・芸北', department: '普通', quota: 30, finalApplicants: 22, finalRate: 0.73 });
  return allRecords;
}
