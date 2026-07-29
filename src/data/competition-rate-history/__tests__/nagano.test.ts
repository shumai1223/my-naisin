import { NAGANO_COMPETITION_RATE_HISTORY } from '../nagano';

/**
 * Λ-4（多年度アーカイブ・長野県）DoD検証: 令和7年度の全日制計を一次資料の本文記述・別紙１表の
 * 両方と一致する固定値で確認する。
 */
describe('長野県 多年度アーカイブ（Λ-4・令和7年度分・grand-total-only）', () => {
  it('1年度分（令和7年度）を収録している', () => {
    expect(NAGANO_COMPETITION_RATE_HISTORY.years).toHaveLength(1);
    expect(NAGANO_COMPETITION_RATE_HISTORY.years[0].fiscalYear).toBe('令和7年度（2025年度）');
  });

  it('categoriesは空(学校粒度の内訳は未収録と正直に記録)', () => {
    expect(NAGANO_COMPETITION_RATE_HISTORY.years[0].categories).toHaveLength(0);
  });

  it('全日制計は一次資料の本文・別紙１表と一致する(募集人員8,806・志願者数8,250・倍率0.94)', () => {
    const r7 = NAGANO_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(8806);
    expect(r7.grandTotal.applicants).toBe(8250);
    expect(r7.grandTotal.rate).toBeCloseTo(0.94, 2);
  });
});
