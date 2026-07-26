import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { FUKUSHIMA_COMPETITION_RATES } from '../fukushima';

/**
 * Y-6 DoD検証（福島県・保留県からの再挑戦で完全達成）。
 */
describe('福島県 倍率パイプラインα（Y-6・全日制50校99レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = FUKUSHIMA_COMPETITION_RATES;

  it('全レコード合計が「全日制 合計」行（quota1,686・applicants106）と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '全日制 合計')!;
    const result = checkAgainstSubtotal(records, subtotal, () => true);
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

  it('coverageがcompleteを示している（前期選抜・連携型選抜・定時制は意図的にスコープ外）', () => {
    expect(FUKUSHIMA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('99レコード・50校が収録されている', () => {
    expect(records.length).toBe(99);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(50);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of FUKUSHIMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.fukushima\.lg\.jp\//);
    }
  });
});
