import { KAGOSHIMA_COMPETITION_RATE_HISTORY } from '../kagoshima';

/**
 * Λ-4（多年度アーカイブ・鹿児島県）DoD検証: 令和7・令和6年度の「全日制 合計」
 * （学力検査定員quota・最終出願者数applicants）を一次資料の固定値で確認する。
 */
describe('鹿児島県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(KAGOSHIMA_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(KAGOSHIMA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of KAGOSHIMA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度は一次資料と一致する(学力検査定員10,398・最終出願者数8,455・倍率0.81)', () => {
    const r7 = KAGOSHIMA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(10398);
    expect(r7.grandTotal.applicants).toBe(8455);
    expect(r7.grandTotal.rate).toBeCloseTo(0.81, 2);
  });

  it('令和6年度は一次資料と一致する(学力検査定員10,957・最終出願者数9,205・倍率0.84)', () => {
    const r6 = KAGOSHIMA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(10957);
    expect(r6.grandTotal.applicants).toBe(9205);
    expect(r6.grandTotal.rate).toBeCloseTo(0.84, 2);
  });

  it('内部整合性: 全年度で志願者数÷募集人員が公表倍率とおおむね一致する', () => {
    for (const y of KAGOSHIMA_COMPETITION_RATE_HISTORY.years) {
      const computed = y.grandTotal.applicants / y.grandTotal.quota;
      expect(computed).toBeCloseTo(y.grandTotal.rate, 2);
    }
  });
});
