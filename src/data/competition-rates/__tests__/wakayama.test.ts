import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { WAKAYAMA_COMPETITION_RATES } from '../wakayama';

/**
 * Y-6 DoD検証（和歌山県・保留県からの再挑戦で完全達成）。
 */
describe('和歌山県 倍率パイプラインα（Y-6・全日制32校57レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = WAKAYAMA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全レコード合計が「合計」行（quota5,761・applicants4,891）と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '合計')!;
    const result = checkAgainstSubtotal(records, subtotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが自前算出値（applicants/quotaの四捨五入）と整合する', () => {
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

  it('coverageがcompleteを示している（内部進学専用学科・定時制は意図的にスコープ外）', () => {
    expect(WAKAYAMA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('57レコード・32校（分校4件を含む）が収録されている', () => {
    expect(r8.length).toBe(57);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(32);
  });

  it('分校4校が親学校名(分校名)の命名規則で収録されている', () => {
    expect(r8.find((r) => r.schoolName === '海南(美里分校)')).toBeDefined();
    expect(r8.find((r) => r.schoolName === '有田中央(清水分校)')).toBeDefined();
    expect(r8.find((r) => r.schoolName === '日高(中津分校)')).toBeDefined();
    expect(r8.find((r) => r.schoolName === '南部(龍神分校)')).toBeDefined();
  });

  it('スポーツ推薦本出願者数を含むD+E合算が必要な学科（熊野総合学科・紀央館普通科）が正しく収録されている', () => {
    expect(r8.find((r) => r.schoolName === '熊野' && r.department === '総合学科')).toEqual({
      schoolName: '熊野',
      department: '総合学科',
      quota: 160,
      finalApplicants: 170,
      finalRate: 1.06,
    });
    expect(r8.find((r) => r.schoolName === '紀央館' && r.department === '普通科')).toEqual({
      schoolName: '紀央館',
      department: '普通科',
      quota: 118,
      finalApplicants: 103,
      finalRate: 0.87,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが57件収録され、合計行(quota5,915・applicants5,107=D63+E5,044)と完全一致する。新宮・新翔がR7時点は別々の学校で、R8で統合し新「新宮」(3学科)になった実在の統合を確認した', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(57);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(5915);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(5107);

    expect(r7.some((r) => r.schoolName === '新翔')).toBe(true);
    expect(r8.some((r) => r.schoolName === '新翔')).toBe(false);
    expect(r8.filter((r) => r.schoolName === '新宮')).toHaveLength(3);
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが56件収録され、合計行(quota6,123・applicants5,432=D88+E5,344)と完全一致する。R7/R8より1件少ないのは新宮「学彩探究科」がR6時点でまだ存在しなかったため(R6は新宮=普通科1学科のみ・新翔=総合学科の別々の2校)。橋本の主学科もR6時点は「普通科」でR7/R8の「探究科」への改称前だった', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(56);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(6123);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(5432);

    expect(r6.some((r) => r.schoolName === '新翔')).toBe(true);
    expect(r6.filter((r) => r.schoolName === '新宮')).toHaveLength(1);
    expect(r6.find((r) => r.schoolName === '橋本')).toEqual({
      schoolName: '橋本',
      department: '普通科',
      quota: 160,
      finalApplicants: 161,
      finalRate: 1.01,
      fiscalYear: '令和6年度（2024年度）',
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of WAKAYAMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.wakayama\.lg\.jp\//);
    }
  });
});
