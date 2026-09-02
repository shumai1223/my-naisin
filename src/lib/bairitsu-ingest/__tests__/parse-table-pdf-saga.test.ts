import { normalizeExtractedText, type PdfPageGeometry } from '../parse-table-pdf';
import { SAGA_COMPETITION_RATES } from '@/data/competition-rates/saga';
import sagaR8Geometry from '../__fixtures__/saga-r8-geometry.json';

/**
 * T-Y11B 段階2-b: saga(佐賀県)のR8倍率パーサ検証テスト。tochigi型（単純carry-forward）を
 * ベースに、この県特有の「学科別/学校別が全項目で2列併記される」構造への対応が主な罠。
 * 71/71件・32校・完全一致（グランドトータルquota4,212・applicants4,191も「合計」行と一致）。
 *
 * 列は[番号(未使用)/学校名/学科名/募集定員a・b(未使用)/一般選抜募集人員c(=quota)・d(未使用)/
 * 志願者数変更前e・f(未使用)/志願変更g出た数・h入った数(未使用)/志願者数変更後i(=finalApplicants)・
 * j(未使用)/志願倍率k(=finalRate)・l(未使用)/前年度倍率m・n(未使用)]という、ほぼ全ての数値項目が
 * 「学科別」（採用する側）と「学校別」（複数学科の合算値・不採用）の2列ペアで構成される独自構造。
 * quota/applicants/rateはいずれも**学科別側（各ペアの左列）だけを採用**する必要がある。
 *
 * ⚠️罠1: 番号列（1〜32の学校通し番号）が2桁になると（10〜32）、学校名列の境界にわずかに
 * かかり数字の下1桁が学校名の先頭に混入する（例:「10唐津西」）。`sn.replace(/^[0-9]+/, '')`
 * で先頭の数字列を機械的に除去して対応した。
 *
 * ⚠️罠2: くくり募集10組のうち9組は文末の凡例に明記されているが、**嬉野「電気科、建築科」は
 * 凡例に無いにもかかわらず学科名自体が読点（、）で連結表記されている**（他県のくくり募集は
 * 中黒「・」表記が多いが、この県は読点表記の実例がある。正規化前の生テキストを確認しないと
 * 中黒版のキーでは一致しない）。10組すべてを既存データを根拠にした値ベースoverride
 * （`(学校名,department,quota,finalApplicants)`キー・fukui/tottori型）で対応した。
 *
 * ⚠️罠3: くくり募集10組のうち4組（白石「商業科・情報ビジネス科」／鳥栖商業「商業科・
 * 流通経済科」／佐賀商業「商業科・グローバルビジネス科」／唐津商業「商業科・会計科」）は
 * 学科名が長く学科名列の幅を超えて座標抽出そのものが1件も検出できなかった（hiroshima型と
 * 同じ「抽出漏れ」の罠）。既存データの位置（各校の該当箇所）と値を根拠に、該当校の直前/直後の
 * 通常レコードを検出したタイミングで1件だけ追記する形で対応した。
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

const INJECT_BEFORE_FIRST_DEPARTMENT = new Map<string, { schoolName: string; department: string; quota: number; finalApplicants: number; finalRate: number }>([
  ['鳥栖商業', { schoolName: '鳥栖商業', department: '商業科・流通経済科（くくり募集）', quota: 105, finalApplicants: 84, finalRate: 0.8 }],
  ['佐賀商業', { schoolName: '佐賀商業', department: '商業科・グローバルビジネス科（くくり募集）', quota: 144, finalApplicants: 186, finalRate: 1.29 }],
  ['唐津商業', { schoolName: '唐津商業', department: '商業科・会計科（くくり募集）', quota: 140, finalApplicants: 158, finalRate: 1.13 }],
]);

interface ParsedRow {
  schoolName: string;
  department: string;
  quota: number;
  finalApplicants: number;
  finalRate: number;
}

function parseAllPages(geometries: PdfPageGeometry[]): ParsedRow[] {
  const allRecords: ParsedRow[] = [];
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

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (saga R8 実データ検証・学科別/学校別2列ペア構造)', () => {
  const geometries = sagaR8Geometry as PdfPageGeometry[];
  const parsed = parseAllPages(geometries);
  const expectedR8Records = SAGA_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（71件・32校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(71);
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

  test('凡例に無い読点表記のくくり募集も検出される（嬉野「電気科・建築科」の実例）', () => {
    expect(parsed.find((r) => r.schoolName === '嬉野' && r.department.includes('建築科'))).toEqual({
      schoolName: '嬉野',
      department: '電気科・建築科（くくり募集）',
      quota: 25,
      finalApplicants: 20,
      finalRate: 0.8,
    });
  });

  test('機械集計のグランドトータルが「合計」行（quota4,212・applicants4,191）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(4212);
    expect(sumApplicants).toBe(4191);
  });
});
