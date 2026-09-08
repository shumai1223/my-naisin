import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { ISHIKAWA_TEIJI_COMPETITION_RATES } from '../ishikawa';

/**
 * T-Y11F §5順序#4 DoD検証（石川県・定時制課程10レコード・夜間制/昼間制の4段階集計）: 手入力した
 * 合計が、石川県教育委員会公表の学校別小計・区分別集計・総計（officialSubtotals）と一致することを
 * 機械的に突合する。
 */
describe('石川県 定時制課程 倍率パイプライン（T-Y11F §5順序#4）', () => {
  const { records, officialSubtotals } = ISHIKAWA_TEIJI_COMPETITION_RATES;

  it('取り込み件数は10レコード（6校・小松北と金沢中央は夜間部/午前部/午後部の3レコード）', () => {
    expect(records).toHaveLength(10);
  });

  it('学校数は6校', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(6);
  });

  it('小松北3レコードの合計が公式「小松北　小計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '小松北　小計');
    if (!subtotal) throw new Error('officialSubtotals に "小松北　小計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, (r) => r.schoolName === '小松北');
    expect(result.matches).toBe(true);
  });

  it('金沢中央3レコードの合計が公式「金沢中央　小計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '金沢中央　小計');
    if (!subtotal) throw new Error('officialSubtotals に "金沢中央　小計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, (r) => r.schoolName === '金沢中央');
    expect(result.matches).toBe(true);
  });

  it('夜間部レコードの合計が公式「夜間制」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '夜間制');
    if (!subtotal) throw new Error('officialSubtotals に "夜間制" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, (r) => r.department.includes('夜間部'));
    expect(result.matches).toBe(true);
  });

  it('午前部・午後部レコードの合計が公式「昼間制」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '昼間制');
    if (!subtotal) throw new Error('officialSubtotals に "昼間制" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, (r) => r.department.includes('午前部') || r.department.includes('午後部'));
    expect(result.matches).toBe(true);
  });

  it('全10レコードの合計が公式「総計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '総計');
    if (!subtotal) throw new Error('officialSubtotals に "総計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(480);
    expect(sumRecords(records).finalApplicants).toBe(236);
  });

  it('quota/finalApplicants/finalRateはいずれも0以上（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(r.finalRate).toBeGreaterThanOrEqual(0);
    }
  });

  it('finalRateは公表値どおりquota分の2桁目まで丸められている（±0.015の誤差内で自己整合）', () => {
    for (const r of records) {
      if (r.quota === 0) continue;
      const computed = r.finalApplicants / r.quota;
      expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.015);
    }
  });
});
