import { sumRecords, checkAgainstSubtotal } from '@/lib/competition-rate';
import { TOKYO_COMPETITION_RATES } from '../tokyo';

/**
 * Y-2 DoD検証（東京都・1県目の型化）: 手入力した107校の合計が、
 * 東京都教育委員会公表の「計」行（officialSubtotals）と一致することを機械的に突合する。
 * 1件でもズレれば転記ミスの可能性が高い＝信頼の堀の生命線。
 */
describe('東京都 倍率パイプラインα（Y-2・突合テスト）', () => {
  const { records, officialSubtotals } = TOKYO_COMPETITION_RATES;

  it('取り込み件数は107校（区部57+多摩部44+島しょ6）', () => {
    expect(records).toHaveLength(107);
  });

  it('区部57校の合計が公式「区部計」と一致する', () => {
    const TOKYO_23_WARDS = new Set([
      '千代田', '港', '新宿', '文京', '台東', '墨田', '江東', '品川', '目黒', '大田',
      '世田谷', '渋谷', '中野', '杉並', '豊島', '荒川', '板橋', '練馬', '足立', '葛飾', '江戸川',
    ]);
    const subtotal = officialSubtotals.find((s) => s.label === '区部計')!;
    const result = checkAgainstSubtotal(records, subtotal, (r) => TOKYO_23_WARDS.has(r.area ?? ''));
    expect(result.matches).toBe(true);
    expect(sumRecords(records.filter((r) => TOKYO_23_WARDS.has(r.area ?? ''))).schoolCount).toBe(57);
  });

  it('島しょ6校の合計が公式「島しょ計」と一致する', () => {
    const ISLAND_AREAS = new Set(['大島', '新島', '神津島', '三宅', '八丈', '小笠原']);
    const subtotal = officialSubtotals.find((s) => s.label === '島しょ計')!;
    const result = checkAgainstSubtotal(records, subtotal, (r) => ISLAND_AREAS.has(r.area ?? ''));
    expect(result.matches).toBe(true);
  });

  it('多摩部44校の合計が公式「多摩部計」と一致する（区部・島しょ以外の全件）', () => {
    const TOKYO_23_WARDS = new Set([
      '千代田', '港', '新宿', '文京', '台東', '墨田', '江東', '品川', '目黒', '大田',
      '世田谷', '渋谷', '中野', '杉並', '豊島', '荒川', '板橋', '練馬', '足立', '葛飾', '江戸川',
    ]);
    const ISLAND_AREAS = new Set(['大島', '新島', '神津島', '三宅', '八丈', '小笠原']);
    const subtotal = officialSubtotals.find((s) => s.label === '多摩部計')!;
    const result = checkAgainstSubtotal(
      records,
      subtotal,
      (r) => !TOKYO_23_WARDS.has(r.area ?? '') && !ISLAND_AREAS.has(r.area ?? '')
    );
    expect(result.matches).toBe(true);
  });

  it('全107校の合計が公式「取り込み対象全体」計と一致する', () => {
    const subtotal = officialSubtotals.find((s) => s.label.includes('取り込み対象全体'))!;
    const result = checkAgainstSubtotal(records, subtotal, () => true);
    expect(result.matches).toBe(true);
  });

  it('全レコードのquota>0・finalApplicants>=0・finalRateが概算で整合する', () => {
    for (const r of records) {
      expect(r.quota).toBeGreaterThan(0);
      expect(r.finalApplicants).toBeGreaterThanOrEqual(0);
      // 倍率は小数第3位で丸められている場合があるため誤差0.01を許容
      expect(Math.abs(r.finalApplicants / r.quota - r.finalRate)).toBeLessThan(0.01);
    }
  });

  it('coverageが正直に部分取り込みを示している（Y-0憲法③の精神）', () => {
    expect(TOKYO_COMPETITION_RATES.coverage.status).toBe('partial');
    expect(TOKYO_COMPETITION_RATES.coverage.pendingDepartments.length).toBeGreaterThan(0);
  });
});
