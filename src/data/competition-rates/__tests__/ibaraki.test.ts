import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { IBARAKI_COMPETITION_RATES } from '../ibaraki';

/**
 * Y-6 DoD検証（茨城県・11県目・全日制完全達成）。
 */
describe('茨城県 倍率パイプラインα（Y-6・全日制85校149レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = IBARAKI_COMPETITION_RATES;

  it('全日制の全レコード合計が「全日制計」行（quota16,647・applicants15,211・倍率0.91）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
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
    expect(IBARAKI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('149レコード・85校が収録されている', () => {
    expect(records.length).toBe(149);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(85);
  });

  it('学校名の行折返しで遅延して出現した学科(常陸大宮・水戸第三・波崎等)が正しく収録されている', () => {
    expect(records.filter((r) => r.schoolName === '常陸大宮')).toHaveLength(3);
    expect(records.filter((r) => r.schoolName === '水戸第三')).toHaveLength(3);
    expect(records.filter((r) => r.schoolName === '波崎')).toHaveLength(4);
    expect(records.filter((r) => r.schoolName === '水戸農業')).toHaveLength(7);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of IBARAKI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/kyoiku\.pref\.ibaraki\.jp\//);
    }
  });
});
