import { gateApiRequest } from '@/lib/api-auth';
import { corsCsv, corsPreflight, logApiHit } from '@/lib/api-cors';
import { STATS_METRICS, buildSuppressedAggregate, buildStatsCsv, computeAggregate } from '@/lib/stats-aggregation';
import { getStatsValues } from '@/lib/stats-db';

/**
 * 匿名統計（全国集計）のCSV配布（堀B・TIER N-7）。
 *
 * GET /api/stats/csv → 内申点・偏差値・総合得点の全国集計を1行1指標のCSV（BOM付きUTF-8）で配布。
 * 表計算ソフト・研究/メディア利用にそのまま読み込める（/api/naishin/csv と同じ配布パターン）。
 * サンプルサイズが不足する指標はinsufficient_data列で明示し、mean/min/maxは空欄のまま返す
 * （k-匿名性・捏造ゼロ。/api/stats/distribution と同じ抑制ロジックを再利用）。
 * 都道府県別内訳は現時点でほぼ全セルがサンプル不足のため対象外（全国集計のみ・母数が育ったら拡張）。
 */
export async function GET(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  logApiHit('stats-csv', request, { tier: gate.tier });

  const generatedAtIso = new Date().toISOString();
  const rows = await Promise.all(
    STATS_METRICS.map(async (metric) => {
      const values = await getStatsValues(metric);
      const count = computeAggregate(values)?.count ?? 0;
      const aggregate = buildSuppressedAggregate(values);
      return { metric, count, aggregate };
    })
  );

  return corsCsv(buildStatsCsv(rows, generatedAtIso), {
    filename: 'my-naishin-stats-national-2026.csv',
    headers: gate.headers,
    private: gate.cachePrivate,
  });
}

export function OPTIONS() {
  return corsPreflight();
}
