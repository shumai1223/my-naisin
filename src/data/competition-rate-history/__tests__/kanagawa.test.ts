import { KANAGAWA_COMPETITION_RATE_HISTORY } from '../kanagawa';

/**
 * Λ-4（多年度アーカイブ・神奈川県）DoD検証: 全日制合計の数値が独立した二次情報源
 * （リセモム確定記事・各年度別紙1の前年度列・県公式PDF直接取得）と一致することを固定値で
 * 確認する。**令和7年度の値は2026-08-06に46,104→46,075へ再訂正済み**（2026-07-29の
 * 「誤読修正」が実際には誤りだった。詳細はkanagawa.tsの令和7年度コメント参照）。
 */
describe('神奈川県 多年度アーカイブ（Λ-4・令和8〜令和2年度分・grand-total-only）', () => {
  it('7年度分（令和8〜令和2年度）を収録している', () => {
    expect(KANAGAWA_COMPETITION_RATE_HISTORY.years).toHaveLength(7);
    expect(KANAGAWA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
      '令和2年度（2020年度）',
    ]);
  });

  it('令和8年度の全日制合計は県公式PDF(志願変更締切時)・リセモム確定記事の2ソースが一致する(募集39,431・志願43,821・倍率1.11)', () => {
    const r8 = KANAGAWA_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(39431);
    expect(r8.grandTotal.applicants).toBe(43821);
    expect(r8.grandTotal.rate).toBeCloseTo(1.11, 2);
    expect(r8.grandTotal.schoolCount).toBe(139);
  });

  it('全年度でcategoriesは空(学科別内訳は原資料に存在しないため未収録と正直に記録)', () => {
    for (const y of KANAGAWA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の全日制合計は令和7年度自身の公式PDF(志願変更締切時)と一致する(募集39,395・志願46,075・倍率1.17)', () => {
    const r7 = KANAGAWA_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(39395);
    expect(r7.grandTotal.applicants).toBe(46075);
    expect(r7.grandTotal.rate).toBeCloseTo(1.17, 2);
    expect(r7.grandTotal.schoolCount).toBe(142);
  });

  it('令和6年度の全日制合計は令和7年度別紙1の前年度列(志願変更締切時)と一致する(募集39,947・志願47,330・倍率1.18)', () => {
    const r6 = KANAGAWA_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(39947);
    expect(r6.grandTotal.applicants).toBe(47330);
    expect(r6.grandTotal.rate).toBeCloseTo(1.18, 2);
    expect(r6.grandTotal.schoolCount).toBe(145);
  });

  it('令和5年度の全日制合計はリセマム確定記事と一致する(募集40,930・志願48,082・倍率1.17)', () => {
    const r5 = KANAGAWA_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(40930);
    expect(r5.grandTotal.applicants).toBe(48082);
    expect(r5.grandTotal.rate).toBeCloseTo(1.17, 2);
    expect(r5.grandTotal.schoolCount).toBe(146);
  });

  it('令和4年度の全日制合計はリセマム確定記事・よみうり進学メディアの2ソースと一致する(募集40,530・志願47,513・倍率1.17)', () => {
    const r4 = KANAGAWA_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(40530);
    expect(r4.grandTotal.applicants).toBe(47513);
    expect(r4.grandTotal.rate).toBeCloseTo(1.17, 2);
    expect(r4.grandTotal.schoolCount).toBe(146);
  });

  it('令和3年度の全日制合計はリセマム確定記事・よみうり進学メディアの2ソースが完全一致する(募集39,730・志願46,714・倍率1.18)', () => {
    const r3 = KANAGAWA_COMPETITION_RATE_HISTORY.years[5];
    expect(r3.grandTotal.quota).toBe(39730);
    expect(r3.grandTotal.applicants).toBe(46714);
    expect(r3.grandTotal.rate).toBeCloseTo(1.18, 2);
  });

  it('令和2年度の全日制合計はリセマム確定記事と一致する(募集41,280・志願48,275・倍率1.17)', () => {
    const r2 = KANAGAWA_COMPETITION_RATE_HISTORY.years[6];
    expect(r2.grandTotal.quota).toBe(41280);
    expect(r2.grandTotal.applicants).toBe(48275);
    expect(r2.grandTotal.rate).toBeCloseTo(1.17, 2);
  });
});
