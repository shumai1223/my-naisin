import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { KAGAWA_TEIJI_COMPETITION_RATES } from '../kagawa';

/**
 * T-Y11F §5順序#4 DoD検証（香川県・定時制課程12レコード）: 手入力した合計が、
 * 香川県教育委員会公表の「定時制合計」（officialSubtotals）と一致することを機械的に突合する。
 */
describe('香川県 定時制課程 倍率パイプライン（T-Y11F §5順序#4）', () => {
  const { records, officialSubtotals } = KAGAWA_TEIJI_COMPETITION_RATES;

  it('取り込み件数は12レコード（6校・複数学科を持つ学校は別レコード）', () => {
    expect(records).toHaveLength(12);
  });

  it('学校数は9校（高松工芸・多度津は複数学科にまたがる）', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(9);
  });

  it('全レコードの合計が公式「定時制合計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '定時制合計');
    if (!subtotal) throw new Error('officialSubtotals に "定時制合計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(472);
    expect(sumRecords(records).finalApplicants).toBe(76);
  });

  it('三木のみ別日程定員留保によりquotaが40未満(32)、他はquota40', () => {
    const miki = records.find((r) => r.schoolName === '三木');
    expect(miki?.quota).toBe(32);
    const others = records.filter((r) => r.schoolName !== '三木');
    for (const r of others) expect(r.quota).toBe(40);
  });

  it('quota/finalApplicants/finalRateはいずれも0以上（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(r.finalRate).toBeGreaterThanOrEqual(0);
    }
  });

  it('finalRateは公表値どおりquota分の1桁目まで丸められている（±0.015の誤差内で自己整合）', () => {
    for (const r of records) {
      if (r.quota === 0) continue;
      const computed = r.finalApplicants / r.quota;
      expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.015);
    }
  });
});
