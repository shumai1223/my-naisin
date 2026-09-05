import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { KANAGAWA_TEIJI_COMPETITION_RATES } from '../kanagawa';

/**
 * T-P1 P1-3 DoD検証（神奈川県・定時制3セクション18レコード＋通信制1セクション2レコード＝計20レコード）:
 * 4セクションそれぞれの公式合計と機械集計が一致することを検証する。
 */
describe('神奈川県 定時制・通信制（単位制） 倍率パイプライン（T-P1 P1-3）', () => {
  const { records, officialSubtotals } = KANAGAWA_TEIJI_COMPETITION_RATES;

  const byTag = (tag: string) => records.filter((r) => r.department.includes(tag));

  it('取り込み件数は計20レコード（普通科11＋総合学科4＋専門学科3＋通信制2）', () => {
    expect(records).toHaveLength(20);
    expect(byTag('単位制普通科・定時制')).toHaveLength(11);
    expect(byTag('単位制総合学科・定時制')).toHaveLength(4);
    expect(byTag('単位制専門学科(工業)・定時制')).toHaveLength(3);
    expect(byTag('単位制普通科・通信制')).toHaveLength(2);
  });

  it('県立神奈川工業と県立厚木清南は複数セクションに重複登場する（角括弧タグで区別）', () => {
    const kanagawaKogyoRecords = records.filter((r) => r.schoolName === '県立神奈川工業');
    expect(kanagawaKogyoRecords).toHaveLength(4); // 普通科1 + 機械/電気/建設3
    const atsugiSeinanRecords = records.filter((r) => r.schoolName === '県立厚木清南');
    expect(atsugiSeinanRecords).toHaveLength(2); // 定時制1 + 通信制1
  });

  it.each([
    ['単位制普通科合計', '単位制普通科・定時制', 983, 558],
    ['単位制総合学科合計', '単位制総合学科・定時制', 406, 328],
    ['単位制専門学科（工業）合計', '単位制専門学科(工業)・定時制', 84, 16],
    ['通信制単位制普通科合計', '単位制普通科・通信制', 1216, 542],
  ])('セクション「%s」の機械集計が公式合計と一致する', (label, tag, expectedQuota, expectedApplicants) => {
    const subtotal = officialSubtotals.find((s) => s.label === label);
    if (!subtotal) throw new Error(`officialSubtotals に "${label}" が見つかりません`);
    const section = byTag(tag);
    const result = checkAgainstSubtotal(records, subtotal, (r) => r.department.includes(tag));
    expect(result.matches).toBe(true);
    expect(sumRecords(section).quota).toBe(expectedQuota);
    expect(sumRecords(section).finalApplicants).toBe(expectedApplicants);
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
      const computed = r.finalApplicants / r.quota;
      expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.015);
    }
  });
});
