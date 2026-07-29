import { ISHIKAWA_COMPETITION_RATE_HISTORY } from '../ishikawa';

/**
 * Λ-4（多年度アーカイブ・石川県）DoD検証: 令和7年度の全県合計・全日制一般入学を
 * 報道記事の固定値で確認する。学校数(40校)は既存Y-6 ishikawa.tsのofficialSubtotalsと
 * 完全一致することも確認済み。
 */
describe('石川県 多年度アーカイブ（Λ-4・令和7年度分・grand-total-only）', () => {
  it('1年度分（令和7年度）を収録している', () => {
    expect(ISHIKAWA_COMPETITION_RATE_HISTORY.years).toHaveLength(1);
    expect(ISHIKAWA_COMPETITION_RATE_HISTORY.years[0].fiscalYear).toBe('令和7年度（2025年度）');
  });

  it('categoriesは空(学校粒度の内訳は未収録と正直に記録)', () => {
    expect(ISHIKAWA_COMPETITION_RATE_HISTORY.years[0].categories).toHaveLength(0);
  });

  it('全県合計は報道記事と一致し、学校数は既存Y-6のofficialSubtotalsと一致する(40校・募集6,666・出願6,409・倍率0.96)', () => {
    const r7 = ISHIKAWA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.schoolCount).toBe(40);
    expect(r7.grandTotal.quota).toBe(6666);
    expect(r7.grandTotal.applicants).toBe(6409);
    expect(r7.grandTotal.rate).toBeCloseTo(0.96, 2);
  });

  it('内部整合性: 出願者数÷募集定員が公表倍率とおおむね一致する', () => {
    const r7 = ISHIKAWA_COMPETITION_RATE_HISTORY.years[0];
    const computed = r7.grandTotal.applicants / r7.grandTotal.quota;
    expect(computed).toBeCloseTo(r7.grandTotal.rate, 2);
  });
});
