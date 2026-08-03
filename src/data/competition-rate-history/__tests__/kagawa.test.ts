import { KAGAWA_COMPETITION_RATE_HISTORY } from '../kagawa';

/**
 * 香川県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の全日制課程合計の数値を
 * リセモム記事（教委発表の引用）の固定値で確認する。
 */
describe('香川県 多年度アーカイブ（Λ-4・令和7/令和6/令和5/令和4の4年度分・grand-total-only）', () => {
  it('4年度分（令和7年度・令和6年度・令和5年度・令和4年度）を収録している', () => {
    expect(KAGAWA_COMPETITION_RATE_HISTORY.years).toHaveLength(4);
    expect(KAGAWA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
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

  it('令和5年度の合計はリセモム記事と一致する(定員4,609・出願者数5,299・倍率1.15)', () => {
    const r5 = KAGAWA_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(4609);
    expect(r5.grandTotal.applicants).toBe(5299);
    expect(r5.grandTotal.rate).toBeCloseTo(1.15, 2);
  });

  it('令和4年度の合計はリセモム記事と一致する(定員4,907・出願者数5,538・倍率1.13)', () => {
    const r4 = KAGAWA_COMPETITION_RATE_HISTORY.years[3];
    expect(r4.grandTotal.quota).toBe(4907);
    expect(r4.grandTotal.applicants).toBe(5538);
    expect(r4.grandTotal.rate).toBeCloseTo(1.13, 2);
  });
});
