#!/usr/bin/env node
// GA4 を Model Context Protocol (stdio) で公開するサーバー。
// 認証は scripts/lib/ga4-client.mjs の OAuth（自分のGoogleアカウント・readonly スコープ）を再利用するので、
// サービスアカウントの「プロパティへユーザー追加」問題を回避できる。
// Claude Code はこの MCP の `ga4_*` ツールから直接 GA4 を読める。
//
// 前提: 一度 `npm run ga4:auth` を実行して .ga4/token.json を作成済みであること。
// 鉄則: stdio MCP は stdout に MCP プロトコル以外を書いてはいけない（ログは必ず stderr=console.error）。
import { analyticsdata } from '@googleapis/analyticsdata';
import { analyticsadmin } from '@googleapis/analyticsadmin';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getAuthedClient, getPropertyId } from './lib/ga4-client.mjs';
import { PRESETS } from './lib/ga4-presets.mjs';

// ---- 共通ヘルパ ------------------------------------------------------------
function resolveDates({ startDate, endDate, days } = {}) {
  // start/end が来たらそれを優先。無ければ days（既定28）の相対指定。
  // 値は 'YYYY-MM-DD' でも 'NdaysAgo' / 'today' / 'yesterday' でも可。
  if (startDate || endDate) return { startDate: startDate || '28daysAgo', endDate: endDate || 'today' };
  const d = Number(days ?? 28);
  return { startDate: `${d}daysAgo`, endDate: 'today' };
}

