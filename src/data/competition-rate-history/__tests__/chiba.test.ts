import { CHIBA_COMPETITION_RATE_HISTORY } from '../chiba';

/**
 * Λ-4（多年度アーカイブ・千葉県）DoD検証: 報道記事から取得した全日制合計の数値を固定値で確認する。
 * 令和6年度分は別の独立記事(2月16日付発表を報じた記事)とも一致することを実測確認済み。
 */
describe('千葉県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(CHIBA_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(CHIBA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳はA/B突合ロジックが必要なため今回は未収録と正直に記録)', () => {
    for (const y of CHIBA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全日制合計は報道記事と一致する(募集29,720・志願33,854・倍率1.14)', () => {
    const r7 = CHIBA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(29720);
    expect(r7.grandTotal.applicants).toBe(33854);
    expect(r7.grandTotal.rate).toBeCloseTo(1.14, 2);
  });

  it('令和6年度の全日制合計は独立した2記事(令和7年度記事の前年度比較・令和6年度発表時記事)双方と一致する(募集30,680・志願34,478・倍率1.12)', () => {
    const r6 = CHIBA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(30680);
    expect(r6.grandTotal.applicants).toBe(34478);
    expect(r6.grandTotal.rate).toBeCloseTo(1.12, 2);
  });
});
