import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { AOMORI_COMPETITION_RATES } from '../aomori';

/**
 * Y-6 DoD検証（青森県・32県目・全日制完全達成）。
 */
describe('青森県 倍率パイプラインα（Y-6・全日制43校89レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = AOMORI_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「全日制の課程合計」行（quota6,980・applicants6,436）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制の課程合計')!;
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

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(AOMORI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('89レコード・43校が収録されている', () => {
    expect(r8.length).toBe(89);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(43);
  });

  it('くくり募集(青森商業・商業/情報処理等)が単一レコードとして正しく収録されている', () => {
    expect(r8.find((r) => r.schoolName === '青森商業')).toEqual({
      schoolName: '青森商業',
      department: '商業・情報処理(くくり)',
      quota: 200,
      finalApplicants: 108,
      finalRate: 0.54,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが89件・43校収録され、公式「全日制の課程合計」7,060/6,533と完全一致し、R8と学校名+学科名の組み合わせが完全一致する(学校再編なし・くくり募集3組も同一)', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(89);
    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(43);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(7060);
    expect(sumApplicants).toBe(6533);

    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of AOMORI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.aomori\.lg\.jp\//);
    }
  });
});
