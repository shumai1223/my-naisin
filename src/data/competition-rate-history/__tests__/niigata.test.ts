import { NIIGATA_COMPETITION_RATE_HISTORY } from '../niigata';

/**
 * 新潟県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の一般選抜(全日制課程)合計の数値を
 * リセモム記事（教委発表の引用）の固定値で確認する。
 */
describe('新潟県 多年度アーカイブ（Λ-4・令和7/令和6/令和5の3年度分・grand-total-only）', () => {
  it('3年度分（令和7年度・令和6年度・令和5年度）を収録している', () => {
    expect(NIIGATA_COMPETITION_RATE_HISTORY.years).toHaveLength(3);
    expect(NIIGATA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of NIIGATA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(募集人数11,567・志願者数11,931・倍率1.03)', () => {
    const r7 = NIIGATA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(11567);
    expect(r7.grandTotal.applicants).toBe(11931);
    expect(r7.grandTotal.rate).toBeCloseTo(1.03, 2);
  });

  it('令和6年度の合計は一次資料と一致する(募集人数12,168・志願者数12,551・倍率1.03)', () => {
    const r6 = NIIGATA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(12168);
    expect(r6.grandTotal.applicants).toBe(12551);
    expect(r6.grandTotal.rate).toBeCloseTo(1.03, 2);
  });

  it('令和5年度の合計はリセモム記事と一致する(募集人数12,366・志願者数12,893・倍率1.04)', () => {
    const r5 = NIIGATA_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(12366);
    expect(r5.grandTotal.applicants).toBe(12893);
    expect(r5.grandTotal.rate).toBeCloseTo(1.04, 2);
  });
});
