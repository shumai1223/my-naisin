import { IBARAKI_COMPETITION_RATE_HISTORY } from '../ibaraki';

/**
 * Λ-4（多年度アーカイブ・茨城県）DoD検証: 令和7・令和6・令和5年度の「全日制計」行の数値を
 * 一次資料（茨城県教育委員会の志願者数等PDF・志願先変更後）の固定値で確認する。
 */
describe('茨城県 多年度アーカイブ（Λ-4・令和7/令和6/令和5の3年度分・grand-total-only）', () => {
  it('3年度分（令和7年度・令和6年度・令和5年度）を収録している', () => {
    expect(IBARAKI_COMPETITION_RATE_HISTORY.years).toHaveLength(3);
    expect(IBARAKI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of IBARAKI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全日制計は一次資料と一致する(募集16,723・志願16,548・倍率0.99)', () => {
    const r7 = IBARAKI_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(16723);
    expect(r7.grandTotal.applicants).toBe(16548);
    expect(r7.grandTotal.rate).toBeCloseTo(0.99, 2);
  });

  it('令和6年度の全日制計は一次資料と一致する(募集17,040・志願16,742・倍率0.98)', () => {
    const r6 = IBARAKI_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(17040);
    expect(r6.grandTotal.applicants).toBe(16742);
    expect(r6.grandTotal.rate).toBeCloseTo(0.98, 2);
  });

  it('令和5年度の全日制計は一次資料と一致する(募集17,443・志願17,246・倍率0.99)', () => {
    const r5 = IBARAKI_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(17443);
    expect(r5.grandTotal.applicants).toBe(17246);
    expect(r5.grandTotal.rate).toBeCloseTo(0.99, 2);
  });
});
