#!/usr/bin/env node
// Google Trends を Model Context Protocol (stdio) で公開するサーバー。
// scripts/ga4-mcp.mjs / scripts/gsc-mcp.mjs と同一パターン（node直接起動・プロジェクトの.mcp.json）。
//
// 前提: 認証は不要（Trendsは公開データ）。初回起動時に .trends/ が自動生成される。
// 鉄則: stdio MCP は stdout に MCPプロトコル以外を書いてはいけない（ログは必ず console.error）。
//
// 安定化の実装は scripts/lib/trends-client.mjs 側（直列キュー・cookie自動更新・指数バックオフ・
// stale-if-error キャッシュ）。このファイルは薄いツール定義に徹する。
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import {
  CFG,
  clearCache,
  health,
  interestByRegion,
  interestOverTime,
  relatedQueries,
  relatedTopics,
  seasonality,
  suggestions,
  trendingNow,
} from './lib/trends-client.mjs';

function ok(obj) {
  return { content: [{ type: 'text', text: JSON.stringify(obj, null, 2) }] };
}

const kwProp = {
  keywords: {
    type: 'array',
    items: { type: 'string' },
    description: '検索語の配列（最大5件。2件以上入れると相対比較になる）。例 ["内申点","偏差値"]',
  },
};
const commonProps = {
  geo: {
    type: 'string',
    description: `地域コード。既定 "${CFG.geo}"。都道府県は "JP-13"(東京)のような ISO 3166-2。"" で全世界。`,
  },
  timeframe: {
    type: 'string',
    description:
      '期間。now 1-H / now 4-H / now 1-d / now 7-d / today 1-m / today 3-m / today 12-m / today 5-y / all、または "YYYY-MM-DD YYYY-MM-DD"。既定 today 12-m。',
  },
  category: { type: 'number', description: 'TrendsのカテゴリID（既定0=すべて）。例 958=Education。' },
  property: {
    type: 'string',
    description: '検索面。"" (ウェブ) / images / news / youtube / froogle。既定は ""。',
  },
  noCache: { type: 'boolean', description: 'true でキャッシュを無視して取り直す（既定false）。' },
  cacheTtlMinutes: { type: 'number', description: `キャッシュ有効期間（分）。既定 ${CFG.cacheTtlMs / 60000}。` },
};

