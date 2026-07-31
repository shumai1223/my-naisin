import { buildSchoolPageDataForPrefecture } from '../school-page-data';
import type { SchoolRecord } from '../school-master';
import type { CompetitionRateRecord } from '../competition-rate';

function rec(code: string, name: string): SchoolRecord {
  return { code, name, address: `${name}の住所`, postalCode: '1000001', branch: false };
}

function rate(schoolName: string, department: string, quota: number, finalApplicants: number, finalRate: number): CompetitionRateRecord {
  return { schoolName, department, quota, finalApplicants, finalRate };
}

describe('buildSchoolPageDataForPrefecture', () => {
  test('単一学科の学校は1件のSchoolPageDataになる', () => {
    const master = [rec('T1', '東京都立日比谷高等学校')];
    const rates = [rate('日比谷', '普通科', 253, 520, 2.06)];
    const result = buildSchoolPageDataForPrefecture(master, rates);
    expect(result.schools).toHaveLength(1);
    expect(result.schools[0]).toMatchObject({
      schoolCode: 'T1',
      schoolName: '東京都立日比谷高等学校',
      totalQuota: 253,
      totalApplicants: 520,
    });
    expect(result.schools[0].overallRate).toBeCloseTo(2.06, 2);
    expect(result.skipped).toHaveLength(0);
  });

  test('複数学科(普通科+理数科等)の学校は募集人員・応募者数を合算する', () => {
    const master = [rec('O1', '大阪府立東高等学校')];
    const rates = [
      rate('東', '普通科', 200, 271, 1.36),
      rate('東', '理数科', 80, 99, 1.24),
      rate('東', '英語科', 36, 23, 0.64),
    ];
    const result = buildSchoolPageDataForPrefecture(master, rates);
    expect(result.schools).toHaveLength(1);
    expect(result.schools[0].totalQuota).toBe(200 + 80 + 36);
    expect(result.schools[0].totalApplicants).toBe(271 + 99 + 23);
    expect(result.schools[0].departmentRates).toHaveLength(3);
  });

  test('学校名が突合できない場合はページを作らずskippedへ回す(no-match)', () => {
    const master = [rec('T1', '東京都立日比谷高等学校')];
    const rates = [rate('存在しない高校', '普通科', 100, 100, 1.0)];
    const result = buildSchoolPageDataForPrefecture(master, rates);
    expect(result.schools).toHaveLength(0);
    expect(result.skipped).toEqual([{ schoolName: '存在しない高校', reason: 'no-match' }]);
  });

  test('あいまい一致(同名複数校)もskippedへ回す(誤った紐付けをしない)', () => {
    const master = [rec('X1', '東京都立大森高等学校'), rec('X2', '東京都立大森高校')];
    const rates = [rate('大森', '普通科', 100, 100, 1.0)];
    const result = buildSchoolPageDataForPrefecture(master, rates);
    expect(result.schools).toHaveLength(0);
    expect(result.skipped).toEqual([{ schoolName: '大森', reason: 'ambiguous' }]);
  });

  test('募集人員0の学校はoverallRateを0にする(0除算を起こさない)', () => {
    const master = [rec('Z1', '東京都立ゼロ高等学校')];
    const rates: CompetitionRateRecord[] = [];
    const result = buildSchoolPageDataForPrefecture(master, rates);
    // ratesが無いのでmatchSummaryにも現れず、schools/skippedともに0件が正しい
    expect(result.schools).toHaveLength(0);
    expect(result.skipped).toHaveLength(0);
  });
});
