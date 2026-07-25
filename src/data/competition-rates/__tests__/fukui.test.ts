import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { FUKUI_COMPETITION_RATES } from '../fukui';

/**
 * Y-6 DoD検証（福井県・15県目・全日制完全達成）。
 */
describe('福井県 倍率パイプラインα（Y-6・全日制24校72レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = FUKUI_COMPETITION_RATES;

  it('全日制の全レコード合計が「合計」行（quota3,316・applicants3,428・倍率1.03）と完全一致する', () => {
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
    expect(FUKUI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('72レコード・24校が収録されている', () => {
    expect(records.length).toBe(72);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(24);
  });

  it('鯖江のくくり募集2組(画像確認で解決)が正しく収録されている', () => {
    const sports = records.find((r) => r.schoolName === '鯖江' && r.department.includes('スポーツ・健康福祉'));
    expect(sports).toEqual({
      schoolName: '鯖江',
      department: '普通（スポーツ・健康福祉くくり募集）',
      quota: 14,
      finalApplicants: 14,
      finalRate: 1.0,
    });
    const itArt = records.find((r) => r.schoolName === '鯖江' && r.department.includes('IT・アートデザイン'));
    expect(itArt).toEqual({
      schoolName: '鯖江',
      department: '普通（IT・アートデザインくくり募集）',
      quota: 26,
      finalApplicants: 29,
      finalRate: 1.12,
    });
  });

  it('高志中学校からの内部進学枠(探究創造※2)は対象外', () => {
    const koshiRecords = records.filter((r) => r.schoolName === '高志');
    expect(koshiRecords).toHaveLength(1);
    expect(koshiRecords[0].quota).toBe(143);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of FUKUI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.fukui\.lg\.jp\//);
    }
  });
});
