import { AKITA_COMPETITION_RATE_HISTORY } from '../akita';

/**
 * Λ-4（多年度アーカイブ・秋田県）DoD検証: 令和7・令和6年度の「全日制の課程 県合計」の
 * 数値を一次資料（秋田県教育委員会「1次募集 志願者数（志願先変更後）」公－２）の固定値で確認する。
 */
describe('秋田県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(AKITA_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(AKITA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of AKITA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の県合計は一次資料と一致する(募集定員6,495・志願5,587・倍率0.86)', () => {
    const r7 = AKITA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(6495);
    expect(r7.grandTotal.applicants).toBe(5587);
    expect(r7.grandTotal.rate).toBeCloseTo(0.86, 2);
  });

  it('令和6年度の県合計は一次資料と一致する(募集定員6,604・志願5,753・倍率0.87)', () => {
    const r6 = AKITA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(6604);
    expect(r6.grandTotal.applicants).toBe(5753);
    expect(r6.grandTotal.rate).toBeCloseTo(0.87, 2);
  });
});
