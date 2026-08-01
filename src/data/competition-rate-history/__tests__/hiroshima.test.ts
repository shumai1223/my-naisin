import { checkYearTotal } from '@/lib/competition-rate-history';
import { HIROSHIMA_COMPETITION_RATE_HISTORY } from '../hiroshima';

/**
 * Λ-4（多年度アーカイブ・広島県）DoD検証: 各年度の学科系統別内訳を積み上げた合計が、
 * 一次ソース(志願状況PDF)の「小計」行(全日制本校)と完全一致することを機械的に突合する。
 */
describe('広島県 多年度アーカイブ（Λ-4・令和8〜令和7の2年度分・category-detail）', () => {
  it('2年度分（令和8・令和7年度）を収録している', () => {
    expect(HIROSHIMA_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(HIROSHIMA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和8年度（2026年度）',
      '令和7年度（2025年度）',
    ]);
  });

  it.each(HIROSHIMA_COMPETITION_RATE_HISTORY.years)('$fiscalYear: 学科系統別11区分の合計が公式「小計」行と完全一致する', (snapshot) => {
    const result = checkYearTotal(snapshot, snapshot.grandTotal, () => true);
    expect(result.matches).toBe(true);
    expect(result.actualQuota).toBe(snapshot.grandTotal.quota);
    expect(result.actualApplicants).toBe(snapshot.grandTotal.applicants);
  });

  it('令和8年度の全日制本校小計は一次資料と一致する(募集14,673・志願13,737・倍率0.94)', () => {
    const r8 = HIROSHIMA_COMPETITION_RATE_HISTORY.years[0];
    expect(r8.grandTotal.quota).toBe(14673);
    expect(r8.grandTotal.applicants).toBe(13737);
    expect(r8.grandTotal.rate).toBeCloseTo(0.94, 2);
  });

  it('令和7年度の全日制本校小計は一次資料と一致する(募集14,668・志願14,780・倍率1.01)', () => {
    const r7 = HIROSHIMA_COMPETITION_RATE_HISTORY.years[1];
    expect(r7.grandTotal.quota).toBe(14668);
    expect(r7.grandTotal.applicants).toBe(14780);
    expect(r7.grandTotal.rate).toBeCloseTo(1.01, 2);
  });
});
