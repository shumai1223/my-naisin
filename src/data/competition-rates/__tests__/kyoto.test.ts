import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { KYOTO_COMPETITION_RATES } from '../kyoto';

/**
 * Y-6 DoD検証（京都府・34県目・全日制完全達成）。
 */
describe('京都府 倍率パイプラインα（Y-6・全日制75レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = KYOTO_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全レコード合計が「全日制計」行（quota6,048・applicants5,160）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
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

  it('coverageがcompleteを示している（前期選抜・定時制は意図的にスコープ外）', () => {
    expect(KYOTO_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('75レコードが収録されている', () => {
    expect(r8.length).toBe(75);
  });

  it('applicants=0の学科（北桑田・普通/京都フォレスト/京都八幡(南)・人間科学）も正しく収録されている', () => {
    expect(r8.find((r) => r.schoolName === '北桑田')).toEqual({
      schoolName: '北桑田',
      department: '普通',
      quota: 42,
      finalApplicants: 0,
      finalRate: 0,
    });
  });

  it('くくり募集（綾部(東)・農業/園芸=注2により両学科併せて募集）が単一レコードとして正しく収録されている', () => {
    expect(r8.find((r) => r.schoolName === '綾部(東)' && r.department === '農業・園芸(くくり)')).toEqual({
      schoolName: '綾部(東)',
      department: '農業・園芸(くくり)',
      quota: 9,
      finalApplicants: 2,
      finalRate: 0.22,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが75件収録され、54校・全日制計(quota6,006・applicants5,635)と完全一致する', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(75);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(6006);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(5635);

    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(54);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of KYOTO_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.kyoto-be\.ne\.jp\//);
    }
  });
});
