import { corsCsv, corsPreflight, logApiHit } from '@/lib/api-cors';
import { buildDatasetCsv } from '@/lib/naishin-dataset';

/**
 * 公開データAPI（堀B）— 全国47都道府県の内申点計算方式を CSV で配布。
 *
 * GET /api/naishin/csv → 表計算ソフト・データカタログ・引用に使えるフラットなCSV（BOM付きUTF-8）。
 * JSON（/api/naishin）と同じ正準ソース（naishin-dataset.ts）から生成。利用条件は /developers / meta.license を参照。
 */
export function GET(request: Request) {
  logApiHit('naishin-csv', request);
  return corsCsv(buildDatasetCsv(), { filename: 'my-naishin-prefectures-2026.csv' });
}

export function OPTIONS() {
  return corsPreflight();
}
