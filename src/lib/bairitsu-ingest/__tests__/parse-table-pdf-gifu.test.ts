import { normalizeExtractedText, type PdfPageGeometry } from '../parse-table-pdf';
import { GIFU_COMPETITION_RATES } from '@/data/competition-rates/gifu';
import gifuR8Geometry from '../__fixtures__/gifu-r8-geometry.json';

/**
 * T-Y11B 段階2-b: gifu(岐阜県)のR8倍率パーサ検証テスト。tochigi型（単純carry-forward）を
 * そのまま流用できた。134/134件・完全一致（グランドトータルquota12,925・applicants12,009も
 * 「変更後出願者数総括表」の全日制計と一致）。
 *
 * 列は[学校名/学科(群)名/募集人員(=quota)/出願者数(=finalApplicants)/倍率(=finalRate。
 * 印字済み値を採用)]。各学科(群)の本体行の下に、独自検査を含む選抜の区分（「Ⅰ」「Ⅱ」）・
 * 連携型選抜（「連携」）の内訳行が付随するが、これらは本体行の内数（学校名・学科名列が空欄
 * のまま数値だけが続く）であり、`!departmentRaw`（学科名列が空欄の行は捨てる、既存原則）で
 * 自然にスキップされる。
 *
 * ⚠️唯一の罠: 全日制の後（5頁目）に「２　定時制」「３　通信制」という別セクションが続き、
 * 華陽フロンティア（定時制11校の1つ・普通科Ⅰ部/Ⅱ部/Ⅲ部）・飛騨高山（通信制2校の1つ）等が
 * **全日制と同じ学校名・同じ学科名で別の（小さい）quota/applicantsを持つ行として再登場する**。
 * 単純な学校名+学科名のキーでは全日制の正しいレコードと区別できないため、「２　定時制」
 * 「３　通信制」という見出し行（学校名列に出現）を検知した時点で以降の行を丸ごと処理打ち切り
 * とする（定時制・通信制は他県と同じ理由でスコープ外）。
 *
 * ⚠️既存の罠の再確認: 学校集計行等の除外判定に単純な`.includes('計')`を使うと、正当な学科名
 * 「会計」（岐阜商業に実在）まで誤って除外してしまう（`.includes('合計')`のように完全な
 * マーカー文字列で判定する必要がある・nagasaki型の教訓の再確認）。
 */

const boundaries = [105, 205, 415, 480, 545, 570];
const numCols = boundaries.length - 1;
// 0 学校名, 1 学科(群)名, 2 募集人員(=quota), 3 出願者数(=finalApplicants), 4 倍率(=finalRate)

function normalizeDepartmentTextFullwidth(s: string): string {
  return normalizeExtractedText(s).replace(/、/g, '・').replace(/\(/g, '（').replace(/\)/g, '）');
}

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
  let stopped = false;
  for (const geom of geometries) {
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
      allRecords.push({ schoolName: currentSchool, department, quota, finalApplicants, finalRate });
    }
  }
  return allRecords;
}

describe('bairitsu-ingest parse-table-pdf 汎用carry-forward組み立て (gifu R8 実データ検証・定時制/通信制セクションの打ち切り)', () => {
  const geometries = gifuR8Geometry as PdfPageGeometry[];
  const parsed = parseAllPages(geometries);
  const expectedR8Records = GIFU_COMPETITION_RATES.records.filter((r) => r.fiscalYear === undefined);

  test('R8のレコード件数が既存データと一致する（134件・63校）', () => {
    expect(parsed.length).toBe(expectedR8Records.length);
    expect(parsed.length).toBe(134);
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

  test('定時制(華陽フロンティア)・通信制(飛騨高山)の同名重複レコードは収録されない', () => {
    expect(parsed.some((r) => r.schoolName === '華陽フロンティア')).toBe(false);
    expect(parsed.filter((r) => r.schoolName === '飛騨高山').length).toBe(6);
  });

  test('「会計」のような「計」を含む正当な学科名は誤って除外されない（岐阜商業の実例）', () => {
    expect(parsed.find((r) => r.schoolName === '岐阜商業' && r.department === '会計')).toEqual({
      schoolName: '岐阜商業',
      department: '会計',
      quota: 80,
      finalApplicants: 88,
      finalRate: 1.1,
    });
  });

  test('機械集計のグランドトータルが「全日制計」（quota12,925・applicants12,009）と一致する', () => {
    const sumQuota = parsed.reduce((acc, r) => acc + r.quota, 0);
    const sumApplicants = parsed.reduce((acc, r) => acc + r.finalApplicants, 0);
    expect(sumQuota).toBe(12925);
    expect(sumApplicants).toBe(12009);
  });
});
