import { YAMANASHI_COMPETITION_RATE_HISTORY } from '../yamanashi';

/**
 * 山梨県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の全日制後期募集（26校48学科）
 * 合計の数値をリセモム記事（教委発表の引用）の固定値で確認する。
 */
describe('山梨県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(YAMANASHI_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(YAMANASHI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of YAMANASHI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(募集人員3,395・志願者数3,227・倍率0.95)', () => {
    const r7 = YAMANASHI_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(3395);
    expect(r7.grandTotal.applicants).toBe(3227);
    expect(r7.grandTotal.rate).toBeCloseTo(0.95, 2);
  });

  it('令和6年度の合計は一次資料と一致する(募集人員3,537・志願者数3,374・倍率0.95)', () => {
    const r6 = YAMANASHI_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(3537);
    expect(r6.grandTotal.applicants).toBe(3374);
    expect(r6.grandTotal.rate).toBeCloseTo(0.95, 2);
  });
});
