/**
 * 匿名統計の集計ロジック（S-1・旧TIER N-2・A-12の一次データ堀）。
 *
 * migrations/0007_create_stats_submissions.sql（2026-07-10適用済み）が定義する
 * stats_submissions テーブルを集計する際の型・k-匿名性しきい値・純粋な集計関数を
 * 単一ソース化する。D1バインディング・envには一切依存しない（stats-db.tsがここの関数へ
 * 実データを渡す）。
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

export interface StatsCsvRow {
  metric: StatsMetric;
  /** 集計対象の全件数（k-匿名性で非表示にする前の実件数）。 */
  count: number;
  /** 非表示（サンプルサイズ不足）ならnull。表示可能ならStatsAggregate。 */
  aggregate: StatsAggregate | null;
}

const STATS_METRIC_LABELS: Record<StatsMetric, string> = {
  naishin: '内申点',
  hensachi: '偏差値',
  'total-score': '総合得点',
};

/**
 * 匿名統計（全国集計）をCSV文字列に変換する（純粋関数・DB非依存＝テスト可能）。
 * サンプルサイズ不足のセルはmean/min/maxを空欄にし、insufficient_data列で明示する
 * （k-匿名性を維持したまま「データが無いものを在るかのように見せない」原則をCSVでも徹底）。
 */
export function buildStatsCsv(rows: StatsCsvRow[], generatedAtIso: string = new Date().toISOString()): string {
  const header = ['metric', 'metric_label', 'sample_count', 'insufficient_data', 'mean', 'min', 'max', 'min_sample_size', 'generated_at'];
  const lines = [header.join(',')];
  for (const row of rows) {
    const insufficient = row.aggregate === null;
    const cells = [
      row.metric,
      STATS_METRIC_LABELS[row.metric],
      String(row.count),
      String(insufficient),
      insufficient ? '' : row.aggregate!.mean.toFixed(2),
      insufficient ? '' : String(row.aggregate!.min),
      insufficient ? '' : String(row.aggregate!.max),
      String(STATS_MIN_SAMPLE_SIZE),
      generatedAtIso,
    ];
    lines.push(cells.join(','));
  }
  return lines.join('\n') + '\n';
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
