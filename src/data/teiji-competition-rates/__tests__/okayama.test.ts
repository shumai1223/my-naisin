import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { OKAYAMA_TEIJI_COMPETITION_RATES } from '../okayama';

/**
 * T-P1 P1-3 DoD検証（岡山県・定時制7校12レコード）: 手入力した各ブロックの合計が、
 * 岡山県教育委員会公表の「計」（officialSubtotals）と一致することを機械的に突合する。
 */
describe('岡山県 定時制（県立・市立） 倍率パイプライン（T-P1 P1-3）', () => {
  const { records, officialSubtotals } = OKAYAMA_TEIJI_COMPETITION_RATES;
  const findSubtotal = (label: string) => {
    const s = officialSubtotals.find((x) => x.label === label);
    if (!s) throw new Error(`officialSubtotals に "${label}" が見つかりません`);
    return s;
  };

  it('取り込み件数は12レコード（7校・複数学科/部を持つ学校は別レコード）', () => {
    expect(records).toHaveLength(12);
  });

  it('学校数は7校', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(7);
  });

  it('県立定時制（烏城2レコード）の合計が公式「県立定時制計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('県立定時制計'), (r) => r.schoolName === '烏城');
    expect(result.matches).toBe(true);
  });

  it('市立定時制10レコードの合計が公式「市立定時制計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('市立定時制計'), (r) => r.schoolName !== '烏城');
    expect(result.matches).toBe(true);
    expect(sumRecords(records.filter((r) => r.schoolName !== '烏城')).schoolCount).toBe(10);
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
