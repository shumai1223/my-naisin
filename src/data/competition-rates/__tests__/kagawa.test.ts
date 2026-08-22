import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { KAGAWA_COMPETITION_RATES } from '../kagawa';

/**
 * Y-6 DoD検証（香川県・18県目・全日制完全達成）。
 */
describe('香川県 倍率パイプラインα（Y-6・全日制30校68レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = KAGAWA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「全日制合計」行（quota4,208・applicants4,296・倍率1.02）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
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

  it('coverageがcompleteを示している（定時制・連携型選抜等のみ意図的にスコープ外）', () => {
    expect(KAGAWA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('68レコード・30校が収録されている', () => {
    expect(r8.length).toBe(68);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(30);
  });

  it('凡例(※印)で明記済みのくくり募集3組が正しく収録されている', () => {
    expect(r8.find((r) => r.schoolName === '三本松')).toEqual({
      schoolName: '三本松',
      department: '普通・理数（くくり募集）',
      quota: 87,
      finalApplicants: 80,
      finalRate: 0.92,
    });
    expect(r8.find((r) => r.schoolName === '農業経営')).toEqual({
      schoolName: '農業経営',
      department: '農業生産・環境園芸・動物科学・食農科学（くくり募集）',
      quota: 77,
      finalApplicants: 41,
      finalRate: 0.53,
    });
    expect(r8.find((r) => r.schoolName === '観音寺第一')).toEqual({
      schoolName: '観音寺第一',
      department: '普通・理数（くくり募集）',
      quota: 150,
      finalApplicants: 134,
      finalRate: 0.89,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが68件・30校収録され、公式「全日制合計」4,376/4,732と完全一致し、R8と学校名+学科名の組み合わせが完全一致する(学校再編なし・くくり募集3組も同一)', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(68);
    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(30);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(4376);
    expect(sumApplicants).toBe(4732);

    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが68件・30校収録され、公式「全日制合計」4,553/5,056と完全一致し、R7と学校名+学科名の組み合わせが完全一致する(学校再編なし・くくり募集3組も同一)', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r6.length).toBe(68);
    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(30);
    const sumQuota = r6.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r6.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(4553);
    expect(sumApplicants).toBe(5056);

    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`));
    const r6Keys = new Set(r6.map((r) => `${r.schoolName}|${r.department}`));
    expect(r6Keys.size).toBe(r7Keys.size);
    for (const key of r6Keys) {
      expect(r7Keys.has(key)).toBe(true);
    }
  });

  it('掛-1(学校別×多年度): 令和5年度(R5)分レコードが68件・30校収録され、公式「全日制合計」4,609/5,299と完全一致し、R6と学校名+学科名の組み合わせが完全一致する(学校再編なし・くくり募集3組も同一)', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r5.length).toBe(68);
    const distinctSchools = new Set(r5.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(30);
    const sumQuota = r5.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r5.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(4609);
    expect(sumApplicants).toBe(5299);

    const r6Keys = new Set(r6.map((r) => `${r.schoolName}|${r.department}`));
    const r5Keys = new Set(r5.map((r) => `${r.schoolName}|${r.department}`));
    expect(r5Keys.size).toBe(r6Keys.size);
    for (const key of r5Keys) {
      expect(r6Keys.has(key)).toBe(true);
    }
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of KAGAWA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.kagawa\.lg\.jp\//);
    }
  });
});
