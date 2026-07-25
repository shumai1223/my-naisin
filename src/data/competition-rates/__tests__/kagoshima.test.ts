import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { KAGOSHIMA_COMPETITION_RATES } from '../kagoshima';

/**
 * Y-6 DoD検証（鹿児島県・26県目・全日制完全達成）。
 */
describe('鹿児島県 倍率パイプラインα（Y-6・全日制68校156レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = KAGOSHIMA_COMPETITION_RATES;

  it('全日制の全レコード合計が「全日制合計」行（quota10,349・applicants7,948）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制合計')!;
    const result = checkAgainstSubtotal(records, grandTotal, () => true);
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

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(KAGOSHIMA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('156レコード・68校が収録されている', () => {
    expect(records.length).toBe(156);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(68);
  });

  it('applicants=0の学科（野田女子・衛生看護/与論・普通）も正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '野田女子' && r.department === '衛生看護')).toEqual({
      schoolName: '野田女子',
      department: '衛生看護',
      quota: 40,
      finalApplicants: 0,
      finalRate: 0,
    });
    expect(records.find((r) => r.schoolName === '与論')).toEqual({
      schoolName: '与論',
      department: '普通',
      quota: 45,
      finalApplicants: 0,
      finalRate: 0,
    });
  });

  it('離島の学区（熊毛・大島）の学校が正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '種子島' && r.department === '普通')).toEqual({
      schoolName: '種子島',
      department: '普通',
      quota: 80,
      finalApplicants: 53,
      finalRate: 0.66,
    });
    expect(records.find((r) => r.schoolName === '沖永良部' && r.department === '商業')).toEqual({
      schoolName: '沖永良部',
      department: '商業',
      quota: 39,
      finalApplicants: 33,
      finalRate: 0.85,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of KAGOSHIMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.kagoshima\.jp\//);
    }
  });
});
