import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { KANAGAWA_COMPETITION_RATES } from '../kanagawa';

/**
 * Y-2 DoD検証（神奈川県・先行8県2県目）: 手入力した全レコードの合計が、
 * 神奈川県教育委員会公表の「一般募集共通選抜（志願変更締切時）」の全体値
 * （報道各社が伝える募集定員39,431人・志願者数43,821人・倍率1.11倍）と一致することを
 * 機械的に突合する。1件でもズレれば転記ミスの可能性が高い＝信頼の堀の生命線。
 */
describe('神奈川県 倍率パイプラインα（Y-2・全日制の突合テスト）', () => {
  const { records, officialSubtotals } = KANAGAWA_COMPETITION_RATES;
  const findSubtotal = (label: string) => {
    const s = officialSubtotals.find((x) => x.label === label);
    if (!s) throw new Error(`officialSubtotals に "${label}" が見つかりません`);
    return s;
  };

  it('普通科（共通選抜）県立87校+市立5校=92校の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('普通科（共通選抜）合計'), (r) => r.department === '普通科' && !r.fiscalYear);
    expect(result.matches).toBe(true);
    expect(result.actualQuota).toBeGreaterThan(0);
  });

  it('普通科（クリエイティブスクール）4校の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('普通科（クリエイティブスクール）合計'),
      (r) => r.department === '普通科（クリエイティブスクール）' && !r.fiscalYear
    );
    expect(result.matches).toBe(true);
  });

  it('専門学科（農業/工業/商業/水産/福祉/体育/美術/国際）の各合計が公式値と一致する', () => {
    const checks: Array<[string, string]> = [
      ['専門学科（農業）合計', '農業科'],
      ['専門学科（工業）合計', '工業科'],
      ['専門学科（商業）合計', '商業科'],
      ['専門学科（水産）計', '水産科'],
      ['専門学科（福祉）合計', '福祉科'],
      ['専門学科（体育）合計', '体育科'],
      ['専門学科（美術）合計', '美術科'],
      ['専門学科（国際）合計', '国際科'],
    ];
    for (const [label, department] of checks) {
      const result = checkAgainstSubtotal(records, findSubtotal(label), (r) => r.department === department && !r.fiscalYear);
      expect(result.matches).toBe(true);
    }
  });

  it('単位制普通科16校の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('単位制普通科合計'),
      (r) => (r.department === '普通科（単位制）' || r.department === '普通科（単位制・一般コース）') && !r.fiscalYear
    );
    expect(result.matches).toBe(true);
  });

  it('単位制総合学科（クリエイティブ除く）7校の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('単位制総合学科（クリエイティブ除く）合計'),
      (r) => r.department === '総合学科（単位制）' && !r.fiscalYear
    );
    expect(result.matches).toBe(true);
  });

  it('単位制専門学科（農業）2校の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('単位制専門学科（農業）合計'),
      (r) => r.department === '農業科（単位制）' && !r.fiscalYear
    );
    expect(result.matches).toBe(true);
  });

  it('単位制専門学科（国際関係）の合計が公式値と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('単位制専門学科（国際関係）計'),
      (r) => r.department === '国際科（単位制）' && !r.fiscalYear
    );
    expect(result.matches).toBe(true);
  });

  it('全レコードの合計が公式「一般募集共通選抜(全日制)+連携募集 全体」39,431/43,821と完全一致する（Y-2神奈川県の最終DoD）', () => {
    const result = checkAgainstSubtotal(records, findSubtotal('一般募集共通選抜（全日制）+連携募集 全体'), (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
    expect(result.actualQuota).toBe(39431);
    expect(result.actualApplicants).toBe(43821);
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが168件収録され(bessi3.xlsx sheet1〜3完結)、普通科(県立+市立)の合計が印字済み「合計」27,066/32,929と完全一致する', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(168);
    const futsuka = r7.filter((r) => r.department === '普通科');
    const sumQuota = futsuka.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = futsuka.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(27066);
    expect(sumApplicants).toBe(32929);
    const creative = r7.filter((r) => r.department === '普通科（クリエイティブスクール）');
    expect(creative.length).toBe(5);
    expect(creative.reduce((a, r) => a + r.quota, 0)).toBe(832);
    expect(creative.reduce((a, r) => a + r.finalApplicants, 0)).toBe(732);
    const senmon = r7.filter(
      (r) => r.department !== '普通科' && r.department !== '普通科（クリエイティブスクール）'
    );
    // sheet2(専門学科・全日制) 33件 + sheet3(単位制・連携募集を含む) 37件
    expect(senmon.length).toBe(70);
    expect(senmon.reduce((a, r) => a + r.quota, 0)).toBe(4356 + 7141);
    expect(senmon.reduce((a, r) => a + r.finalApplicants, 0)).toBe(4273 + 8141);
    const seen = new Set<string>();
    for (const r of r7) {
      const key = `${r.area}|${r.schoolName}|${r.department}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.01);
    }
  });

  it('coverageが全日制の完了を示している', () => {
    expect(KANAGAWA_COMPETITION_RATES.coverage.status).toBe('complete');
    expect(KANAGAWA_COMPETITION_RATES.coverage.pendingDepartments).toEqual([]);
  });

  it('sourcesが公式URLを正しく記録している', () => {
    for (const s of KANAGAWA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.kanagawa\.jp\//);
    }
  });
});
