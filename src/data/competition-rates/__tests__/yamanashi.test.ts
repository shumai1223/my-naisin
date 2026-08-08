import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { YAMANASHI_COMPETITION_RATES } from '../yamanashi';

/**
 * Y-6 DoD検証（山梨県・29県目・全日制完全達成）。
 *
 * ⚠️帰国生徒等特別措置の適用者は最終志願者数に内数として含まれるが倍率算定からは除外されるため、
 * 該当者が一定数いる学科（笛吹・果樹園芸/都留興譲館・普通）では印字済み倍率が
 * finalApplicants/quotaの単純計算値と若干（最大0.06程度）ずれる。許容誤差を0.06に緩めている。
 */
describe('山梨県 倍率パイプラインα（Y-6・全日制26校48学科の完全収録テスト）', () => {
  const { records, officialSubtotals } = YAMANASHI_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「全日制課程計」行（quota3,356・applicants3,037）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制課程計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが自前算出値（applicants/quota・帰国生徒等除外のため許容誤差0.06）と整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.06);
    }
  });

  it('学校名+学科名+年度の重複が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}|${r.fiscalYear ?? ''}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes).toEqual([]);
  });

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(YAMANASHI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('48レコード・26校が収録されている（資料が明記する「26校48学科」と一致）', () => {
    expect(r8.length).toBe(48);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(26);
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが48件・26校収録され、公式「全日制課程計」3,395/3,227と完全一致し、R8と学校名+学科名の組み合わせが完全一致する(学校再編なし)', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(48);
    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(26);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(3395);
    expect(sumApplicants).toBe(3227);

    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが48件・26校収録され、公式「全日制課程計」3,537/3,374と完全一致し、R8と学校名+学科名の組み合わせが完全一致する(学校再編なし)', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(48);
    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(26);
    const sumQuota = r6.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r6.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(3537);
    expect(sumApplicants).toBe(3374);

    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`));
    const r6Keys = new Set(r6.map((r) => `${r.schoolName}|${r.department}`));
    expect(r6Keys.size).toBe(r8Keys.size);
    for (const key of r6Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('教委が公式に一括募集と定める学科群（韮崎工業・工業一括）が単一レコードとして収録されている', () => {
    expect(records.find((r) => r.schoolName === '韮崎工業')).toEqual({
      schoolName: '韮崎工業',
      department: '工業(一括)',
      quota: 103,
      finalApplicants: 84,
      finalRate: 0.82,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of YAMANASHI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.yamanashi\.jp\//);
    }
  });
});