const TOOLS = [
  {
    name: 'trends_interest_over_time',
    description:
      'Google Trends の時系列（0-100の相対検索インデックス）を取得する。最も汎用的なツール。複数キーワードを渡すと同一スケールでの比較になる（=市場規模の比率が読める）。',
    inputSchema: { type: 'object', properties: { ...kwProp, ...commonProps }, required: ['keywords'] },
  },
  {
    name: 'trends_interest_by_region',
    description:
      '地域別の関心度を取得する。geo="JP" + resolution="REGION" で47都道府県の相対値が出る（県別コンテンツの優先順位付けに使う）。',
    inputSchema: {
      type: 'object',
      properties: {
        ...kwProp,
        ...commonProps,
        resolution: {
          type: 'string',
          enum: ['COUNTRY', 'REGION', 'CITY', 'DMA'],
          description: '粒度。国内なら REGION（都道府県）、geo="" なら COUNTRY。既定は geo 有りで REGION。',
        },
      },
      required: ['keywords'],
    },
  },
  {
    name: 'trends_related_queries',
    description:
      '関連する検索クエリを top（人気）と rising（急上昇）で取得する。rising の "Breakout" は +5000%超を意味する。新規ページの種を探すのに使う。',
    inputSchema: { type: 'object', properties: { ...kwProp, ...commonProps }, required: ['keywords'] },
  },
  {
    name: 'trends_related_topics',
    description:
      '関連トピック（エンティティ単位）を top / rising で取得する。⚠️ 2026-08-30時点でGoogle側が常に空配列を返すため実質使えない（available:false と note が付いて返る）。関連語が欲しいときは trends_related_queries を使うこと。',
    inputSchema: { type: 'object', properties: { ...kwProp, ...commonProps }, required: ['keywords'] },
  },
  {
    name: 'trends_seasonality',
    description:
      '過去5年の週次データから月別平均指数・ピーク月・季節係数（最大月÷最小月）を計算する。単一キーワード専用。「いつ仕込めば間に合うか」の判断に使う。',
    inputSchema: {
      type: 'object',
      properties: {
        keyword: { type: 'string', description: '対象の検索語（1件）。' },
        geo: commonProps.geo,
        timeframe: { type: 'string', description: '既定 "today 5-y"。短くすると精度が落ちる。' },
        category: commonProps.category,
        noCache: commonProps.noCache,
      },
      required: ['keyword'],
    },
  },
  {
    name: 'trends_trending_now',
    description:
      '今まさに急上昇している検索（Trending now / RSS）を取得する。トークン不要の安定エンドポイント。既定はキャッシュ20分。',
    inputSchema: {
      type: 'object',
      properties: {
        geo: { type: 'string', description: `国コード。既定 "${CFG.geo}"。` },
        limit: { type: 'number', description: '件数（既定20・上限50）。' },
        noCache: commonProps.noCache,
      },
    },
  },
  {
    name: 'trends_suggestions',
    description:
      'Trends のトピック候補（オートコンプリート）を取得する。同名異義の切り分けや、キーワードが Trends 上でどう認識されているかの確認に使う。',
    inputSchema: {
      type: 'object',
      properties: { keyword: { type: 'string', description: '調べたい語。' }, noCache: commonProps.noCache },
      required: ['keyword'],
    },
  },
  {
    name: 'trends_health',
    description:
      '疎通・設定・cookie状態・キャッシュ・リトライ統計を返す診断ツール。値がおかしい/遅いときはまずこれを実行する。clearCache=true でキャッシュを全消去する。',
    inputSchema: {
      type: 'object',
      properties: {
        probe: { type: 'boolean', description: '実際に1本取得して疎通確認する（既定true）。' },
        clearCache: { type: 'boolean', description: 'true でキャッシュを全消去してから診断する（既定false）。' },
      },
    },
  },
];

async function runTool(name, args = {}) {
  switch (name) {
    case 'trends_interest_over_time':
      return ok(await interestOverTime(args));
    case 'trends_interest_by_region':
      return ok(await interestByRegion(args));
    case 'trends_related_queries':
      return ok(await relatedQueries(args));
    case 'trends_related_topics':
      return ok(await relatedTopics(args));
    case 'trends_seasonality':
      return ok(await seasonality(args));
    case 'trends_trending_now':
      return ok(await trendingNow(args));
    case 'trends_suggestions':
      return ok(await suggestions(args));
    case 'trends_health': {
      const cleared = args.clearCache ? clearCache() : null;
      const h = await health({ probe: args.probe !== false });
      return ok(cleared ? { ...h, cleared } : h);
    }
    default:
      throw new Error(`不明なツール: ${name}`);
  }
}

const server = new Server({ name: 'trends-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  try {
    return await runTool(req.params.name, req.params.arguments || {});
  } catch (e) {
    console.error('[trends-mcp] tool error:', req.params.name, e?.message || e);
    return { content: [{ type: 'text', text: `エラー: ${e?.message || String(e)}` }], isError: true };
  }
});

// 予期しない例外でサーバーが黙って死ぬのを防ぐ（stdioが切れるとMCPが「接続失敗」になるだけで
// 原因が見えない。必ずstderrに残してプロセスは生かす）。
process.on('unhandledRejection', (e) => console.error('[trends-mcp] unhandledRejection:', e?.message || e));
process.on('uncaughtException', (e) => console.error('[trends-mcp] uncaughtException:', e?.message || e));

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('[trends-mcp] started (stdio)');
