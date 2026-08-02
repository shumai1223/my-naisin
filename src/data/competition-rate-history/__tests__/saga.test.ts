import { SAGA_COMPETITION_RATE_HISTORY } from '../saga';

/**
 * 佐賀県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の全日制合計の数値を
 * 一次資料/リセモム記事の固定値で確認する。
 */
describe('佐賀県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(SAGA_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(SAGA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of SAGA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(募集人員4,505・志願者数4,596・倍率1.02)', () => {
    const r7 = SAGA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(4505);
    expect(r7.grandTotal.applicants).toBe(4596);
    expect(r7.grandTotal.rate).toBeCloseTo(1.02, 2);
  });

  it('令和6年度の合計は一次資料と一致する(募集人員4,667・出願者数4,880・倍率1.05)', () => {
    const r6 = SAGA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(4667);
    expect(r6.grandTotal.applicants).toBe(4880);
    expect(r6.grandTotal.rate).toBeCloseTo(1.05, 2);
  });
});
