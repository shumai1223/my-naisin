/**
 * 匿名統計の集計ロジック（TIER N-2）。k-匿名性のしきい値と純粋な集計関数の契約テスト。
 */
import {
  STATS_MIN_SAMPLE_SIZE,
  STATS_METRICS,
  isStatsMetric,
  shouldSuppressCell,
  computeAggregate,
  buildSuppressedAggregate,
  isValidStatsSubmission,
} from '../stats-aggregation';

describe('isStatsMetric', () => {
  it('登録済みの指標のみtrue', () => {
    for (const m of STATS_METRICS) {
      expect(isStatsMetric(m)).toBe(true);
    }
    expect(isStatsMetric('unknown-metric')).toBe(false);
    expect(isStatsMetric(123)).toBe(false);
    expect(isStatsMetric(undefined)).toBe(false);
  });
});

describe('shouldSuppressCell（k-匿名性）', () => {
  it('しきい値未満は抑制対象', () => {
    expect(shouldSuppressCell(STATS_MIN_SAMPLE_SIZE - 1)).toBe(true);
  });

  it('しきい値ちょうど・超過は抑制しない', () => {
    expect(shouldSuppressCell(STATS_MIN_SAMPLE_SIZE)).toBe(false);
    expect(shouldSuppressCell(STATS_MIN_SAMPLE_SIZE + 1)).toBe(false);
  });

  it('しきい値は上書き可能', () => {
    expect(shouldSuppressCell(10, 5)).toBe(false);
    expect(shouldSuppressCell(3, 5)).toBe(true);
  });
});

describe('computeAggregate', () => {
  it('件数・平均・最小・最大を計算する', () => {
    const agg = computeAggregate([30, 35, 40]);
    expect(agg).toEqual({ count: 3, mean: 35, min: 30, max: 40 });
  });

  it('非有限値は除外して計算する', () => {
    const agg = computeAggregate([30, NaN, 40, Infinity]);
    expect(agg).toEqual({ count: 2, mean: 35, min: 30, max: 40 });
  });

  it('空配列・全て非有限ならnull', () => {
    expect(computeAggregate([])).toBeNull();
    expect(computeAggregate([NaN, Infinity])).toBeNull();
  });
});

describe('buildSuppressedAggregate（k-匿名性を適用した公開用集計）', () => {
  it('サンプルサイズが閾値以上なら集計結果を返す', () => {
    const values = Array.from({ length: STATS_MIN_SAMPLE_SIZE }, (_, i) => 30 + i);
    const agg = buildSuppressedAggregate(values);
    expect(agg).not.toBeNull();
    expect(agg?.count).toBe(STATS_MIN_SAMPLE_SIZE);
  });

  it('サンプルサイズが閾値未満ならnull（非表示）', () => {
    const values = Array.from({ length: STATS_MIN_SAMPLE_SIZE - 1 }, (_, i) => 30 + i);
    expect(buildSuppressedAggregate(values)).toBeNull();
  });

  it('空配列はnull', () => {
    expect(buildSuppressedAggregate([])).toBeNull();
  });
});

describe('isValidStatsSubmission', () => {
  it('妥当な提出データはtrue', () => {
    expect(isValidStatsSubmission({ metric: 'naishin', value: 40, maxValue: 45, prefectureCode: 'tokyo' })).toBe(true);
    expect(isValidStatsSubmission({ metric: 'hensachi', value: 55 })).toBe(true);
  });

  it('不正な指標・数値・型は全てfalse', () => {
    expect(isValidStatsSubmission({ metric: 'unknown', value: 40 })).toBe(false);
    expect(isValidStatsSubmission({ metric: 'naishin', value: 'not-a-number' })).toBe(false);
    expect(isValidStatsSubmission({ metric: 'naishin', value: NaN })).toBe(false);
    expect(isValidStatsSubmission({ metric: 'naishin', value: 40, maxValue: 'bad' })).toBe(false);
    expect(isValidStatsSubmission({ metric: 'naishin', value: 40, prefectureCode: 123 })).toBe(false);
    expect(isValidStatsSubmission(null)).toBe(false);
    expect(isValidStatsSubmission('string')).toBe(false);
  });
});
