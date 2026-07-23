import { gateApiRequest } from '@/lib/api-auth';
import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { isStatsMetric, buildSuppressedPercentile, STATS_MIN_SAMPLE_SIZE, STATS_METRICS } from '@/lib/stats-aggregation';
import { getStatsValues } from '@/lib/stats-db';
import { SITE_URL } from '@/lib/naishin-dataset';

/**
 * 匿名統計のパーセンタイルAPI（T-1・紹介/解放機構の中身＝「全国統計の先行閲覧」）。
 * Ω-1（TIER Ω・パーセンタイル・フック）: 「あなたの◯◯は全国◯%・県内◯位相当」を
 * 1回のリクエストで返せるよう、prefecture指定時は全国集計と県内集計の両方を計算する。
 *
 * GET /api/stats/percentile?metric=hensachi&value=58
 *   自分の値が、これまでにオプトインで集まった匿名の全国提出データの中で何%タイルかを返す
 *   （「あなたは（協力者内で）上位◯%」の元データ）。
 * GET /api/stats/percentile?metric=naishin&value=40&prefecture=tokyo
 *   上記の全国集計（result）に加え、prefectureCode一致分のみで集計した県内パーセンタイル
 *   （prefectureResult）も同時に返す。/api/stats/distribution と同じk-匿名性ガード
 *   （STATS_MIN_SAMPLE_SIZE未満は該当フィールドがnull）を、全国・県内それぞれに独立して適用する。
 */
export async function GET(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  logApiHit('stats-percentile', request, { tier: gate.tier });

  const url = new URL(request.url);
  const metricRaw = url.searchParams.get('metric');
  const valueRaw = url.searchParams.get('value');
  const prefecture = url.searchParams.get('prefecture') ?? undefined;

  if (!metricRaw || !isStatsMetric(metricRaw)) {
    return corsJson(
      {
        error: 'invalid_params',
        message: `metric は次のいずれかを指定してください: ${STATS_METRICS.join(', ')}`,
      },
      { status: 400, cacheSeconds: 300, headers: gate.headers }
    );
  }

  const value = valueRaw === null ? NaN : Number(valueRaw);
  if (!Number.isFinite(value)) {
    return corsJson(
      { error: 'invalid_params', message: 'value は数値で指定してください' },
      { status: 400, cacheSeconds: 300, headers: gate.headers }
    );
  }

  const nationalValues = await getStatsValues(metricRaw);
  const result = buildSuppressedPercentile(nationalValues, value);

  let prefectureResult = null;
  if (prefecture) {
    const prefectureValues = await getStatsValues(metricRaw, prefecture);
    prefectureResult = buildSuppressedPercentile(prefectureValues, value);
  }

  return corsJson(
    {
      meta: {
        name: '匿名統計パーセンタイル（自分の値が全国・県内の協力者内で何%タイルか）',
        description:
          '利用者が任意でオプトインした匿名の計算結果と比較した、自分の値のパーセンタイル。個人を特定できる情報は含まない。サンプルサイズが不足する場合は表示しない（k-匿名性・全国と県内で独立判定）。',
        metric: metricRaw,
        prefecture: prefecture ?? null,
        value,
        minSampleSize: STATS_MIN_SAMPLE_SIZE,
        generatedAt: new Date().toISOString(),
        source: `${SITE_URL}/quality`,
      },
      insufficientData: result === null,
      result,
      prefectureInsufficientData: prefecture ? prefectureResult === null : null,
      prefectureResult,
    },
    { headers: gate.headers, private: gate.cachePrivate }
  );
}

export function OPTIONS() {
  return corsPreflight();
}
