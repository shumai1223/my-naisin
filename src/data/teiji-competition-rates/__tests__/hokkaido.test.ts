import { sumRecords } from '@/lib/competition-rate';
import { HOKKAIDO_TEIJI_COMPETITION_RATES } from '../hokkaido';

/**
 * T-P1 P1-3 DoD検証（北海道・石狩地区の定時制13校＋有朋単位制2レコード＋後志地区の定時制4校＝
 * coverage='partial'）: ページ内に公式「計」行が無いため、個票の機械集計値が自己検算どおりで
 * あることを検証する。北海道は15地域区分あるうち2区分のみ着手済みで、coverage.status===
 * 'partial'であることも明示的に検証する（次回セッションが誤って「完了」と誤認しないため）。
 */
describe('北海道 定時制・有朋単位制 倍率パイプライン（T-P1 P1-3・partial・石狩+後志地区のみ）', () => {
  const { records, coverage } = HOKKAIDO_TEIJI_COMPETITION_RATES;
  const yuho = records.filter((r) => r.department.includes('有朋'));
  const ishikariTeiji = records.filter(
    (r) => !r.department.includes('有朋') && ['小樽潮陵', '真狩', '留寿都', '小樽未来創造'].every((n) => r.schoolName !== n)
  );
  const shiribeshiTeiji = records.filter((r) => ['小樽潮陵', '真狩', '留寿都', '小樽未来創造'].includes(r.schoolName));

  it('coverage.statusはpartial（15地域区分中、石狩+後志の2区分のみ着手のため）', () => {
    expect(coverage.status).toBe('partial');
    expect(coverage.pendingDepartments.length).toBe(13);
  });

  it('取り込み件数は石狩定時制13レコード＋有朋単位制2レコード＋後志定時制4レコード=計19レコード', () => {
    expect(records).toHaveLength(19);
    expect(ishikariTeiji).toHaveLength(13);
    expect(yuho).toHaveLength(2);
    expect(shiribeshiTeiji).toHaveLength(4);
  });

  it('石狩定時制は10校・後志定時制は4校（複数学科を持つ学校は学科ごとに別レコード）', () => {
    expect(new Set(ishikariTeiji.map((r) => r.schoolName)).size).toBe(10);
    expect(new Set(shiribeshiTeiji.map((r) => r.schoolName)).size).toBe(4);
  });

  it('個票の機械集計値が自己検算値と一致する（公式「計」行が無いため）', () => {
    const ishikariSum = sumRecords(ishikariTeiji);
    expect(ishikariSum.quota).toBe(520);
    expect(ishikariSum.finalApplicants).toBe(184);

    const yuhoSum = sumRecords(yuho);
    expect(yuhoSum.quota).toBe(160);
    expect(yuhoSum.finalApplicants).toBe(36);

    const shiribeshiSum = sumRecords(shiribeshiTeiji);
    expect(shiribeshiSum.quota).toBe(160);
    expect(shiribeshiSum.finalApplicants).toBe(43);
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
