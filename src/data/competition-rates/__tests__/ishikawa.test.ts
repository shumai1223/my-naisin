import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { ISHIKAWA_COMPETITION_RATES } from '../ishikawa';

/**
 * Y-6 DoD検証（石川県・14県目・全日制完全達成）。
 */
describe('石川県 倍率パイプラインα（Y-6・全日制40校70レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = ISHIKAWA_COMPETITION_RATES;

  it('全日制の全レコード合計が「全県合計」行（quota6,566・applicants6,076・倍率0.93）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全県合計')!;
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
    expect(ISHIKAWA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('70レコード・40校が収録されている', () => {
    expect(records.length).toBe(70);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(40);
  });

  it('併願制度(小松・金沢泉丘・七尾)が単一レコードに正しく合算されている', () => {
    const komatsu = records.find((r) => r.schoolName === '小松');
    expect(komatsu).toEqual({
      schoolName: '小松',
      department: '普通・理数（併願あり・合算）',
      quota: 320,
      finalApplicants: 377,
      finalRate: 1.18,
    });
    expect(records.filter((r) => r.schoolName === '金沢泉丘')).toHaveLength(1);
    expect(records.filter((r) => r.schoolName === '七尾')).toHaveLength(1);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of ISHIKAWA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.ishikawa\.lg\.jp\//);
    }
  });
});
