import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { YAMAGATA_TEIJI_COMPETITION_RATES } from '../yamagata';

/**
 * T-Y11F §5順序#4 DoD検証（山形県・定時制課程7レコード）: 手入力した合計が、
 * 山形県教育委員会公表の「定時制公立合計」（officialSubtotals）と一致することを機械的に突合する。
 */
describe('山形県 定時制課程 倍率パイプライン（T-Y11F §5順序#4）', () => {
  const { records, officialSubtotals } = YAMAGATA_TEIJI_COMPETITION_RATES;

  it('取り込み件数は7レコード（5校・霞城学園はⅠ〜Ⅲ部で3レコード）', () => {
    expect(records).toHaveLength(7);
  });

  it('学校数は5校', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(5);
  });

  it('全レコードの合計が公式「定時制公立合計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '定時制公立合計');
    if (!subtotal) throw new Error('officialSubtotals に "定時制公立合計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(241);
    expect(sumRecords(records).finalApplicants).toBe(109);
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
