import { TOTTORI_COMPETITION_RATE_HISTORY } from '../tottori';

/**
 * Λ-4（多年度アーカイブ・鳥取県）DoD検証: 令和7・令和6年度の「一般選抜 全日制課程
 * （実質募集定員）」の数値を一次資料の固定値で確認する。
 */
describe('鳥取県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(TOTTORI_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(TOTTORI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of TOTTORI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度は一次資料と一致する(実質募集定員2,936・志願2,586・倍率0.88)', () => {
    const r7 = TOTTORI_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(2936);
    expect(r7.grandTotal.applicants).toBe(2586);
    expect(r7.grandTotal.rate).toBeCloseTo(0.88, 2);
  });

  it('令和6年度は一次資料と一致する(実質募集定員3,048・志願2,648・倍率0.87)', () => {
    const r6 = TOTTORI_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(3048);
    expect(r6.grandTotal.applicants).toBe(2648);
    expect(r6.grandTotal.rate).toBeCloseTo(0.87, 2);
  });
});
