import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { SAGA_COMPETITION_RATES } from '../saga';

/**
 * Y-6 DoD検証（佐賀県・19県目・全日制完全達成）。
 */
describe('佐賀県 倍率パイプラインα（Y-6・全日制32校71レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = SAGA_COMPETITION_RATES;

  it('全日制の全レコード合計が「合計」行（quota4,212・applicants4,191・倍率1.00）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
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

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(SAGA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('71レコード・32校が収録されている', () => {
    expect(records.length).toBe(71);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(32);
  });

  it('凡例記載の9組＋凡例漏れの1組(嬉野)を含むくくり募集10組が正しく収録されている', () => {
    const kukuriRecords = records.filter((r) => r.department.includes('くくり募集'));
    expect(kukuriRecords).toHaveLength(10);
    const ureshino = records.find((r) => r.schoolName === '嬉野' && r.department.includes('くくり募集'));
    expect(ureshino).toEqual({
      schoolName: '嬉野',
      department: '電気科・建築科（くくり募集）',
      quota: 25,
      finalApplicants: 20,
      finalRate: 0.8,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of SAGA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.saga\.lg\.jp\//);
    }
  });
});
