import { IWATE_COMPETITION_RATE_HISTORY } from '../iwate';

/**
 * Λ-4（多年度アーカイブ・岩手県）DoD検証: 令和7・令和6年度の「合計」行の数値を
 * 一次資料（岩手県教育委員会の志願者数一覧表・調整後）の固定値で確認する。
 */
describe('岩手県 多年度アーカイブ（Λ-4・令和7/令和6/令和5/令和4/令和3/令和2の6年度分・grand-total-only）', () => {
  it('6年度分（令和7年度・令和6年度・令和5年度・令和4年度・令和3年度・令和2年度）を収録している', () => {
    expect(IWATE_COMPETITION_RATE_HISTORY.years).toHaveLength(6);
    expect(IWATE_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
      '令和2年度（2020年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of IWATE_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(実質定員8,382・調整後志願6,684・倍率0.80)', () => {
    const r7 = IWATE_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(8382);
    expect(r7.grandTotal.applicants).toBe(6684);
    expect(r7.grandTotal.rate).toBeCloseTo(0.8, 2);
  });

  it('令和6年度の合計は一次資料と一致する(実質定員7,862・調整後志願6,281・倍率0.80)', () => {
    const r6 = IWATE_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(7862);
    expect(r6.grandTotal.applicants).toBe(6281);
    expect(r6.grandTotal.rate).toBeCloseTo(0.8, 2);
  });

  it('令和5年度の合計はリセモム記事と一致する(実質定員7,881・確定志願6,424・倍率0.82)', () => {
    const r5 = IWATE_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(7881);
    expect(r5.grandTotal.applicants).toBe(6424);
    expect(r5.grandTotal.rate).toBeCloseTo(0.82, 2);
  });

  it('令和4年度の合計はリセモム記事と一致する(実質定員8,049・確定志願6,836・倍率0.85)', () => {
    const r4 = IWATE_COMPETITION_RATE_HISTORY.years[3];
    expect(r4.grandTotal.quota).toBe(8049);
    expect(r4.grandTotal.applicants).toBe(6836);
    expect(r4.grandTotal.rate).toBeCloseTo(0.85, 2);
  });

  it('令和3年度の合計はリセモム記事と一致する(実質定員8,068・志願6,590・倍率0.82)', () => {
    const r3 = IWATE_COMPETITION_RATE_HISTORY.years[4];
    expect(r3.grandTotal.quota).toBe(8068);
    expect(r3.grandTotal.applicants).toBe(6590);
    expect(r3.grandTotal.rate).toBeCloseTo(0.82, 2);
  });

  it('令和2年度の合計はリセモム記事と一致する(実質定員8,115・志願7,088・倍率0.87)', () => {
    const r2 = IWATE_COMPETITION_RATE_HISTORY.years[5];
    expect(r2.grandTotal.quota).toBe(8115);
    expect(r2.grandTotal.applicants).toBe(7088);
    expect(r2.grandTotal.rate).toBeCloseTo(0.87, 2);
  });
});
