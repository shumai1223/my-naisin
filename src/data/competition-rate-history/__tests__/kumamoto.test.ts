import { KUMAMOTO_COMPETITION_RATE_HISTORY } from '../kumamoto';

/**
 * Λ-4（多年度アーカイブ・熊本県）DoD検証: 令和7年度の全日制課程・後期(一般)選抜の合計を固定値で確認する。
 * R7ネイティブ文書の「計」行とR8文書に埋め込まれた前年度比較列(倍率0.92)の二重検証済み。
 */
describe('熊本県 多年度アーカイブ（Λ-4・令和7年度分・grand-total-only）', () => {
  it('1年度分（令和7年度）を収録している', () => {
    expect(KUMAMOTO_COMPETITION_RATE_HISTORY.years).toHaveLength(1);
    expect(KUMAMOTO_COMPETITION_RATE_HISTORY.years[0].fiscalYear).toBe('令和7年度（2025年度）');
  });

  it('categoriesは空(学校粒度の内訳は未収録と正直に記録)', () => {
    expect(KUMAMOTO_COMPETITION_RATE_HISTORY.years[0].categories).toHaveLength(0);
  });

  it('全日制課程・後期(一般)選抜の合計は一次資料の「計」行と一致する(募集8,258・出願7,585・倍率0.92)', () => {
    const r7 = KUMAMOTO_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(8258);
    expect(r7.grandTotal.applicants).toBe(7585);
    expect(r7.grandTotal.rate).toBeCloseTo(0.92, 2);
  });
});
