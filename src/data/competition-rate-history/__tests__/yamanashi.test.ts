import { YAMANASHI_COMPETITION_RATE_HISTORY } from '../yamanashi';

/**
 * 山梨県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の全日制後期募集（26校48学科）
 * 合計の数値をリセモム記事（教委発表の引用）の固定値で確認する。
 */
describe('山梨県 多年度アーカイブ（Λ-4・令和7/令和6/令和5/令和4/令和3/令和2の6年度分・grand-total-only）', () => {
  it('6年度分（令和7年度・令和6年度・令和5年度・令和4年度・令和3年度・令和2年度）を収録している', () => {
    expect(YAMANASHI_COMPETITION_RATE_HISTORY.years).toHaveLength(6);
    expect(YAMANASHI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
      '令和2年度（2020年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of YAMANASHI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(募集人員3,395・志願者数3,227・倍率0.95)', () => {
    const r7 = YAMANASHI_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(3395);
    expect(r7.grandTotal.applicants).toBe(3227);
    expect(r7.grandTotal.rate).toBeCloseTo(0.95, 2);
  });

  it('令和6年度の合計は一次資料と一致する(募集人員3,537・志願者数3,374・倍率0.95)', () => {
    const r6 = YAMANASHI_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(3537);
    expect(r6.grandTotal.applicants).toBe(3374);
    expect(r6.grandTotal.rate).toBeCloseTo(0.95, 2);
  });

  it('令和5年度の合計はリセモム記事(確定)と一致する(募集定員3,601・志願者数3,489・倍率0.96)', () => {
    const r5 = YAMANASHI_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(3601);
    expect(r5.grandTotal.applicants).toBe(3489);
    expect(r5.grandTotal.rate).toBeCloseTo(0.96, 2);
  });

  it('令和4年度の合計はリセモム記事(確定)と一致する(募集人員3,692・志願者数3,538・倍率0.95)', () => {
    const r4 = YAMANASHI_COMPETITION_RATE_HISTORY.years[3];
    expect(r4.grandTotal.quota).toBe(3692);
    expect(r4.grandTotal.applicants).toBe(3538);
    expect(r4.grandTotal.rate).toBeCloseTo(0.95, 2);
  });

  it('令和3年度の合計はリセモム記事(確定)と一致する(募集定員3,684・志願者数3,606・倍率0.98)', () => {
    const r3 = YAMANASHI_COMPETITION_RATE_HISTORY.years[4];
    expect(r3.grandTotal.quota).toBe(3684);
    expect(r3.grandTotal.applicants).toBe(3606);
    expect(r3.grandTotal.rate).toBeCloseTo(0.98, 2);
  });

  it('令和2年度の合計は一次資料と一致する(募集人員3,865・志願者数3,947・倍率1.02)', () => {
    const r2 = YAMANASHI_COMPETITION_RATE_HISTORY.years[5];
    expect(r2.grandTotal.quota).toBe(3865);
    expect(r2.grandTotal.applicants).toBe(3947);
    expect(r2.grandTotal.rate).toBeCloseTo(1.02, 2);
  });
});
