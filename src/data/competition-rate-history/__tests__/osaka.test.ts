import { OSAKA_COMPETITION_RATE_HISTORY } from '../osaka';

/**
 * Λ-4（多年度アーカイブ・大阪府）DoD検証: 令和8・令和7・令和6年度の「全体合計」行の数値を
 * 一次資料(xlsx・Node標準zlibで自前パース)の固定値で確認する。
 */
describe('大阪府 多年度アーカイブ（Λ-4・令和8/令和7/令和6の3年度分・grand-total-only）', () => {
  it('3年度分（令和8年度・令和7年度・令和6年度）を収録している', () => {
    expect(OSAKA_COMPETITION_RATE_HISTORY.years).toHaveLength(3);
    expect(OSAKA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of OSAKA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和8年度の合計は一次資料(xlsx表1〜6)と一致する(募集定員31,847・志願33,422・倍率1.05)', () => {
    const r8 = OSAKA_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(31847);
    expect(r8.grandTotal.applicants).toBe(33422);
    expect(r8.grandTotal.rate).toBeCloseTo(1.05, 2);
  });

  it('令和7年度の合計は一次資料(xlsx表1〜5)と一致する(募集定員33,250・志願34,003・倍率1.02)', () => {
    const r7 = OSAKA_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(33250);
    expect(r7.grandTotal.applicants).toBe(34003);
    expect(r7.grandTotal.rate).toBeCloseTo(1.02, 2);
  });

  it('令和6年度の合計は一次資料(xlsx表1〜5)と一致する(募集定員34,789・志願36,379・倍率1.05)', () => {
    const r6 = OSAKA_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(34789);
    expect(r6.grandTotal.applicants).toBe(36379);
    expect(r6.grandTotal.rate).toBeCloseTo(1.05, 2);
  });
});
