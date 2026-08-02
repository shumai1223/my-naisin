import { MIE_COMPETITION_RATE_HISTORY } from '../mie';

/**
 * Λ-4（多年度アーカイブ・三重県）DoD検証: 令和7・令和6年度の「全日制総計」の数値を
 * 一次資料（三重県教育委員会の後期選抜志願状況ページ本文）の固定値で確認する。
 */
describe('三重県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(MIE_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(MIE_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of MIE_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全日制総計は一次資料と一致する(52校・募集6,589・志願7,230・倍率1.10)', () => {
    const r7 = MIE_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.schoolCount).toBe(52);
    expect(r7.grandTotal.quota).toBe(6589);
    expect(r7.grandTotal.applicants).toBe(7230);
    expect(r7.grandTotal.rate).toBeCloseTo(1.1, 2);
  });

  it('令和6年度の全日制総計は一次資料と一致する(52校・募集6,819・志願7,360・倍率1.08)', () => {
    const r6 = MIE_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.schoolCount).toBe(52);
    expect(r6.grandTotal.quota).toBe(6819);
    expect(r6.grandTotal.applicants).toBe(7360);
    expect(r6.grandTotal.rate).toBeCloseTo(1.08, 2);
  });
});
