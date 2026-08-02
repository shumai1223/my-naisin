import { SHIGA_COMPETITION_RATE_HISTORY } from '../shiga';

/**
 * 滋賀県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度（いずれも旧制度・一般選抜）の
 * 全日制課程合計の数値をリセモム記事（教委発表の引用）の固定値で確認する。
 */
describe('滋賀県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(SHIGA_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(SHIGA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of SHIGA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(学力検査定員6,253・確定出願者数6,563・倍率1.05)', () => {
    const r7 = SHIGA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(6253);
    expect(r7.grandTotal.applicants).toBe(6563);
    expect(r7.grandTotal.rate).toBeCloseTo(1.05, 2);
  });

  it('令和6年度の合計は一次資料と一致する(学力検査定員6,369・確定出願者数6,727・倍率1.06)', () => {
    const r6 = SHIGA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(6369);
    expect(r6.grandTotal.applicants).toBe(6727);
    expect(r6.grandTotal.rate).toBeCloseTo(1.06, 2);
  });
});
