import { HYOGO_COMPETITION_RATE_HISTORY } from '../hyogo';

/**
 * Λ-4（多年度アーカイブ・兵庫県）DoD検証: 令和7・令和6年度の全日制合計の数値を固定値で確認する。
 * 出典PDFはいずれも翌年度出願状況PDFに埋め込まれた「前年度」列(東京都の総括表と同型の併記形式)。
 */
describe('兵庫県 多年度アーカイブ（Λ-4・令和7/令和6/令和5の3年度分・grand-total-only）', () => {
  it('3年度分（令和7年度・令和6年度・令和5年度）を収録している', () => {
    expect(HYOGO_COMPETITION_RATE_HISTORY.years).toHaveLength(3);
    expect(HYOGO_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
    ]);
  });

  it('全年度でcategoriesは空(区分別内訳は原資料に存在しないため未収録と正直に記録)', () => {
    for (const y of HYOGO_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全日制127校計は令和8年度版出願状況PDFの前年度列と一致する(定員21,252・志願21,596・倍率1.02)', () => {
    const r7 = HYOGO_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(21252);
    expect(r7.grandTotal.applicants).toBe(21596);
    expect(r7.grandTotal.rate).toBeCloseTo(1.02, 2);
    expect(r7.grandTotal.schoolCount).toBe(127);
  });

  it('令和6年度の全日制計は令和7年度版出願状況PDFの前年度列と一致する(定員21,889・志願22,677・倍率1.04)', () => {
    const r6 = HYOGO_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(21889);
    expect(r6.grandTotal.applicants).toBe(22677);
    expect(r6.grandTotal.rate).toBeCloseTo(1.04, 2);
  });

  it('令和5年度の全日制計は令和6年度版出願状況PDFの前年度列と一致する(定員21,903・志願22,663・倍率1.03)', () => {
    const r5 = HYOGO_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(21903);
    expect(r5.grandTotal.applicants).toBe(22663);
    expect(r5.grandTotal.rate).toBeCloseTo(1.03, 2);
  });
});
