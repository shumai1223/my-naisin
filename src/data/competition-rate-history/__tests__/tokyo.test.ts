import { checkYearTotal } from '@/lib/competition-rate-history';
import { TOKYO_COMPETITION_RATE_HISTORY } from '../tokyo';

/**
 * Λ-4パイロット（多年度アーカイブ・東京都）DoD検証: 各年度の区分別内訳を積み上げた合計が、
 * 一次ソース(総括表PDF)の「全日制合計」行と完全一致することを機械的に突合する。
 */
describe('東京都 多年度アーカイブ（Λ-4パイロット・令和7/令和6の2年度分）', () => {
  it('2年度分（令和7年度・令和6年度）を収録している', () => {
    expect(TOKYO_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(TOKYO_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和6年度（2024年度）',
    ]);
  });

  it.each(TOKYO_COMPETITION_RATE_HISTORY.years)('$fiscalYear: 全区分の合計が公式「全日制合計」と完全一致する', (snapshot) => {
    const result = checkYearTotal(snapshot, snapshot.grandTotal, () => true);
    expect(result.matches).toBe(true);
    expect(result.actualQuota).toBe(snapshot.grandTotal.quota);
    expect(result.actualApplicants).toBe(snapshot.grandTotal.applicants);
  });

  it('令和7年度の全日制合計は報道発表値(募集30,078・応募38,718・倍率1.29)と一致する', () => {
    const r7 = TOKYO_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.quota).toBe(30078);
    expect(r7.grandTotal.applicants).toBe(38718);
    expect(r7.grandTotal.rate).toBeCloseTo(1.29, 2);
  });

  it.each(TOKYO_COMPETITION_RATE_HISTORY.years)('$fiscalYear: 普通科5区分の合計が普通科合計相当(令和7=23,999/令和6=24,219)と一致する', (snapshot) => {
    const isR7 = snapshot.fiscalYear.startsWith('令和7');
    const generalLabels = new Set([
      '普通科(コース、単位制、島しょ、海外帰国生徒対象以外)計',
      '普通科(島しょ)計',
      'コース制計',
      '単位制計',
      '海外帰国生徒対象計',
    ]);
    const result = checkYearTotal(
      snapshot,
      { label: '普通科合計', quota: isR7 ? 23999 : 24219, applicants: isR7 ? 32177 : 35204, rate: 0 },
      (c) => generalLabels.has(c.label)
    );
    expect(result.matches).toBe(true);
  });

  it.each(TOKYO_COMPETITION_RATE_HISTORY.years)('$fiscalYear: 専門学科16学科の合計が専門学科合計相当(令和7=4,453/令和6=4,498)と一致する', (snapshot) => {
    const isR7 = snapshot.fiscalYear.startsWith('令和7');
    const excluded = new Set([
      '普通科(コース、単位制、島しょ、海外帰国生徒対象以外)計',
      '普通科(島しょ)計',
      'コース制計',
      '単位制計',
      '海外帰国生徒対象計',
      '総合学科',
    ]);
    const result = checkYearTotal(
      snapshot,
      { label: '専門学科合計', quota: isR7 ? 4453 : 4498, applicants: isR7 ? 4505 : 4658, rate: 0 },
      (c) => !excluded.has(c.label)
    );
    expect(result.matches).toBe(true);
  });
});
