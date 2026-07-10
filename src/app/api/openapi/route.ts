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
        '日本全国47都道府県の公立高校入試における内申点（調査書点）の計算方式データと厳密計算を提供する公開REST API。' +
        'キー無し（匿名ティア）でそのまま利用でき、出典明記で無料。継続・大量利用には無料APIキー（POST /api/keys で自己発行）を付けるとレート上限と月次クォータが上がる（Pro / Scale は /developers）。' +
        'レスポンスには X-Api-Tier / X-RateLimit-* ヘッダが付く。MCP互換エンドポイントは /api/mcp。',
      contact: { name: 'My Naishin', url: SITE_URL },
      license: { name: DATASET_META.license.type, url: `${SITE_URL}/developers` },
    },
    servers: [{ url: SITE_URL, description: '本番' }],
    externalDocs: { description: '開発者ドキュメント（料金プラン含む）', url: `${SITE_URL}/developers` },
    // キーは任意（匿名でも可）。付与するとティア昇格＋クォータ。空オブジェクトで「無認証も許可」を明示。
    security: [{}, { ApiKeyAuth: [] }, { BearerAuth: [] }],
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
            '429': { description: 'レート上限または当月クォータを超過（Retry-After ヘッダ参照）' },
          },
        },
      },
      '/api/naishin/{code}': {
        get: {
          operationId: 'getPrefecture',
          summary: '特定都道府県の詳細（計算式・計算例・目安校）／?target= で逆算',
          description:
            '?target=180 を付けると、目標内申点からの逆算（必要評定平均・1段階あたりの内申増分・優先教科）を返す。',
          parameters: [
            {
              name: 'code',
              in: 'path',
              required: true,
              description: '都道府県コード（英語小文字, 例: tokyo, osaka, hokkaido）。',
              schema: { type: 'string', example: 'tokyo' },
            },
            {
              name: 'target',
              in: 'query',
              required: false,
              description: '目標内申点。指定すると逆算モードになる。',
              schema: { type: 'number', example: 240 },
            },
          ],
          responses: {
            '200': {
              description: '成功',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/PrefectureDetail' } },
              },
            },
            '400': { description: 'target が数値でない' },
            '404': { description: '都道府県コードが見つからない' },
          },
        },
      },
      '/api/naishin/compare': {
        get: {
          operationId: 'comparePrefectures',
          summary: '複数都道府県の内申点を同一評定で横並び比較',
          parameters: [
            {
              name: 'codes',
              in: 'query',
              required: true,
              description: 'カンマ区切りの都道府県コード（例: tokyo,osaka,hyogo）。',
              schema: { type: 'string', example: 'tokyo,osaka,hyogo' },
            },
            {
              name: 'grade',
              in: 'query',
              required: false,
              description: '一律評定（1〜5, 既定4）。',
              schema: { type: 'integer', example: 4 },
            },
          ],
          responses: {
            '200': { description: '成功' },
            '400': { description: 'codes 未指定' },
          },
        },
      },
      '/api/hensachi': {
        get: {
          operationId: 'calculateHensachi',
          summary: '偏差値の計算・逆算・順位変換（S-5）',
          description:
            '?score=&average=&stdDev= で偏差値を計算。?targetHensachi=&average=&stdDev= で必要点数を逆算。' +
            '?rank=&population= で順位から偏差値、?hensachi=&population= で偏差値から順位を算出。パラメータ無しはエンドポイント一覧。',
          parameters: [
            { name: 'score', in: 'query', required: false, description: '得点。', schema: { type: 'number', example: 70 } },
            { name: 'average', in: 'query', required: false, description: '平均点。', schema: { type: 'number', example: 60 } },
            { name: 'stdDev', in: 'query', required: false, description: '標準偏差（>0）。', schema: { type: 'number', example: 10 } },
            { name: 'targetHensachi', in: 'query', required: false, description: '目標偏差値（逆算モード）。', schema: { type: 'number', example: 65 } },
            { name: 'rank', in: 'query', required: false, description: '順位（rank_to_hensachiモード）。', schema: { type: 'number', example: 150 } },
            { name: 'hensachi', in: 'query', required: false, description: '偏差値（hensachi_to_rankモード）。', schema: { type: 'number', example: 50 } },
            { name: 'population', in: 'query', required: false, description: '母集団の人数。', schema: { type: 'number', example: 300 } },
          ],
          responses: {
            '200': { description: '成功' },
            '400': { description: 'パラメータが不正（数値以外・stdDev<=0等）' },
          },
        },
      },
      '/api/hensachi/percentile-table': {
        get: {
          operationId: 'hensachiPercentileTable',
          summary: '偏差値→上位%・母集団順位の対応表',
          description: '?values=45,50,55 で任意の偏差値リストを指定可能（カンマ区切り）。未指定は既定の代表偏差値（30〜75）。',
          parameters: [
            { name: 'values', in: 'query', required: false, description: 'カンマ区切りの偏差値リスト。', schema: { type: 'string', example: '45,50,55,60,65' } },
          ],
          responses: { '200': { description: '成功' }, '400': { description: 'valuesが数値でない' } },
        },
      },
      '/api/total-score': {
        get: {
          operationId: 'listTotalScoreSystems',
          summary: '統一エンジンで計算可能な総合得点方式（学力検査点＋内申点）の一覧',
          description: '統一エンジン（registry）を持つ5県のみ対象。東京・神奈川等の個別実装8県は含まれない。',
          responses: { '200': { description: '成功' } },
        },
      },
      '/api/total-score/{code}': {
        get: {
          operationId: 'getTotalScoreSystem',
          summary: '特定県の総合得点システム詳細／?academicRaw=&reportRaw= で計算／?targetTotal=&reportRaw= で逆算',
          parameters: [
            { name: 'code', in: 'path', required: true, description: '都道府県コード（例: hyogo）。', schema: { type: 'string', example: 'hyogo' } },
            { name: 'academicRaw', in: 'query', required: false, description: '学力検査点の素点（計算モード）。', schema: { type: 'number', example: 500 } },
            { name: 'reportRaw', in: 'query', required: false, description: '調査書点の素点。', schema: { type: 'number', example: 250 } },
            { name: 'targetTotal', in: 'query', required: false, description: '目標総合得点（逆算モード）。', schema: { type: 'number', example: 500 } },
            { name: 'ratioOptionId', in: 'query', required: false, description: '任意。傾斜配点オプションID。', schema: { type: 'string' } },
          ],
          responses: {
            '200': { description: '成功' },
            '400': { description: 'パラメータが数値でない' },
            '404': { description: '都道府県コードが見つからない（対応5県は /api/total-score を参照）' },
          },
        },
      },
      '/api/openapi': {
        get: {
          operationId: 'getOpenApiSpec',
          summary: '本OpenAPI仕様書（自己記述）',
          responses: { '200': { description: '成功' } },
        },
      },
      '/api/keys': {
        post: {
          operationId: 'issueApiKey',
          summary: '無料APIキーの自己発行（平文は一度だけ返る）',
          description:
            'free ティアのAPIキーを発行する。レスポンスの apiKey は再表示できないため安全に保管すること。Pro / Scale プランは /developers から。',
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    label: { type: 'string', description: '用途メモ（任意）', example: 'my-juku-app' },
                    email: { type: 'string', description: '連絡先（任意）', example: 'dev@example.com' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: '発行成功',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/IssuedKey' } } },
            },
            '429': { description: '発行レート超過' },
            '503': { description: 'キー発行は準備中（匿名ティアで利用可）' },
          },
        },
        get: {
          operationId: 'verifyApiKey',
          summary: '自分のキーの有効性・ティアを確認（平文は返さない）',
          security: [{ BearerAuth: [] }, { ApiKeyAuth: [] }],
          responses: { '200': { description: '確認結果' }, '400': { description: 'キー未指定' }, '404': { description: '無効' } },
        },
      },
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: '無料キーは POST /api/keys で自己発行。キー無しでも匿名ティアで利用可。',
        },
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'Authorization: Bearer <apiKey>。キー無しでも匿名ティアで利用可。',
        },
      },
      schemas: {
        IssuedKey: {
          type: 'object',
          properties: {
            apiKey: { type: 'string', example: 'mnsk_live_xxxxxxxx' },
            prefix: { type: 'string', example: 'mnsk_live_a1b2c3d4' },
            tier: { type: 'string', example: 'free' },
            rateLimitPerMinute: { type: 'integer', example: 120 },
            monthlyQuota: { type: 'integer', example: 10000 },
          },
        },
        Prefecture: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'tokyo' },
            name: { type: 'string', example: '東京都' },
            region: { type: 'string', example: '関東' },
            targetGrades: { type: 'array', items: { type: 'integer' }, example: [3] },
            coreMultiplier: { type: 'number', example: 1 },
            practicalMultiplier: { type: 'number', example: 2 },
            // 東京都の内申点（調査書点）満点は65点（中3のみ：5教科×1＋実技4教科×2）。
            // 1020点満点系への換算は reverseCalc 側の係数で行う（API本体は65を返す）。
            maxScore: { type: 'integer', example: 65 },
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
