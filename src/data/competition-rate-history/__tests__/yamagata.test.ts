import { YAMAGATA_COMPETITION_RATE_HISTORY } from '../yamagata';

/**
 * 山形県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の全日制公立合計の数値を
 * 一次資料の固定値で確認する。
 */
describe('山形県 多年度アーカイブ（Λ-4・令和7/令和6/令和5/令和4の4年度分・grand-total-only）', () => {
  it('4年度分（令和7年度・令和6年度・令和5年度・令和4年度）を収録している', () => {
    expect(YAMAGATA_COMPETITION_RATE_HISTORY.years).toHaveLength(4);
    expect(YAMAGATA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of YAMAGATA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(募集人員5,609・志願者数4,505・倍率0.80)', () => {
    const r7 = YAMAGATA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(5609);
    expect(r7.grandTotal.applicants).toBe(4505);
    expect(r7.grandTotal.rate).toBeCloseTo(0.8, 2);
  });

  it('令和6年度の合計は一次資料と一致する(一般選抜定員5,729・志願者数4,518・倍率0.79)', () => {
    const r6 = YAMAGATA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(5729);
    expect(r6.grandTotal.applicants).toBe(4518);
    expect(r6.grandTotal.rate).toBeCloseTo(0.79, 2);
  });

  it('令和5年度の合計は一次資料と一致する(一般選抜定員5,948・志願者数4,869・倍率0.82)', () => {
    const r5 = YAMAGATA_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(5948);
    expect(r5.grandTotal.applicants).toBe(4869);
    expect(r5.grandTotal.rate).toBeCloseTo(0.82, 2);
  });

  it('令和4年度の合計は一次資料と一致する(一般選抜定員6,067・志願者数5,072・倍率0.84)', () => {
    const r4 = YAMAGATA_COMPETITION_RATE_HISTORY.years[3];
    expect(r4.grandTotal.quota).toBe(6067);
    expect(r4.grandTotal.applicants).toBe(5072);
    expect(r4.grandTotal.rate).toBeCloseTo(0.84, 2);
  });
});
