import { TOCHIGI_COMPETITION_RATE_HISTORY } from '../tochigi';

/**
 * 栃木県 多年度アーカイブ（Λ-4）DoD検証: 令和8・令和7年度の「全日制計（一般選抜定員ベース）」
 * の数値を一次資料の固定値で確認する。
 */
describe('栃木県 多年度アーカイブ（Λ-4・令和8/令和7/令和6/令和5/令和4の5年度分・grand-total-only）', () => {
  it('5年度分（令和8年度・令和7年度・令和6年度・令和5年度・令和4年度）を収録している', () => {
    expect(TOCHIGI_COMPETITION_RATE_HISTORY.years).toHaveLength(5);
    expect(TOCHIGI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of TOCHIGI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和8年度の合計は一次資料と一致する(一般選抜定員7,259・出願者数7,602・倍率1.05)', () => {
    const r8 = TOCHIGI_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(7259);
    expect(r8.grandTotal.applicants).toBe(7602);
    expect(r8.grandTotal.rate).toBeCloseTo(1.05, 2);
  });

  it('令和7年度の合計は一次資料と一致する(一般選抜定員7,486・出願人員8,338・倍率1.11)', () => {
    const r7 = TOCHIGI_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(7486);
    expect(r7.grandTotal.applicants).toBe(8338);
    expect(r7.grandTotal.rate).toBeCloseTo(1.11, 2);
  });

  it('令和6年度の合計は一次資料と一致する(一般選抜定員7,679・出願人員8,479・倍率1.10)', () => {
    const r6 = TOCHIGI_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(7679);
    expect(r6.grandTotal.applicants).toBe(8479);
    expect(r6.grandTotal.rate).toBeCloseTo(1.1, 2);
  });

  it('令和5年度の合計は一次資料と一致する(一般選抜定員8,017・出願人員8,715・倍率1.09)', () => {
    const r5 = TOCHIGI_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(8017);
    expect(r5.grandTotal.applicants).toBe(8715);
    expect(r5.grandTotal.rate).toBeCloseTo(1.09, 2);
  });

  it('令和4年度の合計は一次資料と一致する(一般選抜定員7,986・出願人員9,021・倍率1.13)', () => {
    const r4 = TOCHIGI_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(7986);
    expect(r4.grandTotal.applicants).toBe(9021);
    expect(r4.grandTotal.rate).toBeCloseTo(1.13, 2);
  });
});
