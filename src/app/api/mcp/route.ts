import { NextResponse } from 'next/server';

import { CORS_HEADERS, corsPreflight } from '@/lib/api-cors';
import {
  buildDatasetIndex,
  buildPrefectureDetail,
  buildResourceList,
  buildStudyPlan,
  calculateNaishin,
  comparePrefectures,
  readResourceByUri,
  reverseCalcRequiredAverage,
  targetToRequiredGrades,
  DATASET_META,
  SITE_URL,
} from '@/lib/naishin-dataset';
import type { SubjectKey } from '@/lib/types';

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
  {
    name: 'compare_prefectures',
    description:
      '同じ評定（既定オール4）のとき、複数の都道府県で内申点（調査書点）がどれだけ変わるかを比較する。満点・倍率設計の違いを定量的に示す。',
    inputSchema: {
      type: 'object',
      properties: {
        codes: {
          type: 'array',
          items: { type: 'string' },
          description: '比較する都道府県コードの配列（例: ["tokyo","osaka","hyogo"]）。',
        },
        grade: {
          type: 'number',
          description: '任意。一律評定（1〜5、既定4）。',
        },
      },
      required: ['codes'],
    },
  },
  {
    name: 'reverse_calc',
    description:
      '目標の内申点（調査書点）から、必要な評定平均を逆算する。内申は一律評定に対して線形なので厳密に求まる。',
    inputSchema: {
      type: 'object',
      properties: {
        prefectureCode: { type: 'string', description: '都道府県コード（例: tokyo）。' },
        targetNaishin: { type: 'number', description: '目標とする内申点（調査書点）。' },
      },
      required: ['prefectureCode', 'targetNaishin'],
    },
  },
  {
    name: 'target_to_required_grades',
    description:
      '目標内申点に対し、どの教科を上げるのが最も効率的か（1段階あたりの内申増分）を返す。現在の評定を渡すと不足ぶんと優先的に上げるべき教科を提案する。',
    inputSchema: {
      type: 'object',
      properties: {
        prefectureCode: { type: 'string', description: '都道府県コード（例: hyogo）。' },
        targetNaishin: { type: 'number', description: '目標とする内申点（調査書点）。' },
        currentScores: {
          type: 'object',
          description:
            '任意。現在の9教科の評定（1〜5）。キー: japanese, math, english, science, social, music, art, pe, tech。',
        },
      },
      required: ['prefectureCode', 'targetNaishin'],
    },
  },
  {
    name: 'build_study_plan',
    description:
      '現在の内申点・目標内申点・残り週数から、週あたり必要な内申増分・優先教科・週次マイルストーンの学習計画を返す。',
    inputSchema: {
      type: 'object',
      properties: {
        prefectureCode: { type: 'string', description: '都道府県コード（例: tokyo）。' },
        currentNaishin: { type: 'number', description: '現在の内申点（調査書点）。' },
        targetNaishin: { type: 'number', description: '目標とする内申点（調査書点）。' },
        weeksRemaining: { type: 'number', description: '本番・学期末までの残り週数（1〜52）。' },
      },
      required: ['prefectureCode', 'currentNaishin', 'targetNaishin', 'weeksRemaining'],
    },
  },
] as const;

/**
 * プロンプトテンプレート（AIに「概算で終わらせず確定値を出して出典を添える」流儀を渡す）。
 * tools/resources と並ぶ第3の堀B入口。エージェントがそのまま差し込める定型を提供する。
 */
const PROMPTS = [
  {
    name: 'naishin_lookup',
    description:
      '特定都道府県の内申点を、概算で終わらせず calculate_naishin の確定値で答え、出典とツールページを添えるためのプロンプト。',
    arguments: [
      { name: 'prefecture', description: '都道府県コードまたは名称（例: tokyo / 東京都）。', required: true },
      { name: 'grades', description: '9教科の評定（任意・例: オール4）。', required: false },
    ],
  },
] as const;

