import { SHIMANE_COMPETITION_RATE_HISTORY } from '../shimane';

/**
 * 島根県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の全日制（本校35校）合計の数値を
 * 一次資料/リセモム記事の固定値で確認する。
 */
describe('島根県 多年度アーカイブ（Λ-4・令和7/令和6/令和5の3年度分・grand-total-only）', () => {
  it('3年度分（令和7年度・令和6年度・令和5年度）を収録している', () => {
    expect(SHIMANE_COMPETITION_RATE_HISTORY.years).toHaveLength(3);
    expect(SHIMANE_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of SHIMANE_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(募集定員3,217・出願者数2,667・倍率0.83)', () => {
    const r7 = SHIMANE_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(3217);
    expect(r7.grandTotal.applicants).toBe(2667);
    expect(r7.grandTotal.rate).toBeCloseTo(0.83, 2);
  });

  it('令和6年度の合計は一次資料と一致する(募集定員4,169・出願者数3,481・倍率0.83)', () => {
    const r6 = SHIMANE_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(4169);
    expect(r6.grandTotal.applicants).toBe(3481);
    expect(r6.grandTotal.rate).toBeCloseTo(0.83, 2);
  });

  it('令和5年度の合計はリセモム記事と一致する(募集定員4,227・出願者数3,873・倍率0.92)', () => {
    const r5 = SHIMANE_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(4227);
    expect(r5.grandTotal.applicants).toBe(3873);
    expect(r5.grandTotal.rate).toBeCloseTo(0.92, 2);
  });
});
