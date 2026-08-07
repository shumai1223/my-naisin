import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { MIYAZAKI_COMPETITION_RATES } from '../miyazaki';

/**
 * Y-6 DoD検証（宮崎県・24県目・全日制完全達成）。
 */
describe('宮崎県 倍率パイプラインα（Y-6・全日制34校104レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = MIYAZAKI_COMPETITION_RATES;
  const r8 = records.filter((r) => !r.fiscalYear);

  it('全日制の全レコード合計が「全日制合計」行（quota3,873・applicants2,767）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制合計')!;
    const result = checkAgainstSubtotal(records, grandTotal, (r) => !r.fiscalYear);
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
    expect(MIYAZAKI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('104レコード・34校が収録されている', () => {
    expect(r8.length).toBe(104);
    const distinctSchools = new Set(r8.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(34);
  });

  it('applicants=0の学科（延岡星雲・フロンティア/高鍋農業・畜産科学/小林秀峰・福祉）も正しく収録されている', () => {
    expect(r8.find((r) => r.schoolName === '延岡星雲' && r.department === 'フロンティア')).toEqual({
      schoolName: '延岡星雲',
      department: 'フロンティア',
      quota: 19,
      finalApplicants: 0,
      finalRate: 0,
    });
    expect(r8.find((r) => r.schoolName === '高鍋農業' && r.department === '畜産科学')).toEqual({
      schoolName: '高鍋農業',
      department: '畜産科学',
      quota: 25,
      finalApplicants: 0,
      finalRate: 0,
    });
  });

  it('附属中内進生を含む理数科（宮崎西・都城泉ヶ丘）が調整済み募集人員で正しく収録されている', () => {
    expect(r8.find((r) => r.schoolName === '宮崎西' && r.department === '理数')).toEqual({
      schoolName: '宮崎西',
      department: '理数',
      quota: 30,
      finalApplicants: 48,
      finalRate: 1.6,
    });
    expect(r8.find((r) => r.schoolName === '都城泉ヶ丘' && r.department === '理数')).toEqual({
      schoolName: '都城泉ヶ丘',
      department: '理数',
      quota: 26,
      finalApplicants: 42,
      finalRate: 1.62,
    });
  });

  it('掛-1(学校別×多年度): 令和7年度(R7)分レコードが104件・34校収録され、公式「全日制合計」3,862/3,159と完全一致する。飯野の「普通」のみR8で「みらい探究」に改称(quotaは同一・誤読ではなく実際の学科名称変更)されているため、この1件を除けばR7/R8で学校名+学科名が完全一致する', () => {
    const r7 = records.filter((r) => r.fiscalYear === '令和7年度（2025年度）');
    expect(r7.length).toBe(104);
    const distinctSchools = new Set(r7.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(34);
    const sumQuota = r7.reduce((a, r) => a + r.quota, 0);
    const sumApplicants = r7.reduce((a, r) => a + r.finalApplicants, 0);
    expect(sumQuota).toBe(3862);
    expect(sumApplicants).toBe(3159);

    const renamed = new Set(['飯野|普通']);
    const r8Keys = new Set(r8.map((r) => `${r.schoolName}|${r.department}`));
    const r7Keys = new Set(r7.map((r) => `${r.schoolName}|${r.department}`).filter((k) => !renamed.has(k)));
    for (const key of r7Keys) {
      expect(r8Keys.has(key)).toBe(true);
    }
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of MIYAZAKI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.miyazaki\.lg\.jp\//);
    }
  });
});
