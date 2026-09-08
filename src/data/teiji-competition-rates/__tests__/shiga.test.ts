import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { SHIGA_TEIJI_COMPETITION_RATES } from '../shiga';

/**
 * T-Y11F §5順序#4 DoD検証（滋賀県・定時制課程7レコード・一般型選抜のみ）: 手入力した
 * 合計が、自己集計値（officialSubtotals）と一致することを機械的に突合する。全日制shiga.tsと
 * 同様、公式の「計②」は学校独自型選抜を含むため直接比較できず、除外した学校独自型選抜分
 * （quota12・applicants4）を差し引いた残差が一致することをコメントで検証済み。
 */
describe('滋賀県 定時制課程 倍率パイプライン（T-Y11F §5順序#4）', () => {
  const { records, officialSubtotals } = SHIGA_TEIJI_COMPETITION_RATES;

  it('取り込み件数は7レコード（7校・一般型選抜のみ）', () => {
    expect(records).toHaveLength(7);
  });

  it('学校数は7校', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(7);
  });

  it('全レコードの合計が自己集計値と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '一般型選抜のみ自己集計（定時制）');
    if (!subtotal) throw new Error('officialSubtotals に "一般型選抜のみ自己集計（定時制）" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(268);
    expect(sumRecords(records).finalApplicants).toBe(159);
  });

  it('公式「計②」280/163から自己集計268/159を差し引いた残差が学校独自型選抜分(12/4)と一致する', () => {
    const officialTotal = { quota: 280, finalApplicants: 163 };
    const selfTotal = sumRecords(records);
    expect(officialTotal.quota - selfTotal.quota).toBe(12);
    expect(officialTotal.finalApplicants - selfTotal.finalApplicants).toBe(4);
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
