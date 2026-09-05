import { sumRecords } from '@/lib/competition-rate';
import { HIROSHIMA_TEIJI_COMPETITION_RATES } from '../hiroshima';

/**
 * T-P1 P1-3 DoD検証（広島県・定時制14校20行中、一次選抜定員が実数公表の芦品まなび学園3レコードのみ収録）:
 * 「１学級」表記で定員が数値化できない17行はrecordsに含めず、pendingDepartmentsに正直に記録している
 * ことを検証する（Y-0憲法③捏造ゼロ）。
 */
describe('広島県 定時制 倍率パイプライン（T-P1 P1-3・partial）', () => {
  const { records, coverage } = HIROSHIMA_TEIJI_COMPETITION_RATES;

  it('coverage.statusはpartial（1学級表記の学校は定員を推測しないため）', () => {
    expect(coverage.status).toBe('partial');
  });

  it('取り込み件数は3レコード（芦品まなび学園・午前/午後/夜間）', () => {
    expect(records).toHaveLength(3);
    expect(new Set(records.map((r) => r.schoolName))).toEqual(new Set(['芦品まなび学園']));
  });

  it('「１学級」表記の17行はpendingDepartmentsに記録されている', () => {
    expect(coverage.pendingDepartments.length).toBe(16);
    expect(coverage.pendingDepartments.every((d) => d.includes('1学級'))).toBe(true);
  });

  it('個票の機械集計値は自己検算どおり(quota114・applicants50、公式「計」行が無いため)', () => {
    const sums = sumRecords(records);
    expect(sums.quota).toBe(114);
    expect(sums.finalApplicants).toBe(50);
  });

  it('quota/finalApplicants/finalRateはいずれも0以上（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(r.finalRate).toBeGreaterThanOrEqual(0);
    }
  });

  it('finalRateは公表値どおりquota分の1桁目まで丸められている（±0.01の誤差内で自己整合）', () => {
    for (const r of records) {
      const computed = r.finalApplicants / r.quota;
      expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.015);
    }
  });
});
