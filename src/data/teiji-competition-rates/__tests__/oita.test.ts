import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { OITA_TEIJI_COMPETITION_RATES } from '../oita';

/**
 * T-Y11F §5順序#4 DoD検証（大分県・定時制課程9レコード・学校別3小計＋合計の4段階）: 手入力した
 * 合計が、大分県教育委員会公表の学校別「計」・「県立高校定時制課程合計」（officialSubtotals）と
 * 一致することを機械的に突合する。
 */
describe('大分県 定時制課程 倍率パイプライン（T-Y11F §5順序#4）', () => {
  const { records, officialSubtotals } = OITA_TEIJI_COMPETITION_RATES;

  it('取り込み件数は9レコード（4校）', () => {
    expect(records).toHaveLength(9);
  });

  it('学校数は4校', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(4);
  });

  it('中津東2レコードの合計が公式「中津東計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '中津東計');
    if (!subtotal) throw new Error('officialSubtotals に "中津東計" が見つかりません');
    const target = records.filter((r) => r.schoolName === '中津東');
    const result = checkAgainstSubtotal(target, subtotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('大分工業2レコードの合計が公式「大分工業計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '大分工業計');
    if (!subtotal) throw new Error('officialSubtotals に "大分工業計" が見つかりません');
    const target = records.filter((r) => r.schoolName === '大分工業');
    const result = checkAgainstSubtotal(target, subtotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('爽風館4レコードの合計が公式「爽風館計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '爽風館計');
    if (!subtotal) throw new Error('officialSubtotals に "爽風館計" が見つかりません');
    const target = records.filter((r) => r.schoolName === '爽風館');
    const result = checkAgainstSubtotal(target, subtotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('全レコードの合計が公式「合計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '合計');
    if (!subtotal) throw new Error('officialSubtotals に "合計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(344);
    expect(sumRecords(records).finalApplicants).toBe(65);
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
