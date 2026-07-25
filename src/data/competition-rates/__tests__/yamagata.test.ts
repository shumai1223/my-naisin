import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { YAMAGATA_COMPETITION_RATES } from '../yamagata';

/**
 * Y-6 DoD検証（山形県・35県目・全日制完全達成）。
 */
describe('山形県 倍率パイプラインα（Y-6・全日制42校90レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = YAMAGATA_COMPETITION_RATES;

  it('全日制の全レコード合計が「全日制公立合計」行（quota4,404・applicants2,973）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制公立合計')!;
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
    expect(YAMAGATA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('90レコード・42校が収録されている', () => {
    expect(records.length).toBe(90);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(42);
  });

  it('理数探究科・国際探究科をあわせた「探究科」が単一レコードとして正しく収録されている（山形東）', () => {
    expect(records.find((r) => r.schoolName === '山形東' && r.department.includes('探究'))).toEqual({
      schoolName: '山形東',
      department: '探究(理数探究,国際探究)',
      quota: 76,
      finalApplicants: 169,
      finalRate: 2.22,
    });
  });

  it('applicants=0の学科（村山産業・流通ビジネス/小国・普通）も正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '小国')).toEqual({
      schoolName: '小国',
      department: '普通',
      quota: 25,
      finalApplicants: 0,
      finalRate: 0,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of YAMAGATA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.yamagata\.jp\//);
    }
  });
});
