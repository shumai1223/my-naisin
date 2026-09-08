import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { WAKAYAMA_TEIJI_COMPETITION_RATES } from '../wakayama';

/**
 * T-Y11F §5順序#4 DoD検証（和歌山県・定時制課程15レコード＝県立13＋市立2）: 手入力した
 * 合計が、和歌山県教育委員会公表の「定時制 県立合計」「定時制 市立合計」（officialSubtotals）
 * と一致することを機械的に突合する。
 */
describe('和歌山県 定時制課程 倍率パイプライン（T-Y11F §5順序#4）', () => {
  const { records, officialSubtotals } = WAKAYAMA_TEIJI_COMPETITION_RATES;
  const isMunicipal = (r: { schoolName: string }) => r.schoolName.startsWith('和歌山市立');

  it('取り込み件数は15レコード（県立13・市立2）', () => {
    expect(records).toHaveLength(15);
    expect(records.filter(isMunicipal)).toHaveLength(2);
    expect(records.filter((r) => !isMunicipal(r))).toHaveLength(13);
  });

  it('学校数は8校（県立7・市立1）', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(8);
  });

  it('県立分の合計が公式「定時制 県立合計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '定時制 県立合計');
    if (!subtotal) throw new Error('officialSubtotals に "定時制 県立合計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, (r) => !isMunicipal(r));
    expect(result.matches).toBe(true);
    expect(sumRecords(records.filter((r) => !isMunicipal(r))).quota).toBe(570);
    expect(sumRecords(records.filter((r) => !isMunicipal(r))).finalApplicants).toBe(204);
  });

  it('市立分の合計が公式「定時制 市立合計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '定時制 市立合計');
    if (!subtotal) throw new Error('officialSubtotals に "定時制 市立合計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, isMunicipal);
    expect(result.matches).toBe(true);
    expect(sumRecords(records.filter(isMunicipal)).quota).toBe(80);
    expect(sumRecords(records.filter(isMunicipal)).finalApplicants).toBe(9);
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
