#!/usr/bin/env node
// Search Console を Model Context Protocol (stdio) で公開するサーバー。
// scripts/ga4-mcp.mjs と同一パターン（自分のOAuth・node直接起動）。
//
// 2026-07-11補修: 旧来の外部パッケージ gsc-mcp-server（npx起動・~/.claude.jsonのユーザーレベル
// mcpServers）は疎通が不安定だった。GA4 MCPはnode直接起動（プロジェクトの.mcp.json）で
// このループ環境でも安定して動くことが実測済み（2026-07-10/11 worklog）なので、同じ構成に揃える。
//
// 前提: 一度 `npm run gsc:auth` を実行して .gsc/token.json を作成済みであること
//       （.ga4/client_secret.json を共用・スコープはwebmasters.readonlyのみ追加同意）。
// 鉄則: stdio MCP は stdout に MCP プロトコル以外を書いてはいけない（ログは必ず stderr=console.error）。
//
// 依存メモ（[[ga4-mcp-integration]]の教訓を踏襲）: 巨大な `googleapis` メタパッケージはこの環境で
// import に約20秒（AV/TLSスキャン税）かかり、MCPクライアントの起動待ちに響く。スコープ版
// `@googleapis/searchconsole` なら約0.3秒（実測）なのでこちらを使う（ga4-mcp.mjsが
// `@googleapis/analyticsdata` を使うのと同じ理由）。
import { searchconsole } from '@googleapis/searchconsole';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getAuthedClient, getSiteUrl } from './lib/gsc-client.mjs';

// GSCは集計に約2〜3日の遅延があるため、既定の終端は3日前（gsc-weekly-report.tsと同じ運用）。
const LAG_DAYS = 3;

function ymd(daysAgo) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function resolveDates({ startDate, endDate, days } = {}) {
  if (startDate || endDate) {
    return { startDate: startDate || ymd(LAG_DAYS + Number(days ?? 7)), endDate: endDate || ymd(LAG_DAYS) };
  }
  const window = Number(days ?? 7);
  return { startDate: ymd(LAG_DAYS + window), endDate: ymd(LAG_DAYS) };
}

function client() {
  return searchconsole({ version: 'v1', auth: getAuthedClient() });
}

function ok(obj) {
  return { content: [{ type: 'text', text: JSON.stringify(obj, null, 2) }] };
}

const siteUrlProp = {
  siteUrl: {
    type: 'string',
    description: '対象プロパティ（例 "sc-domain:my-naishin.com"）。省略時は .gsc/config.json または GSC_SITE_URL を使用。一度渡すと保存される。',
  },
};
const dateProps = {
  startDate: { type: 'string', description: '開始日 YYYY-MM-DD。省略時は days から逆算。' },
  endDate: { type: 'string', description: '終了日 YYYY-MM-DD。省略時は 3日前（GSCの集計遅延を考慮）。' },
  days: { type: 'number', description: 'startDate/endDate 未指定時の期間（既定7）。終端は常に3日前。' },
};

const TOOLS = [
  {
    name: 'gsc_query',
    description: 'Search Console の検索パフォーマンスを次元別に取得する（query/page/date/device/country）。最も汎用的なツール。',
    inputSchema: {
      type: 'object',
      properties: {
        ...siteUrlProp,
        ...dateProps,
        dimensions: {
          type: 'array',
          items: { type: 'string', enum: ['query', 'page', 'date', 'device', 'country'] },
          description: '次元の配列。例 ["query"], ["page"], ["date"]。省略時は次元なし（総計のみ）。',
        },
        rowLimit: { type: 'number', description: '最大行数（既定100・上限1000）。' },
        queryContains: { type: 'string', description: '絞り込み: クエリ文字列に含む（部分一致・簡易フィルタ）。' },
        pageContains: { type: 'string', description: '絞り込み: ページURLに含む（部分一致・簡易フィルタ）。' },
      },
    },
  },
  {
    name: 'gsc_totals',
    description: '次元なしの総計（clicks/impressions/ctr/position）を今期間で取得する。週次サマリのWoW比較に使う。',
    inputSchema: { type: 'object', properties: { ...siteUrlProp, ...dateProps } },
  },
  {
    name: 'gsc_sitemaps',
    description: '送信済みサイトマップの一覧と状態（最終処理日時・警告/エラー件数）を取得する。疎通・インデックス状況の健康診断に使う。',
    inputSchema: { type: 'object', properties: { ...siteUrlProp } },
  },
  {
    name: 'gsc_sites',
    description: 'この認証アカウントがアクセスできるSearch Consoleプロパティの一覧と権限レベルを取得する。疎通確認・「どのアカウント/サイトで繋がっているか」の診断に使う。',
    inputSchema: { type: 'object', properties: {} },
  },
];

