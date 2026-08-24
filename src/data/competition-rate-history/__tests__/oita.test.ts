import { OITA_COMPETITION_RATE_HISTORY } from '../oita';

/**
 * Λ-4（多年度アーカイブ・大分県）DoD検証: 令和8〜令和3年度の「県立高校全日制課程合計」行の
 * 数値を一次資料(令和8・令和7年度は大分県教育委員会PDF)・地方紙・教育系サイト(令和6〜3年度は
 * TOSオンライン/リセモム/個別指導NEXTA)の固定値で確認する。
 */
describe('大分県 多年度アーカイブ（Λ-4・令和8〜令和2の7年度分・grand-total-only）', () => {
  it('7年度分（令和8年度〜令和2年度）を収録している', () => {
    expect(OITA_COMPETITION_RATE_HISTORY.years).toHaveLength(7);
    expect(OITA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
      '令和2年度（2020年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of OITA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和8年度の合計は一次資料と一致する(募集定員5,806・志願5,969・倍率1.03)', () => {
    const r8 = OITA_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(5806);
    expect(r8.grandTotal.applicants).toBe(5969);
    expect(r8.grandTotal.rate).toBeCloseTo(1.03, 2);
  });

  it('令和7年度の合計は一次資料と一致する(募集定員5,666・志願5,783・倍率1.02)', () => {
    const r7 = OITA_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(5666);
    expect(r7.grandTotal.applicants).toBe(5783);
    expect(r7.grandTotal.rate).toBeCloseTo(1.02, 2);
  });

  it('令和6年度の合計はTOSオンライン記事と一致する(募集定員5,864・志願6,080・倍率1.04)', () => {
    const r6 = OITA_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(5864);
    expect(r6.grandTotal.applicants).toBe(6080);
    expect(r6.grandTotal.rate).toBeCloseTo(1.04, 2);
  });

  it('令和5年度の合計はリセモム記事と一致する(募集定員5,825・志願6,134・倍率1.05)', () => {
    const r5 = OITA_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(5825);
    expect(r5.grandTotal.applicants).toBe(6134);
    expect(r5.grandTotal.rate).toBeCloseTo(1.05, 2);
  });

  it('令和4年度の合計はリセモム記事と一致する(募集定員5,889・志願6,181・倍率1.05)', () => {
    const r4 = OITA_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(5889);
    expect(r4.grandTotal.applicants).toBe(6181);
    expect(r4.grandTotal.rate).toBeCloseTo(1.05, 2);
  });

  it('令和3年度の合計はリセモム記事と一致する(募集定員5,635・志願6,070・倍率1.08)', () => {
    const r3 = OITA_COMPETITION_RATE_HISTORY.years[5];
    expect(r3.grandTotal.quota).toBe(5635);
    expect(r3.grandTotal.applicants).toBe(6070);
    expect(r3.grandTotal.rate).toBeCloseTo(1.08, 2);
  });

  it('令和2年度の合計はリセモム記事(最終志願状況)と一致する(募集定員5,730・志願6,168・倍率1.08)', () => {
    const r2 = OITA_COMPETITION_RATE_HISTORY.years[6];
    expect(r2.grandTotal.quota).toBe(5730);
    expect(r2.grandTotal.applicants).toBe(6168);
    expect(r2.grandTotal.rate).toBeCloseTo(1.08, 2);
  });
});
