import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { FUKUOKA_TEIJI_COMPETITION_RATES } from '../fukuoka';

/**
 * T-Y11F §5順序#4 DoD検証（福岡県・定時制課程16レコード・単位制課程を除く）: 手入力した合計が、
 * 福岡県教育委員会公表の「県立計」「市立計」「合計」（officialSubtotals）と一致することを
 * 機械的に突合する。
 */
describe('福岡県 定時制課程 倍率パイプライン（T-Y11F §5順序#4）', () => {
  const { records, officialSubtotals } = FUKUOKA_TEIJI_COMPETITION_RATES;

  it('取り込み件数は16レコード（16校・単位制課程を除く）', () => {
    expect(records).toHaveLength(16);
  });

  it('学校数は16校', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(16);
  });

  it('県立15校の合計が公式「県立計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '県立計');
    if (!subtotal) throw new Error('officialSubtotals に "県立計" が見つかりません');
    const prefectural = records.filter((r) => r.schoolName !== '嘉穂総合（市立分校）');
    expect(prefectural).toHaveLength(15);
    const result = checkAgainstSubtotal(prefectural, subtotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('市立1校の合計が公式「市立計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '市立計');
    if (!subtotal) throw new Error('officialSubtotals に "市立計" が見つかりません');
    const municipal = records.filter((r) => r.schoolName === '嘉穂総合（市立分校）');
    expect(municipal).toHaveLength(1);
    const result = checkAgainstSubtotal(municipal, subtotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('全16校の合計が公式「合計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '合計');
    if (!subtotal) throw new Error('officialSubtotals に "合計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(720);
    expect(sumRecords(records).finalApplicants).toBe(300);
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
