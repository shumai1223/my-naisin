import { checkYearTotal } from '@/lib/competition-rate-history';
import { SAITAMA_COMPETITION_RATE_HISTORY } from '../saitama';

/**
 * Λ-4（多年度アーカイブ・埼玉県）DoD検証: 各年度の学科区分別内訳を積み上げた合計が、
 * 一次ソース(埼玉県教育委員会PDF)の「全日制 普通・専門・総合学科計」行と完全一致するかを
 * 機械的に突合する。埼玉県は当初、募集人員相当の公表値(入学許可予定者数)が見つからず
 * 見送っていたが、県公式サイトの学校別入学志願確定者数PDFから解決できた（2026-07-31）。
 */
describe('埼玉県 多年度アーカイブ（Λ-4・41県目・令和7〜令和8の2年度分）', () => {
  it('2年度分（令和7・令和8年度）を収録している', () => {
    expect(SAITAMA_COMPETITION_RATE_HISTORY.years).toHaveLength(2);
    expect(SAITAMA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和7年度（2025年度）',
      '令和8年度（2026年度）',
    ]);
  });

  it.each(SAITAMA_COMPETITION_RATE_HISTORY.years)('$fiscalYear: 全学科区分の合計が公式「全日制合計」と完全一致する', (snapshot) => {
    const result = checkYearTotal(snapshot, snapshot.grandTotal, () => true);
    expect(result.matches).toBe(true);
    expect(result.actualQuota).toBe(snapshot.grandTotal.quota);
    expect(result.actualApplicants).toBe(snapshot.grandTotal.applicants);
  });

  it('令和7年度の全日制合計は報道発表値(志願確定者数38,587人・倍率1.10倍)と一致する', () => {
    const r7 = SAITAMA_COMPETITION_RATE_HISTORY.years[0];
    expect(r7.grandTotal.applicants).toBe(38587);
    expect(r7.grandTotal.rate).toBeCloseTo(1.1, 2);
  });

  it.each(SAITAMA_COMPETITION_RATE_HISTORY.years)('$fiscalYear: 普通科計を除いた専門学科15区分+総合学科の合計が専門学科計+総合学科計と一致する', (snapshot) => {
    const result = checkYearTotal(
      snapshot,
      { label: '専門学科+総合学科', quota: 0, applicants: 0, rate: 0 },
      (c) => c.label !== '普通科計'
    );
    const nonGeneral = snapshot.categories.filter((c) => c.label !== '普通科計');
    const expectedQuota = nonGeneral.reduce((a, c) => a + c.quota, 0);
    const expectedApplicants = nonGeneral.reduce((a, c) => a + c.applicants, 0);
    expect(result.actualQuota).toBe(expectedQuota);
    expect(result.actualApplicants).toBe(expectedApplicants);
    expect(snapshot.grandTotal.quota - snapshot.categories.find((c) => c.label === '普通科計')!.quota).toBe(expectedQuota);
  });
});
