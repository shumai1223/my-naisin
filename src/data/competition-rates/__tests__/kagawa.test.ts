import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { KAGAWA_COMPETITION_RATES } from '../kagawa';

/**
 * Y-6 DoD検証（香川県・18県目・全日制完全達成）。
 */
describe('香川県 倍率パイプラインα（Y-6・全日制30校68レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = KAGAWA_COMPETITION_RATES;

  it('全日制の全レコード合計が「全日制合計」行（quota4,208・applicants4,296・倍率1.02）と完全一致する', () => {
    const grandTotal = officialSubtotals.find((s) => s.label === '全日制計')!;
    const result = checkAgainstSubtotal(records, grandTotal, () => true);
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

  it('coverageがcompleteを示している（定時制・連携型選抜等のみ意図的にスコープ外）', () => {
    expect(KAGAWA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('68レコード・30校が収録されている', () => {
    expect(records.length).toBe(68);
    const distinctSchools = new Set(records.map((r) => r.schoolName));
    expect(distinctSchools.size).toBe(30);
  });

  it('凡例(※印)で明記済みのくくり募集3組が正しく収録されている', () => {
    expect(records.find((r) => r.schoolName === '三本松')).toEqual({
      schoolName: '三本松',
      department: '普通・理数（くくり募集）',
      quota: 87,
      finalApplicants: 80,
      finalRate: 0.92,
    });
    expect(records.find((r) => r.schoolName === '農業経営')).toEqual({
      schoolName: '農業経営',
      department: '農業生産・環境園芸・動物科学・食農科学（くくり募集）',
      quota: 77,
      finalApplicants: 41,
      finalRate: 0.53,
    });
    expect(records.find((r) => r.schoolName === '観音寺第一')).toEqual({
      schoolName: '観音寺第一',
      department: '普通・理数（くくり募集）',
      quota: 150,
      finalApplicants: 134,
      finalRate: 0.89,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of KAGAWA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.kagawa\.lg\.jp\//);
    }
  });
});
