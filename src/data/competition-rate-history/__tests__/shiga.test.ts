import { SHIGA_COMPETITION_RATE_HISTORY } from '../shiga';

/**
 * 滋賀県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度（いずれも旧制度・一般選抜）の
 * 全日制課程合計の数値をリセモム記事（教委発表の引用）の固定値で確認する。
 */
describe('滋賀県 多年度アーカイブ（Λ-4・令和8/令和7/令和6/令和5/令和4/令和3/令和2の7年度分・grand-total-only）', () => {
  it('7年度分（令和8年度〜令和2年度）を収録している', () => {
    expect(SHIGA_COMPETITION_RATE_HISTORY.years).toHaveLength(7);
    expect(SHIGA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
      '令和2年度（2020年度）',
    ]);
  });

  it('令和8年度の合計は一次資料「計①」行・外部二次情報(ベネッセ)と一致する(募集人数9,230・確定出願者数12,201・倍率1.32)', () => {
    const r8 = SHIGA_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(9230);
    expect(r8.grandTotal.applicants).toBe(12201);
    expect(r8.grandTotal.rate).toBeCloseTo(1.32, 2);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of SHIGA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(学力検査定員6,253・確定出願者数6,563・倍率1.05)', () => {
    const r7 = SHIGA_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(6253);
    expect(r7.grandTotal.applicants).toBe(6563);
    expect(r7.grandTotal.rate).toBeCloseTo(1.05, 2);
  });

  it('令和6年度の合計は一次資料と一致する(学力検査定員6,369・確定出願者数6,727・倍率1.06)', () => {
    const r6 = SHIGA_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(6369);
    expect(r6.grandTotal.applicants).toBe(6727);
    expect(r6.grandTotal.rate).toBeCloseTo(1.06, 2);
  });

  it('令和5年度の合計はリセモム記事と一致する(学力検査定員6,286・確定出願者数6,689・倍率1.06)', () => {
    const r5 = SHIGA_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(6286);
    expect(r5.grandTotal.applicants).toBe(6689);
    expect(r5.grandTotal.rate).toBeCloseTo(1.06, 2);
  });

  it('令和4年度の合計はリセモム記事と一致する(学力検査定員6,308・出願者数6,912・倍率1.09)', () => {
    const r4 = SHIGA_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(6308);
    expect(r4.grandTotal.applicants).toBe(6912);
    expect(r4.grandTotal.rate).toBeCloseTo(1.09, 2);
  });

  it('令和3年度の合計はリセモム記事と一致する(学力検査定員6,004・出願者数6,602・倍率1.10)', () => {
    const r3 = SHIGA_COMPETITION_RATE_HISTORY.years[5];
    expect(r3.grandTotal.quota).toBe(6004);
    expect(r3.grandTotal.applicants).toBe(6602);
    expect(r3.grandTotal.rate).toBeCloseTo(1.1, 2);
  });

  it('令和2年度の合計は一次資料と一致する(学力検査定員6,379・確定出願者数6,928・倍率1.09)', () => {
    const r2 = SHIGA_COMPETITION_RATE_HISTORY.years[6];
    expect(r2.grandTotal.quota).toBe(6379);
    expect(r2.grandTotal.applicants).toBe(6928);
    expect(r2.grandTotal.rate).toBeCloseTo(1.09, 2);
  });
});
