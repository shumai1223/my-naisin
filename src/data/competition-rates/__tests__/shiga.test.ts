import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { SHIGA_COMPETITION_RATES } from '../shiga';

/**
 * Y-6 DoD検証（滋賀県・保留県からの再挑戦で完全達成）。
 *
 * 注意: 資料に一般型選抜のみの印字済み「計」行が無いため、officialSubtotalsは自己集計値（回帰ガード）。
 * 独立検証は資料自身の「計①」（学校独自型＋一般型合算=募集人数9,230・確定出願者数12,201・倍率1.32）が
 * 外部二次情報（ベネッセ）の同一数値と一致することで代替した（shiga.tsのコメント参照）。
 */
describe('滋賀県 倍率パイプラインα（Y-6・全日制44校61レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = SHIGA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全レコード合計が自己集計値（quota6,016・applicants9,333）と一致する（回帰ガード）', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '一般型選抜のみ自己集計')!;
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

  it('coverageがcompleteを示している（学校独自型選抜・定時制は意図的にスコープ外）', () => {
    expect(SHIGA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('61レコード・44校が収録されている', () => {
    expect(r8.length).toBe(61);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(44);
  });

  it('「両方の学科」併願枠を含む5校が統合レコードとして収録されている', () => {
    for (const school of ['膳所', '草津東', '守山北', '高島', '米原']) {
      const rec = r8.find((r) => r.schoolName === school);
      expect(rec).toBeDefined();
      expect(rec!.department).toContain('両方の学科含む');
    }
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが62件収録され、旧制度の全日制「計①」行(quota6,253・applicants6,563)と完全一致する。R7は栗東を含む6校が「両方の学科」統合校だったが、R8では栗東の統合が解除され美術科が掲載されなくなったことを確認した', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(62);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(6253);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(6563);

    const rittoR7 = r7.find((r) => r.schoolName === '栗東');
    expect(rittoR7?.department).toContain('美術');
    const rittoR8 = r8.find((r) => r.schoolName === '栗東');
    expect(rittoR8?.department).toBe('普通');
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが61件・44校収録され、全日制「計①」行(quota6,369・applicants6,727・倍率1.06)と完全一致する。R6は「両方の学科」統合校が膳所・草津東・栗東・米原・高島の5校のみで、守山北はR6時点では「普通」単独学科(みらい共創との統合はR7から)、伊香も「普通」単独(森の探究はR7で新設)だったことを確認した', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r6.length).toBe(61);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(6369);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(6727);

    const distinctSchools6 = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools6.size).toBe(44);

    const moriyamakitaR6 = r6.find((r) => r.schoolName === '守山北');
    expect(moriyamakitaR6?.department).toBe('普通');
    const moriyamakitaR7 = r7.find((r) => r.schoolName === '守山北');
    expect(moriyamakitaR7?.department).toContain('みらい共創');

    expect(r6.filter((r) => r.schoolName === '伊香')).toHaveLength(1);
    expect(r7.filter((r) => r.schoolName === '伊香')).toHaveLength(2);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of SHIGA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.shiga\.lg\.jp\//);
    }
  });
});
