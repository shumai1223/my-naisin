#!/usr/bin/env node
// AdSense を Model Context Protocol (stdio) で公開するサーバー。
// scripts/gsc-mcp.mjs と同一パターン（自分のOAuth・node直接起動・読み取り専用）。
// 2026-09-26 新設: AdSense 稼働（9/25点火）後の RPM・視認率・ユニット別の数字を、
// 👤がスクリーンショットを貼らなくても対話セッションから直接読めるようにするため。
//
// 前提: 一度 `npm run adsense:auth` を実行して .adsense/token.json を作成済みであること
//       （.ga4/client_secret.json を共用・スコープは adsense.readonly のみ）。
//       Google Cloud 側で「AdSense Management API」が有効になっていること。
// 鉄則: stdio MCP は stdout に MCP プロトコル以外を書いてはいけない（ログは必ず stderr）。
// 依存メモ: フル `googleapis` は import が重いので、スコープ版 `@googleapis/adsense` を使う。
//
// ⚠️ 読み取り専用。広告設定・支払い情報を変更するツールは作らない。
import { adsense } from '@googleapis/adsense';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { getAuthedClient, DEFAULT_ACCOUNT } from './lib/adsense-client.mjs';

function client() {
  return adsense({ version: 'v2', auth: getAuthedClient() });
}

function ok(obj) {
  return { content: [{ type: 'text', text: JSON.stringify(obj, null, 2) }] };
}

// 既定で取る指標（UIの「ページRPM・表示回数RPM・アクティブビュー視認可能」に対応）。
const DEFAULT_METRICS = [
  'ESTIMATED_EARNINGS',
  'PAGE_VIEWS',
  'PAGE_VIEWS_RPM',
  'IMPRESSIONS',
  'IMPRESSIONS_RPM',
  'ACTIVE_VIEW_VIEWABILITY',
  'CLICKS',
];

const DATE_RANGES = ['TODAY', 'YESTERDAY', 'MONTH_TO_DATE', 'YEAR_TO_DATE', 'LAST_7_DAYS', 'LAST_30_DAYS'];

function ymdParts(s) {
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) throw new Error(`日付は YYYY-MM-DD で指定してください: ${s}`);
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}

// generate のレスポンス（headers + rows[].cells[].value）を、見出し名をキーにしたオブジェクト配列にする。
function tabulate(data) {
  const headers = (data.headers || []).map((h) => h.name);
  const toObj = (cells) => Object.fromEntries((cells || []).map((c, i) => [headers[i], c.value ?? null]));
  return {
    headers,
    rowCount: Number(data.totalMatchedRows ?? (data.rows || []).length),
    rows: (data.rows || []).map((r) => toObj(r.cells)),
    totals: data.totals ? toObj(data.totals.cells) : null,
    averages: data.averages ? toObj(data.averages.cells) : null,
    warnings: data.warnings || [],
    startDate: data.startDate,
    endDate: data.endDate,
  };
}

