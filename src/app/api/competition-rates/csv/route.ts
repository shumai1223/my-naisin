import { gateApiRequest } from '@/lib/api-auth';
import { corsCsv, corsPreflight, logApiHit } from '@/lib/api-cors';
import { buildCompetitionRatesCsv } from '@/lib/competition-rate-public-api';

/**
 * 公開データAPI（堀B・T-S13A A-2）— 再配布許諾済み都道府県の学校別入試競争率をCSVで配布。
 *
 * GET /api/competition-rates/csv → 表計算ソフト・データカタログ・引用向け（BOM付きUTF-8）。
 * /api/competition-rates と同じ正準ソース（competition-rate-public-api.ts）から生成。
 */
export async function GET(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  await logApiHit('competition-rates-csv', request, { tier: gate.tier });
  return corsCsv(buildCompetitionRatesCsv(), {
    filename: 'my-naishin-competition-rates-2026.csv',
    headers: gate.headers,
    private: gate.cachePrivate,
  });
}

export function OPTIONS() {
  return corsPreflight();
}
