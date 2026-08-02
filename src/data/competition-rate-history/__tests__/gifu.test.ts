import { GIFU_COMPETITION_RATE_HISTORY } from '../gifu';

/**
 * Λ-4（多年度アーカイブ・岐阜県）DoD検証: 令和7・令和6年度の「全日制の課程 総計」行の数値を
 * 一次資料（岐阜県教育委員会高校教育課の変更後出願者数総括表PDF）の固定値で確認する。
 */
describe('岐阜県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(GIFU_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(GIFU_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of GIFU_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全日制の課程総計は一次資料と一致する(募集12,885・志願12,376・倍率0.96)', () => {
    const r7 = GIFU_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(12885);
    expect(r7.grandTotal.applicants).toBe(12376);
    expect(r7.grandTotal.rate).toBeCloseTo(0.96, 2);
  });

  it('令和6年度の全日制の課程総計は一次資料と一致する(募集13,121・志願12,829・倍率0.98)', () => {
    const r6 = GIFU_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(13121);
    expect(r6.grandTotal.applicants).toBe(12829);
    expect(r6.grandTotal.rate).toBeCloseTo(0.98, 2);
  });
});
