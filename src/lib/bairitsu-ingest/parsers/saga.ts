import { normalizeExtractedText, type PdfPageGeometry, type ParsedCompetitionRow } from '../parse-table-pdf';

/**
 * T-Y11E E-1: saga(佐賀県)のR8倍率パーサを、テストから呼べる純関数として抽出したもの。
 *
 * ロジック本体は `__tests__/parse-table-pdf-saga.test.ts`（T-Y11B段階2-bで検証済み）から
 * 移設。tochigi型（単純carry-forward）をベースに、この県特有の「学科別/学校別が全項目で
 * 2列併記される」構造への対応が主な罠。quota/applicants/rateはいずれも学科別側（各ペアの
 * 左列）だけを採用する。番号列の混入除去・凡例に無い読点表記のくくり募集override・座標抽出
 * そのものが検出できなかった4組の位置ベース補完も行う（詳細はテストファイル側のコメントを参照）。
 */

const boundaries = [60, 70, 106, 190, 215, 240, 266, 292, 318, 344, 362, 386, 410, 432, 456, 480];
const numCols = boundaries.length - 1;
// 0 番号(未使用), 1 学校名, 2 学科名, 3 a(未使用), 4 b(未使用), 5 c=quota, 6 d(未使用),
// 7 e(未使用), 8 f(未使用), 9 g(未使用), 10 h(未使用), 11 i=finalApplicants, 12 j(未使用),
// 13 k=finalRate, 14 l+以降(未使用)

function normalizeDepartmentTextFullwidth(s: string): string {
  return normalizeExtractedText(s).replace(/、/g, '・').replace(/\(/g, '（').replace(/\)/g, '）');
}

const KUKURI_OVERRIDE = new Map<string, string>([
  ['神埼|普通科|84|54', '普通科・こども教育進学コース（くくり募集）'],
  ['佐賀東|普通科|184|130', '普通科・スポーツ科（くくり募集）'],
  ['唐津西|地域探究進学コース|115|98', '普通科・地域探究進学コース・学際探究進学コース（くくり募集）'],
  ['伊万里|普通科|133|117', '普通科・MIRAI進学科（くくり募集）'],
  ['鹿島|文理探求進学コース|156|63', '普通科・文理探求進学コース・未来探求進学コース（くくり募集）'],
  ['嬉野|電気科、建築科|25|20', '電気科・建築科（くくり募集）'],
]);

const INJECT_BEFORE_FIRST_DEPARTMENT = new Map<string, ParsedCompetitionRow>([
  ['鳥栖商業', { schoolName: '鳥栖商業', department: '商業科・流通経済科（くくり募集）', quota: 105, finalApplicants: 84, finalRate: 0.8 }],
  ['佐賀商業', { schoolName: '佐賀商業', department: '商業科・グローバルビジネス科（くくり募集）', quota: 144, finalApplicants: 186, finalRate: 1.29 }],
  ['唐津商業', { schoolName: '唐津商業', department: '商業科・会計科（くくり募集）', quota: 140, finalApplicants: 158, finalRate: 1.13 }],
]);

/** 佐賀県R8倍率PDFの学校別データ全頁分（`saga-r8-geometry.json`）を解析する。 */
export function parseSaga(geometries: PdfPageGeometry[]): ParsedCompetitionRow[] {
  const allRecords: ParsedCompetitionRow[] = [];
  let currentSchool = '';
  for (const geom of geometries) {
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
      const schoolNameRaw = join(cell[1]);
      const departmentRaw = join(cell[2]);
      const quotaText = join(cell[5]);
      const applicantsText = join(cell[11]);
      const rateText = join(cell[13]);

      const sn = normalizeExtractedText(schoolNameRaw).replace(/^[0-9]+/, '');
      if (/定時制/.test(sn)) break;
      if (sn && sn !== currentSchool) {
        currentSchool = sn;
        const inject = INJECT_BEFORE_FIRST_DEPARTMENT.get(sn);
        if (inject) allRecords.push(inject);
      }
      if (!departmentRaw) continue;
      const deptNorm = normalizeExtractedText(departmentRaw);
      if (deptNorm.includes('合計')) continue;

      const quota = Number(quotaText.replace(/,/g, ''));
      const finalApplicants = Number(applicantsText.replace(/,/g, ''));
      const finalRate = Number(rateText);
      if (!Number.isFinite(quota) || quota <= 0) continue;
      if (!Number.isFinite(finalApplicants) || !Number.isFinite(finalRate)) continue;

      const override = KUKURI_OVERRIDE.get(`${currentSchool}|${deptNorm}|${quota}|${finalApplicants}`);
      let department = override ?? normalizeDepartmentTextFullwidth(deptNorm);
      if (currentSchool === '唐津青翔' && department === 'ｅスポーツ学科') department = 'eスポーツ学科';
      allRecords.push({ schoolName: currentSchool, department, quota, finalApplicants, finalRate });

      if (currentSchool === '白石' && department === '普通科' && quota === 102) {
        allRecords.push({ schoolName: '白石', department: '商業科・情報ビジネス科（くくり募集）', quota: 66, finalApplicants: 55, finalRate: 0.83 });
      }
    }
  }
  return allRecords;
}
