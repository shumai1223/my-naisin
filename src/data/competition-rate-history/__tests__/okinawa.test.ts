import { OKINAWA_COMPETITION_RATE_HISTORY } from '../okinawa';

/**
 * Λ-4（多年度アーカイブ・沖縄県）DoD検証: 令和7年度の「全日制のみ」合計行の数値を
 * 一次資料（沖縄県教育委員会PDF・総計から定時制6箇所を機械的に減算した値）で確認する。
 * 令和6〜3年度は2026-08-06に調査したが、教委公式サイトが直近2年度分しかPDFを残しておらず、
 * 報道記事では募集人員/志願者数の実数を確度高く確認できなかったため未収録（詳細は
 * worklog 2026-08-06 08:17参照）。
 */
describe('沖縄県 多年度アーカイブ（Λ-4・令和7年度のみ1年分・grand-total-only）', () => {
  it('1年度分（令和7年度）のみを収録している(令和6〜3年度は確度不足のため未収録と正直に記録)', () => {
    expect(OKINAWA_COMPETITION_RATE_HISTORY.years).toHaveLength(1);
    expect(OKINAWA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
    ]);
  });

  it('categoriesは空(学校別内訳は未収録と正直に記録)', () => {
    for (const y of OKINAWA_COMPETITION_RATE_HISTORY.years) {
      expect(y.categories).toHaveLength(0);
    }
  });

  it('令和7年度の合計は一次資料の総計から定時制6箇所を機械的に減算した値と一致する(募集人員14,157・志願者13,262・倍率0.94)', () => {
    const r7 = OKINAWA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(14157);
    expect(r7.grandTotal.applicants).toBe(13262);
    expect(r7.grandTotal.rate).toBeCloseTo(0.94, 2);
  });

  it('内部整合性: 志願者数÷募集人員が公表倍率とおおむね一致する', () => {
    for (const y of OKINAWA_COMPETITION_RATE_HISTORY.years) {
      const computed = y.grandTotal.applicants / y.grandTotal.quota;
      expect(computed).toBeCloseTo(y.grandTotal.rate, 2);
    }
  });
});
