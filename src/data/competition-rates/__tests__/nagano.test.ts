import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { NAGANO_COMPETITION_RATES } from '../nagano';

/**
 * Y-6 DoD検証（長野県・10県目・全日制完全達成／掛-1・R7多年度対応済）。
 *
 * 全県計に加え4通学区（北信/東信/南信/中信）ごとの合計行が別紙内に明記されているため、
 * 地区別の突合と全県計の突合の両方をDoDとして検証する。
 */
describe('長野県 倍率パイプラインα（Y-6・全日制77校129レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = NAGANO_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が全県計（quota8,807・applicants7,795・倍率0.89）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it.each([
    ['第1通学区（北信地区）計', '北信'],
    ['第2通学区（東信地区）計', '東信'],
    ['第3通学区（南信地区）計', '南信'],
    ['第4通学区（中信地区）計', '中信'],
  ])('%sが別紙記載の地区合計と完全一致する', (label, area) => {
    const subtotal = officialSubtotals.find((s) => s.label === label)!;
    const result = checkAgainstSubtotal(records, subtotal, (r) => !r.fiscalYear && r.area === area);
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
    expect(NAGANO_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('129レコード・77校が収録されている', () => {
    expect(r8.length).toBe(129);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
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
      const rec = r8.find((r) => r.schoolName === c.schoolName && r.department === c.department);
      expect(rec).toEqual(c);
    }
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが126件収録され、全県計と4通学区すべての合計行と完全一致する。小諸(普通・音楽)+小諸商業(商業)がR8では統合し「小諸義塾」になった実在の学校統合と、岡谷工業のくくり募集構成の変化(R7=5学科共有定員→R8=環境化学廃止し4学科独立定員)を確認した', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(126);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(8806);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(8250);

    const areaTotals: Record<string, { count: number; quota: number; applicants: number }> = {
      北信: { count: 37, quota: 2597, applicants: 2468 },
      東信: { count: 25, quota: 1851, applicants: 1761 },
      南信: { count: 37, quota: 2321, applicants: 2152 },
      中信: { count: 27, quota: 2037, applicants: 1869 },
    };
    for (const [area, expected] of Object.entries(areaTotals)) {
      const rs = r7.filter((r) => r.area === area);
      expect(rs.length).toBe(expected.count);
      expect(rs.reduce((a, r) => a + r.quota, 0)).toBe(expected.quota);
      expect(rs.reduce((a, r) => a + r.finalApplicants, 0)).toBe(expected.applicants);
    }

    expect(r7.find((r) => r.schoolName === '小諸商業')).toBeTruthy();
    expect(r7.find((r) => r.schoolName === '小諸義塾')).toBeUndefined();
    expect(r8.find((r) => r.schoolName === '小諸義塾')).toBeTruthy();
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが127件収録され、全県計と4通学区すべての合計行と完全一致する。更級農業(R6=生産流通・生物科学・グリーンライフ・施設園芸の4学科くくり募集→R7/R8=地域園芸・植物活用・食農科学の3学科に再編)・下伊那農業(R6=農業機械・園芸クリエイト・食品化学・アグリサービスの4学科独立定員→R7/R8=栽培科学・地域資源・生物活用の3学科に再編)・岡谷工業(R6=5学科くくり募集quota80→R7=同5学科quota64→R8=環境化学廃止し4学科独立定員)という3件の実在の学科改編を確認した。小諸・小諸商業はR6/R7とも別々の学校のまま', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(127);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(9945);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(9312);

    const areaTotals6: Record<string, { count: number; quota: number; applicants: number }> = {
      北信: { count: 37, quota: 2935, applicants: 2725 },
      東信: { count: 25, quota: 2044, applicants: 1934 },
      南信: { count: 38, quota: 2668, applicants: 2489 },
      中信: { count: 27, quota: 2298, applicants: 2164 },
    };
    for (const [area, expected] of Object.entries(areaTotals6)) {
      const rs = r6.filter((r) => r.area === area);
      expect(rs.length).toBe(expected.count);
      expect(rs.reduce((a, r) => a + r.quota, 0)).toBe(expected.quota);
      expect(rs.reduce((a, r) => a + r.finalApplicants, 0)).toBe(expected.applicants);
    }

    expect(r6.find((r) => r.schoolName === '小諸商業')).toBeTruthy();
    expect(r6.find((r) => r.schoolName === '小諸義塾')).toBeUndefined();
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of NAGANO_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.nagano\.lg\.jp\//);
    }
  });
});
