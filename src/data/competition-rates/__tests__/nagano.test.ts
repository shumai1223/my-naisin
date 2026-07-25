import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { NAGANO_COMPETITION_RATES } from '../nagano';

/**
 * Y-6 DoD検証（長野県・10県目・全日制完全達成）。
 *
 * 全県計に加え4通学区（北信/東信/南信/中信）ごとの合計行が別紙内に明記されているため、
 * 地区別の突合と全県計の突合の両方をDoDとして検証する。
 */
describe('長野県 倍率パイプラインα（Y-6・全日制77校129レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = NAGANO_COMPETITION_RATES;

  it('全日制の全レコード合計が全県計（quota8,807・applicants7,795・倍率0.89）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, () => true);
    expect(result.matches).toBe(true);
  });

  it.each([
    ['第1通学区（北信地区）計', '北信'],
    ['第2通学区（東信地区）計', '東信'],
    ['第3通学区（南信地区）計', '南信'],
    ['第4通学区（中信地区）計', '中信'],
  ])('%sが別紙記載の地区合計と完全一致する', (label, area) => {
    const subtotal = officialSubtotals.find((s) => s.label === label)!;
    const result = checkAgainstSubtotal(records, subtotal, (r) => r.area === area);
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
    expect(NAGANO_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('129レコード・77校が収録されている', () => {
    expect(records.length).toBe(129);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(77);
  });

  it('くくり募集（複数学科・コースが募集人員を共有）が正しく収録されている', () => {
    const cases: Array<{ schoolName: string; area: string; department: string; quota: number; finalApplicants: number; finalRate: number }> = [
      { schoolName: '飯山', area: '北信', department: '自然科学探究・人文科学探究（くくり募集）', quota: 44, finalApplicants: 10, finalRate: 0.23 },
      { schoolName: '長野商業', area: '北信', department: '商業・会計（くくり募集）', quota: 80, finalApplicants: 82, finalRate: 1.03 },
      {
        schoolName: '駒ケ根工業',
        area: '南信',
        department: '工業（機械・電気・情報技術）',
        quota: 48,
        finalApplicants: 43,
        finalRate: 0.9,
      },
      {
        schoolName: '松本県ケ丘',
        area: '中信',
        department: '自然探究・国際探究（くくり募集）',
        quota: 16,
        finalApplicants: 36,
        finalRate: 2.25,
      },
    ];
    for (const c of cases) {
      const rec = records.find((r) => r.schoolName === c.schoolName && r.department === c.department);
      expect(rec).toEqual(c);
    }
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of NAGANO_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.nagano\.lg\.jp\//);
    }
  });
});
