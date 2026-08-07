import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { SAGA_COMPETITION_RATES } from '../saga';

/**
 * Y-6 DoD検証（佐賀県・19県目・全日制完全達成／掛-1・R7多年度対応済）。
 */
describe('佐賀県 倍率パイプラインα（Y-6・全日制32校71レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = SAGA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「合計」行（quota4,212・applicants4,191・倍率1.00）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
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

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(SAGA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('71レコード・32校が収録されている', () => {
    expect(r8.length).toBe(71);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(32);
  });

  it('凡例記載の9組＋凡例漏れの1組(嬉野)を含むくくり募集10組が正しく収録されている', () => {
    const kukuriRecords = r8.filter((r) => r.department.includes('くくり募集'));
    expect(kukuriRecords).toHaveLength(10);
    const ureshino = r8.find((r) => r.schoolName === '嬉野' && r.department.includes('くくり募集'));
    expect(ureshino).toEqual({
      schoolName: '嬉野',
      department: '電気科・建築科（くくり募集）',
      quota: 25,
      finalApplicants: 20,
      finalRate: 0.8,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが70件・32校収録され、公式「合計」4,505/4,596と完全一致する。神埼「こども教育進学コース」・唐津青翔「eスポーツ学科」はいずれもR8(2026年度)新設(WebSearchで公式発表を裏取り済み)のためR7側に存在せず、この2件を除けばR7/R8で学校名+学科名が完全一致する', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(70);
    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(32);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(4505);
    expect(sumApplicants).toBe(4596);

    const r7OnlyKeys = new Set(['神埼|普通科']);
    const r8OnlyKeys = new Set(['神埼|普通科・こども教育進学コース（くくり募集）', '唐津青翔|eスポーツ学科']);
    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`).filter((k) => !r8OnlyKeys.has(k)));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`).filter((k) => !r7OnlyKeys.has(k)));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of SAGA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.saga\.lg\.jp\//);
    }
  });
});
