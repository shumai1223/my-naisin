import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { TOKYO_TEIJI_COMPETITION_RATES } from '../tokyo';

/**
 * T-P1 P1-3 DoD検証（東京都・定時制/チャレンジスクール/在京外国人16校）: 手入力した各セクションの
 * 合計が、東京都教育委員会公表の「計」行（officialSubtotals）と一致することを機械的に突合する。
 */
describe('東京都 定時制課程・チャレンジスクール・在京外国人 倍率パイプライン（T-P1 P1-3）', () => {
  const { records, officialSubtotals } = TOKYO_TEIJI_COMPETITION_RATES;
  const findSubtotal = (label: string) => {
    const s = officialSubtotals.find((x) => x.label === label);
    if (!s) throw new Error(`officialSubtotals に "${label}" が見つかりません`);
    return s;
  };

  it('取り込み件数は16レコード（定時制単位制7 + チャレンジスクール等8 + 在京外国人1）', () => {
    expect(records).toHaveLength(16);
  });

  it('定時制課程（単位制の学校）7レコードの合計が公式「定時制課程単位制計」と一致する', () => {
    const teijiDepartments = new Set(['普通科', '普通科1〜4部', '情報科2・4部', '普通科1〜3部']);
    const result = checkAgainstSubtotal(records, findSubtotal('定時制課程単位制計'), (r) => teijiDepartments.has(r.department));
    expect(result.matches).toBe(true);
    expect(sumRecords(records.filter((r) => teijiDepartments.has(r.department))).schoolCount).toBe(7);
  });

  it('チャレンジスクール及びチャレンジ枠8レコードの合計が公式「チャレンジスクール及びチャレンジ枠 計」と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('チャレンジスクール及びチャレンジ枠 計'),
      (r) => r.department === '総合学科1〜3部' || r.department === '普通科1・2部（チャレンジ枠）'
    );
    expect(result.matches).toBe(true);
    expect(
      sumRecords(records.filter((r) => r.department === '総合学科1〜3部' || r.department === '普通科1・2部（チャレンジ枠）')).schoolCount
    ).toBe(8);
  });

  it('在京外国人生徒等対象入学者選抜（国際高校）1レコードが公式「計」と一致する', () => {
    const result = checkAgainstSubtotal(
      records,
      findSubtotal('在京外国人生徒等対象入学者選抜（国際高校）計'),
      (r) => r.schoolName === '国際'
    );
    expect(result.matches).toBe(true);
  });

  it('全16レコードの合計quota/applicantsが3セクションの公式計の合算と一致する（総検算）', () => {
    const totals = sumRecords(records);
    const expectedQuota = officialSubtotals.reduce((acc, s) => acc + s.quota, 0);
    const expectedApplicants = officialSubtotals.reduce((acc, s) => acc + s.finalApplicants, 0);
    expect(totals.quota).toBe(expectedQuota);
    expect(totals.finalApplicants).toBe(expectedApplicants);
  });

  it('quota/finalApplicants/finalRateはいずれも0より大きい（不変条件）', () => {
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
