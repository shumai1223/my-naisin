import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { TOKUSHIMA_COMPETITION_RATES } from '../tokushima';

/**
 * Y-6 DoD検証（徳島県・17県目・全日制完全達成／掛-1・R7多年度対応済）。
 */
describe('徳島県 倍率パイプラインα（Y-6・全日制32校69レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = TOKUSHIMA_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「合計」行（quota4,165・applicants4,160・倍率1.00）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
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
    expect(TOKUSHIMA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('69レコード・32校が収録されている', () => {
    expect(r8.length).toBe(69);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(32);
  });

  it('徳島科学技術は6学科・阿南光は4学科（機械ロボットシステム/電気情報システム/都市環境システム/産業創造）・海部は3学科（普通/情報ビジネス/数理科学）が正しく収録されている（掛-1着手時に判明した2件の学校名誤帰属を訂正済み）', () => {
    expect(r8.filter((r) => r.schoolName === '徳島科学技術')).toHaveLength(6);
    expect(r8.filter((r) => r.schoolName === '阿南光')).toHaveLength(4);
    expect(r8.find((r) => r.schoolName === '阿南光' && r.department === '普通')).toBeUndefined();
    expect(r8.filter((r) => r.schoolName === '海部')).toHaveLength(3);
    expect(r8.find((r) => r.schoolName === '海部' && r.department === '普通')).toEqual({
      schoolName: '海部',
      department: '普通',
      quota: 30,
      finalApplicants: 25,
      finalRate: 0.83,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが69件・32校収録され、公式「合計」4,102/4,062と完全一致し、学校名+学科名の集合がR8と完全に一致する', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(69);
    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(32);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(4102);
    expect(sumApplicants).toBe(4062);

    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`));
    expect(r7Keys.size).toBe(r8Keys.size);
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('掛-1(学校別×多年度): 令和6年度(R6)分レコードが68件・32校収録され、公式「合計」4,211/4,232と完全一致する(名西・芸術(音楽)はR6時点で募集人員0のため69件でなく68件)', () => {
    const r6 = records.filter((r) => r.fiscalYear === '令和6年度（2024年度）');
    expect(r6.length).toBe(68);
    const distinctSchools = new Set(r6.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(32);
    const sumQuota = r6.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r6.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(4211);
    expect(sumApplicants).toBe(4232);

    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`));
    const r6Keys = new Set(r6.map((r) => `${r.schoolName}|${r.department}`));
    expect(r8Keys.size - r6Keys.size).toBe(1);
    for (const key of r6Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
    expect(r6Keys.has('名西|芸術（音楽）')).toBe(false);
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of TOKUSHIMA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/nyuushi\.tokushima-ec\.ed\.jp\//);
    }
  });
});
