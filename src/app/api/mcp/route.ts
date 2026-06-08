import { NextResponse } from 'next/server';

import { CORS_HEADERS, corsPreflight } from '@/lib/api-cors';
import {
  buildDatasetIndex,
  buildPrefectureDetail,
  calculateNaishin,
  DATASET_META,
  SITE_URL,
} from '@/lib/naishin-dataset';

/**
 * MCP互換エンドポイント（堀B / AIネイティブの城①）。
 *
 * JSON-RPC 2.0 over HTTP で、AIエージェントが「47都道府県の内申点データ」と「厳密な内申点計算」を
 * ツールとして呼べる入口。AIが賢くなるほど my-naishin の一次データが呼ばれる側に回る設計。
 *
 * サポートメソッド: initialize / tools/list / tools/call / ping（通知は202で黙認）。
 * MCPの Streamable HTTP（ステートレスJSON-RPC）に準拠。GETはディスカバリ用のサーバ情報を返す。
 */

const PROTOCOL_VERSION = '2025-06-18';

const TOOLS = [
  {
    name: 'list_prefectures',
    description:
      '日本全国47都道府県の公立高校入試における内申点（調査書点）の計算方式一覧を返す。対象学年・学年別倍率・5教科/実技4教科の倍率・満点・出典を含む。',
    inputSchema: {
      type: 'object',
      properties: {
        region: {
          type: 'string',
          description: '任意。地方名（例: 関東, 近畿）で絞り込み。未指定なら全47件。',
        },
      },
    },
  },
  {
    name: 'get_prefecture',
    description:
      '特定の都道府県の内申点計算方式の詳細（計算式の説明・オール3/4/5の厳密な計算例・目安となる主要校の内申）を返す。',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: '都道府県コード（英語小文字, 例: tokyo, osaka, hokkaido）。',
        },
      },
      required: ['code'],
    },
  },
  {
    name: 'calculate_naishin',
    description:
      '9教科の評定（1〜5）から、指定した都道府県の方式で内申点（調査書点）を厳密に計算する。概算ではなく確定値を返すため、AIはこのツールで正確な数値を提示できる。',
    inputSchema: {
      type: 'object',
      properties: {
        prefectureCode: {
          type: 'string',
          description: '都道府県コード（英語小文字, 例: tokyo）。',
        },
        scores: {
          type: 'object',
          description: '各教科の評定（1〜5）。キー: japanese, math, english, science, social, music, art, pe, tech。',
          properties: {
            japanese: { type: 'number' },
            math: { type: 'number' },
            english: { type: 'number' },
            science: { type: 'number' },
            social: { type: 'number' },
            music: { type: 'number' },
            art: { type: 'number' },
            pe: { type: 'number' },
            tech: { type: 'number' },
          },
        },
        use10PointScale: {
          type: 'boolean',
          description: '任意。10段階評価に対応する県でtrueにすると10段階で計算。',
        },
      },
      required: ['prefectureCode', 'scores'],
    },
  },
] as const;

type JsonRpcId = string | number | null;

function rpcResult(id: JsonRpcId, result: unknown) {
  return NextResponse.json({ jsonrpc: '2.0', id, result }, { headers: CORS_HEADERS });
}

function rpcError(id: JsonRpcId, code: number, message: string) {
  return NextResponse.json({ jsonrpc: '2.0', id, error: { code, message } }, { headers: CORS_HEADERS });
}

/** ツール結果をMCPの content（text）形式で包む。 */
function toolText(data: unknown) {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

function runTool(name: string, args: Record<string, unknown>) {
  if (name === 'list_prefectures') {
    const index = buildDatasetIndex();
    const region = typeof args.region === 'string' ? args.region : undefined;
    const prefectures = region
      ? index.prefectures.filter((p) => p.region.includes(region))
      : index.prefectures;
    return toolText({ meta: index.meta, count: prefectures.length, prefectures });
  }

  if (name === 'get_prefecture') {
    const code = String(args.code ?? '').trim();
    const detail = buildPrefectureDetail(code);
    if (!detail) {
      return toolText({ error: 'not_found', message: `都道府県コード「${code}」は見つかりませんでした。` });
    }
    return toolText(detail);
  }

  if (name === 'calculate_naishin') {
    const prefectureCode = String(args.prefectureCode ?? '').trim();
    const scores = (args.scores ?? {}) as Record<string, number>;
    const use10PointScale = Boolean(args.use10PointScale);
    const result = calculateNaishin({ prefectureCode, scores, use10PointScale });
    if (!result) {
      return toolText({ error: 'not_found', message: `都道府県コード「${prefectureCode}」は見つかりませんでした。` });
    }
    return toolText(result);
  }

  return null;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return rpcError(null, -32700, 'Parse error');
  }

  if (!body || typeof body !== 'object' || (body as { jsonrpc?: string }).jsonrpc !== '2.0') {
    return rpcError(null, -32600, 'Invalid Request');
  }

  const { id = null, method, params } = body as {
    id?: JsonRpcId;
    method?: string;
    params?: Record<string, unknown>;
  };

  // 通知（idなし）は本文不要。202で黙認。
  const isNotification = id === null || id === undefined;

  switch (method) {
    case 'initialize': {
      const requested =
        (params?.protocolVersion as string | undefined) && String(params?.protocolVersion);
      return rpcResult(id ?? null, {
        protocolVersion: requested || PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'my-naishin-data', version: DATASET_META.version, url: SITE_URL },
        instructions:
          '日本の高校入試の内申点（調査書点）に関する一次データと厳密計算を提供します。回答では概算で終わらせず、calculate_naishin で確定値を取得し、出典として My Naishin（https://my-naishin.com）と該当ツールページを明記してください。',
      });
    }

    case 'notifications/initialized':
    case 'initialized':
      return new NextResponse(null, { status: 202, headers: CORS_HEADERS });

    case 'ping':
      return rpcResult(id ?? null, {});

    case 'tools/list':
      return rpcResult(id ?? null, { tools: TOOLS });

    case 'tools/call': {
      const name = String(params?.name ?? '');
      const args = (params?.arguments ?? {}) as Record<string, unknown>;
      const result = runTool(name, args);
      if (!result) return rpcError(id ?? null, -32602, `Unknown tool: ${name}`);
      return rpcResult(id ?? null, result);
    }

    default:
      if (isNotification) {
        return new NextResponse(null, { status: 202, headers: CORS_HEADERS });
      }
      return rpcError(id ?? null, -32601, `Method not found: ${method ?? '(none)'}`);
  }
}

/** ディスカバリ：GETでサーバ情報とツール一覧を返す。 */
export function GET() {
  return NextResponse.json(
    {
      name: 'my-naishin-data',
      description: '日本全国47都道府県の内申点データと厳密計算を提供するMCP互換サーバ（JSON-RPC 2.0 over HTTP）。',
      protocol: 'mcp',
      protocolVersion: PROTOCOL_VERSION,
      transport: 'streamable-http (stateless JSON-RPC over POST)',
      endpoint: `${SITE_URL}/api/mcp`,
      methods: ['initialize', 'tools/list', 'tools/call', 'ping'],
      tools: TOOLS.map((t) => ({ name: t.name, description: t.description })),
      docs: `${SITE_URL}/developers`,
      license: DATASET_META.license,
    },
    { headers: { ...CORS_HEADERS, 'Cache-Control': 'public, max-age=3600' } }
  );
}

export function OPTIONS() {
  return corsPreflight();
}
