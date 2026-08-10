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

/** 表示用の指標ラベル（'内申点'/'偏差値'/'総合得点'）→ StatsMetric。対応しない場合はnull（例: '評定平均'は統計未収集）。 */
const METRIC_LABEL_TO_STATS_METRIC: Record<string, StatsMetric> = {
  内申点: 'naishin',
  偏差値: 'hensachi',
  総合得点: 'total-score',
};

/**
 * リードマグネット等でラベル文字列（metricLabel）として保持している指標名から、
 * 匿名統計API（/api/stats/percentile等）が受け付けるStatsMetricキーへ変換する（ZZ-5a）。
 * 未対応のラベル（評定平均など統計未収集の指標）はnull。
 */
export function metricLabelToStatsMetric(label: string | undefined): StatsMetric | null {
  if (!label) return null;
  return METRIC_LABEL_TO_STATS_METRIC[label] ?? null;
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

/* ────────────────────────────────────────────────────────────────────────────
 * 公開ゲート（DW-1・2026-08-10）
 *
 * 事故: 2026-08-10 に本番の /api/stats/* ・/stats ・/report/2026 ・/api/mcp が
 *   「偏差値の全国平均 = 63.16」を配信していた。偏差値は定義上、母集団平均が50。
 *   原因は STATS_VALUE_LIMITS が「1件ずつ」しか検査せず、1件ずつは妥当（20〜90）でも
 *   集団としてあり得ない分布を素通しすること。宮崎県の avgNaishin 425（満点135）を
 *   3,826件のテストが全greenのまま通したのと同じ穴。
 *
 * 対策は2層:
 *   Layer A  checkAggregateInvariants … 指標ごとの「集計レベル」不変条件。理論上の
 *                                       アンカーがある指標（偏差値＝平均50）を自動で弾く。
 *   Layer B  STATS_PUBLICATION           … 出所を証明できない指標を明示的に withheld にする。
 *                                       「確認できない数値は推測で埋めず、空にして理由を書く」（Y-0）。
 *
 * どちらも fail-closed。metric を渡さずに公開集計を作れる関数は用意しない。
 * ──────────────────────────────────────────────────────────────────────────── */

/** 公開を止めた理由（APIのmetaでそのまま利用者に開示する。黙って隠さない）。 */
export interface StatsSuppressionReason {
  /** 機械可読なコード。 */
  code: 'insufficient_sample' | 'aggregate_invariant_violation' | 'provenance_unverified';
  /** 人間可読な説明（日本語・そのまま公開してよい文言）。 */
  message: string;
}

/**
 * 集計レベルの不変条件。理論上のアンカーが無い指標は band を持たない
 * （持たせると恣意的な検閲になるため。その場合は Layer B で扱う）。
 */
export const STATS_AGGREGATE_INVARIANTS: Partial<
  Record<StatsMetric, { meanCenter: number; meanTolerance: number; rationale: string }>
> = {
  // 偏差値は「平均50・標準偏差10」になるよう定義された量。標本平均が50から大きく外れた集合は
  // 母集団の推定値として公開できない（自己選択でも汚染でも、公開すれば同じ嘘になる）。
  hensachi: {
    meanCenter: 50,
    meanTolerance: 5,
    rationale: '偏差値は定義上、母集団平均が50。標本平均が50±5を外れる集合は全国分布として公開しない。',
  },
};

/**
 * 出所を証明できたか（Layer B）。`/api/stats/submit` に投稿元の真正性検査が無い間、
 * 「人間の投稿である」と証明できない指標は公開しない。
 *
 * 2026-08-10 時点の実測（本番D1 `stats_submissions`）:
 *   hensachi   263件中243件(92%) が 07-16 / 07-22 / 07-27 / 08-01 / 08-07 の5日に集中。
 *              同期間のGA4 `stats_optin_grant` は28日で10件。実トラフィックは148〜172クリック/日。
 *   total-score 48件中39件(81%) が 07-21 / 07-25 の2日に集中。真偽を判定する材料が無い。
 *   naishin     8件（k-匿名性しきい値未満で元々非公開）。
 *
 * → 送信元の真正性検査を入れて再収集するまで、全指標を withheld にする。
 *   復帰の条件は docs/ の DW-1 対応記録に書く（勝手に true へ戻さないこと）。
 */
export const STATS_PUBLICATION: Record<StatsMetric, { publishable: boolean; withheldReason?: string }> = {
  hensachi: {
    publishable: false,
    withheldReason:
      '投稿の真正性を検証できないため公開を停止しています（2026-08-10〜）。自動投稿とみられる集中が確認されたため、送信元の検証を実装したうえで再収集します。',
  },
  naishin: {
    publishable: false,
    withheldReason:
      '投稿の真正性を検証できないため公開を停止しています（2026-08-10〜）。送信元の検証を実装したうえで再収集します。',
  },
  'total-score': {
    publishable: false,
    withheldReason:
      '投稿の真正性を検証できないため公開を停止しています（2026-08-10〜）。送信元の検証を実装したうえで再収集します。',
  },
};

/**
 * 集計が指標の不変条件を満たすか（Layer A・純粋関数）。
 * 違反があれば理由を返す。アンカーを持たない指標は常に null（＝Layer Aは通す）。
 */
export function checkAggregateInvariants(metric: StatsMetric, aggregate: StatsAggregate): StatsSuppressionReason | null {
  const inv = STATS_AGGREGATE_INVARIANTS[metric];
  if (!inv) return null;
  const deviation = Math.abs(aggregate.mean - inv.meanCenter);
  if (deviation > inv.meanTolerance) {
    return {
      code: 'aggregate_invariant_violation',
      message: `${inv.rationale}（実測の標本平均 ${aggregate.mean.toFixed(2)}）`,
    };
  }
  return null;
}

export interface PublishableAggregateResult {
  /** 公開してよい集計。公開できない場合は null。 */
  aggregate: StatsAggregate | null;
  /** 集計対象の実件数（公開可否に関わらず返す。件数だけは隠さない）。 */
  count: number;
  /** null でない場合、なぜ公開しなかったか。 */
  suppressed: StatsSuppressionReason | null;
}

/**
 * 公開用の集計を作る唯一の入口（fail-closed）。
 * k-匿名性 → Layer B（出所）→ Layer A（不変条件）の順に検査し、1つでも落ちたら aggregate は null。
 *
 * ⚠️ 公開面（API・ページ・MCP）は必ずこの関数を通すこと。`computeAggregate` /
 *    `buildSuppressedAggregate` を公開面から直接呼ぶと、この2層のゲートを迂回する。
 */
export function buildPublishableAggregate(
  metric: StatsMetric,
  values: number[],
  threshold: number = STATS_MIN_SAMPLE_SIZE
): PublishableAggregateResult {
  const agg = computeAggregate(values);
  const count = agg?.count ?? 0;

  if (!agg || shouldSuppressCell(count, threshold)) {
    return {
      aggregate: null,
      count,
      suppressed: {
        code: 'insufficient_sample',
        message: `公開に必要な件数（${threshold}件）に達していません。`,
      },
    };
  }

  const publication = STATS_PUBLICATION[metric];
  if (!publication.publishable) {
    return {
      aggregate: null,
      count,
      suppressed: {
        code: 'provenance_unverified',
        message: publication.withheldReason ?? '出所を検証できないため公開していません。',
      },
    };
  }

  const violation = checkAggregateInvariants(metric, agg);
  if (violation) return { aggregate: null, count, suppressed: violation };

  return { aggregate: agg, count, suppressed: null };
}

export interface PublishablePercentileResult {
  percentile: PercentileResult | null;
  count: number;
  suppressed: StatsSuppressionReason | null;
}

/**
 * 公開用のパーセンタイルを作る唯一の入口（fail-closed）。
 * 分布そのものが公開できない集合から算出したパーセンタイルも同じく公開できない
 * （利用者の自己比較に汚染された分母を使わせないため）。
 */
export function buildPublishablePercentile(
  metric: StatsMetric,
  values: number[],
  target: number,
  threshold: number = STATS_MIN_SAMPLE_SIZE
): PublishablePercentileResult {
  const gate = buildPublishableAggregate(metric, values, threshold);
  if (!gate.aggregate) return { percentile: null, count: gate.count, suppressed: gate.suppressed };

  const percentile = buildSuppressedPercentile(values, target, threshold);
  return { percentile, count: gate.count, suppressed: percentile ? null : gate.suppressed };
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
 * 表示専用の丸め処理（min/maxが浮動小数点の場合、生の桁数(例: 21.333333333333332)を
 * そのままUIに出さない）。整数値の指標(内申点・総合得点)はそのまま整数表示、
 * 小数が生じうる指標(偏差値)は小数第1位に丸める。CSV/API出力(stats-aggregation.tsの
 * buildStatsCsvRow等)は精度保持のため意図的にこの丸めを適用しない。
 */
export function formatStatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
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

export interface PrefectureStatsCell {
  prefectureCode: string;
  /** 集計対象の全件数（k-匿名性で非表示にする前の実件数）。 */
  count: number;
  /** 非表示（サンプルサイズ不足）ならnull。表示可能ならStatsAggregate。 */
  aggregate: StatsAggregate | null;
}

/**
 * 都道府県別の集計（ZZ-1d・/stats v2）。k-匿名性のしきい値は全国集計と同じ定数を共有する
 * （県内は全国よりnが小さくなりやすく、閾値を緩めると個人特定リスクが上がるため）。
 * 入力はprefectureCode→値配列のマップ（DBからのgroup byの結果を想定）・純粋関数でテスト可能。
 */
export function buildPrefectureAggregates(
  valuesByPrefecture: Record<string, number[]>,
  threshold: number = STATS_MIN_SAMPLE_SIZE
): PrefectureStatsCell[] {
  return Object.entries(valuesByPrefecture).map(([prefectureCode, values]) => {
    const agg = computeAggregate(values);
    const count = agg?.count ?? 0;
    return { prefectureCode, count, aggregate: shouldSuppressCell(count, threshold) ? null : agg };
  });
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

export interface PercentileResult {
  /** 集計対象の全件数（表示前のk-匿名性判定用）。 */
  count: number;
  /** 自分の値以下（自分を含む）の割合（0〜100・四捨五入）。「全国上位◯%」の元データ。 */
  percentile: number;
}

/**
 * 提出値の集合の中で target が何%タイル（自分以下が全体の何%か）かを計算する（純粋関数）。
 * 空配列・非有限値は null。同値はすべて「自分以下」に含める（<=）。
 */
export function computePercentileRank(values: number[], target: number): number | null {
  if (!Number.isFinite(target)) return null;
  const finite = values.filter((v) => Number.isFinite(v));
  if (finite.length === 0) return null;
  const atOrBelow = finite.filter((v) => v <= target).length;
  return Math.round((atOrBelow / finite.length) * 100);
}

/**
 * k-匿名性を適用したパーセンタイル集計（T-1：解放機構の中身＝全国統計の先行閲覧）。
 * サンプルサイズが閾値未満ならnull（＝呼び出し側は「まだデータが足りません」にフォールバック）。
 */
export function buildSuppressedPercentile(
  values: number[],
  target: number,
  threshold: number = STATS_MIN_SAMPLE_SIZE
): PercentileResult | null {
  const finite = values.filter((v) => Number.isFinite(v));
  if (shouldSuppressCell(finite.length, threshold)) return null;
  const percentile = computePercentileRank(finite, target);
  if (percentile === null) return null;
  return { count: finite.length, percentile };
}

/** 提出データの妥当性検査（DBに書く前のバリデーション・N-3のAPI実装時に使う想定）。 */
/**
 * 指標ごとの妥当域。有限数チェックだけでは「偏差値790」等の異常値が保存され
 * 平均を破壊する(2026-07-19実測: hensachi 72件中13件が域外・平均99.8に汚染)。
 * 域は理論上の全都道府県の上限を包む緩い箱(naishinは大阪450点満点、total-scoreは東京1020等)。
 */
export const STATS_VALUE_LIMITS: Record<StatsMetric, { min: number; max: number }> = {
  hensachi: { min: 20, max: 90 },
  naishin: { min: 0, max: 500 },
  'total-score': { min: 0, max: 1100 },
};

export function isValidStatsSubmission(input: unknown): input is StatsSubmissionInput {
  if (!input || typeof input !== 'object') return false;
  const obj = input as Record<string, unknown>;
  if (!isStatsMetric(obj.metric)) return false;
  if (typeof obj.value !== 'number' || !Number.isFinite(obj.value)) return false;
  const { min, max } = STATS_VALUE_LIMITS[obj.metric];
  if (obj.value < min || obj.value > max) return false;
  if (obj.maxValue !== undefined && (typeof obj.maxValue !== 'number' || !Number.isFinite(obj.maxValue))) return false;
  // 満点が添えられている指標は「満点超えの得点」を拒否(入力ミス・いたずらの典型形)。
  if (typeof obj.maxValue === 'number' && obj.maxValue > 0 && obj.value > obj.maxValue) return false;
  if (obj.prefectureCode !== undefined && typeof obj.prefectureCode !== 'string') return false;
  return true;
}