function toList(v) {
  if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
  if (typeof v === 'string') return v.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

function buildOrderBys(orderBy, dimensions, desc) {
  if (!orderBy) return undefined;
  const descending = desc !== false; // 既定は降順
  return dimensions.includes(orderBy)
    ? [{ dimension: { dimensionName: orderBy }, desc: descending }]
    : [{ metric: { metricName: orderBy }, desc: descending }];
}

// runReport/runRealtimeReport のレスポンスを扱いやすい形に整形する。
function tidy(data) {
  const dimHeaders = (data.dimensionHeaders || []).map((h) => h.name);
  const metHeaders = (data.metricHeaders || []).map((h) => h.name);
  const rows = (data.rows || []).map((row) => {
    const o = {};
    (row.dimensionValues || []).forEach((d, i) => (o[dimHeaders[i]] = d.value));
    (row.metricValues || []).forEach((m, i) => (o[metHeaders[i]] = m.value));
    return o;
  });
  const totals = data.totals?.[0]?.metricValues
    ? Object.fromEntries(metHeaders.map((h, i) => [h, data.totals[0].metricValues[i]?.value]))
    : undefined;
  return { rowCount: data.rowCount ?? rows.length, dimensions: dimHeaders, metrics: metHeaders, rows, totals };
}

const dataApi = () => analyticsdata({ version: 'v1beta', auth: getAuthedClient() });
const adminApi = () => analyticsadmin({ version: 'v1beta', auth: getAuthedClient() });

function ok(obj) {
  return { content: [{ type: 'text', text: JSON.stringify(obj, null, 2) }] };
}

// ---- ツール定義 ------------------------------------------------------------
const propertyProp = {
  property: {
    type: 'string',
    description: '数値の GA4 プロパティID（例 "123456789"）。省略時は .ga4/config.json または GA4_PROPERTY_ID を使用。一度渡すと保存される。',
  },
};
const dateProps = {
  startDate: { type: 'string', description: '開始日 YYYY-MM-DD または "28daysAgo" 等。end と併用。' },
  endDate: { type: 'string', description: '終了日 YYYY-MM-DD または "today"。' },
  days: { type: 'number', description: 'start/end 未指定時の相対期間（既定28）。' },
};

const TOOLS = [
  {
    name: 'ga4_run_report',
    description:
      'GA4 Data API の runReport を実行し、任意の指標×ディメンションのレポートを取得する。最も汎用的なツール。',
    inputSchema: {
      type: 'object',
      properties: {
        ...propertyProp,
        metrics: {
          type: 'array',
          items: { type: 'string' },
          description: '指標名の配列。例 ["screenPageViews","totalUsers","sessions","engagedSessions"]',
        },
        dimensions: {
          type: 'array',
          items: { type: 'string' },
          description: 'ディメンション名の配列。例 ["pagePath"], ["date"], ["sessionDefaultChannelGroup"]',
        },
        ...dateProps,
        orderBy: { type: 'string', description: '並べ替えに使う指標/ディメンション名。' },
        desc: { type: 'boolean', description: '降順か（既定 true）。' },
        limit: { type: 'number', description: '最大行数（既定100）。' },
        dimensionFilter: { type: 'object', description: '高度: GA4 の FilterExpression をそのまま渡す。' },
        metricFilter: { type: 'object', description: '高度: 指標側 FilterExpression。' },
        keepEmptyRows: { type: 'boolean', description: '値0の行も残すか。' },
      },
      required: ['metrics'],
    },
  },
  {
    name: 'ga4_preset',
    description:
      'よく使うレポートを名前で実行する近道。preset: ' + Object.keys(PRESETS).join(' / '),
    inputSchema: {
      type: 'object',
      properties: {
        preset: { type: 'string', enum: Object.keys(PRESETS), description: 'プリセット名。' },
        ...propertyProp,
        ...dateProps,
        limit: { type: 'number', description: 'プリセット既定を上書きする最大行数。' },
      },
      required: ['preset'],
    },
  },
  {
    name: 'ga4_realtime_report',
    description: '直近約30分のリアルタイムレポート（runRealtimeReport）。今まさに見られているページ等。',
    inputSchema: {
      type: 'object',
      properties: {
        ...propertyProp,
        metrics: { type: 'array', items: { type: 'string' }, description: '既定 ["activeUsers"]。' },
        dimensions: { type: 'array', items: { type: 'string' }, description: '例 ["unifiedScreenName"], ["country"]。' },
        limit: { type: 'number', description: '最大行数（既定50）。' },
      },
    },
  },
  {
    name: 'ga4_metadata',
    description: 'このプロパティで使用可能なディメンション・指標の一覧（API名/UI名）を取得する。指標名が分からない時に使う。',
    inputSchema: { type: 'object', properties: { ...propertyProp } },
  },
  {
    name: 'ga4_list_properties',
    description: 'アクセスできる GA4 アカウント／プロパティと数値プロパティIDの一覧。"どのIDを使う?" を解決する。',
    inputSchema: { type: 'object', properties: {} },
  },
];

// ---- ツール実行 ------------------------------------------------------------
async function handle(name, args = {}) {
  switch (name) {
    case 'ga4_run_report': {
      const property = `properties/${getPropertyId(args.property)}`;
      const metrics = toList(args.metrics);
      const dimensions = toList(args.dimensions);
      if (!metrics.length) throw new Error('metrics を1つ以上指定してください。');
      const requestBody = {
        dateRanges: [resolveDates(args)],
        metrics: metrics.map((n) => ({ name: n })),
        limit: Number(args.limit ?? 100),
      };
      if (dimensions.length) requestBody.dimensions = dimensions.map((n) => ({ name: n }));
      const orderBys = buildOrderBys(args.orderBy, dimensions, args.desc);
      if (orderBys) requestBody.orderBys = orderBys;
      if (args.dimensionFilter) requestBody.dimensionFilter = args.dimensionFilter;
      if (args.metricFilter) requestBody.metricFilter = args.metricFilter;
      if (args.keepEmptyRows) requestBody.keepEmptyRows = true;
      const { data } = await dataApi().properties.runReport({ property, requestBody });
      return ok({ property, dateRange: requestBody.dateRanges[0], ...tidy(data) });
    }

    case 'ga4_preset': {
      const p = PRESETS[args.preset];
      if (!p) throw new Error(`未知のプリセット "${args.preset}"。利用可能: ${Object.keys(PRESETS).join(', ')}`);
      const property = `properties/${getPropertyId(args.property)}`;
      const metrics = toList(p.metrics);
      const dimensions = toList(p.dimensions);
      const requestBody = {
        dateRanges: [resolveDates(args)],
        metrics: metrics.map((n) => ({ name: n })),
        limit: Number(args.limit ?? p.limit ?? 100),
      };
      if (dimensions.length) requestBody.dimensions = dimensions.map((n) => ({ name: n }));
      const orderBys = buildOrderBys(p.orderBy, dimensions, p.asc === true ? false : true);
      if (orderBys) requestBody.orderBys = orderBys;
      const { data } = await dataApi().properties.runReport({ property, requestBody });
      return ok({ preset: args.preset, property, dateRange: requestBody.dateRanges[0], ...tidy(data) });
    }

    case 'ga4_realtime_report': {
      const property = `properties/${getPropertyId(args.property)}`;
      const metrics = toList(args.metrics);
      const dimensions = toList(args.dimensions);
      const requestBody = {
        metrics: (metrics.length ? metrics : ['activeUsers']).map((n) => ({ name: n })),
        limit: Number(args.limit ?? 50),
      };
      if (dimensions.length) requestBody.dimensions = dimensions.map((n) => ({ name: n }));
      const { data } = await dataApi().properties.runRealtimeReport({ property, requestBody });
      return ok({ property, realtime: true, ...tidy(data) });
    }

    case 'ga4_metadata': {
      const property = getPropertyId(args.property);
      const { data } = await dataApi().properties.getMetadata({ name: `properties/${property}/metadata` });
      return ok({
        property: `properties/${property}`,
        dimensions: (data.dimensions || []).map((d) => ({ apiName: d.apiName, uiName: d.uiName, category: d.category })),
        metrics: (data.metrics || []).map((m) => ({ apiName: m.apiName, uiName: m.uiName, type: m.type, category: m.category })),
      });
    }

    case 'ga4_list_properties': {
      const { data } = await adminApi().accountSummaries.list({ pageSize: 200 });
      const accounts = (data.accountSummaries || []).map((a) => ({
        account: a.account,
        accountName: a.displayName,
        properties: (a.propertySummaries || []).map((p) => ({
          propertyId: String(p.property || '').replace('properties/', ''),
          displayName: p.displayName,
          propertyType: p.propertyType,
        })),
      }));
      return ok({ accounts });
    }

    default:
      throw new Error(`未知のツール: ${name}`);
  }
}

// ---- MCP 配線 --------------------------------------------------------------
const server = new Server({ name: 'ga4', version: '1.0.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  try {
    return await handle(name, args || {});
  } catch (e) {
    const msg = e?.errors?.[0]?.message || e?.message || String(e);
    let hint = '';
    if (/認証トークンがありません|invalid_grant|No refresh token|Token has been expired/.test(msg))
      hint = ' → `npm run ga4:auth` を（再）実行してトークンを作成してください。';
    else if (/PERMISSION_DENIED|403/.test(msg))
      hint = ' → このGoogleアカウントが対象プロパティの閲覧権限を持つか、Cloudプロジェクトで Analytics Data/Admin API が有効か確認。';
    else if (/プロパティID/.test(msg)) hint = ' → ga4_list_properties で数値IDを調べ、property 引数で一度渡してください。';
    return { content: [{ type: 'text', text: `GA4エラー: ${msg}${hint}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('[ga4-mcp] started (stdio). tools:', TOOLS.map((t) => t.name).join(', '));