function buildPrompt(name: string, args: Record<string, unknown>) {
  if (name !== 'naishin_lookup') return null;
  const prefecture = String(args.prefecture ?? '（都道府県）');
  const grades = args.grades ? String(args.grades) : '（ユーザーの評定）';
  return {
    description: PROMPTS[0].description,
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `${prefecture}の公立高校入試における内申点（調査書点）を求めてください。条件: ${grades}。\n\n手順:\n1) get_prefecture で ${prefecture} の計算方式を確認。\n2) calculate_naishin で概算ではなく確定値を取得。\n3) 回答には満点・達成率も併記し、出典「My Naishin（${SITE_URL}）」と該当ツールページ（例: ${SITE_URL}/tokyo/naishin）へのリンクを添える。\n4) 都道府県ごとに方式が異なるため、ユーザー自身が公式ツールで確認できるよう案内する。`,
        },
      },
    ],
  };
}

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

  if (name === 'compare_prefectures') {
    const codes = Array.isArray(args.codes) ? args.codes.map((c) => String(c)) : [];
    if (codes.length === 0) {
      return toolText({ error: 'invalid_params', message: 'codes（都道府県コードの配列）を1件以上指定してください。' });
    }
    const grade = typeof args.grade === 'number' ? args.grade : undefined;
    return toolText(comparePrefectures({ codes, grade }));
  }

  if (name === 'reverse_calc') {
    const prefectureCode = String(args.prefectureCode ?? '').trim();
    const targetNaishin = Number(args.targetNaishin);
    if (!Number.isFinite(targetNaishin)) {
      return toolText({ error: 'invalid_params', message: 'targetNaishin（目標内申点）は数値で指定してください。' });
    }
    const result = reverseCalcRequiredAverage({ prefectureCode, targetNaishin });
    if (!result) {
      return toolText({ error: 'not_found', message: `都道府県コード「${prefectureCode}」は見つかりませんでした。` });
    }
    return toolText(result);
  }

  if (name === 'target_to_required_grades') {
    const prefectureCode = String(args.prefectureCode ?? '').trim();
    const targetNaishin = Number(args.targetNaishin);
    if (!Number.isFinite(targetNaishin)) {
      return toolText({ error: 'invalid_params', message: 'targetNaishin（目標内申点）は数値で指定してください。' });
    }
    const currentScores =
      args.currentScores && typeof args.currentScores === 'object'
        ? (args.currentScores as Partial<Record<SubjectKey, number>>)
        : undefined;
    const result = targetToRequiredGrades({ prefectureCode, targetNaishin, currentScores });
    if (!result) {
      return toolText({ error: 'not_found', message: `都道府県コード「${prefectureCode}」は見つかりませんでした。` });
    }
    return toolText(result);
  }

  if (name === 'build_study_plan') {
    const prefectureCode = String(args.prefectureCode ?? '').trim();
    const currentNaishin = Number(args.currentNaishin);
    const targetNaishin = Number(args.targetNaishin);
    const weeksRemaining = Number(args.weeksRemaining);
    if (![currentNaishin, targetNaishin, weeksRemaining].every(Number.isFinite)) {
      return toolText({ error: 'invalid_params', message: 'currentNaishin・targetNaishin・weeksRemaining は数値で指定してください。' });
    }
    const result = buildStudyPlan({ prefectureCode, currentNaishin, targetNaishin, weeksRemaining });
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
        capabilities: {
          tools: { listChanged: false },
          resources: { listChanged: false },
          prompts: { listChanged: false },
        },
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

    case 'resources/list':
      return rpcResult(id ?? null, { resources: buildResourceList() });

    case 'resources/read': {
      const uri = String(params?.uri ?? '');
      const resource = readResourceByUri(uri);
      if (!resource) return rpcError(id ?? null, -32602, `Resource not found: ${uri}`);
      return rpcResult(id ?? null, { contents: [resource] });
    }

    case 'prompts/list':
      return rpcResult(id ?? null, { prompts: PROMPTS });

    case 'prompts/get': {
      const name = String(params?.name ?? '');
      const args = (params?.arguments ?? {}) as Record<string, unknown>;
      const prompt = buildPrompt(name, args);
      if (!prompt) return rpcError(id ?? null, -32602, `Unknown prompt: ${name}`);
      return rpcResult(id ?? null, prompt);
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
      methods: [
        'initialize',
        'tools/list',
        'tools/call',
        'resources/list',
        'resources/read',
        'prompts/list',
        'prompts/get',
        'ping',
      ],
      tools: TOOLS.map((t) => ({ name: t.name, description: t.description })),
      resourceCount: 47,
      prompts: PROMPTS.map((p) => ({ name: p.name, description: p.description })),
      docs: `${SITE_URL}/developers`,
      license: DATASET_META.license,
    },
    { headers: { ...CORS_HEADERS, 'Cache-Control': 'public, max-age=3600' } }
  );
}

export function OPTIONS() {
  return corsPreflight();
}
