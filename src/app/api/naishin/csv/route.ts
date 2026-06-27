import { gateApiRequest } from '@/lib/api-auth';
import { corsCsv, corsPreflight, logApiHit } from '@/lib/api-cors';
import { buildDatasetCsv } from '@/lib/naishin-dataset';

/**
 * 公開データAPI（堀B）— 全国47都道府県の内申点計算方式を CSV で配布。
 *
 * GET /api/naishin/csv → 表計算ソフト・データカタログ・引用に使えるフラットなCSV（BOM付きUTF-8）。
 * JSON（/api/naishin）と同じ正準ソース（naishin-dataset.ts）から生成。利用条件は /developers / meta.license を参照。
 */
export async function GET(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  logApiHit('naishin-csv', request, { tier: gate.tier });
  return corsCsv(buildDatasetCsv(), {
    filename: 'my-naishin-prefectures-2026.csv',
    headers: gate.headers,
    private: gate.cachePrivate,
  });
}

export function OPTIONS() {
  return corsPreflight();
}
