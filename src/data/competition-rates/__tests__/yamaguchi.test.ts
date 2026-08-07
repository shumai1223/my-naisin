import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { YAMAGUCHI_COMPETITION_RATES } from '../yamaguchi';

/**
 * Y-6 DoD検証（山口県・25県目・全日制完全達成）。
 *
 * ⚠️山口県は倍率を小数第1位までしか公表しないため、finalApplicants/quotaの生の計算値と
 * 印字済みfinalRateとの差が他県（許容誤差0.02）より大きく出る箇所が複数ある。ここでは
 * 許容誤差を0.06に緩めている（quota/finalApplicantsの転記精度はグランドトータル突合で別途保証済み）。
 */
describe('山口県 倍率パイプラインα（Y-6・全日制43校98レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = YAMAGUCHI_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「全日制計」行（quota4,893・applicants4,677）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが自前算出値（applicants/quota・小数第1位公表のため許容誤差0.06）と整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.06);
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
    expect(YAMAGUCHI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('98レコード・43校が収録されている', () => {
    expect(r8.length).toBe(98);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(43);
  });

  it('くくり募集の文理探究(岩国・山口・宇部・下関西・萩)が単一レコードとして正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '岩国' && r.department.includes('くくり募集'))).toEqual({
      schoolName: '岩国',
      department: '文理探究(人文探究・理数探究くくり募集)',
      quota: 49,
      finalApplicants: 45,
      finalRate: 0.9,
    });
  });

  it('徳山の文理探究は文・理数の独立2レコードとして収録されている（くくり募集ではない）', () => {
    expect(records.find((r) => r.schoolName === '徳山' && r.department === '文理探究・文')).toEqual({
      schoolName: '徳山',
      department: '文理探究・文',
      quota: 18,
      finalApplicants: 17,
      finalRate: 0.9,
    });
    expect(records.find((r) => r.schoolName === '徳山' && r.department === '文理探究・理数')).toEqual({
      schoolName: '徳山',
      department: '文理探究・理数',
      quota: 28,
      finalApplicants: 59,
      finalRate: 2.1,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが104件収録され、「全日制計」(quota5,533・applicants5,612)と完全一致する。周防大島高校(普通37・地域創生25)はR7時点は県立だが令和8年4月に設置者が山口県立大学へ移管され山口県立大学附属周防大島高等学校に改称、柳井・柳井商工・熊毛南・田布施農工・熊毛北の5校は同時期に新設2校(柳井/田布施農工の校地を継承)へ再編統合された実在の変化により、柳井商工・熊毛南・熊毛北はR8には存在しない', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(104);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(5533);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(5612);

    expect(r7.some((r) => r.schoolName === '周防大島' && r.department === '普通')).toBe(true);
    expect(r8.some((r) => r.schoolName === '周防大島')).toBe(false);
    for (const merged of ['柳井商工', '熊毛南', '熊毛北']) {
      expect(r7.some((r) => r.schoolName === merged)).toBe(true);
      expect(r8.some((r) => r.schoolName === merged)).toBe(false);
    }

    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(47);
  });

  it('掛-1第2弾(3年度目): 令和6年度(R6)分レコードが105件収録され、「全日制」計行(quota5,584・applicants5,811)と完全一致する。田部高校(普通・総合生活)はR6時点は存在するがR7/R8には存在しない実在の統廃合、岩国・山口・徳山はR6時点はまだ文理探究くくりを導入前(普通+理数の2学科構成)だった', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(105);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(5584);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(5811);

    expect(r6.some((r) => r.schoolName === '田部')).toBe(true);
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.some((r) => r.schoolName === '田部')).toBe(false);
    expect(r8.some((r) => r.schoolName === '田部')).toBe(false);

    expect(r6.find((r) => r.schoolName === '岩国' && r.department === '理数')).toEqual({
      schoolName: '岩国',
      department: '理数',
      quota: 28,
      finalApplicants: 47,
      finalRate: 1.7,
      fiscalYear: '令和6年度（2024年度）',
    });

    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(48);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of YAMAGUCHI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.yamaguchi\.lg\.jp\//);
    }
  });
});
