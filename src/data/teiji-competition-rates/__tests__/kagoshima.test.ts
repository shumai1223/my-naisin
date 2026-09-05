import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { KAGOSHIMA_TEIJI_COMPETITION_RATES } from '../kagoshima';

/**
 * T-P1 P1-3 DoD検証（鹿児島県・定時制2校3レコード）: 学区ごとの小計と定時制合計、
 * いずれも公式値と機械集計が一致することを検証する。
 */
describe('鹿児島県 定時制 倍率パイプライン（T-P1 P1-3）', () => {
  const { records, officialSubtotals } = KAGOSHIMA_TEIJI_COMPETITION_RATES;

  it('取り込み件数は3レコード（2校・開陽のみ2学科）', () => {
    expect(records).toHaveLength(3);
    expect(new Set(records.map((r) => r.schoolName)).size).toBe(2);
  });

  it('鹿児島学区計と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '鹿児島学区計');
    if (!subtotal) throw new Error('officialSubtotals に "鹿児島学区計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, (r) => r.schoolName === '開陽');
    expect(result.matches).toBe(true);
  });

  it('大島学区計と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '大島学区計');
    if (!subtotal) throw new Error('officialSubtotals に "大島学区計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, (r) => r.schoolName === '奄美');
    expect(result.matches).toBe(true);
  });

  it('定時制合計と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '定時制合計');
    if (!subtotal) throw new Error('officialSubtotals に "定時制合計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(76);
    expect(sumRecords(records).finalApplicants).toBe(38);
  });

  it('quota/finalApplicants/finalRateはいずれも0以上（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(r.finalRate).toBeGreaterThanOrEqual(0);
    }
  });

  it('finalRateは公表値どおりquota分の1桁目まで丸められている（±0.01の誤差内で自己整合）', () => {
    for (const r of records) {
      const computed = r.finalApplicants / r.quota;
      expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.015);
    }
  });
});
