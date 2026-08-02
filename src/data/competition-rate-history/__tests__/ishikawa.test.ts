import { ISHIKAWA_COMPETITION_RATE_HISTORY } from '../ishikawa';

/**
 * Λ-4（多年度アーカイブ・石川県）DoD検証: 令和7・令和6年度の全県合計・全日制一般入学を
 * 固定値で確認する。学校数(40校)は既存Y-6 ishikawa.tsのofficialSubtotalsと完全一致することも
 * 確認済み。
 */
describe('石川県 多年度アーカイブ（Λ-4・令和7/令和6/令和5の3年度分・grand-total-only）', () => {
  it('3年度分（令和7年度・令和6年度・令和5年度）を収録している', () => {
    expect(ISHIKAWA_COMPETITION_RATE_HISTORY.years).toHaveLength(3);
    expect(ISHIKAWA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校粒度の内訳は未収録と正直に記録)', () => {
    for (const y of ISHIKAWA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全県合計は報道記事と一致し、学校数は既存Y-6のofficialSubtotalsと一致する(40校・募集6,666・出願6,409・倍率0.96)', () => {
    const r7 = ISHIKAWA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.schoolCount).toBe(40);
    expect(r7.grandTotal.quota).toBe(6666);
    expect(r7.grandTotal.applicants).toBe(6409);
    expect(r7.grandTotal.rate).toBeCloseTo(0.96, 2);
  });

  it('令和6年度の全県合計は一次資料と一致する(40校・一般入学枠6,775・出願6,650・倍率0.98)', () => {
    const r6 = ISHIKAWA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.schoolCount).toBe(40);
    expect(r6.grandTotal.quota).toBe(6775);
    expect(r6.grandTotal.applicants).toBe(6650);
    expect(r6.grandTotal.rate).toBeCloseTo(0.98, 2);
  });

  it('令和5年度の全県合計は一次資料と一致する(40校・一般入学枠7,003・出願7,067・倍率1.01)', () => {
    const r5 = ISHIKAWA_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.schoolCount).toBe(40);
    expect(r5.grandTotal.quota).toBe(7003);
    expect(r5.grandTotal.applicants).toBe(7067);
    expect(r5.grandTotal.rate).toBeCloseTo(1.01, 2);
  });

  it('内部整合性: 全年度で出願者数÷募集定員が公表倍率とおおむね一致する', () => {
    for (const y of ISHIKAWA_COMPETITION_RATE_HISTORY.years) {
      const computed = y.grandTotal.applicants / y.grandTotal.quota;
      expect(computed).toBeCloseTo(y.grandTotal.rate, 2);
    }
  });
});
