import { KOCHI_COMPETITION_RATE_HISTORY } from '../kochi';

/**
 * 高知県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の全日制合計（県立計＋市立計）の
 * 数値を一次資料（高知県教育委員会のＡ日程等志願先変更後の状況）の固定値で確認する。
 */
describe('高知県 多年度アーカイブ（Λ-4・令和7/令和6/令和5の3年度分・grand-total-only）', () => {
  it('3年度分（令和7年度・令和6年度・令和5年度）を収録している', () => {
    expect(KOCHI_COMPETITION_RATE_HISTORY.years).toHaveLength(3);
    expect(KOCHI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of KOCHI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(募集定員4,949・第1志望者数3,399・志願率0.69)', () => {
    const r7 = KOCHI_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(4949);
    expect(r7.grandTotal.applicants).toBe(3399);
    expect(r7.grandTotal.rate).toBeCloseTo(0.69, 2);
  });

  it('令和6年度の合計は一次資料と一致する(募集定員4,924・第1志望者数3,543・志願率0.72)', () => {
    const r6 = KOCHI_COMPETITION_RATE_HISTORY.years[1];
    expect(r6.grandTotal.quota).toBe(4924);
    expect(r6.grandTotal.applicants).toBe(3543);
    expect(r6.grandTotal.rate).toBeCloseTo(0.72, 2);
  });

  it('令和5年度の合計は一次資料と一致する(募集定員4,901・第1志望者数3,442・志願率0.70)', () => {
    const r5 = KOCHI_COMPETITION_RATE_HISTORY.years[2];
    expect(r5.grandTotal.quota).toBe(4901);
    expect(r5.grandTotal.applicants).toBe(3442);
    expect(r5.grandTotal.rate).toBeCloseTo(0.7, 2);
  });
});
