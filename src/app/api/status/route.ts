import { corsJson, corsPreflight } from '@/lib/api-cors';
import { DATASET_META } from '@/lib/naishin-dataset';
import { PREFECTURES } from '@/lib/prefectures';
import { VERIFIED_TOTAL_SCORE_CODES } from '@/lib/total-score/registry';

/**
 * 公開API/MCPの稼働ステータス（堀B：/developers の「ステータス」節・E-3）。
 *
 * 認証・レート制限なしの軽量エンドポイント。監視ツールやAIエージェントが
 * 「今APIが生きているか」だけを素早く確認できるようにする（データ本体は/api/naishin）。
 */
export async function GET() {
  return corsJson(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      dataset: {
        version: DATASET_META.version,
        fiscalYear: DATASET_META.fiscalYear,
        prefectureCount: PREFECTURES.length,
        totalScoreCalculatorCount: VERIFIED_TOTAL_SCORE_CODES.length,
      },
      endpoints: {
        naishinIndex: '/api/naishin',
        naishinDetail: '/api/naishin/{code}',
        naishinCsv: '/api/naishin/csv',
        mcp: '/api/mcp',
        openapi: '/api/openapi',
      },
    },
    { cacheSeconds: 60 },
  );
}

export function OPTIONS() {
  return corsPreflight();
}
