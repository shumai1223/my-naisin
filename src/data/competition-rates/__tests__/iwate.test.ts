import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { IWATE_COMPETITION_RATES } from '../iwate';

/**
 * Y-6 DoD検証（岩手県・33県目・全日制完全達成）。
 */
describe('岩手県 倍率パイプラインα（Y-6・全日制59校113レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = IWATE_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全レコード合計が「合計」行（quota8,215・applicants6,574）と完全一致する', () => {
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

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(IWATE_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('113レコード・59校が収録されている（資料が明記する「59校113学科」と一致）', () => {
    expect(r8.length).toBe(113);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(59);
  });

  it('連携型入学者選抜による調整済み募集定員（一関第一・普通理数科=定員200から連携型67を除いた133）が正しく収録されている', () => {
    expect(r8.find((r) => r.schoolName === '一関第一')).toEqual({
      schoolName: '一関第一',
      department: '普通・理数科',
      quota: 133,
      finalApplicants: 133,
      finalRate: 1.0,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが113件・59校収録され、公式「合計」8,382/6,684と完全一致し、R8と学校名+学科名の組み合わせが完全一致する(学校再編なし)', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(113);
    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(59);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(8382);
    expect(sumApplicants).toBe(6684);

    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが117件・61校収録され、公式「合計」7,862/6,281と完全一致する。R7比較の差分は盛岡南+不来方→南昌みらい・久慈工業+久慈東→久慈翔北の2件の実在の学校統合(2025年4月開校)のみで、それ以外の59校は学校名+学科名がR6/R7で完全一致する', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r6.length).toBe(117);
    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(61);
    const sumQuota = r6.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r6.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(7862);
    expect(sumApplicants).toBe(6281);

    const mergedSchools = new Set(['盛岡南', '不来方', '久慈工業', '久慈東']);
    const newSchools = new Set(['南昌みらい', '久慈翔北']);
    const r6Keys = new Set(
      r6.filter((r) => !mergedSchools.has(r.schoolName)).map((r) => `${r.schoolName}|${r.department}`)
    );
    const r7Keys = new Set(
      r7.filter((r) => !newSchools.has(r.schoolName)).map((r) => `${r.schoolName}|${r.department}`)
    );
    expect(r6Keys).toEqual(r7Keys);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of IWATE_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.iwate\.jp\//);
    }
  });
});
