import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { FUKUSHIMA_TEIJI_COMPETITION_RATES } from '../fukushima';

/**
 * T-Y11F §5順序#4 DoD検証（福島県・定時制課程8レコード）: 手入力した合計が、
 * 福島県教育委員会公表の「定時制　合計」（officialSubtotals）と一致することを機械的に突合する。
 */
describe('福島県 定時制課程 倍率パイプライン（T-Y11F §5順序#4）', () => {
  const { records, officialSubtotals } = FUKUSHIMA_TEIJI_COMPETITION_RATES;

  it('取り込み件数は8レコード（6校・郡山萌世といわき翠の杜は昼間主/夜間主の2レコード）', () => {
    expect(records).toHaveLength(8);
  });

  it('学校数は6校', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(6);
  });

  it('全レコードの合計が公式「定時制　合計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '定時制　合計');
    if (!subtotal) throw new Error('officialSubtotals に "定時制　合計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(200);
    expect(sumRecords(records).finalApplicants).toBe(9);
  });

  it('quota/finalApplicants/finalRateはいずれも0以上（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(r.finalRate).toBeGreaterThanOrEqual(0);
    }
  });

  it('finalRateはfinalApplicants/quotaの自前算出値と一致する（小数第2位四捨五入・±0.01の誤差内）', () => {
    for (const r of records) {
      if (r.quota === 0) continue;
      const computed = r.finalApplicants / r.quota;
      expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.01);
    }
  });
});
