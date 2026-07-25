import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { NARA_COMPETITION_RATES } from '../nara';

/**
 * Y-6 DoD検証（奈良県・30県目・全日制完全達成）。
 */
describe('奈良県 倍率パイプラインα（Y-6・全日制29校71レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = NARA_COMPETITION_RATES;

  it('全レコード合計が「合計（第一出願期間）」行（quota6,896・applicants6,276）と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '合計（第一出願期間）')!;
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが自前算出値（applicants/quotaの四捨五入）と整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.02);
    }
  });

  it('学校名+学科名の重複が無い', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const r of records) {
      const key = `${r.schoolName}|${r.department}`;
      if (seen.has(key)) dupes.push(key);
      seen.add(key);
    }
    expect(dupes).toEqual([]);
  });

  it('coverageがcompleteを示している（第二出願期間・定時制・特別選抜は意図的にスコープ外）', () => {
    expect(NARA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('71レコード・29校が収録されている', () => {
    expect(records.length).toBe(71);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(29);
  });

  it('外部報道と一致する最高倍率（一条・普通1.51倍）・県内最多定員校の倍率（奈良・普通1.20倍/郡山・普通1.27倍）が正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '一条')).toEqual({
      schoolName: '一条',
      department: '普通',
      quota: 200,
      finalApplicants: 302,
      finalRate: 1.51,
    });
    expect(records.find((r) => r.schoolName === '奈良' && r.department === '普通')).toEqual({
      schoolName: '奈良',
      department: '普通',
      quota: 360,
      finalApplicants: 432,
      finalRate: 1.2,
    });
    expect(records.find((r) => r.schoolName === '郡山')).toEqual({
      schoolName: '郡山',
      department: '普通',
      quota: 360,
      finalApplicants: 456,
      finalRate: 1.27,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of NARA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.nara\.lg\.jp\//);
    }
  });
});
