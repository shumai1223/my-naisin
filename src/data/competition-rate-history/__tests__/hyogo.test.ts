import { HYOGO_COMPETITION_RATE_HISTORY } from '../hyogo';

/**
 * Λ-4（多年度アーカイブ・兵庫県）DoD検証: 令和7・令和6年度の全日制合計の数値を固定値で確認する。
 * 出典PDFはいずれも翌年度出願状況PDFに埋め込まれた「前年度」列(東京都の総括表と同型の併記形式)。
 */
describe('兵庫県 多年度アーカイブ（Λ-4・令和7/令和6/令和5/令和4/令和3/令和2の6年度分・grand-total-only）', () => {
  it('6年度分（令和7年度・令和6年度・令和5年度・令和4年度・令和3年度・令和2年度）を収録している', () => {
    expect(HYOGO_COMPETITION_RATE_HISTORY.years).toHaveLength(7);
    expect(HYOGO_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
      '令和2年度（2020年度）',
    ]);
  });

  it('全年度でcategoriesは空(区分別内訳は原資料に存在しないため未収録と正直に記録)', () => {
    for (const y of HYOGO_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和8年度はY-6既存確定値と一致する(全日制127校 計・募集21,150・志願20,567・倍率0.97)', () => {
    const r8 = HYOGO_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(21150);
    expect(r8.grandTotal.applicants).toBe(20567);
    expect(r8.grandTotal.rate).toBeCloseTo(0.97, 2);
    expect(r8.grandTotal.schoolCount).toBe(127);
  });

  it('令和7年度の全日制127校計は令和8年度版出願状況PDFの前年度列と一致する(定員21,252・志願21,596・倍率1.02)', () => {
    const r7 = HYOGO_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(21252);
    expect(r7.grandTotal.applicants).toBe(21596);
    expect(r7.grandTotal.rate).toBeCloseTo(1.02, 2);
    expect(r7.grandTotal.schoolCount).toBe(127);
  });

  it('令和6年度の全日制計は令和7年度版出願状況PDFの前年度列と一致する(定員21,889・志願22,677・倍率1.04)', () => {
    const r6 = HYOGO_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(21889);
    expect(r6.grandTotal.applicants).toBe(22677);
    expect(r6.grandTotal.rate).toBeCloseTo(1.04, 2);
  });

  it('令和5年度の全日制計は令和6年度版出願状況PDFの前年度列と一致する(定員21,903・志願22,663・倍率1.03)', () => {
    const r5 = HYOGO_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(21903);
    expect(r5.grandTotal.applicants).toBe(22663);
    expect(r5.grandTotal.rate).toBeCloseTo(1.03, 2);
  });

  it('令和4年度の全日制計は令和5年度版出願状況PDFの前年度列と一致する(定員21,815・志願22,913・倍率1.05)', () => {
    const r4 = HYOGO_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(21815);
    expect(r4.grandTotal.applicants).toBe(22913);
    expect(r4.grandTotal.rate).toBeCloseTo(1.05, 2);
  });

  it('令和3年度の全日制計は一次資料と一致する(定員21,320・志願22,243・倍率1.04)', () => {
    const r3 = HYOGO_COMPETITION_RATE_HISTORY.years[5];
    expect(r3.grandTotal.quota).toBe(21320);
    expect(r3.grandTotal.applicants).toBe(22243);
    expect(r3.grandTotal.rate).toBeCloseTo(1.04, 2);
  });

  it('令和2年度の全日制計は一次資料と一致する(定員22,366・志願23,765・倍率1.06)', () => {
    const r2 = HYOGO_COMPETITION_RATE_HISTORY.years[6];
    expect(r2.grandTotal.quota).toBe(22366);
    expect(r2.grandTotal.applicants).toBe(23765);
    expect(r2.grandTotal.rate).toBeCloseTo(1.06, 2);
  });
});
