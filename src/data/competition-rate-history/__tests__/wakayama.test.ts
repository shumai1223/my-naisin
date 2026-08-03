import { WAKAYAMA_COMPETITION_RATE_HISTORY } from '../wakayama';

/**
 * 和歌山県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の県立合計（全日制・D+E本出願
 * 合算スコープ）の数値を一次資料の固定値で確認する。
 */
describe('和歌山県 多年度アーカイブ（Λ-4・令和7/令和6/令和5の3年度分・grand-total-only）', () => {
  it('3年度分（令和7年度・令和6年度・令和5年度）を収録している', () => {
    expect(WAKAYAMA_COMPETITION_RATE_HISTORY.years).toHaveLength(3);
    expect(WAKAYAMA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of WAKAYAMA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(入学者枠数5,915・本出願者数5,107・倍率0.86)', () => {
    const r7 = WAKAYAMA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(5915);
    expect(r7.grandTotal.applicants).toBe(5107);
    expect(r7.grandTotal.rate).toBeCloseTo(0.86, 2);
  });

  it('令和6年度の合計は一次資料と一致する(入学者枠数6,123・本出願者数5,432・倍率0.89)', () => {
    const r6 = WAKAYAMA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(6123);
    expect(r6.grandTotal.applicants).toBe(5432);
    expect(r6.grandTotal.rate).toBeCloseTo(0.89, 2);
  });

  it('令和5年度の合計は一次資料と一致する(入学者枠数6,131・本出願者数5,442・倍率0.89)', () => {
    const r5 = WAKAYAMA_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(6131);
    expect(r5.grandTotal.applicants).toBe(5442);
    expect(r5.grandTotal.rate).toBeCloseTo(0.89, 2);
  });
});
