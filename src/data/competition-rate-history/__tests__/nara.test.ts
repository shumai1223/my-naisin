import { NARA_COMPETITION_RATE_HISTORY } from '../nara';

/**
 * 奈良県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度（いずれも旧制度・一般選抜）の
 * 全日制課程合計の数値をリセモム記事（教委発表の引用）の固定値で確認する。令和8年度は
 * 「一次選抜」という新制度のため他年度とlabelを区別している。
 */
describe('奈良県 多年度アーカイブ（Λ-4・令和8/令和7/令和6/令和5/令和4/令和3/令和2の7年度分・grand-total-only）', () => {
  it('7年度分（令和8年度〜令和2年度）を収録している', () => {
    expect(NARA_COMPETITION_RATE_HISTORY.years).toHaveLength(7);
    expect(NARA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
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
    for (const y of NARA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和8年度の合計はY-6既存確定値(一次選抜・第一出願期間)と一致する(募集人員6,896・志願者数6,276・倍率0.91)', () => {
    const r8 = NARA_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(6896);
    expect(r8.grandTotal.applicants).toBe(6276);
    expect(r8.grandTotal.rate).toBeCloseTo(0.91, 2);
    expect(r8.grandTotal.schoolCount).toBe(29);
  });

  it('令和7年度の合計は一次資料と一致する(募集人員4,400・志願者数4,490・倍率1.02)', () => {
    const r7 = NARA_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(4400);
    expect(r7.grandTotal.applicants).toBe(4490);
    expect(r7.grandTotal.rate).toBeCloseTo(1.02, 2);
  });

  it('令和6年度の合計は一次資料と一致する(募集人員4,440・志願者数4,702・倍率1.06)', () => {
    const r6 = NARA_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(4440);
    expect(r6.grandTotal.applicants).toBe(4702);
    expect(r6.grandTotal.rate).toBeCloseTo(1.06, 2);
  });

  it('令和5年度の合計はリセモム記事と一致する(募集人員4,432・志願者数5,062・倍率1.14)', () => {
    const r5 = NARA_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(4432);
    expect(r5.grandTotal.applicants).toBe(5062);
    expect(r5.grandTotal.rate).toBeCloseTo(1.14, 2);
  });

  it('令和4年度の合計はリセモム記事と一致する(募集人員4,956・志願者数4,916・倍率0.99)', () => {
    const r4 = NARA_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(4956);
    expect(r4.grandTotal.applicants).toBe(4916);
    expect(r4.grandTotal.rate).toBeCloseTo(0.99, 2);
  });

  it('令和3年度の合計はリセモム記事と一致する(募集人員4,934・志願者数4,740・倍率0.96)', () => {
    const r3 = NARA_COMPETITION_RATE_HISTORY.years[5];
    expect(r3.grandTotal.quota).toBe(4934);
    expect(r3.grandTotal.applicants).toBe(4740);
    expect(r3.grandTotal.rate).toBeCloseTo(0.96, 2);
  });

  it('令和2年度の合計はリセモム記事と一致する(募集人員5,552・志願者数5,197・倍率0.94)', () => {
    const r2 = NARA_COMPETITION_RATE_HISTORY.years[6];
    expect(r2.grandTotal.quota).toBe(5552);
    expect(r2.grandTotal.applicants).toBe(5197);
    expect(r2.grandTotal.rate).toBeCloseTo(0.94, 2);
  });
});
