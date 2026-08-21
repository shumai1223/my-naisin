import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { ISHIKAWA_COMPETITION_RATES } from '../ishikawa';

/**
 * Y-6 DoD検証（石川県・14県目・全日制完全達成／掛-1・R7多年度対応済）。
 */
describe('石川県 倍率パイプラインα（Y-6・全日制40校70レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = ISHIKAWA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「全県合計」行（quota6,566・applicants6,076・倍率0.93）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全県合計')!;
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

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(ISHIKAWA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('70レコード・40校が収録されている', () => {
    expect(r8.length).toBe(70);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(40);
  });

  it('併願制度(小松・金沢泉丘・七尾)が単一レコードに正しく合算されている', () => {
    const komatsu = r8.find((r) => r.schoolName === '小松');
    expect(komatsu).toEqual({
      schoolName: '小松',
      department: '普通・理数（併願あり・合算）',
      quota: 320,
      finalApplicants: 377,
      finalRate: 1.18,
    });
    expect(r8.filter((r) => r.schoolName === '金沢泉丘')).toHaveLength(1);
    expect(r8.filter((r) => r.schoolName === '七尾')).toHaveLength(1);
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが70件・40校収録され、公式「全県合計」6,666/6,409と完全一致する。併願制度3校(小松・金沢泉丘・七尾)もR7側で同型に合算収録し、学校名+学科名の集合がR8と完全に一致する（新設・廃止学科なし）', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(70);
    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(40);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(6666);
    expect(sumApplicants).toBe(6409);

    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが70件・40校収録され、公式「全県合計」6,775/6,650と完全一致する。併願制度3校(小松・金沢泉丘・七尾)もR6側で同型に合算収録し、学校名+学科名の集合がR7と完全に一致する（新設・廃止学科なし）', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r6.length).toBe(70);
    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(40);
    const sumQuota = r6.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r6.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(6775);
    expect(sumApplicants).toBe(6650);

    const r6Keys = new Set(r6.map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`));
    expect(r6Keys).toEqual(r7Keys);
  });

  it('掛-1(学校別×多年度): 令和5年度(R5)分レコードが70件・40校収録され、公式「全県合計」7,003/7,067と完全一致する。併願制度3校(小松・金沢泉丘・七尾)もR5側で同型に合算収録し、学校名+学科名の集合がR6と完全に一致する（新設・廃止・改称なし）', () => {
    const r5 = records.filter((r) => r.fiscalYear === '令和5年度（2023年度）');
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r5.length).toBe(70);
    const distinctSchools = new Set(r5.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(40);
    const sumQuota = r5.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r5.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(7003);
    expect(sumApplicants).toBe(7067);

    const r5Keys = new Set(r5.map((r) => `${r.schoolName}|${r.department}`));
    const r6Keys = new Set(r6.map((r) => `${r.schoolName}|${r.department}`));
    expect(r5Keys).toEqual(r6Keys);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of ISHIKAWA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.ishikawa\.lg\.jp\//);
    }
  });
});
