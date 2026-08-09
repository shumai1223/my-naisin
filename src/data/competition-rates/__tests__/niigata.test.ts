import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { NIIGATA_COMPETITION_RATES } from '../niigata';

/**
 * Y-6 DoD検証（新潟県・27県目・全日制完全達成）。
 */
describe('新潟県 倍率パイプラインα（Y-6・全日制73校93レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = NIIGATA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「全日制合計」行（quota11,709・applicants11,679）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制合計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
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
    expect(NIIGATA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('93レコード・73校が収録されている', () => {
    expect(r8.length).toBe(93);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(73);
  });

  it('同一校が学科系統をまたいで複数レコードを持つケース（新発田南=普通/工業）が正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '新発田南' && r.department === '普通')).toEqual({
      schoolName: '新発田南',
      department: '普通',
      quota: 160,
      finalApplicants: 180,
      finalRate: 1.12,
    });
    expect(records.find((r) => r.schoolName === '新発田南' && r.department === '工業')).toEqual({
      schoolName: '新発田南',
      department: '工業',
      quota: 160,
      finalApplicants: 154,
      finalRate: 0.96,
    });
  });

  it('最高倍率(新潟・理数1.95)と最低倍率(新潟中央・音楽0.04)が正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '新潟' && r.department === '理数')).toEqual({
      schoolName: '新潟',
      department: '理数',
      quota: 80,
      finalApplicants: 156,
      finalRate: 1.95,
    });
    expect(records.find((r) => r.schoolName === '新潟中央' && r.department === '音楽')).toEqual({
      schoolName: '新潟中央',
      department: '音楽',
      quota: 21,
      finalApplicants: 1,
      finalRate: 0.04,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが92件収録され、「県立及び市立合計」(quota11,750・applicants11,923)と完全一致する', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(92);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(11750);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(11923);

    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(73);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of NIIGATA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/(kyouikucho\.nein\.ed\.jp|www\.pref\.niigata\.lg\.jp)\//);
    }
  });
});
