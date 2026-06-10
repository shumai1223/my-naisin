import { corsJson, corsPreflight } from '@/lib/api-cors';
import { DATASET_META, SITE_URL } from '@/lib/naishin-dataset';

/**
 * OpenAPI 3.1 仕様書（堀B / 開発者・AI向け）。
 *
 * 公開REST（/api/naishin, /api/naishin/{code}）の機械可読スペック。
 * GPTs の Actions / 各種エージェントフレームワークがこの1ファイルでインポートできる＝
 * 「AIが必ず参照する一次データ層」への導線。MCP（JSON-RPC）は /api/mcp、本書はRESTを記述する。
 */
export function GET() {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'My Naishin 内申点データAPI',
      version: DATASET_META.version,
      description:
        '日本全国47都道府県の公立高校入試における内申点（調査書点）の計算方式データと厳密計算を提供する公開REST API。出典明記で無料利用可。MCP互換エンドポイントは /api/mcp。',
      contact: { name: 'My Naishin', url: SITE_URL },
      license: { name: DATASET_META.license.type, url: `${SITE_URL}/developers` },
    },
    servers: [{ url: SITE_URL, description: '本番' }],
    externalDocs: { description: '開発者ドキュメント', url: `${SITE_URL}/developers` },
    paths: {
      '/api/naishin': {
        get: {
          operationId: 'listPrefectures',
          summary: '全47都道府県の内申点計算方式インデックス',
          description:
            '対象学年・学年別倍率・5教科/実技4教科の倍率・満点・出典・各県の機械可読/ツールURLを返す。',
          responses: {
            '200': {
              description: '成功',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/DatasetIndex' },
                },
              },
            },
          },
        },
      },
      '/api/naishin/{code}': {
        get: {
          operationId: 'getPrefecture',
          summary: '特定都道府県の詳細（計算式・計算例・目安校）',
          parameters: [
            {
              name: 'code',
              in: 'path',
              required: true,
              description: '都道府県コード（英語小文字, 例: tokyo, osaka, hokkaido）。',
              schema: { type: 'string', example: 'tokyo' },
            },
          ],
          responses: {
            '200': {
              description: '成功',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/PrefectureDetail' } },
              },
            },
            '404': { description: '都道府県コードが見つからない' },
          },
        },
      },
    },
    components: {
      schemas: {
        Prefecture: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'tokyo' },
            name: { type: 'string', example: '東京都' },
            region: { type: 'string', example: '関東' },
            targetGrades: { type: 'array', items: { type: 'integer' }, example: [3] },
            coreMultiplier: { type: 'number', example: 1 },
            practicalMultiplier: { type: 'number', example: 2 },
            maxScore: { type: 'integer', example: 300 },
            supports10PointScale: { type: 'boolean' },
            toolUrl: { type: 'string', format: 'uri' },
            apiUrl: { type: 'string', format: 'uri' },
          },
        },
        DatasetIndex: {
          type: 'object',
          properties: {
            meta: { type: 'object' },
            prefectures: { type: 'array', items: { $ref: '#/components/schemas/Prefecture' } },
          },
        },
        CalcExample: {
          type: 'object',
          properties: {
            label: { type: 'string', example: 'オール5' },
            total: { type: 'integer' },
            max: { type: 'integer' },
            percent: { type: 'integer' },
          },
        },
        PrefectureDetail: {
          allOf: [
            { $ref: '#/components/schemas/Prefecture' },
            {
              type: 'object',
              properties: {
                formula: { type: 'object' },
                examples: { type: 'array', items: { $ref: '#/components/schemas/CalcExample' } },
                targetSchools: { type: 'array', items: { type: 'object' } },
              },
            },
          ],
        },
      },
    },
  };

  return corsJson(spec);
}

export function OPTIONS() {
  return corsPreflight();
}
