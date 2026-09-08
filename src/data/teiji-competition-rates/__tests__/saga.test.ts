import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { SAGA_TEIJI_COMPETITION_RATES } from '../saga';

/**
 * T-Y11F §5順序#4 DoD検証（佐賀県・定時制課程7レコード・鳥栖工業小計＋合計の2段階）: 手入力した
 * 合計が、佐賀県教育委員会公表の「鳥栖工業計」「合計」（officialSubtotals）と一致することを
 * 機械的に突合する。
 */
describe('佐賀県 定時制課程 倍率パイプライン（T-Y11F §5順序#4）', () => {
  const { records, officialSubtotals } = SAGA_TEIJI_COMPETITION_RATES;

  it('取り込み件数は7レコード（6校）', () => {
    expect(records).toHaveLength(7);
  });

  it('学校数は6校', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(6);
  });

  it('鳥栖工業2レコードの合計が公式「鳥栖工業計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '鳥栖工業計');
    if (!subtotal) throw new Error('officialSubtotals に "鳥栖工業計" が見つかりません');
    const target = records.filter((r) => r.schoolName === '鳥栖工業');
    expect(target).toHaveLength(2);
    const result = checkAgainstSubtotal(target, subtotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('全レコードの合計が公式「合計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '合計');
    if (!subtotal) throw new Error('officialSubtotals に "合計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(280);
    expect(sumRecords(records).finalApplicants).toBe(72);
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
