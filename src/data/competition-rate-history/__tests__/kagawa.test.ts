import { KAGAWA_COMPETITION_RATE_HISTORY } from '../kagawa';

/**
 * 香川県 多年度アーカイブ（Λ-4）DoD検証: 令和7・令和6年度の全日制課程合計の数値を
 * リセモム記事（教委発表の引用）の固定値で確認する。
 */
describe('香川県 多年度アーカイブ（Λ-4・令和8〜令和3の6年度分・grand-total-only）', () => {
  it('6年度分（令和8年度〜令和3年度）を収録している', () => {
    expect(KAGAWA_COMPETITION_RATE_HISTORY.years).toHaveLength(6);
    expect(KAGAWA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
    ]);
  });

  it('令和8年度の合計はリセモム記事と一致する(定員4,208・出願者数4,296・倍率1.02)', () => {
    const r8 = KAGAWA_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(4208);
    expect(r8.grandTotal.applicants).toBe(4296);
    expect(r8.grandTotal.rate).toBeCloseTo(1.02, 2);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of KAGAWA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料と一致する(定員4,376・出願者数4,732・倍率1.08)', () => {
    const r7 = KAGAWA_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(4376);
    expect(r7.grandTotal.applicants).toBe(4732);
    expect(r7.grandTotal.rate).toBeCloseTo(1.08, 2);
  });

  it('令和6年度の合計は一次資料と一致する(定員4,553・出願者数5,056・倍率1.11)', () => {
    const r6 = KAGAWA_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(4553);
    expect(r6.grandTotal.applicants).toBe(5056);
    expect(r6.grandTotal.rate).toBeCloseTo(1.11, 2);
  });

  it('令和5年度の合計はリセモム記事と一致する(定員4,609・出願者数5,299・倍率1.15)', () => {
    const r5 = KAGAWA_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(4609);
    expect(r5.grandTotal.applicants).toBe(5299);
    expect(r5.grandTotal.rate).toBeCloseTo(1.15, 2);
  });

  it('令和4年度の合計はリセモム記事と一致する(定員4,907・出願者数5,538・倍率1.13)', () => {
    const r4 = KAGAWA_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(4907);
    expect(r4.grandTotal.applicants).toBe(5538);
    expect(r4.grandTotal.rate).toBeCloseTo(1.13, 2);
  });

  it('令和3年度の合計は教委公式PDF(Wayback Machine経由)と一致する(定員4,899・出願者数5,710・倍率1.17)', () => {
    const r3 = KAGAWA_COMPETITION_RATE_HISTORY.years[5];
    expect(r3.grandTotal.quota).toBe(4899);
    expect(r3.grandTotal.applicants).toBe(5710);
    expect(r3.grandTotal.rate).toBeCloseTo(1.17, 2);
  });
});
