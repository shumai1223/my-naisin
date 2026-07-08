import { gateApiRequest } from '@/lib/api-auth';
import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { isStatsMetric, buildSuppressedAggregate, STATS_MIN_SAMPLE_SIZE, STATS_METRICS } from '@/lib/stats-aggregation';
import { getStatsValues } from '@/lib/stats-db';
import { SITE_URL } from '@/lib/naishin-dataset';

/**
 * 匿名統計の集計API（堀B・TIER N-3）。
 *
 * GET /api/stats/distribution?metric=naishin&prefecture=tokyo
 *   利用者がオプトインした匿名の計算結果（PII無し）を集計し、件数・平均・最小・最大を返す。
 *   k-匿名性のためサンプルサイズが STATS_MIN_SAMPLE_SIZE（既定30）未満のセルは
 *   insufficientData:true で集計値自体を返さない（[[fable5-loop-protocol]]の捏造回避原則と同じ思想＝
 *   データが無いものを在るかのように見せない）。
 *
 * ⚠️ 2026-07-09時点、オプトインUI（StatsOptIn）は未マウント・migration 0007は未適用のため、
 *   実際に集計対象となるデータはまだ0件。このエンドポイントは常に insufficientData:true を返す
 *   （設計上安全＝存在しないデータを捏造して返すことはない）。N-1のUI結線・N-2の migration適用が
 *   完了すると自動的にデータが貯まり始める。
 */
export async function GET(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  logApiHit('stats-distribution', request, { tier: gate.tier });

  const url = new URL(request.url);
  const metricRaw = url.searchParams.get('metric');
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

  const values = await getStatsValues(metricRaw, prefecture);
  const aggregate = buildSuppressedAggregate(values);

  return corsJson(
    {
      meta: {
        name: '匿名統計（内申点・偏差値等の全国分布）',
        description:
          '利用者が任意でオプトインした匿名の計算結果を集計した統計値。個人を特定できる情報は含まない。サンプルサイズが不足するセルは表示しない（k-匿名性）。',
        metric: metricRaw,
        prefecture: prefecture ?? null,
        minSampleSize: STATS_MIN_SAMPLE_SIZE,
        generatedAt: new Date().toISOString(),
        source: `${SITE_URL}/quality`,
      },
      insufficientData: aggregate === null,
      aggregate,
    },
    { headers: gate.headers, private: gate.cachePrivate }
  );
}

export function OPTIONS() {
  return corsPreflight();
}
