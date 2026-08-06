import { KAGOSHIMA_COMPETITION_RATE_HISTORY } from '../kagoshima';

/**
 * Λ-4（多年度アーカイブ・鹿児島県）DoD検証: 令和8・令和7・令和6・令和5年度の「全日制 合計」
 * （学力検査定員quota・最終出願者数applicants）を一次資料の固定値で確認する。
 */
describe('鹿児島県 多年度アーカイブ（Λ-4・令和8〜令和2の7年度分・grand-total-only）', () => {
  it('7年度分（令和8年度〜令和2年度）を収録している', () => {
    expect(KAGOSHIMA_COMPETITION_RATE_HISTORY.years).toHaveLength(7);
    expect(KAGOSHIMA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
      '令和5年度（2023年度）',
      '令和4年度（2022年度）',
      '令和3年度（2021年度）',
      '令和2年度（2020年度）',
    ]);
  });

  it('令和4年度はリセモム記事と一致する(学力検査定員11,260・出願者数9,187・倍率0.82)', () => {
    const r4 = KAGOSHIMA_COMPETITION_RATE_HISTORY.years[4];
    expect(r4.grandTotal.quota).toBe(11260);
    expect(r4.grandTotal.applicants).toBe(9187);
    expect(r4.grandTotal.rate).toBeCloseTo(0.82, 2);
  });

  it('令和8年度は一次資料と一致する(学力検査定員10,349・最終出願者数7,948・倍率0.77)', () => {
    const r8 = KAGOSHIMA_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(10349);
    expect(r8.grandTotal.applicants).toBe(7948);
    expect(r8.grandTotal.rate).toBeCloseTo(0.77, 2);
  });

  it('全年度でcategoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of KAGOSHIMA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度は一次資料と一致する(学力検査定員10,398・最終出願者数8,455・倍率0.81)', () => {
    const r7 = KAGOSHIMA_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(10398);
    expect(r7.grandTotal.applicants).toBe(8455);
    expect(r7.grandTotal.rate).toBeCloseTo(0.81, 2);
  });

  it('令和6年度は一次資料と一致する(学力検査定員10,957・最終出願者数9,205・倍率0.84)', () => {
    const r6 = KAGOSHIMA_COMPETITION_RATE_HISTORY.years[2];
    expect(r6.grandTotal.quota).toBe(10957);
    expect(r6.grandTotal.applicants).toBe(9205);
    expect(r6.grandTotal.rate).toBeCloseTo(0.84, 2);
  });

  it('令和5年度は一次資料と一致する(学力検査定員11,094・最終出願者数9,025・倍率0.81)', () => {
    const r5 = KAGOSHIMA_COMPETITION_RATE_HISTORY.years[3];
    expect(r5.grandTotal.quota).toBe(11094);
    expect(r5.grandTotal.applicants).toBe(9025);
    expect(r5.grandTotal.rate).toBeCloseTo(0.81, 2);
  });

  it('令和3年度は一次資料(Wayback Machine経由)と一致する(学力検査定員11,211・出願者数9,064・倍率0.81)', () => {
    const r3 = KAGOSHIMA_COMPETITION_RATE_HISTORY.years[5];
    expect(r3.grandTotal.quota).toBe(11211);
    expect(r3.grandTotal.applicants).toBe(9064);
    expect(r3.grandTotal.rate).toBeCloseTo(0.81, 2);
  });

  it('令和2年度はリセモム記事の「県立と市立の合計」と一致する(学力検査定員11,221・出願者数9,476・倍率0.84)', () => {
    const r2 = KAGOSHIMA_COMPETITION_RATE_HISTORY.years[6];
    expect(r2.grandTotal.quota).toBe(11221);
    expect(r2.grandTotal.applicants).toBe(9476);
    expect(r2.grandTotal.rate).toBeCloseTo(0.84, 2);
  });

  it('内部整合性: 全年度で志願者数÷募集人員が公表倍率とおおむね一致する', () => {
    for (const y of KAGOSHIMA_COMPETITION_RATE_HISTORY.years) {
      const computed = y.grandTotal.applicants / y.grandTotal.quota;
      expect(computed).toBeCloseTo(y.grandTotal.rate, 2);
    }
  });
});
