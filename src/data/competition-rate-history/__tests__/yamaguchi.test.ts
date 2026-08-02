import { YAMAGUCHI_COMPETITION_RATE_HISTORY } from '../yamaguchi';

/**
 * 山口県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の全日制課程第1次募集合計の数値を
 * リセモム記事（教委発表の引用）の固定値で確認する。
 */
describe('山口県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(YAMAGUCHI_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(YAMAGUCHI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of YAMAGUCHI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(定員5,533・出願者数5,612・倍率1.01)', () => {
    const r7 = YAMAGUCHI_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(5533);
    expect(r7.grandTotal.applicants).toBe(5612);
    expect(r7.grandTotal.rate).toBeCloseTo(1.01, 2);
  });

  it('令和6年度の合計は一次資料と一致する(定員5,584・出願者数5,811・倍率1.04)', () => {
    const r6 = YAMAGUCHI_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(5584);
    expect(r6.grandTotal.applicants).toBe(5811);
    expect(r6.grandTotal.rate).toBeCloseTo(1.04, 2);
  });
});
