import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { SHIMANE_TEIJI_COMPETITION_RATES } from '../shimane';

/**
 * T-P1 P1-3 DoD検証（島根県・定時制3校8レコード）: 手入力した合計が、
 * 島根県教育委員会公表の「合計」（officialSubtotals）と一致することを機械的に突合する。
 */
describe('島根県 定時制 倍率パイプライン（T-P1 P1-3）', () => {
  const { records, officialSubtotals } = SHIMANE_TEIJI_COMPETITION_RATES;

  it('取り込み件数は8レコード（3校・複数学科/時間帯を持つ学校は別レコード）', () => {
    expect(records).toHaveLength(8);
  });

  it('学校数は3校', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(3);
  });

  it('全レコードの合計が公式「合計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '合計');
    if (!subtotal) throw new Error('officialSubtotals に "合計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(360);
    expect(sumRecords(records).finalApplicants).toBe(134);
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
      if (r.quota === 0) continue;
      const computed = r.finalApplicants / r.quota;
      expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.015);
    }
  });
});
