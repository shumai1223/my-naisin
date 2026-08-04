import { KYOTO_COMPETITION_RATE_HISTORY } from '../kyoto';

/**
 * Λ-4（多年度アーカイブ・京都府）DoD検証: 令和7・令和6・令和5年度の「中期選抜 全日制計」
 * （中期選抜募集人員C=A-B・志願者数D・倍率D/C）を一次資料の固定値で確認する。
 */
describe('京都府 多年度アーカイブ（Λ-4・令和7/令和6/令和5/令和4の4年度分・grand-total-only）', () => {
  it('4年度分（令和7年度・令和6年度・令和5年度・令和4年度）を収録している', () => {
    expect(KYOTO_COMPETITION_RATE_HISTORY.years).toHaveLength(4);
    expect(KYOTO_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of KYOTO_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度は一次資料と一致する(中期選抜募集人員6,006・志願5,635・倍率0.94)', () => {
    const r7 = KYOTO_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(6006);
    expect(r7.grandTotal.applicants).toBe(5635);
    expect(r7.grandTotal.rate).toBeCloseTo(0.94, 2);
  });

  it('令和6年度は一次資料と一致する(中期選抜募集人員6,108・志願6,027・倍率0.99)', () => {
    const r6 = KYOTO_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(6108);
    expect(r6.grandTotal.applicants).toBe(6027);
    expect(r6.grandTotal.rate).toBeCloseTo(0.99, 2);
  });

  it('令和5年度は一次資料と一致する(中期選抜募集人員6,096・志願5,935・倍率0.97)', () => {
    const r5 = KYOTO_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(6096);
    expect(r5.grandTotal.applicants).toBe(5935);
    expect(r5.grandTotal.rate).toBeCloseTo(0.97, 2);
  });

  it('令和4年度は一次資料と一致する(中期選抜募集人員6,424・志願6,414・倍率1.00)', () => {
    const r4 = KYOTO_COMPETITION_RATE_HISTORY.years[3];
    expect(r4.grandTotal.quota).toBe(6424);
    expect(r4.grandTotal.applicants).toBe(6414);
    expect(r4.grandTotal.rate).toBeCloseTo(1.0, 2);
  });

  it('内部整合性: 全年度で志願者数÷募集人員が公表倍率とおおむね一致する', () => {
    for (const y of KYOTO_COMPETITION_RATE_HISTORY.years) {
      const computed = y.grandTotal.applicants / y.grandTotal.quota;
      expect(computed).toBeCloseTo(y.grandTotal.rate, 2);
    }
  });
});
