import { KANAGAWA_COMPETITION_RATE_HISTORY } from '../kanagawa';

/**
 * Λ-4（多年度アーカイブ・神奈川県）DoD検証: 全日制合計の数値が独立した二次情報源
 * （カナロコ報道記事・令和8年度別紙1の前年度列・令和7年度別紙1の前年度列・リセマム確定記事）と
 * 一致することを固定値で確認する。
 */
describe('神奈川県 多年度アーカイブ（Λ-4・令和7/令和6/令和5/令和4年度分・grand-total-only）', () => {
  it('4年度分（令和7年度・令和6年度・令和5年度・令和4年度）を収録している', () => {
    expect(KANAGAWA_COMPETITION_RATE_HISTORY.years).toHaveLength(4);
    expect(KANAGAWA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
    ]);
  });

  it('全年度でcategoriesは空(学科別内訳は原資料に存在しないため未収録と正直に記録)', () => {
    for (const y of KANAGAWA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全日制合計はカナロコ報道記事・令和8年度別紙1の前年度列と一致する(募集39,395・志願46,104・倍率1.17)', () => {
    const r7 = KANAGAWA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(39395);
    expect(r7.grandTotal.applicants).toBe(46104);
    expect(r7.grandTotal.rate).toBeCloseTo(1.17, 2);
    expect(r7.grandTotal.schoolCount).toBe(142);
  });

  it('令和6年度の全日制合計は令和7年度別紙1の前年度列(志願変更締切時)と一致する(募集39,947・志願47,330・倍率1.18)', () => {
    const r6 = KANAGAWA_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(39947);
    expect(r6.grandTotal.applicants).toBe(47330);
    expect(r6.grandTotal.rate).toBeCloseTo(1.18, 2);
    expect(r6.grandTotal.schoolCount).toBe(145);
  });

  it('令和5年度の全日制合計はリセマム確定記事と一致する(募集40,930・志願48,082・倍率1.17)', () => {
    const r5 = KANAGAWA_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(40930);
    expect(r5.grandTotal.applicants).toBe(48082);
    expect(r5.grandTotal.rate).toBeCloseTo(1.17, 2);
    expect(r5.grandTotal.schoolCount).toBe(146);
  });

  it('令和4年度の全日制合計はリセマム確定記事・よみうり進学メディアの2ソースと一致する(募集40,530・志願47,513・倍率1.17)', () => {
    const r4 = KANAGAWA_COMPETITION_RATE_HISTORY.years[3];
    expect(r4.grandTotal.quota).toBe(40530);
    expect(r4.grandTotal.applicants).toBe(47513);
    expect(r4.grandTotal.rate).toBeCloseTo(1.17, 2);
    expect(r4.grandTotal.schoolCount).toBe(146);
  });
});
