import { TOTTORI_COMPETITION_RATE_HISTORY } from '../tottori';

/**
 * Λ-4（多年度アーカイブ・鳥取県）DoD検証: 令和7・令和6年度の「一般選抜 全日制課程
 * （実質募集定員）」の数値を一次資料の固定値で確認する。
 */
describe('鳥取県 多年度アーカイブ（Λ-4・令和8〜令和3の6年度分・grand-total-only）', () => {
  it('6年度分（令和8年度〜令和3年度）を収録している', () => {
    expect(TOTTORI_COMPETITION_RATE_HISTORY.years).toHaveLength(6);
    expect(TOTTORI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of TOTTORI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和8年度はY-6既存確定値と一致する(全日制計・募集定員2,937・志願2,334・倍率0.79)', () => {
    const r8 = TOTTORI_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(2937);
    expect(r8.grandTotal.applicants).toBe(2334);
    expect(r8.grandTotal.rate).toBeCloseTo(0.79, 2);
  });

  it('令和7年度は一次資料と一致する(実質募集定員2,936・志願2,586・倍率0.88)', () => {
    const r7 = TOTTORI_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(2936);
    expect(r7.grandTotal.applicants).toBe(2586);
    expect(r7.grandTotal.rate).toBeCloseTo(0.88, 2);
  });

  it('令和6年度は一次資料と一致する(実質募集定員3,048・志願2,648・倍率0.87)', () => {
    const r6 = TOTTORI_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(3048);
    expect(r6.grandTotal.applicants).toBe(2648);
    expect(r6.grandTotal.rate).toBeCloseTo(0.87, 2);
  });

  it('令和5年度は一次資料と一致する(実質募集定員3,040・志願2,757・倍率0.91)', () => {
    const r5 = TOTTORI_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(3040);
    expect(r5.grandTotal.applicants).toBe(2757);
    expect(r5.grandTotal.rate).toBeCloseTo(0.91, 2);
  });

  it('令和4年度は令和5年度資料の前年度欄と一致する(実質募集定員3,381・志願3,139・倍率0.93)', () => {
    const r4 = TOTTORI_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(3381);
    expect(r4.grandTotal.applicants).toBe(3139);
    expect(r4.grandTotal.rate).toBeCloseTo(0.93, 2);
  });

  it('令和3年度はリセモム確定記事と一致する(実質募集定員3,419・志願3,194・倍率0.93)', () => {
    const r3 = TOTTORI_COMPETITION_RATE_HISTORY.years[5];
    expect(r3.grandTotal.quota).toBe(3419);
    expect(r3.grandTotal.applicants).toBe(3194);
    expect(r3.grandTotal.rate).toBeCloseTo(0.93, 2);
  });
});
