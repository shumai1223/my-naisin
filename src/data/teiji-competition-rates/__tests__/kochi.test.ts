import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { KOCHI_TEIJI_COMPETITION_RATES } from '../kochi';

/**
 * T-Y11F §5順序#4 DoD検証（高知県・多部制単位制2レコード・定時制昼間部A日程のみ）: 手入力した
 * 合計が、高知県教育委員会公表の「合計」（officialSubtotals）と一致することを機械的に突合する。
 */
describe('高知県 定時制課程（多部制単位制） 倍率パイプライン（T-Y11F §5順序#4）', () => {
  const { records, officialSubtotals } = KOCHI_TEIJI_COMPETITION_RATES;

  it('取り込み件数は2レコード（2校）', () => {
    expect(records).toHaveLength(2);
  });

  it('学校数は2校', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(2);
  });

  it('全レコードの合計が公式「合計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '合計');
    if (!subtotal) throw new Error('officialSubtotals に "合計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(120);
    expect(sumRecords(records).finalApplicants).toBe(61);
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
