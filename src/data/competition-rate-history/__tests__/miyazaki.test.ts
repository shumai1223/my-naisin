import { MIYAZAKI_COMPETITION_RATE_HISTORY } from '../miyazaki';

/**
 * Λ-4（多年度アーカイブ・宮崎県）DoD検証: 令和7・令和6年度の「全日制合計」
 * （一般入学募集人員quota・志願者数applicants）を一次資料の固定値で確認する。
 */
describe('宮崎県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(MIYAZAKI_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(MIYAZAKI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of MIYAZAKI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度は一次資料と一致する(募集人員3,862・志願者数3,159・倍率0.82)', () => {
    const r7 = MIYAZAKI_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(3862);
    expect(r7.grandTotal.applicants).toBe(3159);
    expect(r7.grandTotal.rate).toBeCloseTo(0.82, 2);
  });

  it('令和6年度はリセモム記事と一致する(募集人員3,948・志願者数3,190・倍率0.81)', () => {
    const r6 = MIYAZAKI_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(3948);
    expect(r6.grandTotal.applicants).toBe(3190);
    expect(r6.grandTotal.rate).toBeCloseTo(0.81, 2);
  });

  it('内部整合性: 全年度で志願者数÷募集人員が公表倍率とおおむね一致する', () => {
    for (const y of MIYAZAKI_COMPETITION_RATE_HISTORY.years) {
      const computed = y.grandTotal.applicants / y.grandTotal.quota;
      expect(computed).toBeCloseTo(y.grandTotal.rate, 2);
    }
  });
});
