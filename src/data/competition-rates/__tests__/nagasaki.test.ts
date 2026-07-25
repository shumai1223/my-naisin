import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { NAGASAKI_COMPETITION_RATES } from '../nagasaki';

/**
 * Y-6 DoD検証（長崎県・20県目・全日制完全達成）。
 */
describe('長崎県 倍率パイプラインα（Y-6・全日制55校116レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = NAGASAKI_COMPETITION_RATES;

  it('全日制の全レコード合計が「総計」行（quota7,288・applicants5,794・倍率0.80）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する（長崎県は倍率を小数第1位までしか公表しないため許容誤差を広めに取る）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.06);
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
    expect(NAGASAKI_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('116レコード・55校が収録されている', () => {
    expect(records.length).toBe(116);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(55);
  });

  it('注記(※5)で明記済みのくくり募集(長崎東)が正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '長崎東')).toEqual({
      schoolName: '長崎東',
      department: '普通・国際（くくり募集）',
      quota: 151,
      finalApplicants: 158,
      finalRate: 1,
    });
  });

  it('applicants=0の学科(宇久・対馬国際文化交流)も正しく収録されている(quota>0のため)', () => {
    expect(records.find((r) => r.schoolName === '宇久')).toEqual({
      schoolName: '宇久',
      department: '普通',
      quota: 39,
      finalApplicants: 0,
      finalRate: 0,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of NAGASAKI_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.nagasaki\.jp\//);
    }
  });
});
