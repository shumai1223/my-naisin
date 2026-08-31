import { gateApiRequest } from '@/lib/api-auth';
import { corsCsv, corsPreflight, logApiHit } from '@/lib/api-cors';
import { buildNationalComparison, toCsv } from '@/lib/naishin-national-comparison';

/**
 * 公開データAPI（T-N4-1）— 47都道府県の内申点の扱いの違いを研究用に整理したCSV。
 *
 * GET /api/naishin/national-comparison → 満点・対象学年・学年倍率・実技傾斜比率・内申点:当日点比率を
 * 1県1行で配布。既存データ(naishin-dataset.ts)の再集計のみで新規収集は行わない。
 * 順位付け・優劣の評価列は一切含まない（Y-0憲法・N4-1本文の指示）。
 */
export async function GET(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  await logApiHit('naishin-national-comparison', request, { tier: gate.tier });
  return corsCsv(toCsv(buildNationalComparison()), {
    filename: 'my-naishin-national-comparison-2026.csv',
    headers: gate.headers,
    private: gate.cachePrivate,
  });
}

export function OPTIONS() {
  return corsPreflight();
}
