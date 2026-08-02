import { FUKUSHIMA_COMPETITION_RATE_HISTORY } from '../fukushima';

/**
 * Λ-4（多年度アーカイブ・福島県）DoD検証: 令和7・令和6年度の「全日制 合計」行の数値を
 * 一次資料（福島県教育委員会の後期選抜志願状況PDF・出願先変更後）の固定値で確認する。
 */
describe('福島県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(FUKUSHIMA_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(FUKUSHIMA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of FUKUSHIMA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全日制合計は一次資料と一致する(後期選抜募集定員1,603・志願175・倍率0.11)', () => {
    const r7 = FUKUSHIMA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(1603);
    expect(r7.grandTotal.applicants).toBe(175);
    expect(r7.grandTotal.rate).toBeCloseTo(0.11, 2);
  });

  it('令和6年度の全日制合計は一次資料と一致する(後期選抜募集定員1,484・志願230・倍率0.15)', () => {
    const r6 = FUKUSHIMA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(1484);
    expect(r6.grandTotal.applicants).toBe(230);
    expect(r6.grandTotal.rate).toBeCloseTo(0.15, 2);
  });
});