const TOOLS = [
  {
    name: 'adsense_report',
    description:
      'AdSense のレポートを取得する（読み取り専用）。既定は直近7日・日別・主要指標（見積もり収益・ページビュー・ページRPM・表示回数・表示回数RPM・視認率・クリック）。金額は日本円。' +
      '次元の例: DATE, AD_UNIT_NAME, AD_FORMAT_NAME, PLATFORM_TYPE_NAME, BUYER_NETWORK_NAME, COUNTRY_NAME, DOMAIN_NAME。',
    inputSchema: {
      type: 'object',
      properties: {
        dateRange: { type: 'string', enum: [...DATE_RANGES, 'CUSTOM'], description: '期間のプリセット（既定 LAST_7_DAYS）。CUSTOM のときは startDate/endDate を指定。' },
        startDate: { type: 'string', description: 'YYYY-MM-DD（dateRange=CUSTOM または省略時に指定すると CUSTOM 扱い）' },
        endDate: { type: 'string', description: 'YYYY-MM-DD' },
        dimensions: { type: 'array', items: { type: 'string' }, description: '次元（既定 ["DATE"]）。空配列なら合計のみ。' },
        metrics: { type: 'array', items: { type: 'string' }, description: `指標（既定 ${DEFAULT_METRICS.join(', ')}）` },
        orderBy: { type: 'array', items: { type: 'string' }, description: '並び順。例 ["-ESTIMATED_EARNINGS"]（先頭の - で降順）' },
        limit: { type: 'number', description: '最大行数（既定 100）' },
        account: { type: 'string', description: `アカウント（既定 ${DEFAULT_ACCOUNT}）` },
      },
    },
  },
  {
    name: 'adsense_accounts',
    description: 'この認証アカウントで見られる AdSense アカウントの一覧（疎通確認用）。',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'adsense_alerts',
    description: 'AdSense の警告（ポリシー違反・無効トラフィック・支払い関連など）の一覧。',
    inputSchema: { type: 'object', properties: { account: { type: 'string' } } },
  },
  {
    name: 'adsense_payments',
    description: 'AdSense の支払い（未払い残高・過去の支払い）の一覧。',
    inputSchema: { type: 'object', properties: { account: { type: 'string' } } },
  },
];

async function runTool(name, args) {
  const c = client();
  const account = args.account || DEFAULT_ACCOUNT;
  switch (name) {
    case 'adsense_report': {
      const useCustom = args.dateRange === 'CUSTOM' || (!args.dateRange && (args.startDate || args.endDate));
      const params = {
        account,
        dateRange: useCustom ? 'CUSTOM' : args.dateRange || 'LAST_7_DAYS',
        metrics: args.metrics?.length ? args.metrics : DEFAULT_METRICS,
        dimensions: Array.isArray(args.dimensions) ? args.dimensions : ['DATE'],
        currencyCode: 'JPY',
        languageCode: 'ja',
        reportingTimeZone: 'ACCOUNT_TIME_ZONE',
        limit: Number(args.limit ?? 100),
      };
      if (args.orderBy?.length) params.orderBy = args.orderBy;
      if (useCustom) {
        if (!args.startDate || !args.endDate) throw new Error('CUSTOM のときは startDate と endDate の両方が必要です。');
        const s = ymdParts(args.startDate);
        const e = ymdParts(args.endDate);
        params['startDate.year'] = s.year;
        params['startDate.month'] = s.month;
        params['startDate.day'] = s.day;
        params['endDate.year'] = e.year;
        params['endDate.month'] = e.month;
        params['endDate.day'] = e.day;
      }
      const res = await c.accounts.reports.generate(params);
      return ok({ account, dateRange: params.dateRange, ...tabulate(res.data) });
    }
    case 'adsense_accounts': {
      const res = await c.accounts.list({});
      const accounts = (res.data.accounts || []).map((a) => ({
        name: a.name,
        displayName: a.displayName,
        state: a.state,
        timeZone: a.timeZone?.id,
        createTime: a.createTime,
      }));
      return ok({ count: accounts.length, accounts });
    }
    case 'adsense_alerts': {
      const res = await c.accounts.alerts.list({ parent: account, languageCode: 'ja' });
      const alerts = (res.data.alerts || []).map((a) => ({ severity: a.severity, type: a.type, message: a.message }));
      return ok({ account, count: alerts.length, alerts });
    }
    case 'adsense_payments': {
      const res = await c.accounts.payments.list({ parent: account });
      const payments = (res.data.payments || []).map((p) => ({ name: p.name, amount: p.amount, date: p.date }));
      return ok({ account, count: payments.length, payments });
    }
    default:
      throw new Error(`不明なツール: ${name}`);
  }
}

const server = new Server({ name: 'adsense-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  try {
    return await runTool(req.params.name, req.params.arguments || {});
  } catch (e) {
    console.error('[adsense-mcp] tool error:', req.params.name, e?.message || e);
    return { content: [{ type: 'text', text: `エラー: ${e?.message || String(e)}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('[adsense-mcp] started (stdio)');
