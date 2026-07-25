import { checkAgainstSubtotal } from '@/lib/competition-rate';
import { AKITA_COMPETITION_RATES } from '../akita';

/**
 * Y-6 DoD検証（秋田県・31県目・全日制完全達成）。
 */
describe('秋田県 倍率パイプラインα（Y-6・全日制78レコードの完全収録テスト）', () => {
  const { records, officialSubtotals } = AKITA_COMPETITION_RATES;

  it('全レコード合計が「県合計」行（quota6,268・applicants5,237）と完全一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '県合計')!;
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが自前算出値（applicants/quotaの四捨五入）と整合する', () => {
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

  it('coverageがcompleteを示している（定時制のみ意図的にスコープ外）', () => {
    expect(AKITA_COMPETITION_RATES.coverage.status).toBe('complete');
  });

  it('78レコードが収録されている', () => {
    expect(records.length).toBe(78);
  });

  it('分校（大曲農業・太田分校/湯沢翔北・雄勝校）が親学校と区別できる名称で収録されている', () => {
    expect(records.find((r) => r.schoolName === '大曲農業(太田分校)')).toEqual({
      schoolName: '大曲農業(太田分校)',
      department: '普通科',
      quota: 35,
      finalApplicants: 6,
      finalRate: 0.17,
    });
    expect(records.find((r) => r.schoolName === '湯沢翔北(雄勝校)')).toEqual({
      schoolName: '湯沢翔北(雄勝校)',
      department: '普通科',
      quota: 40,
      finalApplicants: 11,
      finalRate: 0.28,
    });
  });

  it('sourcesが公式PDF URLを正しく記録している', () => {
    for (const s of AKITA_COMPETITION_RATES.sources) {
      expect(s.url).toMatch(/^https:\/\/www\.pref\.akita\.lg\.jp\//);
    }
  });
});
