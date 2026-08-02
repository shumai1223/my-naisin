import { FUKUI_COMPETITION_RATE_HISTORY } from '../fukui';

/**
 * Λ-4（多年度アーカイブ・福井県）DoD検証: 令和7・令和6年度の「全日制 合計」行の数値を
 * 一次資料（福井県教育委員会の志願変更状況PDF・変更最終日）の固定値で確認する。
 */
describe('福井県 多年度アーカイブ（Λ-4・令和7/令和6/令和5/令和4の4年度分・grand-total-only）', () => {
  it('4年度分（令和7年度・令和6年度・令和5年度・令和4年度）を収録している', () => {
    expect(FUKUI_COMPETITION_RATE_HISTORY.years).toHaveLength(4);
    expect(FUKUI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of FUKUI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全日制合計は一次資料と一致する(一般選抜募集人員3,398・志願3,465・倍率1.02)', () => {
    const r7 = FUKUI_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(3398);
    expect(r7.grandTotal.applicants).toBe(3465);
    expect(r7.grandTotal.rate).toBeCloseTo(1.02, 2);
  });

  it('令和6年度の全日制合計は一次資料と一致する(一般選抜募集人員3,578・志願3,577・倍率1.00)', () => {
    const r6 = FUKUI_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(3578);
    expect(r6.grandTotal.applicants).toBe(3577);
    expect(r6.grandTotal.rate).toBeCloseTo(1.0, 2);
  });

  it('令和5年度の全日制合計は一次資料と一致する(一般選抜募集人員3,606・志願3,694・倍率1.02)', () => {
    const r5 = FUKUI_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(3606);
    expect(r5.grandTotal.applicants).toBe(3694);
    expect(r5.grandTotal.rate).toBeCloseTo(1.02, 2);
  });

  it('令和4年度の全日制合計は一次資料と一致する(一般選抜募集人員3,732・志願3,843・倍率1.03)', () => {
    const r4 = FUKUI_COMPETITION_RATE_HISTORY.years[3];
    expect(r4.grandTotal.quota).toBe(3732);
    expect(r4.grandTotal.applicants).toBe(3843);
    expect(r4.grandTotal.rate).toBeCloseTo(1.03, 2);
  });
});
