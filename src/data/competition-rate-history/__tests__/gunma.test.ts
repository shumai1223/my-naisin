import { GUNMA_COMPETITION_RATE_HISTORY } from '../gunma';

/**
 * Λ-4（多年度アーカイブ・群馬県）DoD検証: 令和8〜令和3年度の合計行の数値を一次資料
 * （群馬県教育委員会の志願先変更後志願状況PDF）の固定値で確認する。令和3〜5年度は
 * 前期/後期選抜の二段階制度だったため「後期選抜」（後期募集人員に対する倍率）を収録している
 * 点に注意（R6以降の1段階制「全日制課程選抜合計」とは算出方法が異なる）。
 */
describe('群馬県 多年度アーカイブ（Λ-4・令和8〜令和3の6年度分・grand-total-only）', () => {
  it('6年度分（令和8年度〜令和3年度）を収録している', () => {
    expect(GUNMA_COMPETITION_RATE_HISTORY.years).toHaveLength(6);
    expect(GUNMA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
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

  it('令和5年度の合計は一次資料と一致する(後期募集人員6,344・志願6,276・倍率0.99)', () => {
    const r5 = GUNMA_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(6344);
    expect(r5.grandTotal.applicants).toBe(6276);
    expect(r5.grandTotal.rate).toBeCloseTo(0.99, 2);
  });

  it('令和4年度の合計は一次資料と一致する(後期募集人員6,453・志願6,419・倍率0.99)', () => {
    const r4 = GUNMA_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(6453);
    expect(r4.grandTotal.applicants).toBe(6419);
    expect(r4.grandTotal.rate).toBeCloseTo(0.99, 2);
  });

  it('令和3年度の合計は一次資料・リセモム記事と一致する(後期募集人員6,358・志願6,615・倍率1.04)', () => {
    const r3 = GUNMA_COMPETITION_RATE_HISTORY.years[5];
    expect(r3.grandTotal.quota).toBe(6358);
    expect(r3.grandTotal.applicants).toBe(6615);
    expect(r3.grandTotal.rate).toBeCloseTo(1.04, 2);
  });
});
