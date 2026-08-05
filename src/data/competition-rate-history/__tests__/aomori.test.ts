import { AOMORI_COMPETITION_RATE_HISTORY } from '../aomori';

/**
 * Λ-4（多年度アーカイブ・青森県）DoD検証: 「全日制の課程合計」行の数値が一次資料
 * （令和6年度は独立した二次情報源のリセマム確定記事とも一致）であることを固定値で確認する。
 */
describe('青森県 多年度アーカイブ（Λ-4・令和8〜令和3の6年度分・grand-total-only）', () => {
  it('6年度分（令和8年度〜令和3年度）を収録している', () => {
    expect(AOMORI_COMPETITION_RATE_HISTORY.years).toHaveLength(6);
    expect(AOMORI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of AOMORI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和8年度の全日制の課程合計はY-6既存確定値と一致する(募集6,980・志願6,436・倍率0.92)', () => {
    const r8 = AOMORI_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(6980);
    expect(r8.grandTotal.applicants).toBe(6436);
    expect(r8.grandTotal.rate).toBeCloseTo(0.92, 2);
  });

  it('令和7年度の全日制の課程合計は一次資料と一致する(募集7,060・志願6,533・倍率0.93)', () => {
    const r7 = AOMORI_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(7060);
    expect(r7.grandTotal.applicants).toBe(6533);
    expect(r7.grandTotal.rate).toBeCloseTo(0.93, 2);
  });

  it('令和6年度の全日制の課程合計は一次資料(三八地域版末尾)とリセマム確定記事の両方と一致する(募集7,137・志願6,733・倍率0.94)', () => {
    const r6 = AOMORI_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(7137);
    expect(r6.grandTotal.applicants).toBe(6733);
    expect(r6.grandTotal.rate).toBeCloseTo(0.94, 2);
  });

  it('令和5年度の全日制の課程合計はリセマム確定記事と一致する(募集7,245・志願6,853・倍率0.95・単一ソース)', () => {
    const r5 = AOMORI_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(7245);
    expect(r5.grandTotal.applicants).toBe(6853);
    expect(r5.grandTotal.rate).toBeCloseTo(0.95, 2);
  });

  it('令和4年度の全日制の課程合計はリセマム確定記事と一致する(募集7,290・志願7,199・倍率0.99・単一ソース)', () => {
    const r4 = AOMORI_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(7290);
    expect(r4.grandTotal.applicants).toBe(7199);
    expect(r4.grandTotal.rate).toBeCloseTo(0.99, 2);
  });

  it('令和3年度の全日制の課程合計はリセマム確定記事と一致する(募集7,319・志願7,285・倍率1.00・単一ソース)', () => {
    const r3 = AOMORI_COMPETITION_RATE_HISTORY.years[5];
    expect(r3.grandTotal.quota).toBe(7319);
    expect(r3.grandTotal.applicants).toBe(7285);
    expect(r3.grandTotal.rate).toBeCloseTo(1.0, 2);
  });
});
