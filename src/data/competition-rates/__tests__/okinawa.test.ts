import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { OKINAWA_COMPETITION_RATES } from '../okinawa';

/**
 * Y-6 DoD検証（沖縄県・28県目・全日制完全達成）。
 *
 * ⚠️沖縄県は全日制・定時制が同一表に混在し公式の「全日制計」行が印字されていないため、
 * officialSubtotalsは「総計から定時制内訳を機械的に差し引いた自己算出値」を採用している
 * （okinawa.tsのファイル冒頭コメント参照）。
 */
describe('沖縄県 倍率パイプラインα（Y-6・全日制58校156レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = OKINAWA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「全日制計（自己算出）」行（quota14,084・applicants13,522）と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '全日制計（自己算出）')!;
    const result = checkAgainstSubtotal(records, subtotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが自前算出値（applicants/quotaの四捨五入）と整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.02);
    }
  });

  it('学校名+学科名+年度の重複が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}|${r.fiscalYear ?? ''}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes).toEqual([]);
  });

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(OKINAWA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('156レコード・58校が収録されている', () => {
    expect(r8.length).toBe(156);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(58);
  });

  it('定時制と全日制が併設する学校は全日制分のみ収録されている（那覇工業=全日5学科のみ・定時機械/電気は含まれない）', () => {
    const naha = r8.filter((r) => r.schoolName === '那覇工業');
    expect(naha.length).toBe(5);
    expect(naha.some((r) => r.department === '機械' && r.quota === 40 && r.finalApplicants === 9)).toBe(false);
  });

  it('併設型進学予定者を差し引いた募集人員（名護・フロンティア=定員80-併設型37=43）が正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '名護' && r.department === 'フロンティア')).toEqual({
      schoolName: '名護',
      department: 'フロンティア',
      quota: 43,
      finalApplicants: 51,
      finalRate: 1.19,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが159件収録され、総計から定時制6箇所を差し引いた自己算出値(quota14,157・applicants13,262)と完全一致する。学校名のキー集合はR8と完全一致(統廃合なし)。沖縄県は「実施年度」命名のため、R8相当の資料は県サイト上で「令和7年度実施」、R7相当は「令和6年度実施」と表示される点に注意', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(159);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(14157);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(13262);

    const r7Schools = new Set(r7.map((r) => r.schoolName));
    const r8Schools = new Set(r8.map((r) => r.schoolName));
    expect(r7Schools.size).toBe(58);
    expect([...r7Schools].every((s) => r8Schools.has(s))).toBe(true);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of OKINAWA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.okinawa\.(jp|lg\.jp)\//);
    }
  });
});
