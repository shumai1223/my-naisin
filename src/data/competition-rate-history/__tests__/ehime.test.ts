import { EHIME_COMPETITION_RATE_HISTORY } from '../ehime';

/**
 * Λ-4（多年度アーカイブ・愛媛県）DoD検証: 令和7・令和6年度の「合計」行の数値を
 * 一次資料（愛媛県教育委員会の学科別入学志願者数PDF・志願変更後）の固定値で確認する。
 */
describe('愛媛県 多年度アーカイブ（Λ-4・令和7/令和6/令和5/令和4/令和3の5年度分・grand-total-only）', () => {
  it('5年度分（令和7年度・令和6年度・令和5年度・令和4年度・令和3年度）を収録している', () => {
    expect(EHIME_COMPETITION_RATE_HISTORY.years).toHaveLength(5);
    expect(EHIME_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of EHIME_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(定員8,590・志願7,898・倍率0.92)', () => {
    const r7 = EHIME_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(8590);
    expect(r7.grandTotal.applicants).toBe(7898);
    expect(r7.grandTotal.rate).toBeCloseTo(0.92, 2);
  });

  it('令和6年度の合計は一次資料と一致する(定員8,765・志願7,619・倍率0.87)', () => {
    const r6 = EHIME_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(8765);
    expect(r6.grandTotal.applicants).toBe(7619);
    expect(r6.grandTotal.rate).toBeCloseTo(0.87, 2);
  });

  it('令和5年度の合計は一次資料と一致する(定員8,965・志願7,941・倍率0.89)', () => {
    const r5 = EHIME_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(8965);
    expect(r5.grandTotal.applicants).toBe(7941);
    expect(r5.grandTotal.rate).toBeCloseTo(0.89, 2);
  });

  it('令和4年度の合計は一次資料と一致する(定員9,025・志願7,980・倍率0.88)', () => {
    const r4 = EHIME_COMPETITION_RATE_HISTORY.years[3];
    expect(r4.grandTotal.quota).toBe(9025);
    expect(r4.grandTotal.applicants).toBe(7980);
    expect(r4.grandTotal.rate).toBeCloseTo(0.88, 2);
  });

  it('令和3年度の合計はリセモム記事と一致する(定員9,145・志願7,554・倍率0.83)', () => {
    const r3 = EHIME_COMPETITION_RATE_HISTORY.years[4];
    expect(r3.grandTotal.quota).toBe(9145);
    expect(r3.grandTotal.applicants).toBe(7554);
    expect(r3.grandTotal.rate).toBeCloseTo(0.83, 2);
  });
});
