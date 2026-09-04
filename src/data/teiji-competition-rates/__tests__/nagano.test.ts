import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { NAGANO_TEIJI_COMPETITION_RATES } from '../nagano';

/**
 * T-P1 P1-3 DoD検証（長野県・定時制課程14校+多部制単位制3校の計22レコード）: 手入力した
 * 各セクションの合計が、長野県教育委員会公表の「合計」（officialSubtotals）と一致することを
 * 機械的に突合する。
 */
describe('長野県 定時制課程・定時制課程（多部制・単位制） 倍率パイプライン（T-P1 P1-3）', () => {
  const { records, officialSubtotals } = NAGANO_TEIJI_COMPETITION_RATES;
  const TANBUSEI_SCHOOLS = new Set(['東御清翔', '箕輪進修', '松本筑摩']);

  it('取り込み件数は22レコード（定時制課程16 + 多部制単位制6）', () => {
    expect(records).toHaveLength(22);
  });

  it('定時制課程16レコードの合計が公式「定時制課程 合計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('定時制課程 合計'), (r) => !TANBUSEI_SCHOOLS.has(r.schoolName));
    expect(result.matches).toBe(true);
    expect(sumRecords(records.filter((r) => !TANBUSEI_SCHOOLS.has(r.schoolName))).schoolCount).toBe(16);
  });

  it('多部制・単位制6レコードの合計が公式「多部制・単位制 合計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('多部制・単位制 合計'), (r) => TANBUSEI_SCHOOLS.has(r.schoolName));
    expect(result.matches).toBe(true);
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

  function findSubtotal(label: string) {
    const s = officialSubtotals.find((x) => x.label === label);
    if (!s) throw new Error(`officialSubtotals に "${label}" が見つかりません`);
    return s;
  }
});
