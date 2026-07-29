import { GIFU_COMPETITION_RATE_HISTORY } from '../gifu';

/**
 * Λ-4（多年度アーカイブ・岐阜県）DoD検証: 令和7年度の全日制の課程・総計を一次資料の固定値で確認する。
 */
describe('岐阜県 多年度アーカイブ（Λ-4・令和7年度分・grand-total-only）', () => {
  it('1年度分（令和7年度）を収録している', () => {
    expect(GIFU_COMPETITION_RATE_HISTORY.years).toHaveLength(1);
    expect(GIFU_COMPETITION_RATE_HISTORY.years[0].fiscalYear).toBe('令和7年度（2025年度）');
  });

  it('categoriesは空(学校粒度の内訳は未収録と正直に記録)', () => {
    expect(GIFU_COMPETITION_RATE_HISTORY.years[0].categories).toHaveLength(0);
  });

  it('全日制の課程・総計は一次資料の「総計」行と一致する(定員12,885・出願12,376・倍率0.96)', () => {
    const r7 = GIFU_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(12885);
    expect(r7.grandTotal.applicants).toBe(12376);
    expect(r7.grandTotal.rate).toBeCloseTo(0.96, 2);
  });
});
