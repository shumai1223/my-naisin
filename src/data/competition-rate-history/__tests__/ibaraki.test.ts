import { IBARAKI_COMPETITION_RATE_HISTORY } from '../ibaraki';

/**
 * Λ-4（多年度アーカイブ・茨城県）DoD検証: 令和7・令和6・令和5年度の「全日制計」行の数値を
 * 一次資料（茨城県教育委員会の志願者数等PDF・志願先変更後）の固定値で確認する。
 */
describe('茨城県 多年度アーカイブ（Λ-4・令和8/令和7/令和6/令和5/令和4の5年度分・grand-total-only）', () => {
  it('5年度分（令和8年度・令和7年度・令和6年度・令和5年度・令和4年度）を収録している', () => {
    expect(IBARAKI_COMPETITION_RATE_HISTORY.years).toHaveLength(5);
    expect(IBARAKI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
    ]);
  });

  it('令和8年度の全日制計は一次資料と一致する(募集16,647・志願15,211・倍率0.91)', () => {
    const r8 = IBARAKI_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(16647);
    expect(r8.grandTotal.applicants).toBe(15211);
    expect(r8.grandTotal.rate).toBeCloseTo(0.91, 2);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of IBARAKI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全日制計は一次資料と一致する(募集16,723・志願16,548・倍率0.99)', () => {
    const r7 = IBARAKI_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(16723);
    expect(r7.grandTotal.applicants).toBe(16548);
    expect(r7.grandTotal.rate).toBeCloseTo(0.99, 2);
  });

  it('令和6年度の全日制計は一次資料と一致する(募集17,040・志願16,742・倍率0.98)', () => {
    const r6 = IBARAKI_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(17040);
    expect(r6.grandTotal.applicants).toBe(16742);
    expect(r6.grandTotal.rate).toBeCloseTo(0.98, 2);
  });

  it('令和5年度の全日制計は一次資料と一致する(募集17,443・志願17,246・倍率0.99)', () => {
    const r5 = IBARAKI_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(17443);
    expect(r5.grandTotal.applicants).toBe(17246);
    expect(r5.grandTotal.rate).toBeCloseTo(0.99, 2);
  });

  it('令和4年度の全日制計は実施状況報告書の計17,750/18,033から日立第一附属中学校分80人を除いた値と一致する(募集17,670・志願17,953・倍率1.02)', () => {
    const r4 = IBARAKI_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(17670);
    expect(r4.grandTotal.applicants).toBe(17953);
    expect(r4.grandTotal.rate).toBeCloseTo(1.02, 2);
  });

  it('内部整合性: 志願者数÷募集人員が公表倍率とおおむね一致する', () => {
    for (const y of IBARAKI_COMPETITION_RATE_HISTORY.years) {
      const computed = y.grandTotal.applicants / y.grandTotal.quota;
      expect(computed).toBeCloseTo(y.grandTotal.rate, 2);
    }
  });
});
