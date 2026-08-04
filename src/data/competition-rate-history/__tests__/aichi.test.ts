import { AICHI_COMPETITION_RATE_HISTORY } from '../aichi';

/**
 * Λ-4（多年度アーカイブ・愛知県）DoD検証: 令和8・令和7年度の「合計」
 * （募集人員quota・志願者数applicants）を一次資料/独立ソースの固定値で確認する。
 * 愛知県は1人が最大2校に併願できる制度のため、倍率が1.0を大きく超える点に注意。
 */
describe('愛知県 多年度アーカイブ（Λ-4・令和8/令和7/令和6の3年度分・grand-total-only）', () => {
  it('3年度分（令和8年度・令和7年度・令和6年度）を収録している', () => {
    expect(AICHI_COMPETITION_RATE_HISTORY.years).toHaveLength(3);
    expect(AICHI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of AICHI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和8年度は一次資料と一致する(募集人員30,789・志願者数53,196・倍率1.73)', () => {
    const r8 = AICHI_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(30789);
    expect(r8.grandTotal.applicants).toBe(53196);
    expect(r8.grandTotal.rate).toBeCloseTo(1.73, 2);
  });

  it('令和7年度は独立した2ソースと一致する(募集人員30,781・志願者数56,928・倍率1.85)', () => {
    const r7 = AICHI_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(30781);
    expect(r7.grandTotal.applicants).toBe(56928);
    expect(r7.grandTotal.rate).toBeCloseTo(1.85, 2);
  });

  it('令和6年度は独立した2ソースと一致する(募集人員31,417・志願者数59,007・倍率1.88)', () => {
    const r6 = AICHI_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(31417);
    expect(r6.grandTotal.applicants).toBe(59007);
    expect(r6.grandTotal.rate).toBeCloseTo(1.88, 2);
  });

  it('内部整合性: 全年度で志願者数÷募集人員が公表倍率とおおむね一致する', () => {
    for (const y of AICHI_COMPETITION_RATE_HISTORY.years) {
      const computed = y.grandTotal.applicants / y.grandTotal.quota;
      expect(computed).toBeCloseTo(y.grandTotal.rate, 2);
    }
  });
});
