import { AOMORI_COMPETITION_RATE_HISTORY } from '../aomori';

/**
 * Λ-4（多年度アーカイブ・青森県）DoD検証: 「全日制の課程合計」行の数値が一次資料
 * （令和6年度は独立した二次情報源のリセマム確定記事とも一致）であることを固定値で確認する。
 */
describe('青森県 多年度アーカイブ（Λ-4・令和7/令和6/令和5年度分・grand-total-only）', () => {
  it('3年度分（令和7年度・令和6年度・令和5年度）を収録している', () => {
    expect(AOMORI_COMPETITION_RATE_HISTORY.years).toHaveLength(3);
    expect(AOMORI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of AOMORI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全日制の課程合計は一次資料と一致する(募集7,060・志願6,533・倍率0.93)', () => {
    const r7 = AOMORI_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(7060);
    expect(r7.grandTotal.applicants).toBe(6533);
    expect(r7.grandTotal.rate).toBeCloseTo(0.93, 2);
  });

  it('令和6年度の全日制の課程合計は一次資料(三八地域版末尾)とリセマム確定記事の両方と一致する(募集7,137・志願6,733・倍率0.94)', () => {
    const r6 = AOMORI_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(7137);
    expect(r6.grandTotal.applicants).toBe(6733);
    expect(r6.grandTotal.rate).toBeCloseTo(0.94, 2);
  });

  it('令和5年度の全日制の課程合計はリセマム確定記事と一致する(募集7,245・志願6,853・倍率0.95・単一ソース)', () => {
    const r5 = AOMORI_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(7245);
    expect(r5.grandTotal.applicants).toBe(6853);
    expect(r5.grandTotal.rate).toBeCloseTo(0.95, 2);
  });
});