async function runTool(name, args = {}) {
  const c = client();
  switch (name) {
    case 'gsc_query': {
      const siteUrl = getSiteUrl(args.siteUrl);
      const { startDate, endDate } = resolveDates(args);
      const dimensions = Array.isArray(args.dimensions) ? args.dimensions : [];
      const rowLimit = Math.min(1000, Number(args.rowLimit ?? 100));
      const dimensionFilterGroups = [];
      const filters = [];
      if (args.queryContains) filters.push({ dimension: 'query', operator: 'contains', expression: String(args.queryContains) });
      if (args.pageContains) filters.push({ dimension: 'page', operator: 'contains', expression: String(args.pageContains) });
      if (filters.length) dimensionFilterGroups.push({ filters });
      const res = await c.searchanalytics.query({
        siteUrl,
        requestBody: { startDate, endDate, dimensions, rowLimit, ...(dimensionFilterGroups.length ? { dimensionFilterGroups } : {}) },
      });
      const rows = (res.data.rows || []).map((r) => ({
        ...(dimensions.length ? Object.fromEntries(dimensions.map((d, i) => [d, r.keys?.[i]])) : {}),
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      }));
      return ok({ siteUrl, dateRange: { startDate, endDate }, dimensions, rowCount: rows.length, rows });
    }
    case 'gsc_totals': {
      const siteUrl = getSiteUrl(args.siteUrl);
      const { startDate, endDate } = resolveDates(args);
      const res = await c.searchanalytics.query({ siteUrl, requestBody: { startDate, endDate, rowLimit: 1 } });
      const row = (res.data.rows || [])[0] || {};
      return ok({
        siteUrl,
        dateRange: { startDate, endDate },
        clicks: row.clicks ?? 0,
        impressions: row.impressions ?? 0,
        ctr: row.ctr ?? 0,
        position: row.position ?? null,
      });
    }
    case 'gsc_sitemaps': {
      const siteUrl = getSiteUrl(args.siteUrl);
      const res = await c.sitemaps.list({ siteUrl });
      const sitemaps = (res.data.sitemap || []).map((s) => ({
        path: s.path,
        lastSubmitted: s.lastSubmitted,
        lastDownloaded: s.lastDownloaded,
        isPending: s.isPending,
        isSitemapsIndex: s.isSitemapsIndex,
        warnings: s.warnings,
        errors: s.errors,
        contents: s.contents,
      }));
      return ok({ siteUrl, count: sitemaps.length, sitemaps });
    }
    case 'gsc_sites': {
      const res = await c.sites.list({});
      const sites = (res.data.siteEntry || []).map((s) => ({ siteUrl: s.siteUrl, permissionLevel: s.permissionLevel }));
      return ok({ count: sites.length, sites });
    }
    default:
      throw new Error(`不明なツール: ${name}`);
  }
}

const server = new Server({ name: 'gsc-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  try {
    return await runTool(req.params.name, req.params.arguments || {});
  } catch (e) {
    console.error('[gsc-mcp] tool error:', req.params.name, e?.message || e);
    return { content: [{ type: 'text', text: `エラー: ${e?.message || String(e)}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('[gsc-mcp] started (stdio)');
