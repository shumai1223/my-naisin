import { TOKUSHIMA_COMPETITION_RATE_HISTORY } from '../tokushima';

/**
 * 徳島県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の一般選抜(全日制)合計の数値を
 * リセモム記事（教委発表の引用）の固定値で確認する。
 */
describe('徳島県 多年度アーカイブ（Λ-4・令和7/令和6/令和5/令和4の4年度分・grand-total-only）', () => {
  it('4年度分（令和7年度・令和6年度・令和5年度・令和4年度）を収録している', () => {
    expect(TOKUSHIMA_COMPETITION_RATE_HISTORY.years).toHaveLength(4);
    expect(TOKUSHIMA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of TOKUSHIMA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(募集人員4,102・志願者数4,062・倍率0.99)', () => {
    const r7 = TOKUSHIMA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(4102);
    expect(r7.grandTotal.applicants).toBe(4062);
    expect(r7.grandTotal.rate).toBeCloseTo(0.99, 2);
  });

  it('令和6年度の合計は一次資料と一致する(募集人員4,211・志願者数4,232・倍率1.00)', () => {
    const r6 = TOKUSHIMA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(4211);
    expect(r6.grandTotal.applicants).toBe(4232);
    expect(r6.grandTotal.rate).toBeCloseTo(1.0, 2);
  });

  it('令和5年度の合計はリセモム記事と一致する(募集人員4,187・志願者数4,174・倍率1.00)', () => {
    const r5 = TOKUSHIMA_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(4187);
    expect(r5.grandTotal.applicants).toBe(4174);
    expect(r5.grandTotal.rate).toBeCloseTo(1.0, 2);
  });

  it('令和4年度の合計はリセモム記事と一致する(募集人員4,314・志願者数4,376・倍率1.01)', () => {
    const r4 = TOKUSHIMA_COMPETITION_RATE_HISTORY.years[3];
    expect(r4.grandTotal.quota).toBe(4314);
    expect(r4.grandTotal.applicants).toBe(4376);
    expect(r4.grandTotal.rate).toBeCloseTo(1.01, 2);
  });
});
