import { OITA_COMPETITION_RATE_HISTORY } from '../oita';

/**
 * Λ-4（多年度アーカイブ・大分県）DoD検証: 令和7・令和6年度の「県立高校全日制課程合計」行の
 * 数値を一次資料(令和7年度は大分県教育委員会PDF)・地方紙(令和6年度はTOSオンライン記事)の
 * 固定値で確認する。
 */
describe('大分県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(OITA_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(OITA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of OITA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(募集定員5,666・志願5,783・倍率1.02)', () => {
    const r7 = OITA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(5666);
    expect(r7.grandTotal.applicants).toBe(5783);
    expect(r7.grandTotal.rate).toBeCloseTo(1.02, 2);
  });

  it('令和6年度の合計はTOSオンライン記事と一致する(募集定員5,864・志願6,080・倍率1.04)', () => {
    const r6 = OITA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(5864);
    expect(r6.grandTotal.applicants).toBe(6080);
    expect(r6.grandTotal.rate).toBeCloseTo(1.04, 2);
  });
});
