import { TOYAMA_COMPETITION_RATE_HISTORY } from '../toyama';

/**
 * 富山県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の全日制の課程一般入学者選抜
 * 合計（34校82学科）の数値を一次資料の固定値で確認する。
 */
describe('富山県 多年度アーカイブ（Λ-4・令和7/令和6/令和5/令和4/令和3の5年度分・grand-total-only）', () => {
  it('5年度分（令和7年度・令和6年度・令和5年度・令和4年度・令和3年度）を収録している', () => {
    expect(TOYAMA_COMPETITION_RATE_HISTORY.years).toHaveLength(5);
    expect(TOYAMA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of TOYAMA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(募集人数5,097・志願者数5,044・倍率0.99)', () => {
    const r7 = TOYAMA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(5097);
    expect(r7.grandTotal.applicants).toBe(5044);
    expect(r7.grandTotal.rate).toBeCloseTo(0.99, 2);
  });

  it('令和6年度の合計は一次資料と一致する(募集人数5,188・志願者数5,248・倍率1.01)', () => {
    const r6 = TOYAMA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(5188);
    expect(r6.grandTotal.applicants).toBe(5248);
    expect(r6.grandTotal.rate).toBeCloseTo(1.01, 2);
  });

  it('令和5年度の合計は一次資料と一致する(募集人数5,226・志願者数5,327・倍率1.02)', () => {
    const r5 = TOYAMA_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(5226);
    expect(r5.grandTotal.applicants).toBe(5327);
    expect(r5.grandTotal.rate).toBeCloseTo(1.02, 2);
  });

  it('令和4年度の合計は一次資料と一致する(募集人数5,359・志願者数5,594・倍率1.04)', () => {
    const r4 = TOYAMA_COMPETITION_RATE_HISTORY.years[3];
    expect(r4.grandTotal.quota).toBe(5359);
    expect(r4.grandTotal.applicants).toBe(5594);
    expect(r4.grandTotal.rate).toBeCloseTo(1.04, 2);
  });

  it('令和3年度の合計は一次資料と一致する(募集人数5,440・志願者数5,842・倍率1.07)', () => {
    const r3 = TOYAMA_COMPETITION_RATE_HISTORY.years[4];
    expect(r3.grandTotal.quota).toBe(5440);
    expect(r3.grandTotal.applicants).toBe(5842);
    expect(r3.grandTotal.rate).toBeCloseTo(1.07, 2);
  });
});
