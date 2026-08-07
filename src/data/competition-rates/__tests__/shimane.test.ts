import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { SHIMANE_COMPETITION_RATES } from '../shimane';

/**
 * Y-6 DoD検証（島根県・保留県からの再挑戦で完全達成）。
 */
describe('島根県 倍率パイプラインα（Y-6・全日制35校64レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = SHIMANE_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全レコード合計が「合計」行（quota3,084・applicants2,493）と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '合計')!;
    const result = checkAgainstSubtotal(records, subtotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('県立高校のみの合計が「県立高校計」行（quota3,031・applicants2,447）と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '県立高校計')!;
    const result = checkAgainstSubtotal(records, subtotal, (r) => r.schoolName !== '皆美が丘女子' && !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが自前算出値（applicants/quotaの四捨五入）と整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.02);
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

  it('coverageがcompleteを示している（定時制は意図的にスコープ外）', () => {
    expect(SHIMANE_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('64レコード・35校（県立34校+市立1校）が収録されている', () => {
    expect(r8.length).toBe(64);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(35);
  });

  it('市立高校(皆美が丘女子)が県立高校と区別して収録されている', () => {
    expect(r8.find((r) => r.schoolName === '皆美が丘女子')).toEqual({
      schoolName: '皆美が丘女子',
      department: '普通',
      quota: 53,
      finalApplicants: 46,
      finalRate: 0.87,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが65件収録され、「合計」(quota3,217・applicants2,667)および「県立高校計」(quota3,133・applicants2,596)と完全一致する。皆美が丘女子はR7時点「普通」「国際コミュニケーション」の2学科構成で、国際コミュニケーション科は定員未充足のためR8で募集停止・普通科一本化された実在の学科再編を確認した', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(65);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(3217);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(2667);

    const r7Kenritsu = r7.filter((r) => r.schoolName !== '皆美が丘女子');
    expect(r7Kenritsu.reduce((a, r) => a + r.quota, 0)).toBe(3133);
    expect(r7Kenritsu.reduce((a, r) => a + r.finalApplicants, 0)).toBe(2596);

    expect(r7.some((r) => r.schoolName === '皆美が丘女子' && r.department === '国際コミュニケーション')).toBe(true);
    expect(r8.some((r) => r.schoolName === '皆美が丘女子' && r.department === '国際コミュニケーション')).toBe(false);

    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(35);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of SHIMANE_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.shimane\.lg\.jp\//);
    }
  });
});
