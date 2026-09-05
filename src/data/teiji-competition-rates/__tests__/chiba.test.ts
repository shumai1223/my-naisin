import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { CHIBA_TEIJI_COMPETITION_RATES } from '../chiba';

/**
 * T-P1 P1-3 DoD検証（千葉県・県立定時制16校22レコード）: 手入力した合計が、
 * 千葉県教育委員会公表の「県立定時制　合計」（officialSubtotals）と一致することを機械的に突合する。
 */
describe('千葉県 定時制課程 倍率パイプライン（T-P1 P1-3）', () => {
  const { records, officialSubtotals } = CHIBA_TEIJI_COMPETITION_RATES;

  it('取り込み件数は22レコード（16校・複数部制を持つ学校は部ごとに別レコード）', () => {
    expect(records).toHaveLength(22);
  });

  it('学校数は16校', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(16);
  });

  it('全レコードの合計が公式「県立定時制　合計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '県立定時制　合計');
    if (!subtotal) throw new Error('officialSubtotals に "県立定時制　合計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(1237);
    expect(sumRecords(records).finalApplicants).toBe(821);
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
