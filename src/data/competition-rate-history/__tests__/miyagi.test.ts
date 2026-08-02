import { MIYAGI_COMPETITION_RATE_HISTORY } from '../miyagi';

/**
 * Λ-4（多年度アーカイブ・宮城県）DoD検証: 令和7・令和6年度の全日制課程・第一次募集の合計を
 * 一次資料（宮城県教育庁「総括」表）の固定値で確認する。
 */
describe('宮城県 多年度アーカイブ（Λ-4・令和7/令和6/令和5/令和4の4年度分・grand-total-only）', () => {
  it('4年度分（令和7年度・令和6年度・令和5年度・令和4年度）を収録している', () => {
    expect(MIYAGI_COMPETITION_RATE_HISTORY.years).toHaveLength(4);
    expect(MIYAGI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校粒度の内訳は未収録と正直に記録)', () => {
    for (const y of MIYAGI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全日制課程・第一次募集は一次資料の「総括」表と一致する(募集13,440・出願13,349・倍率0.99)', () => {
    const r7 = MIYAGI_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(13440);
    expect(r7.grandTotal.applicants).toBe(13349);
    expect(r7.grandTotal.rate).toBeCloseTo(0.99, 2);
  });

  it('令和6年度の全日制課程・第一次募集は一次資料の前年度列と一致する(募集13,640・出願13,609・倍率1.00)', () => {
    const r6 = MIYAGI_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(13640);
    expect(r6.grandTotal.applicants).toBe(13609);
    expect(r6.grandTotal.rate).toBeCloseTo(1.0, 2);
  });

  it('令和5年度の全日制課程・第一次募集は一次資料(令和6年度「結果について」発表の前年度列)と一致する(募集13,760・出願14,095・倍率1.02)', () => {
    const r5 = MIYAGI_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(13760);
    expect(r5.grandTotal.applicants).toBe(14095);
    expect(r5.grandTotal.rate).toBeCloseTo(1.02, 2);
  });

  it('令和4年度の全日制課程・第一次募集はリセモム確定記事と一致する(募集13,880・出願14,005・倍率1.01)', () => {
    const r4 = MIYAGI_COMPETITION_RATE_HISTORY.years[3];
    expect(r4.grandTotal.quota).toBe(13880);
    expect(r4.grandTotal.applicants).toBe(14005);
    expect(r4.grandTotal.rate).toBeCloseTo(1.01, 2);
  });
});
