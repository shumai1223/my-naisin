import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { TOCHIGI_TEIJI_COMPETITION_RATES } from '../tochigi';

/**
 * T-Y11F §5順序#4 DoD検証（栃木県・定時制課程12レコード）: 手入力した合計が、
 * 栃木県教育委員会公表の「合計」（officialSubtotals）と一致することを機械的に突合する。
 */
describe('栃木県 定時制課程 倍率パイプライン（T-Y11F §5順序#4）', () => {
  const { records, officialSubtotals } = TOCHIGI_TEIJI_COMPETITION_RATES;

  it('取り込み件数は12レコード（8校・複数学科/部を持つ学校は別レコード）', () => {
    expect(records).toHaveLength(12);
  });

  it('学校数は8校', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(8);
  });

  it('全レコードの合計が公式「合計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '合計');
    if (!subtotal) throw new Error('officialSubtotals に "合計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(452);
    expect(sumRecords(records).finalApplicants).toBe(193);
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
