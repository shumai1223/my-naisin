import { FUKUOKA_COMPETITION_RATE_HISTORY } from '../fukuoka';

/**
 * Λ-4（多年度アーカイブ・福岡県）DoD検証: 県立全日制合計の数値を固定値で確認する。
 */
describe('福岡県 多年度アーカイブ（Λ-4・令和7年度分・県立全日制のみ・grand-total-only）', () => {
  it('1年度分（令和7年度）を収録している', () => {
    expect(FUKUOKA_COMPETITION_RATE_HISTORY.years).toHaveLength(1);
    expect(FUKUOKA_COMPETITION_RATE_HISTORY.years[0].fiscalYear).toBe('令和7年度（2025年度）');
  });

  it('categoriesは空(市組合立分は未収録と正直に記録)', () => {
    expect(FUKUOKA_COMPETITION_RATE_HISTORY.years[0].categories).toHaveLength(0);
  });

  it('県立全日制合計はリセモム記事と一致する(定員22,040・志願24,542・倍率1.11)', () => {
    const r7 = FUKUOKA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(22040);
    expect(r7.grandTotal.applicants).toBe(24542);
    expect(r7.grandTotal.rate).toBeCloseTo(1.11, 2);
  });
});
