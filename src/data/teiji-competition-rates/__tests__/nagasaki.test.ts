import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { NAGASAKI_TEIJI_COMPETITION_RATES } from '../nagasaki';

/**
 * T-P1 P1-3 DoD検証（長崎県・定時制/夜間部8校12レコード・Ⅰ期選抜のみ）: 手入力した合計が、
 * 長崎県教育委員会公表の「県立計」（officialSubtotals）と一致することを機械的に突合する。
 */
describe('長崎県 定時制/夜間部 倍率パイプライン（T-P1 P1-3・Ⅰ期選抜のみ）', () => {
  const { records, officialSubtotals, coverage } = NAGASAKI_TEIJI_COMPETITION_RATES;

  it('取り込み件数は12レコード（8校・複数学科を持つ学校は学科ごとに別レコード）', () => {
    expect(records).toHaveLength(12);
    expect(new Set(records.map((r) => r.schoolName)).size).toBe(8);
  });

  it('coverage.noteにⅠ期選抜のみである留保が明記されている', () => {
    expect(coverage.note).toContain('Ⅰ期選抜');
  });

  it('全レコードの合計が公式「県立計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '県立計');
    if (!subtotal) throw new Error('officialSubtotals に "県立計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(336);
    expect(sumRecords(records).finalApplicants).toBe(133);
  });

  it('quota/finalApplicants/finalRateはいずれも0以上（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(r.finalRate).toBeGreaterThanOrEqual(0);
    }
  });

  it('finalRateは公表値どおりquota分を小数点1桁に丸めた値（±0.06の誤差内で自己整合。長崎県はfinalRateが小数点1桁までしか印字されないため他県より粗い丸め・0.75→0.8や0.25→0.3のような境界値の四捨五入で最大0.05の差が出る）', () => {
    for (const r of records) {
      const computed = r.finalApplicants / r.quota;
      expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.06);
    }
  });
});
