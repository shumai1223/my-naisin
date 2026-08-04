import { GUNMA_COMPETITION_RATE_HISTORY } from '../gunma';

/**
 * Λ-4（多年度アーカイブ・群馬県）DoD検証: 令和8・令和7・令和6年度の「公立全日制・フレックス
 * スクール合計」行の数値を一次資料（群馬県教育委員会の志願先変更後志願状況PDF）の固定値で確認する。
 */
describe('群馬県 多年度アーカイブ（Λ-4・令和8/令和7/令和6の3年度分・grand-total-only）', () => {
  it('3年度分（令和8年度・令和7年度・令和6年度）を収録している', () => {
    expect(GUNMA_COMPETITION_RATE_HISTORY.years).toHaveLength(3);
    expect(GUNMA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of GUNMA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和8年度の合計は一次資料と一致する(募集定員11,153・志願10,800・倍率0.97)', () => {
    const r8 = GUNMA_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(11153);
    expect(r8.grandTotal.applicants).toBe(10800);
    expect(r8.grandTotal.rate).toBeCloseTo(0.97, 2);
  });

  it('令和7年度の合計は一次資料と一致する(募集定員11,435・志願11,525・倍率1.01)', () => {
    const r7 = GUNMA_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(11435);
    expect(r7.grandTotal.applicants).toBe(11525);
    expect(r7.grandTotal.rate).toBeCloseTo(1.01, 2);
  });

  it('令和6年度の合計は一次資料と一致する(募集定員11,757・志願11,744・倍率1.00)', () => {
    const r6 = GUNMA_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(11757);
    expect(r6.grandTotal.applicants).toBe(11744);
    expect(r6.grandTotal.rate).toBeCloseTo(1.0, 2);
  });
});
