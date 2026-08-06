import { NAGASAKI_COMPETITION_RATE_HISTORY } from '../nagasaki';

/**
 * 長崎県 多年度アーカイブ（Λ-4）DoD検証: 令和7〜令和3年度の全日制合計の数値を
 * 一次資料/リセモム記事の固定値で確認する。令和6年度以前は制度名が「後期選抜」
 * （令和7年度以降の「一般選抜」に相当）である点に注意。
 */
describe('長崎県 多年度アーカイブ（Λ-4・令和8/令和7/令和6/令和5/令和4/令和3の6年度分・grand-total-only）', () => {
  it('6年度分（令和8年度〜令和3年度）を収録している', () => {
    expect(NAGASAKI_COMPETITION_RATE_HISTORY.years).toHaveLength(6);
    expect(NAGASAKI_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
    ]);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of NAGASAKI_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和8年度の合計はリセモム確定記事と一致する(一般選抜・募集人員7,288・志願者数5,794・倍率0.80)', () => {
    const r8 = NAGASAKI_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(7288);
    expect(r8.grandTotal.applicants).toBe(5794);
    expect(r8.grandTotal.rate).toBeCloseTo(0.8, 2);
  });

  it('令和7年度の合計は一次資料と一致する(一般選抜・募集人員7,372・志願者数5,953・倍率0.81)', () => {
    const r7 = NAGASAKI_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(7372);
    expect(r7.grandTotal.applicants).toBe(5953);
    expect(r7.grandTotal.rate).toBeCloseTo(0.81, 2);
  });

  it('令和6年度の合計はリセモム記事と一致する(後期選抜・募集人員5,250・志願者数3,906・倍率0.74)', () => {
    const r6 = NAGASAKI_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(5250);
    expect(r6.grandTotal.applicants).toBe(3906);
    expect(r6.grandTotal.rate).toBeCloseTo(0.74, 2);
  });

  it('令和5年度の合計はリセモム記事と一致する(後期選抜・募集人員5,554・志願者数4,277・倍率0.77)', () => {
    const r5 = NAGASAKI_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(5554);
    expect(r5.grandTotal.applicants).toBe(4277);
    expect(r5.grandTotal.rate).toBeCloseTo(0.77, 2);
  });

  it('令和4年度の合計はリセモム記事と一致する(後期選抜・募集人員5,577・志願者数4,277・倍率0.77)', () => {
    const r4 = NAGASAKI_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(5577);
    expect(r4.grandTotal.applicants).toBe(4277);
    expect(r4.grandTotal.rate).toBeCloseTo(0.77, 2);
  });

  it('令和3年度の合計はリセモム記事と一致する(後期選抜・募集人員5,527・志願者数4,350・倍率0.79)', () => {
    const r3 = NAGASAKI_COMPETITION_RATE_HISTORY.years[5];
    expect(r3.grandTotal.quota).toBe(5527);
    expect(r3.grandTotal.applicants).toBe(4350);
    expect(r3.grandTotal.rate).toBeCloseTo(0.79, 2);
  });
});
