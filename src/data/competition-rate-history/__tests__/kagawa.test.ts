import { KAGAWA_COMPETITION_RATE_HISTORY } from '../kagawa';

/**
 * 香川県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の全日制課程合計の数値を
 * リセモム記事（教委発表の引用）の固定値で確認する。
 */
describe('香川県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(KAGAWA_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(KAGAWA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of KAGAWA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(定員4,376・出願者数4,732・倍率1.08)', () => {
    const r7 = KAGAWA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(4376);
    expect(r7.grandTotal.applicants).toBe(4732);
    expect(r7.grandTotal.rate).toBeCloseTo(1.08, 2);
  });

  it('令和6年度の合計は一次資料と一致する(定員4,553・出願者数5,056・倍率1.11)', () => {
    const r6 = KAGAWA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(4553);
    expect(r6.grandTotal.applicants).toBe(5056);
    expect(r6.grandTotal.rate).toBeCloseTo(1.11, 2);
  });
});
