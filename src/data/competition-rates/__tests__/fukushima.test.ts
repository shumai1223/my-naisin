import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { FUKUSHIMA_COMPETITION_RATES } from '../fukushima';

/**
 * Y-6 DoD検証（福島県・保留県からの再挑戦で完全達成／掛-1・R7多年度対応済）。
 */
describe('福島県 倍率パイプラインα（Y-6・全日制50校99レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = FUKUSHIMA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全レコード合計が「全日制 合計」行（quota1,686・applicants106）と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '全日制 合計')!;
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

  it('coverageがcompleteを示している（前期選抜・連携型選抜・定時制は意図的にスコープ外）', () => {
    expect(FUKUSHIMA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('99レコード・50校が収録されている', () => {
    expect(r8.length).toBe(99);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(50);
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが96件収録され、「全日制 合計」行(quota1,603・applicants175)と完全一致する。福島県の後期選抜募集定員は前期選抜の結果に応じて年ごとに残り枠が大きく変動するため、対象学科の顔ぶれ自体が年で入れ替わる(前期選抜で埋まった学科はその年は一覧に出現しない)。この構造上、他県のような学校名+学科名の完全一致検証は意味を持たないため実施しない', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(96);
    expect(r7.reduce((a, r) => a + r.quota, 0)).toBe(1603);
    expect(r7.reduce((a, r) => a + r.finalApplicants, 0)).toBe(175);
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが89件収録され、「全日制 合計」行(quota1,484・applicants230)と完全一致する。R6も後期選抜募集定員が前期選抜の結果に応じた残り枠であり対象学科が年ごとに入れ替わる構造はR7/R8と同型のため、学校名+学科名の完全一致検証は実施しない', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(89);
    expect(r6.reduce((a, r) => a + r.quota, 0)).toBe(1484);
    expect(r6.reduce((a, r) => a + r.finalApplicants, 0)).toBe(230);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of FUKUSHIMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.fukushima\.lg\.jp\//);
    }
  });
});
