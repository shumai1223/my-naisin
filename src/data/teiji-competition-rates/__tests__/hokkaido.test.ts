import { sumRecords } from '@/lib/competition-rate';
import { HOKKAIDO_TEIJI_COMPETITION_RATES } from '../hokkaido';

/**
 * T-P1 P1-3 DoD検証（北海道・石狩地区の定時制13校＋有朋単位制2レコード＝coverage='partial'）:
 * ページ内に公式「計」行が無いため、個票の機械集計値が自己検算どおりであることを検証する。
 * 北海道は14管内あるうち石狩地区のみ着手済みで、coverage.status==='partial'であることも
 * 明示的に検証する（次回セッションが誤って「完了」と誤認しないため）。
 */
describe('北海道 定時制・有朋単位制 倍率パイプライン（T-P1 P1-3・partial・石狩地区のみ）', () => {
  const { records, coverage } = HOKKAIDO_TEIJI_COMPETITION_RATES;
  const teiji = records.filter((r) => !r.department.includes('有朋'));
  const yuho = records.filter((r) => r.department.includes('有朋'));

  it('coverage.statusはpartial（14管内中、石狩地区のみ着手のため）', () => {
    expect(coverage.status).toBe('partial');
    expect(coverage.pendingDepartments.length).toBe(14);
  });

  it('取り込み件数は定時制13レコード＋有朋単位制2レコード=計15レコード', () => {
    expect(records).toHaveLength(15);
    expect(teiji).toHaveLength(13);
    expect(yuho).toHaveLength(2);
  });

  it('定時制は10校（複数学科を持つ学校は学科ごとに別レコード）', () => {
    const schoolNames = new Set(teiji.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(10);
  });

  it('個票の機械集計値が自己検算値と一致する（公式「計」行が無いため）', () => {
    const teijiSum = sumRecords(teiji);
    expect(teijiSum.quota).toBe(520);
    expect(teijiSum.finalApplicants).toBe(184);

    const yuhoSum = sumRecords(yuho);
    expect(yuhoSum.quota).toBe(160);
    expect(yuhoSum.finalApplicants).toBe(36);
  });

  it('quota/finalApplicants/finalRateはいずれも0以上（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(r.finalRate).toBeGreaterThanOrEqual(0);
    }
  });

  it('finalRateはfinalApplicants/quotaの自前算出値と一致する（小数点2桁丸め・±0.005の誤差内）', () => {
    for (const r of records) {
      const computed = r.finalApplicants / r.quota;
      expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.006);
    }
  });
});
