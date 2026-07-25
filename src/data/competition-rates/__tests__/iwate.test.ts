import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { IWATE_COMPETITION_RATES } from '../iwate';

/**
 * Y-6 DoD検証（岩手県・33県目・全日制完全達成）。
 */
describe('岩手県 倍率パイプラインα（Y-6・全日制59校113レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = IWATE_COMPETITION_RATES;

  it('全レコード合計が「合計」行（quota8,215・applicants6,574）と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '合計')!;
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

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(IWATE_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('113レコード・59校が収録されている（資料が明記する「59校113学科」と一致）', () => {
    expect(records.length).toBe(113);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(59);
  });

  it('連携型入学者選抜による調整済み募集定員（一関第一・普通理数科=定員200から連携型67を除いた133）が正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '一関第一')).toEqual({
      schoolName: '一関第一',
      department: '普通・理数科',
      quota: 133,
      finalApplicants: 133,
      finalRate: 1.0,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of IWATE_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.iwate\.jp\//);
    }
  });
});
