import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { TOKUSHIMA_COMPETITION_RATES } from '../tokushima';

/**
 * Y-6 DoD検証（徳島県・17県目・全日制完全達成）。
 */
describe('徳島県 倍率パイプラインα（Y-6・全日制32校69レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = TOKUSHIMA_COMPETITION_RATES;

  it('全日制の全レコード合計が「合計」行（quota4,165・applicants4,160・倍率1.00）と完全一致する', () => {
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
    expect(TOKUSHIMA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('69レコード・32校が収録されている', () => {
    expect(records.length).toBe(69);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(32);
  });

  it('文書内で2箇所に分裂していた徳島科学技術高校が1校9学科に統合されている', () => {
    expect(records.filter((r) => r.schoolName === '徳島科学技術')).toHaveLength(9);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of TOKUSHIMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/nyuushi\.tokushima-ec\.ed\.jp\//);
    }
  });
});
