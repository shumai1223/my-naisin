import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { NAGANO_COMPETITION_RATES } from '../nagano';

/**
 * Y-6 DoD検証（長野県・10県目・部分収録=第1通学区/北信地区のみ）。
 */
describe('長野県 倍率パイプラインα（Y-6・部分収録=第1通学区(北信地区)24校37レコード）', () => {
  const { records, officialSubtotals } = NAGANO_COMPETITION_RATES;

  it('第1通学区（北信地区）の合計が別紙記載のグランドトータル（quota2,623・applicants2,303・倍率0.88）と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '第1通学区（北信地区）計')!;
    const result = checkAgainstSubtotal(records, subtotal, () => true);
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

  it('coverageがpartialを示している（第1通学区のみ・残り3通学区は次回以降）', () => {
    expect(NAGANO_COMPETITION_RATES.coverage.status).toBe('partial');
  });

  it('37レコード・24校が収録されている', () => {
    expect(records.length).toBe(37);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(24);
  });

  it('くくり募集（複数学科・コースが募集人員を共有）が正しく収録されている', () => {
    const iiyama = records.find((r) => r.schoolName === '飯山' && r.department.includes('くくり募集'));
    expect(iiyama).toEqual({
      schoolName: '飯山',
      department: '自然科学探究・人文科学探究（くくり募集）',
      quota: 44,
      finalApplicants: 10,
      finalRate: 0.23,
    });
    const naganoShogyo = records.find((r) => r.schoolName === '長野商業');
    expect(naganoShogyo).toEqual({
      schoolName: '長野商業',
      department: '商業・会計（くくり募集）',
      quota: 80,
      finalApplicants: 82,
      finalRate: 1.03,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of NAGANO_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.nagano\.lg\.jp\//);
    }
  });
});
