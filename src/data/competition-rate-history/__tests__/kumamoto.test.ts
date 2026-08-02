import { KUMAMOTO_COMPETITION_RATE_HISTORY } from '../kumamoto';

/**
 * Λ-4（多年度アーカイブ・熊本県）DoD検証: 令和7・令和6年度の全日制課程・後期(一般)選抜の
 * 合計を固定値で確認する。R7ネイティブ文書の「計」行とR8文書に埋め込まれた前年度比較列
 * (倍率0.92)の二重検証済み。R6はネイティブ文書の「計」行とWebSearch独立記事(倍率0.94)の
 * 二重検証済み。
 */
describe('熊本県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(KUMAMOTO_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(KUMAMOTO_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校粒度の内訳は未収録と正直に記録)', () => {
    for (const y of KUMAMOTO_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全日制課程・後期(一般)選抜の合計は一次資料の「計」行と一致する(募集8,258・出願7,585・倍率0.92)', () => {
    const r7 = KUMAMOTO_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(8258);
    expect(r7.grandTotal.applicants).toBe(7585);
    expect(r7.grandTotal.rate).toBeCloseTo(0.92, 2);
  });

  it('令和6年度の全日制課程・後期(一般)選抜の合計は一次資料の「計」行と一致する(募集8,250・出願7,760・倍率0.94)', () => {
    const r6 = KUMAMOTO_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(8250);
    expect(r6.grandTotal.applicants).toBe(7760);
    expect(r6.grandTotal.rate).toBeCloseTo(0.94, 2);
  });
});
