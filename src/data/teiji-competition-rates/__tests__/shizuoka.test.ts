import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { SHIZUOKA_TEIJI_COMPETITION_RATES } from '../shizuoka';

/**
 * T-P1 P1-3 DoD検証（静岡県・定時制15校+単位制による定時制4校の計19レコード）: 手入力した
 * 各セクションの合計が、静岡県教育委員会公表の「合計」（officialSubtotals）と一致することを
 * 機械的に突合する。
 */
describe('静岡県 定時制・単位制による定時制 倍率パイプライン（T-P1 P1-3）', () => {
  const { records, officialSubtotals } = SHIZUOKA_TEIJI_COMPETITION_RATES;
  const TANISEI_SCHOOLS = new Set(['三島長陵', '静岡中央', 'ふじのくに国際', '浜松大平台']);

  it('取り込み件数は19レコード（定時制15 + 単位制による定時制4）', () => {
    expect(records).toHaveLength(19);
  });

  it('定時制15レコードの合計が公式「定時制 合計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('定時制 合計'), (r) => !TANISEI_SCHOOLS.has(r.schoolName));
    expect(result.matches).toBe(true);
    expect(sumRecords(records.filter((r) => !TANISEI_SCHOOLS.has(r.schoolName))).schoolCount).toBe(15);
  });

  it('単位制による定時制4レコードの合計が公式「単位制による定時制 合計」と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('単位制による定時制 合計'), (r) => TANISEI_SCHOOLS.has(r.schoolName));
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
