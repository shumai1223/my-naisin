import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { OSAKA_TEIJI_COMPETITION_RATES } from '../osaka';

/**
 * T-Y11F §5順序#4 DoD検証（大阪府・定時制課程18レコード・3区分小計）: 手入力した合計が、
 * 大阪府教育委員会公表の「普通科計」「専門学科計」「総合学科計」（officialSubtotals）と
 * 一致することを機械的に突合する。
 */
describe('大阪府 定時制課程 倍率パイプライン（T-Y11F §5順序#4）', () => {
  const { records, officialSubtotals } = OSAKA_TEIJI_COMPETITION_RATES;

  it('取り込み件数は18レコード（18校）', () => {
    expect(records).toHaveLength(18);
  });

  it('学校数は18校（重複なし）', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(18);
  });

  it('普通科7校の合計が公式「普通科計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '普通科計');
    if (!subtotal) throw new Error('officialSubtotals に "普通科計" が見つかりません');
    const target = records.filter((r) => r.department === '普通');
    expect(target).toHaveLength(7);
    const result = checkAgainstSubtotal(target, subtotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('専門学科2校の合計が公式「専門学科計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '専門学科計');
    if (!subtotal) throw new Error('officialSubtotals に "専門学科計" が見つかりません');
    const target = records.filter((r) => r.schoolName === '堺市立堺' || r.schoolName === '岸和田市立');
    expect(target).toHaveLength(2);
    const result = checkAgainstSubtotal(target, subtotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('総合学科9校の合計が公式「総合学科計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '総合学科計');
    if (!subtotal) throw new Error('officialSubtotals に "総合学科計" が見つかりません');
    const target = records.filter((r) => r.department === '総合学科');
    expect(target).toHaveLength(9);
    const result = checkAgainstSubtotal(target, subtotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('全レコードの合計はquota840・finalApplicants398（3区分小計の合算・原資料に単一総合計行はない）', () => {
    expect(sumRecords(records).quota).toBe(840);
    expect(sumRecords(records).finalApplicants).toBe(398);
  });

  it('quota/finalApplicants/finalRateはいずれも0以上（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(r.finalRate).toBeGreaterThanOrEqual(0);
    }
  });

  it('finalRateはfinalApplicants/quotaの自前算出値と一致する（小数第2位四捨五入・±0.01の誤差内）', () => {
    for (const r of records) {
      if (r.quota === 0) continue;
      const computed = r.finalApplicants / r.quota;
      expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.01);
    }
  });
});
