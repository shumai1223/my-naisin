/**
 * 匿名統計の集計ロジック（TIER N-2・A-12の一次データ堀）。
 *
 * migrations/0007_create_stats_submissions.sql（未適用・👤監督付き適用待ち）が定義する
 * stats_submissions テーブルを将来集計する際の型・k-匿名性しきい値・純粋な集計関数を
 * 単一ソース化する。D1バインディング・envには一切依存しない（N-3のAPI実装時に
 * ここの関数へ実データを渡すだけで機能する設計）。
 */

/** 集計・公開時にこの件数未満のセルは非表示にする（k-匿名性）。全ての公開APIがこの定数を参照する。 */
export const STATS_MIN_SAMPLE_SIZE = 30;

/** stats_submissions.metric に入る値（migrations/0007のコメントと対応する単一ソース）。 */
export const STATS_METRICS = ['naishin', 'hensachi', 'total-score'] as const;
export type StatsMetric = (typeof STATS_METRICS)[number];

export function isStatsMetric(value: unknown): value is StatsMetric {
  return typeof value === 'string' && (STATS_METRICS as readonly string[]).includes(value);
}

export interface StatsSubmissionInput {
  metric: StatsMetric;
  /** 都道府県コード（任意・全国集計にはprefectureCodeを省略した提出も混在しうる）。 */
  prefectureCode?: string;
  value: number;
  maxValue?: number;
}

export interface StatsAggregate {
  count: number;
  mean: number;
  min: number;
  max: number;
}

/** サンプルサイズがk-匿名性のしきい値未満か（未満なら非表示にすべき）。 */
export function shouldSuppressCell(sampleSize: number, threshold: number = STATS_MIN_SAMPLE_SIZE): boolean {
  return sampleSize < threshold;
}

/**
 * 数値配列から件数・平均・最小・最大を計算する（純粋関数）。
 * 空配列はnull（集計不能。呼び出し側でshouldSuppressCellと合わせて非表示にする）。
 */
export function computeAggregate(values: number[]): StatsAggregate | null {
  const finite = values.filter((v) => Number.isFinite(v));
  if (finite.length === 0) return null;
  const sum = finite.reduce((acc, v) => acc + v, 0);
  return {
    count: finite.length,
    mean: sum / finite.length,
    min: Math.min(...finite),
    max: Math.max(...finite),
  };
}

/**
 * k-匿名性を適用した公開用集計。サンプルサイズが閾値未満ならnullを返す
 * （＝呼び出し側のAPI/ページは「表示できるだけのデータがまだありません」等にフォールバックする）。
 */
export function buildSuppressedAggregate(values: number[], threshold: number = STATS_MIN_SAMPLE_SIZE): StatsAggregate | null {
  const agg = computeAggregate(values);
  if (!agg) return null;
  if (shouldSuppressCell(agg.count, threshold)) return null;
  return agg;
}

/** 提出データの妥当性検査（DBに書く前のバリデーション・N-3のAPI実装時に使う想定）。 */
export function isValidStatsSubmission(input: unknown): input is StatsSubmissionInput {
  if (!input || typeof input !== 'object') return false;
  const obj = input as Record<string, unknown>;
  if (!isStatsMetric(obj.metric)) return false;
  if (typeof obj.value !== 'number' || !Number.isFinite(obj.value)) return false;
  if (obj.maxValue !== undefined && (typeof obj.maxValue !== 'number' || !Number.isFinite(obj.maxValue))) return false;
  if (obj.prefectureCode !== undefined && typeof obj.prefectureCode !== 'string') return false;
  return true;
}
