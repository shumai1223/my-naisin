import { KUMAMOTO_COMPETITION_RATE_HISTORY } from '../kumamoto';

/**
 * Λ-4（多年度アーカイブ・熊本県）DoD検証: 令和7・令和6年度の全日制課程・後期(一般)選抜の
 * 合計を固定値で確認する。R7ネイティブ文書の「計」行とR8文書に埋め込まれた前年度比較列
 * (倍率0.92)の二重検証済み。R6はネイティブ文書の「計」行とWebSearch独立記事(倍率0.94)の
 * 二重検証済み。
 */
describe('熊本県 多年度アーカイブ（Λ-4・令和7/令和6/令和5/令和4/令和3/令和2の6年度分・grand-total-only）', () => {
  it('6年度分（令和7年度・令和6年度・令和5年度・令和4年度・令和3年度・令和2年度）を収録している', () => {
    expect(KUMAMOTO_COMPETITION_RATE_HISTORY.years).toHaveLength(6);
    expect(KUMAMOTO_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
      '令和2年度（2020年度）',
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

  it('令和5年度の全日制課程・後期(一般)選抜の合計は一次資料の「計」行と一致する(募集8,362・出願7,985・倍率0.95)', () => {
    const r5 = KUMAMOTO_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(8362);
    expect(r5.grandTotal.applicants).toBe(7985);
    expect(r5.grandTotal.rate).toBeCloseTo(0.95, 2);
  });

  it('令和4年度の全日制課程・後期(一般)選抜の合計は一次資料の「計」行と一致する(募集8,569・出願7,691・倍率0.90)', () => {
    const r4 = KUMAMOTO_COMPETITION_RATE_HISTORY.years[3];
    expect(r4.grandTotal.quota).toBe(8569);
    expect(r4.grandTotal.applicants).toBe(7691);
    expect(r4.grandTotal.rate).toBeCloseTo(0.9, 2);
  });

  it('令和3年度の全日制課程・後期(一般)選抜の合計は一次資料の「計」行と一致する(募集8,785・出願7,411・倍率0.84)', () => {
    const r3 = KUMAMOTO_COMPETITION_RATE_HISTORY.years[4];
    expect(r3.grandTotal.quota).toBe(8785);
    expect(r3.grandTotal.applicants).toBe(7411);
    expect(r3.grandTotal.rate).toBeCloseTo(0.84, 2);
  });

  it('令和2年度の全日制課程・後期(一般)選抜の合計はリセモム記事と一致する(募集8,743・出願8,041・倍率0.92)', () => {
    const r2 = KUMAMOTO_COMPETITION_RATE_HISTORY.years[5];
    expect(r2.grandTotal.quota).toBe(8743);
    expect(r2.grandTotal.applicants).toBe(8041);
    expect(r2.grandTotal.rate).toBeCloseTo(0.92, 2);
  });
});
