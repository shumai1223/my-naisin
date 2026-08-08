import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { IBARAKI_COMPETITION_RATES } from '../ibaraki';

/**
 * Y-6 DoD検証（茨城県・11県目・全日制完全達成）。
 */
describe('茨城県 倍率パイプラインα（Y-6・全日制85校149レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = IBARAKI_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「全日制計」行（quota16,647・applicants15,211・倍率0.91）と完全一致する', () => {
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

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(IBARAKI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('149レコード・85校が収録されている', () => {
    expect(r8.length).toBe(149);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(85);
  });

  it('学校名の行折返しで遅延して出現した学科(常陸大宮・水戸第三・波崎等)が正しく収録されている', () => {
    expect(r8.filter((r) => r.schoolName === '常陸大宮')).toHaveLength(3);
    expect(r8.filter((r) => r.schoolName === '水戸第三')).toHaveLength(3);
    expect(r8.filter((r) => r.schoolName === '波崎')).toHaveLength(4);
    expect(r8.filter((r) => r.schoolName === '水戸農業')).toHaveLength(7);
  });

  it('海洋高校(海洋技術・海洋食品・海洋産業の3学科)が那珂湊と誤帰属せず正しく収録されている（2026-08-07修正）', () => {
    expect(r8.filter((r) => r.schoolName === '海洋')).toHaveLength(3);
    expect(r8.filter((r) => r.schoolName === '那珂湊')).toHaveLength(2);
    expect(r8.some((r) => r.schoolName === '那珂湊' && r.department === '海洋技術')).toBe(false);
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが149件収録され、公式「全日制計」16,723/16,548と完全一致し、R8と学校名+学科名の組み合わせが完全一致する(学校再編なし)', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(149);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(16723);
    expect(sumApplicants).toBe(16548);

    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('掛-1(学校別×多年度・3年度目): 令和6年度(R6)分レコードが149件収録され、公式「全日制計」17,040/16,742と完全一致する。「つくばサイエンス」はR6時点では「科学技術」1学科(quota240)のみで募集しており、R7以降に「普通」「科学技術」の2学科(各quota120)へ再編されたことを確認した', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(149);
    const sumQuota = r6.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r6.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(17040);
    expect(sumApplicants).toBe(16742);

    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(86);

    const tsukubaScience = r6.filter((r) => r.schoolName === 'つくばサイエンス');
    expect(tsukubaScience).toEqual([
      { schoolName: 'つくばサイエンス', department: '科学技術', quota: 240, finalApplicants: 68, finalRate: 0.28, fiscalYear: '令和6年度（2024年度）' },
    ]);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of IBARAKI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/kyoiku\.pref\.ibaraki\.jp\//);
    }
  });
});
