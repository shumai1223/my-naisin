import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { SAITAMA_TEIJI_COMPETITION_RATES } from '../saitama';

/**
 * T-Y11F §5順序#4 DoD検証（埼玉県・定時制課程31レコード）: 手入力した合計が、
 * 埼玉県教育委員会公表の「定時制 普通・専門・総合学科 計」（officialSubtotals）と
 * 一致することを機械的に突合する。
 */
describe('埼玉県 定時制課程 倍率パイプライン（T-Y11F §5順序#4）', () => {
  const { records, officialSubtotals } = SAITAMA_TEIJI_COMPETITION_RATES;

  it('取り込み件数は31レコード（22校・複数学科/部を持つ学校は別レコード）', () => {
    expect(records).toHaveLength(31);
  });

  it('学校数（（定）を含む名称のユニーク数）は23校（大宮商業・川越工業は2区分にまたがる）', () => {
    const schoolNames = new Set(records.map((r) => r.schoolName));
    expect(schoolNames.size).toBe(23);
  });

  it('全レコードの合計が公式「定時制 普通・専門・総合学科 計」と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label === '定時制 普通・専門・総合学科 計');
    if (!subtotal) throw new Error('officialSubtotals に "定時制 普通・専門・総合学科 計" が見つかりません');
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
    expect(sumRecords(records).quota).toBe(1920);
    expect(sumRecords(records).finalApplicants).toBe(1060);
  });

  it('普通科(定)18レコードの小計はquota840・applicants367', () => {
    const futsuu = records.filter((r) => r.department.startsWith('普通科'));
    expect(futsuu).toHaveLength(18);
    expect(sumRecords(futsuu).quota).toBe(840);
    expect(sumRecords(futsuu).finalApplicants).toBe(367);
  });

  it('総合学科(定)9レコードの小計はquota840・applicants645', () => {
    const sougou = records.filter((r) => r.department.startsWith('総合学科'));
    expect(sougou).toHaveLength(9);
    expect(sumRecords(sougou).quota).toBe(840);
    expect(sumRecords(sougou).finalApplicants).toBe(645);
  });

  it('quota/finalApplicants/finalRateはいずれも0以上（不変条件）', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      expect(r.finalRate).toBeGreaterThanOrEqual(0);
    }
  });

  it('finalRateは公表値どおりquota分の1桁目まで丸められている（±0.015の誤差内で自己整合）', () => {
    for (const r of records) {
      if (r.quota === 0) continue;
      const computed = r.finalApplicants / r.quota;
      expect(Math.abs(computed - r.finalRate)).toBeLessThan(0.015);
    }
  });
});
