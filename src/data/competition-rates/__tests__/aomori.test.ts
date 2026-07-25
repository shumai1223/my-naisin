import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { AOMORI_COMPETITION_RATES } from '../aomori';

/**
 * Y-6 DoD検証（青森県・32県目・全日制完全達成）。
 */
describe('青森県 倍率パイプラインα（Y-6・全日制43校89レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = AOMORI_COMPETITION_RATES;

  it('全日制の全レコード合計が「全日制の課程合計」行（quota6,980・applicants6,436）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制の課程合計')!;
    const result = checkAgainstSubtotal(records, grandTotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが自前算出値（applicants/quotaの四捨五入）と整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.02);
    }
  });

  it('学校名+学科名の重複が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes).toEqual([]);
  });

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(AOMORI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('89レコード・43校が収録されている', () => {
    expect(records.length).toBe(89);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(43);
  });

  it('くくり募集(青森商業・商業/情報処理等)が単一レコードとして正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '青森商業')).toEqual({
      schoolName: '青森商業',
      department: '商業・情報処理(くくり)',
      quota: 200,
      finalApplicants: 108,
      finalRate: 0.54,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of AOMORI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.aomori\.lg\.jp\//);
    }
  });
});
