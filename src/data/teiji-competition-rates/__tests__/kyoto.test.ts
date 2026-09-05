import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { KYOTO_TEIJI_COMPETITION_RATES } from '../kyoto';

/**
 * T-P1 P1-3 DoD検証（京都府・昼間定時制3レコード＋夜間定時制6レコード＝計9レコード）:
 * 3段階の公式合計（昼間定時制計・夜間定時制計・定時制計）すべてと機械集計が一致することを検証する。
 */
describe('京都府 定時制 倍率パイプライン（T-P1 P1-3）', () => {
  const { records, officialSubtotals } = KYOTO_TEIJI_COMPETITION_RATES;
  const chukan = records.filter((r) => r.department.includes('昼間定時制'));
  const yakan = records.filter((r) => r.department.includes('夜間定時制'));

  it('取り込み件数は計9レコード（昼間3＋夜間6・8校）', () => {
    expect(records).toHaveLength(9);
    expect(chukan).toHaveLength(3);
    expect(yakan).toHaveLength(6);
    expect(new Set(records.map((r) => r.schoolName)).size).toBe(8);
  });

  it('昼間定時制計と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '昼間定時制計');
    if (!subtotal) throw new Error('officialSubtotals に "昼間定時制計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, (r) => r.department.includes('昼間定時制'));
    expect(result.matches).toBe(true);
    expect(sumRecords(chukan).quota).toBe(106);
    expect(sumRecords(chukan).finalApplicants).toBe(0);
  });

  it('夜間定時制計と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '夜間定時制計');
    if (!subtotal) throw new Error('officialSubtotals に "夜間定時制計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, (r) => r.department.includes('夜間定時制'));
    expect(result.matches).toBe(true);
    expect(sumRecords(yakan).quota).toBe(349);
    expect(sumRecords(yakan).finalApplicants).toBe(85);
  });

  it('定時制計（総合計）と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '定時制計');
    if (!subtotal) throw new Error('officialSubtotals に "定時制計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(455);
    expect(sumRecords(records).finalApplicants).toBe(85);
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
