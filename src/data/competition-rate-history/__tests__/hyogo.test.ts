import { HYOGO_COMPETITION_RATE_HISTORY } from '../hyogo';

/**
 * Λ-4（多年度アーカイブ・兵庫県）DoD検証: 令和7年度の全日制合計の数値を固定値で確認する。
 * 出典PDFは令和8年度出願状況PDFに埋め込まれた「前年度」列(東京都の総括表と同型の併記形式)。
 */
describe('兵庫県 多年度アーカイブ（Λ-4・令和7年度分・grand-total-only）', () => {
  it('1年度分（令和7年度）を収録している', () => {
    expect(HYOGO_COMPETITION_RATE_HISTORY.years).toHaveLength(1);
    expect(HYOGO_COMPETITION_RATE_HISTORY.years[0].fiscalYear).toBe('令和7年度（2025年度）');
  });

  it('categoriesは空(区分別内訳は原資料に存在しないため未収録と正直に記録)', () => {
    expect(HYOGO_COMPETITION_RATE_HISTORY.years[0].categories).toHaveLength(0);
  });

  it('全日制127校計は令和8年度版出願状況PDFの前年度列と一致する(定員21,252・志願21,596・倍率1.02)', () => {
    const r7 = HYOGO_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(21252);
    expect(r7.grandTotal.applicants).toBe(21596);
    expect(r7.grandTotal.rate).toBeCloseTo(1.02, 2);
    expect(r7.grandTotal.schoolCount).toBe(127);
  });
});
