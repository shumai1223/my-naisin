import { NAGANO_COMPETITION_RATE_HISTORY } from '../nagano';

/**
 * Λ-4（多年度アーカイブ・長野県）DoD検証: 令和7年度の全日制計を一次資料の本文記述・別紙１表の
 * 両方と一致する固定値で確認する。
 */
describe('長野県 多年度アーカイブ（Λ-4・令和7/令和6の2年度分・grand-total-only）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(NAGANO_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(NAGANO_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校粒度の内訳は未収録と正直に記録)', () => {
    for (const y of NAGANO_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全日制計は一次資料の本文・別紙１表と一致する(募集人員8,806・志願者数8,250・倍率0.94)', () => {
    const r7 = NAGANO_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(8806);
    expect(r7.grandTotal.applicants).toBe(8250);
    expect(r7.grandTotal.rate).toBeCloseTo(0.94, 2);
  });

  it('令和6年度の全日制計は一次資料の本文・別紙１表と一致する(募集人員9,945・志願者数9,312・倍率0.94)', () => {
    const r6 = NAGANO_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(9945);
    expect(r6.grandTotal.applicants).toBe(9312);
    expect(r6.grandTotal.rate).toBeCloseTo(0.94, 2);
  });
});
