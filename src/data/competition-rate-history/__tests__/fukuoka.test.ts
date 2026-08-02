import { FUKUOKA_COMPETITION_RATE_HISTORY } from '../fukuoka';

/**
 * Λ-4（多年度アーカイブ・福岡県）DoD検証: 令和7・令和6年度の県立全日制合計の数値を固定値で確認する。
 */
describe('福岡県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・県立全日制のみ・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(FUKUOKA_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(FUKUOKA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(市組合立分は未収録と正直に記録)', () => {
    for (const y of FUKUOKA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の県立全日制合計はリセモム記事と一致する(定員22,040・志願24,542・倍率1.11)', () => {
    const r7 = FUKUOKA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(22040);
    expect(r7.grandTotal.applicants).toBe(24542);
    expect(r7.grandTotal.rate).toBeCloseTo(1.11, 2);
  });

  it('令和6年度の県立全日制合計はリセモム記事と一致する(定員22,160・志願25,128・倍率1.13)', () => {
    const r6 = FUKUOKA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(22160);
    expect(r6.grandTotal.applicants).toBe(25128);
    expect(r6.grandTotal.rate).toBeCloseTo(1.13, 2);
  });
});
