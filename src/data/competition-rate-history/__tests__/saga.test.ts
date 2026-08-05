import { SAGA_COMPETITION_RATE_HISTORY } from '../saga';

/**
 * 佐賀県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の全日制合計の数値を
 * 一次資料/リセモム記事の固定値で確認する。
 */
describe('佐賀県 多年度アーカイブ（Λ-4・令和7/令和6/令和5/令和4/令和3/令和2の6年度分・grand-total-only）', () => {
  it('6年度分（令和7年度・令和6年度・令和5年度・令和4年度・令和3年度・令和2年度）を収録している', () => {
    expect(SAGA_COMPETITION_RATE_HISTORY.years).toHaveLength(7);
    expect(SAGA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
      '令和2年度（2020年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of SAGA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和8年度はY-6既存確定値と一致する(全日制計・募集4,212・志願4,191・倍率1.00)', () => {
    const r8 = SAGA_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(4212);
    expect(r8.grandTotal.applicants).toBe(4191);
    expect(r8.grandTotal.rate).toBeCloseTo(1, 2);
  });

  it('令和7年度の合計は一次資料と一致する(募集人員4,505・志願者数4,596・倍率1.02)', () => {
    const r7 = SAGA_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(4505);
    expect(r7.grandTotal.applicants).toBe(4596);
    expect(r7.grandTotal.rate).toBeCloseTo(1.02, 2);
  });

  it('令和6年度の合計は一次資料と一致する(募集人員4,667・出願者数4,880・倍率1.05)', () => {
    const r6 = SAGA_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(4667);
    expect(r6.grandTotal.applicants).toBe(4880);
    expect(r6.grandTotal.rate).toBeCloseTo(1.05, 2);
  });

  it('令和5年度の合計はリセモム記事と一致する(募集人員4,744・出願者数4,899・倍率1.03)', () => {
    const r5 = SAGA_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(4744);
    expect(r5.grandTotal.applicants).toBe(4899);
    expect(r5.grandTotal.rate).toBeCloseTo(1.03, 2);
  });

  it('令和4年度の合計はリセモム記事と一致する(募集人員4,742・出願者数4,919・倍率1.04)', () => {
    const r4 = SAGA_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(4742);
    expect(r4.grandTotal.applicants).toBe(4919);
    expect(r4.grandTotal.rate).toBeCloseTo(1.04, 2);
  });

  it('令和3年度の合計はリセモム記事と一致する(募集人員4,711・出願者数4,905・倍率1.04)', () => {
    const r3 = SAGA_COMPETITION_RATE_HISTORY.years[5];
    expect(r3.grandTotal.quota).toBe(4711);
    expect(r3.grandTotal.applicants).toBe(4905);
    expect(r3.grandTotal.rate).toBeCloseTo(1.04, 2);
  });

  it('令和2年度の合計はリセモム記事と一致する(募集人員4,987・出願者数5,149・倍率1.03)', () => {
    const r2 = SAGA_COMPETITION_RATE_HISTORY.years[6];
    expect(r2.grandTotal.quota).toBe(4987);
    expect(r2.grandTotal.applicants).toBe(5149);
    expect(r2.grandTotal.rate).toBeCloseTo(1.03, 2);
  });
});
