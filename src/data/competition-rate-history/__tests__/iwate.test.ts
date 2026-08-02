import { IWATE_COMPETITION_RATE_HISTORY } from '../iwate';

/**
 * Λ-4（多年度アーカイブ・岩手県）DoD検証: 令和7・令和6年度の「合計」行の数値を
 * 一次資料（岩手県教育委員会の志願者数一覧表・調整後）の固定値で確認する。
 */
describe('岩手県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(IWATE_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(IWATE_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of IWATE_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(実質定員8,382・調整後志願6,684・倍率0.80)', () => {
    const r7 = IWATE_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(8382);
    expect(r7.grandTotal.applicants).toBe(6684);
    expect(r7.grandTotal.rate).toBeCloseTo(0.8, 2);
  });

  it('令和6年度の合計は一次資料と一致する(実質定員7,862・調整後志願6,281・倍率0.80)', () => {
    const r6 = IWATE_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(7862);
    expect(r6.grandTotal.applicants).toBe(6281);
    expect(r6.grandTotal.rate).toBeCloseTo(0.8, 2);
  });
});
