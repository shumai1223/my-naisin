import { NARA_COMPETITION_RATE_HISTORY } from '../nara';

/**
 * 奈良県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度（いずれも旧制度・一般選抜）の
 * 全日制課程合計の数値をリセモム記事（教委発表の引用）の固定値で確認する。
 */
describe('奈良県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(NARA_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(NARA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of NARA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(募集人員4,400・志願者数4,490・倍率1.02)', () => {
    const r7 = NARA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(4400);
    expect(r7.grandTotal.applicants).toBe(4490);
    expect(r7.grandTotal.rate).toBeCloseTo(1.02, 2);
  });

  it('令和6年度の合計は一次資料と一致する(募集人員4,440・志願者数4,702・倍率1.06)', () => {
    const r6 = NARA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(4440);
    expect(r6.grandTotal.applicants).toBe(4702);
    expect(r6.grandTotal.rate).toBeCloseTo(1.06, 2);
  });
});
