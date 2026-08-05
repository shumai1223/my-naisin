import { NIIGATA_COMPETITION_RATE_HISTORY } from '../niigata';

/**
 * 新潟県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の一般選抜(全日制課程)合計の数値を
 * リセモム記事（教委発表の引用）の固定値で確認する。
 */
describe('新潟県 多年度アーカイブ（Λ-4・令和7/令和6/令和5/令和4/令和3/令和2の6年度分・grand-total-only）', () => {
  it('6年度分（令和7年度・令和6年度・令和5年度・令和4年度・令和3年度・令和2年度）を収録している', () => {
    expect(NIIGATA_COMPETITION_RATE_HISTORY.years).toHaveLength(7);
    expect(NIIGATA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
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
    for (const y of NIIGATA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和8年度はY-6既存確定値と一致する(全日制合計・募集11,709・志願11,679・倍率0.99)', () => {
    const r8 = NIIGATA_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(11709);
    expect(r8.grandTotal.applicants).toBe(11679);
    expect(r8.grandTotal.rate).toBeCloseTo(0.99, 2);
  });

  it('令和7年度の合計は一次資料と一致する(募集人数11,567・志願者数11,931・倍率1.03)', () => {
    const r7 = NIIGATA_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(11567);
    expect(r7.grandTotal.applicants).toBe(11931);
    expect(r7.grandTotal.rate).toBeCloseTo(1.03, 2);
  });

  it('令和6年度の合計は一次資料と一致する(募集人数12,168・志願者数12,551・倍率1.03)', () => {
    const r6 = NIIGATA_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(12168);
    expect(r6.grandTotal.applicants).toBe(12551);
    expect(r6.grandTotal.rate).toBeCloseTo(1.03, 2);
  });

  it('令和5年度の合計はリセモム記事と一致する(募集人数12,366・志願者数12,893・倍率1.04)', () => {
    const r5 = NIIGATA_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(12366);
    expect(r5.grandTotal.applicants).toBe(12893);
    expect(r5.grandTotal.rate).toBeCloseTo(1.04, 2);
  });

  it('令和4年度の合計は一次資料と一致する(募集人数12,841・志願者数13,324・倍率1.03)', () => {
    const r4 = NIIGATA_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(12841);
    expect(r4.grandTotal.applicants).toBe(13324);
    expect(r4.grandTotal.rate).toBeCloseTo(1.03, 2);
  });

  it('令和3年度の合計はリセモム記事と一致する(募集人数12,552・志願者数13,289・倍率1.05)', () => {
    const r3 = NIIGATA_COMPETITION_RATE_HISTORY.years[5];
    expect(r3.grandTotal.quota).toBe(12552);
    expect(r3.grandTotal.applicants).toBe(13289);
    expect(r3.grandTotal.rate).toBeCloseTo(1.05, 2);
  });

  it('令和2年度の合計はリセモム記事と一致する(募集人員13,172・志願者数14,121・倍率1.07)', () => {
    const r2 = NIIGATA_COMPETITION_RATE_HISTORY.years[6];
    expect(r2.grandTotal.quota).toBe(13172);
    expect(r2.grandTotal.applicants).toBe(14121);
    expect(r2.grandTotal.rate).toBeCloseTo(1.07, 2);
  });
});
