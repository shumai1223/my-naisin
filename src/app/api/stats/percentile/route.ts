import { gateApiRequest } from '@/lib/api-auth';
import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { isStatsMetric, buildSuppressedPercentile, STATS_MIN_SAMPLE_SIZE, STATS_METRICS } from '@/lib/stats-aggregation';
import { getStatsValues } from '@/lib/stats-db';
import { SITE_URL } from '@/lib/naishin-dataset';

/**
 * 匿名統計のパーセンタイルAPI（T-1・紹介/解放機構の中身＝「全国統計の先行閲覧」）。
 *
 * GET /api/stats/percentile?metric=hensachi&value=58&prefecture=tokyo
 *   自分の値が、これまでにオプトインで集まった匿名の提出データの中で何%タイルかを返す
 *   （「あなたは（協力者内で）上位◯%」の元データ）。/api/stats/distribution と同じ
 *   k-匿名性ガード（STATS_MIN_SAMPLE_SIZE未満は insufficientData:true）を適用する。
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

  const values = await getStatsValues(metricRaw, prefecture);
  const result = buildSuppressedPercentile(values, value);

  return corsJson(
    {
      meta: {
        name: '匿名統計パーセンタイル（自分の値が全国協力者内で何%タイルか）',
        description:
          '利用者が任意でオプトインした匿名の計算結果と比較した、自分の値のパーセンタイル。個人を特定できる情報は含まない。サンプルサイズが不足する場合は表示しない（k-匿名性）。',
        metric: metricRaw,
        prefecture: prefecture ?? null,
        value,
        minSampleSize: STATS_MIN_SAMPLE_SIZE,
        generatedAt: new Date().toISOString(),
        source: `${SITE_URL}/quality`,
      },
      insufficientData: result === null,
      result,
    },
    { headers: gate.headers, private: gate.cachePrivate }
  );
}

export function OPTIONS() {
  return corsPreflight();
}
