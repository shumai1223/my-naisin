import { KANAGAWA_COMPETITION_RATE_HISTORY } from '../kanagawa';

/**
 * Λ-4（多年度アーカイブ・神奈川県）DoD検証: 全日制合計の数値が独立した二次情報源
 * （カナロコ報道記事・令和8年度別紙1の前年度列）と一致することを固定値で確認する。
 */
describe('神奈川県 多年度アーカイブ（Λ-4・令和7年度分・grand-total-only）', () => {
  it('1年度分（令和7年度）を収録している', () => {
    expect(KANAGAWA_COMPETITION_RATE_HISTORY.years).toHaveLength(1);
    expect(KANAGAWA_COMPETITION_RATE_HISTORY.years[0].fiscalYear).toBe('令和7年度（2025年度）');
  });

  it('categoriesは空(学科別内訳は原資料に存在しないため未収録と正直に記録)', () => {
    expect(KANAGAWA_COMPETITION_RATE_HISTORY.years[0].categories).toHaveLength(0);
  });

  it('全日制合計はカナロコ報道記事・令和8年度別紙1の前年度列と一致する(募集39,395・志願46,104・倍率1.17)', () => {
    const r7 = KANAGAWA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(39395);
    expect(r7.grandTotal.applicants).toBe(46104);
    expect(r7.grandTotal.rate).toBeCloseTo(1.17, 2);
    expect(r7.grandTotal.schoolCount).toBe(142);
  });
});
