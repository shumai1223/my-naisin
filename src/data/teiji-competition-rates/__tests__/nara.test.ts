import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { NARA_TEIJI_COMPETITION_RATES } from '../nara';

/**
 * T-Y11F §5順序#4 DoD検証（奈良県・定時制課程5レコード・県立/市立/合計の3段階）: 手入力した
 * 合計が、奈良県教育委員会公表の県立計・市立計・合計（officialSubtotals）と一致することを
 * 機械的に突合する。
 */
describe('奈良県 定時制課程 倍率パイプライン（T-Y11F §5順序#4）', () => {
  const { records, officialSubtotals } = NARA_TEIJI_COMPETITION_RATES;

  it('取り込み件数は5レコード（4校・大和中央は普通Ⅰ部/Ⅱ部の2レコード）', () => {
    expect(records).toHaveLength(5);
  });

  it('学校数は4校', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(4);
  });

  it('県立3校の合計が公式「県立計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '県立計');
    if (!subtotal) throw new Error('officialSubtotals に "県立計" が見つかりません');
    const prefectural = records.filter((r) => r.schoolName !== '西吉野農業');
    const result = checkAgainstSubtotal(prefectural, subtotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('市立1校の合計が公式「市立計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '市立計');
    if (!subtotal) throw new Error('officialSubtotals に "市立計" が見つかりません');
    const municipal = records.filter((r) => r.schoolName === '西吉野農業');
    const result = checkAgainstSubtotal(municipal, subtotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('全レコードの合計が公式「合計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '合計');
    if (!subtotal) throw new Error('officialSubtotals に "合計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(246);
    expect(sumRecords(records).finalApplicants).toBe(111);
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
