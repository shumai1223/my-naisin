import { SHIZUOKA_COMPETITION_RATE_HISTORY } from '../shizuoka';

/**
 * 静岡県 多年度アーカイブ（Λ-4）DoD検証: 令和8・令和7年度の「公立合計」の数値を
 * 一次資料/リセモム記事の固定値で確認する。
 */
describe('静岡県 多年度アーカイブ（Λ-4・令和8/令和7の2年度分・grand-total-only）', () => {
  it('2年度分（令和8年度・令和7年度）を収録している', () => {
    expect(SHIZUOKA_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(SHIZUOKA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of SHIZUOKA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和8年度の公立合計は一次資料と一致する(募集定員16,954・志願者数16,895・倍率1.00)', () => {
    const r8 = SHIZUOKA_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(16954);
    expect(r8.grandTotal.applicants).toBe(16895);
    expect(r8.grandTotal.rate).toBeCloseTo(1.0, 2);
  });

  it('令和7年度の公立合計は一次資料と一致する(募集定員17,084・志願者数18,183・倍率1.06)', () => {
    const r7 = SHIZUOKA_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(17084);
    expect(r7.grandTotal.applicants).toBe(18183);
    expect(r7.grandTotal.rate).toBeCloseTo(1.06, 2);
  });
});
