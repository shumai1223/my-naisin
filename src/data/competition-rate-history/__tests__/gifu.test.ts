import { GIFU_COMPETITION_RATE_HISTORY } from '../gifu';

/**
 * Λ-4（多年度アーカイブ・岐阜県）DoD検証: 令和7・令和6年度の「全日制の課程 総計」行の数値を
 * 一次資料（岐阜県教育委員会高校教育課の変更後出願者数総括表PDF）の固定値で確認する。
 */
describe('岐阜県 多年度アーカイブ（Λ-4・令和8/令和7/令和6/令和5/令和4/令和3/令和2の7年度分・grand-total-only）', () => {
  it('7年度分（令和8年度・令和7年度・令和6年度・令和5年度・令和4年度・令和3年度・令和2年度）を収録している', () => {
    expect(GIFU_COMPETITION_RATE_HISTORY.years).toHaveLength(7);
    expect(GIFU_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
      '令和2年度（2020年度）',
    ]);
  });

  it('令和8年度の全日制の課程総計は一次資料と一致する(募集12,925・志願12,009・倍率0.93)', () => {
    const r8 = GIFU_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(12925);
    expect(r8.grandTotal.applicants).toBe(12009);
    expect(r8.grandTotal.rate).toBeCloseTo(0.93, 2);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of GIFU_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全日制の課程総計は一次資料と一致する(募集12,885・志願12,376・倍率0.96)', () => {
    const r7 = GIFU_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(12885);
    expect(r7.grandTotal.applicants).toBe(12376);
    expect(r7.grandTotal.rate).toBeCloseTo(0.96, 2);
  });

  it('令和6年度の全日制の課程総計は一次資料と一致する(募集13,121・志願12,829・倍率0.98)', () => {
    const r6 = GIFU_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(13121);
    expect(r6.grandTotal.applicants).toBe(12829);
    expect(r6.grandTotal.rate).toBeCloseTo(0.98, 2);
  });

  it('令和5年度の全日制の課程総計は一次資料と一致する(募集13,121・志願12,729・倍率0.97)', () => {
    const r5 = GIFU_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(13121);
    expect(r5.grandTotal.applicants).toBe(12729);
    expect(r5.grandTotal.rate).toBeCloseTo(0.97, 2);
  });

  it('令和4年度の全日制の課程総計は一次資料と一致する(募集13,301・志願13,284・倍率1.00)', () => {
    const r4 = GIFU_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(13301);
    expect(r4.grandTotal.applicants).toBe(13284);
    expect(r4.grandTotal.rate).toBeCloseTo(1.0, 2);
  });

  it('令和3年度の全日制の課程総計はリセモム記事と一致する(募集13,141・志願13,007・倍率0.99)', () => {
    const r3 = GIFU_COMPETITION_RATE_HISTORY.years[5];
    expect(r3.grandTotal.quota).toBe(13141);
    expect(r3.grandTotal.applicants).toBe(13007);
    expect(r3.grandTotal.rate).toBeCloseTo(0.99, 2);
  });

  it('令和2年度の全日制の課程総計はリセモム記事と一致する(募集13,466・志願13,502・倍率1.00)', () => {
    const r2 = GIFU_COMPETITION_RATE_HISTORY.years[6];
    expect(r2.grandTotal.quota).toBe(13466);
    expect(r2.grandTotal.applicants).toBe(13502);
    expect(r2.grandTotal.rate).toBeCloseTo(1.0, 2);
  });
});
