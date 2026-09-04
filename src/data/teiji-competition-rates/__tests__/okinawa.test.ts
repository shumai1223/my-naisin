import { sumRecords } from '@/lib/competition-rate';
import { OKINAWA_TEIJI_COMPETITION_RATES } from '../okinawa';

/**
 * T-P1 P1-3 DoD検証（沖縄県・定時制課程6校8レコード）。
 * ⚠️沖縄県は全日制と定時制が同一表に混在し、県全体の定時制限定の印字済み合計が
 * 資料に存在しないため、他県のような`officialSubtotals`突合テストは書けない
 * （`ops/S1-3-teiji-availability-ledger.md`参照）。ここでは自己集計値を固定する
 * 回帰テストとレコード単位の自己整合のみを検証する。
 */
describe('沖縄県 定時制課程 倍率パイプライン（T-P1 P1-3）', () => {
  const { records, officialSubtotals } = OKINAWA_TEIJI_COMPETITION_RATES;

  it('取り込み件数は8レコード（6校・複数学科/部を持つ学校は別レコード）', () => {
    expect(records).toHaveLength(8);
  });

  it('学校数は6校', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(6);
  });

  it('印字済みの県全体定時制合計が資料に存在しないためofficialSubtotalsは空', () => {
    expect(officialSubtotals).toHaveLength(0);
  });

  it('自己集計値を回帰テストとして固定する（quota400・applicants162・印字値との突合ではない）', () => {
    const totals = sumRecords(records);
    expect(totals.quota).toBe(400);
    expect(totals.finalApplicants).toBe(162);
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
      if (r.quota === 0) continue;
      const computed = r.finalApplicants / r.quota;
      expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.015);
    }
  });
});
