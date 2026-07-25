import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { EHIME_COMPETITION_RATES } from '../ehime';

/**
 * Y-6 DoD検証（愛媛県・16県目・全日制完全達成）。
 */
describe('愛媛県 倍率パイプラインα（Y-6・全日制43校99レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = EHIME_COMPETITION_RATES;

  it('全日制の全レコード合計が「合計」行（quota8,370・applicants7,468・倍率0.89）と完全一致する', () => {
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
    expect(EHIME_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('99レコード・43校が収録されている', () => {
    expect(records.length).toBe(99);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(43);
  });

  it('注記で明記済みのくくり募集（今治西・宇和島東）が正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '今治西')).toEqual({
      schoolName: '今治西',
      department: '国・普（くくり募集）',
      quota: 280,
      finalApplicants: 265,
      finalRate: 0.95,
    });
    expect(records.find((r) => r.schoolName === '宇和島東' && r.department.includes('くくり募集'))).toEqual({
      schoolName: '宇和島東',
      department: '理・普（くくり募集）',
      quota: 160,
      finalApplicants: 144,
      finalRate: 0.9,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of EHIME_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/ehime-kyoiku\.esnet\.ed\.jp\//);
    }
  });
});
