import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { MIE_TEIJI_COMPETITION_RATES } from '../mie';

/**
 * T-Y11F §5順序#4 DoD検証（三重県・定時制課程17レコード＋通信制課程2レコード）: 手入力した
 * 合計が、三重県教育委員会公表の「定時制課程 総計」「通信制課程 総計」（officialSubtotals）と
 * 一致することを機械的に突合する。
 */
describe('三重県 定時制・通信制課程 倍率パイプライン（T-Y11F §5順序#4）', () => {
  const { records, officialSubtotals } = MIE_TEIJI_COMPETITION_RATES;
  const isTsushin = (r: { schoolName: string }) => r.schoolName.includes('（通信制）');

  it('取り込み件数は19レコード（定時制17・通信制2）', () => {
    expect(records).toHaveLength(19);
    expect(records.filter(isTsushin)).toHaveLength(2);
    expect(records.filter((r) => !isTsushin(r))).toHaveLength(17);
  });

  it('定時制課程の合計が公式「定時制課程 総計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '定時制課程 総計');
    if (!subtotal) throw new Error('officialSubtotals に "定時制課程 総計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, (r) => !isTsushin(r));
    expect(result.matches).toBe(true);
    expect(sumRecords(records.filter((r) => !isTsushin(r))).quota).toBe(558);
    expect(sumRecords(records.filter((r) => !isTsushin(r))).finalApplicants).toBe(182);
  });

  it('通信制課程の合計が公式「通信制課程 総計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '通信制課程 総計');
    if (!subtotal) throw new Error('officialSubtotals に "通信制課程 総計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, isTsushin);
    expect(result.matches).toBe(true);
    expect(sumRecords(records.filter(isTsushin)).quota).toBe(392);
    expect(sumRecords(records.filter(isTsushin)).finalApplicants).toBe(53);
  });

  it('quota/finalApplicants/finalRateはいずれも0以上（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(r.finalRate).toBeGreaterThanOrEqual(0);
    }
  });

  it('finalRateは公表値どおりquota分の2桁目まで丸められている（±0.015の誤差内で自己整合）', () => {
    for (const r of records) {
      if (r.quota === 0) continue;
      const computed = r.finalApplicants / r.quota;
      expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.015);
    }
  });
});
