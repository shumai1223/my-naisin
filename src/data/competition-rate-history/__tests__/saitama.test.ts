import { checkYearTotal } from '@/lib/competition-rate-history';
import { SAITAMA_COMPETITION_RATE_HISTORY } from '../saitama';

/**
 * Λ-4（多年度アーカイブ・埼玉県）DoD検証: 各年度の学科区分別内訳を積み上げた合計が、
 * 一次ソース(埼玉県教育委員会PDF)の「全日制 普通・専門・総合学科計」行と完全一致するかを
 * 機械的に突合する。埼玉県は当初、募集人員相当の公表値(入学許可予定者数)が見つからず
 * 見送っていたが、県公式サイトの学校別入学志願確定者数PDFから解決できた（2026-07-31）。
 */
describe('埼玉県 多年度アーカイブ（Λ-4・41県目・令和2〜令和8の7年度分・令和2/令和3のみgrand-total-only）', () => {
  it('7年度分（令和2・3・4・5・6・7・8年度）を収録している', () => {
    expect(SAITAMA_COMPETITION_RATE_HISTORY.years).toHaveLength(7);
    expect(SAITAMA_COMPETITION_RATE_HISTORY.years.map((y) => y.fiscalYear)).toEqual([
      '令和2年度（2020年度）',
      '令和3年度（2021年度）',
      '令和4年度（2022年度）',
      '令和5年度（2023年度）',
      '令和6年度（2024年度）',
      '令和7年度（2025年度）',
      '令和8年度（2026年度）',
    ]);
  });

  it('令和2年度の全日制合計はリセモム記事(教委発表引用)と一致する(入学許可予定者数36,880人・志願者数41,393人・倍率1.12倍)', () => {
    const r2 = SAITAMA_COMPETITION_RATE_HISTORY.years.find((y) => y.fiscalYear === '令和2年度（2020年度）')!;
    expect(r2.granularity).toBe('grand-total-only');
    expect(r2.categories).toHaveLength(0);
    expect(r2.grandTotal.quota).toBe(36880);
    expect(r2.grandTotal.applicants).toBe(41393);
    expect(r2.grandTotal.rate).toBeCloseTo(1.12, 2);
  });

  it('令和3年度の全日制合計はリセモム記事(教委発表引用)と一致する(入学許可予定者数36,040人・志願確定者数39,305人・倍率1.09倍)', () => {
    const r3 = SAITAMA_COMPETITION_RATE_HISTORY.years.find((y) => y.fiscalYear === '令和3年度（2021年度）')!;
    expect(r3.granularity).toBe('grand-total-only');
    expect(r3.categories).toHaveLength(0);
    expect(r3.grandTotal.quota).toBe(36040);
    expect(r3.grandTotal.applicants).toBe(39305);
    expect(r3.grandTotal.rate).toBeCloseTo(1.09, 2);
  });

  it.each(SAITAMA_COMPETITION_RATE_HISTORY.years.filter((y) => y.granularity === 'category-detail'))(
    '$fiscalYear: 全学科区分の合計が公式「全日制合計」と完全一致する',
    (snapshot) => {
      const result = checkYearTotal(snapshot, snapshot.grandTotal, () => true);
      expect(result.matches).toBe(true);
      expect(result.actualQuota).toBe(snapshot.grandTotal.quota);
      expect(result.actualApplicants).toBe(snapshot.grandTotal.applicants);
    }
  );

  it('令和7年度の全日制合計は報道発表値(志願確定者数38,587人・倍率1.10倍)と一致する', () => {
    const r7 = SAITAMA_COMPETITION_RATE_HISTORY.years.find((y) => y.fiscalYear === '令和7年度（2025年度）')!;
    expect(r7.grandTotal.applicants).toBe(38587);
    expect(r7.grandTotal.rate).toBeCloseTo(1.1, 2);
  });

  it('令和6年度の全日制合計は報道発表値(志願確定者数39,414人・倍率1.12倍)と一致する', () => {
    const r6 = SAITAMA_COMPETITION_RATE_HISTORY.years.find((y) => y.fiscalYear === '令和6年度（2024年度）')!;
    expect(r6.grandTotal.applicants).toBe(39414);
    expect(r6.grandTotal.rate).toBeCloseTo(1.12, 2);
  });

  it('令和4年度の全日制合計は一次資料と一致する(募集許可予定者数36,721人・志願確定者数40,265人・倍率1.10倍)', () => {
    const r4 = SAITAMA_COMPETITION_RATE_HISTORY.years.find((y) => y.fiscalYear === '令和4年度（2022年度）')!;
    expect(r4.grandTotal.quota).toBe(36721);
    expect(r4.grandTotal.applicants).toBe(40265);
    expect(r4.grandTotal.rate).toBeCloseTo(1.1, 2);
  });

  it('令和5年度の全日制合計は一次資料と一致する(志願確定者数39,921人・倍率1.11倍)', () => {
    const r5 = SAITAMA_COMPETITION_RATE_HISTORY.years.find((y) => y.fiscalYear === '令和5年度（2023年度）')!;
    expect(r5.grandTotal.quota).toBe(36002);
    expect(r5.grandTotal.applicants).toBe(39921);
    expect(r5.grandTotal.rate).toBeCloseTo(1.11, 2);
  });

  it.each(SAITAMA_COMPETITION_RATE_HISTORY.years.filter((y) => y.granularity === 'category-detail'))(
    '$fiscalYear: 普通科計を除いた専門学科15区分+総合学科の合計が専門学科計+総合学科計と一致する',
    (snapshot) => {
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
    }
  );
});
