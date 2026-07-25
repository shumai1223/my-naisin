import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { TOYAMA_COMPETITION_RATES } from '../toyama';

/**
 * Y-6 DoD検証（富山県・13県目・全日制完全達成）。
 */
describe('富山県 倍率パイプラインα（Y-6・全日制34校75レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = TOYAMA_COMPETITION_RATES;

  it('全日制の全レコード合計が「合計」行（quota5,020・applicants4,482・倍率0.89）と完全一致する', () => {
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

  it('coverageがcompleteを示している（定時制・通信制のみ意図的にスコープ外）', () => {
    expect(TOYAMA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('75レコード・34校が収録されている', () => {
    expect(records.length).toBe(75);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(34);
  });

  it('探究科学科(理数科学科のみ)・人文社会科学科の除外・括弧内数コースの除外が正しく反映されている', () => {
    expect(records.some((r) => r.schoolName === '富山' && r.department === '人文社会科学科')).toBe(false);
    expect(records.some((r) => r.schoolName === '富山北部' && r.department.includes('体育コース'))).toBe(false);
    expect(records.some((r) => r.schoolName === '富山東' && r.department.includes('自然科学コース'))).toBe(false);
    expect(records.some((r) => r.schoolName === '呉羽' && r.department.includes('音楽コース'))).toBe(false);
  });

  it('くくり募集（複数学科が募集人員を共有）が正しく収録されている', () => {
    const uozuKogyo = records.find((r) => r.schoolName === '魚津工業');
    expect(uozuKogyo).toEqual({
      schoolName: '魚津工業',
      department: '機械創造科・電気情報科・ＩＴ環境化学科（くくり募集）',
      quota: 85,
      finalApplicants: 41,
      finalRate: 0.48,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of TOYAMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.toyama\.jp\//);
    }
  });
});
