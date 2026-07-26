import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { WAKAYAMA_COMPETITION_RATES } from '../wakayama';

/**
 * Y-6 DoD検証（和歌山県・保留県からの再挑戦で完全達成）。
 */
describe('和歌山県 倍率パイプラインα（Y-6・全日制32校57レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = WAKAYAMA_COMPETITION_RATES;

  it('全レコード合計が「合計」行（quota5,761・applicants4,891）と完全一致する', () => {
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

  it('coverageがcompleteを示している（内部進学専用学科・定時制は意図的にスコープ外）', () => {
    expect(WAKAYAMA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('57レコード・32校（分校4件を含む）が収録されている', () => {
    expect(records.length).toBe(57);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(32);
  });

  it('分校4校が親学校名(分校名)の命名規則で収録されている', () => {
    expect(records.find((r) => r.schoolName === '海南(美里分校)')).toBeDefined();
    expect(records.find((r) => r.schoolName === '有田中央(清水分校)')).toBeDefined();
    expect(records.find((r) => r.schoolName === '日高(中津分校)')).toBeDefined();
    expect(records.find((r) => r.schoolName === '南部(龍神分校)')).toBeDefined();
  });

  it('スポーツ推薦本出願者数を含むD+E合算が必要な学科（熊野総合学科・紀央館普通科）が正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '熊野' && r.department === '総合学科')).toEqual({
      schoolName: '熊野',
      department: '総合学科',
      quota: 160,
      finalApplicants: 170,
      finalRate: 1.06,
    });
    expect(records.find((r) => r.schoolName === '紀央館' && r.department === '普通科')).toEqual({
      schoolName: '紀央館',
      department: '普通科',
      quota: 118,
      finalApplicants: 103,
      finalRate: 0.87,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of WAKAYAMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.wakayama\.lg\.jp\//);
    }
  });
});
