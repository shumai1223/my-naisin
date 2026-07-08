#!/usr/bin/env node
/**
 * 週次KPI 1枚メール（I-1）＝ga4-weekly + gsc-weekly + 7/20ゲート + トリップワイヤー4本を統合し、
 * 月曜に読むだけで済む1通にまとめる（本人タスク⑬）。
 *
 * 自動取得（GSC・サービスアカウント・CI可）：
 *  - 総クリック・総表示（今週 vs 前週）
 *  - /hensachi の週次CTR履歴（直近4週・トリップワイヤー①判定用）
 *  - ツール面（対象ページ群）の今週/前週 imp・click（トリップワイヤー②判定用）
 *  - 「内申点 計算」ヘッドクエリの今週/前週CTR（トリップワイヤー④判定用）
 *
 * 手動入力（GA4はOAuthのみでCI非対応。ga4:weekly実行結果 or GA4 MCPで取得した数値を渡す）：
 *  --ai-referral-share=<%>   ai_referralのシェア（トリップワイヤー③判定用。既定0）
 *  --cp=<件数>               parent_landing_view件数（C_p。既定0）
 *  --affiliate-clicks=<件数> affiliate_click件数（送客。既定0）
 *  --leads-week=<件数>       今週のlead_submit件数（既定0）
 *  --leads-total=<件数>      名簿累計（既定0）
 *  --conversions=<件数>      ASP実測の確定発生件数（既定0。¥は書かない）
 *  --target-per-week=<件数>  名簿velocityの週次目標（既定140＝C-1の「約20/日」逆算目標の参考値。実際の逆算はROSTER_TARGET/期限から都度算出）
 *  --funnel=<id:count,...>   週次ファネル段階（上流→下流の順。例: tool_start:477,cta_view:759,lead_submit:2）。
 *                            2件以上あればどの遷移が一番ドロップしているか（ボトルネック）を自動特定する（C-1）
 *  --funnel-by-placement=<placement=id:count,id:count;placement2=id:count,...>
 *                            面（ページ/placement）別の週次ファネル。例:
 *                            hensachi=result_view:1000,cta_view:900;juku-shindan=cta_view:280,affiliate_click:20
 *                            指定すると全面のうち最もドロップ率が悪い面とテコ入れ方針の提案を1行出す（Q-3）
 *  --ai-referral-sources=<source:count,...>  ai_referralのソース別内訳（例: chatgpt:20,perplexity:8,google-sge:5）。
 *                            指定するとメールに内訳一覧を出す（トリップワイヤー③のシェア判定には使わない・表示専用。G-2）
 *  --ga4-organic-sessions=<件数>  GA4 Organic Searchセッション（今週）。指定するとConsent捕捉率
 *                            （GSCクリック/GA4セッション、基準5.6x）の定点観測行を出す（I-5）
 *
 * 実行:
 *   npx tsx scripts/weekly-kpi-report.ts                 # プレビューのみ（stdout + reports/）
 *   npx tsx scripts/weekly-kpi-report.ts --send           # RESEND_API_KEY設定時のみ実送信
 *   npx tsx scripts/weekly-kpi-report.ts --send --to=x@y  # 宛先を上書き（既定 CONTACT_EMAIL）
 *
 * 運用上の制約：GA4データAPIはユーザーOAuth前提（[[ga4-mcp-integration]]）でGitHub Actions等の
 * 無人CIから直接は呼べない。そのためGA4由来の数値（C_p/ai_referral share/名簿velocity）は
 * 現状CLI引数での手渡しとし、本人 or /loop が月曜朝に ga4:weekly / GA4 MCP の結果を渡して実行する
 * 運用とする。将来GA4サービスアカウントをプロパティに追加できれば完全無人化できる。
 *
 * 0-8：上記のGA4系引数を1つも渡さずに実行した場合（.github/workflows/kpi-gate-weekly.yml の
 * 無人実行など）は自動的に manualDataProvided=false を立て、C_p/送客/確定発生/名簿velocity欄を
 * 「0件」でなく「未計測」と表示する（GSC自動取得分＝クリック倍率とトリップワイヤーの一部のみで
 * 構成される軽量版メール）。7/20等の判定確定日にこの状態のまま自動実行が走った場合はgate判定も
 * 「⚠️判定保留（未計測）」に切り替わり、conversions=0のデフォルト値がそのままPIVOT等の誤判定として
 * 確定してしまうのを防ぐ（実測値は必ずこのスクリプトを手動引数付きで再実行して確定させること）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';

import { formatWeeklyKpiEmail, type WeeklyKpiData } from '@/lib/weekly-kpi-report';
import type { FunnelStage, PlacementFunnel } from '@/lib/velocity';
import { CONTACT_EMAIL } from '@/lib/contact';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = path.resolve(__dirname, '..', 'reports');
const RESEND_ENDPOINT = 'https://api.resend.com/emails';

const SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:my-naishin.com';
const HENSACHI_PAGE = 'https://my-naishin.com/hensachi';
const HEAD_QUERY = '内申点 計算';
// 「ツール面」＝計算/診断系の主要ページ群（トリップワイヤー②の対象）。
const TOOL_PAGE_PREFIXES = ['https://my-naishin.com/hensachi', 'https://my-naishin.com/hyotei-heikin', 'https://my-naishin.com/reverse'];

const LAG_DAYS = 3;
const WINDOW = 7;

function parseArgs(argv: string[]): Record<string, string | boolean> {
  const a: Record<string, string | boolean> = {};
  for (const t of argv) {
    if (!t.startsWith('--')) continue;
    const [key, ...rest] = t.slice(2).split('=');
    a[key] = rest.length ? rest.join('=') : true;
  }
  return a;
}
const args = parseArgs(process.argv.slice(2));
const num = (v: unknown, fallback = 0): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

/** "id1:count1,id2:count2" を上流→下流の順のFunnelStage[]にパースする。不正行は無視。 */
function parseFunnelStages(raw: unknown): FunnelStage[] | undefined {
  if (typeof raw !== 'string' || !raw.trim()) return undefined;
  const stages: FunnelStage[] = [];
  for (const part of raw.split(',')) {
    const [id, countStr] = part.split(':');
    const count = Number(countStr);
    if (!id || !Number.isFinite(count)) continue;
    stages.push({ id: id.trim(), label: id.trim(), count });
  }
  return stages.length >= 2 ? stages : undefined;
}

/**
 * "placement1=id1:count1,id2:count2;placement2=id1:count1,id2:count2" を
 * 面別ファネル（PlacementFunnel[]）にパースする（Q-3）。各面2段階未満は除外。
 */
function parseFunnelByPlacement(raw: unknown): PlacementFunnel[] | undefined {
  if (typeof raw !== 'string' || !raw.trim()) return undefined;
  const placements: PlacementFunnel[] = [];
  for (const chunk of raw.split(';')) {
    const [placement, stagesRaw] = chunk.split('=');
    if (!placement || !stagesRaw) continue;
    const stages = parseFunnelStages(stagesRaw);
    if (stages) placements.push({ placement: placement.trim(), stages });
  }
  return placements.length > 0 ? placements : undefined;
}

/** "source1:count1,source2:count2" をai_referralソース別内訳にパースする。不正行は無視。 */
function parseSourceCounts(raw: unknown): { source: string; count: number }[] | undefined {
  if (typeof raw !== 'string' || !raw.trim()) return undefined;
  const items: { source: string; count: number }[] = [];
  for (const part of raw.split(',')) {
    const [source, countStr] = part.split(':');
    const count = Number(countStr);
    if (!source || !Number.isFinite(count)) continue;
    items.push({ source: source.trim(), count });
  }
  return items.length > 0 ? items : undefined;
}

function ymd(daysAgo: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

type GscClient = ReturnType<typeof google.searchconsole>;

async function fetchTotals(client: GscClient, startDate: string, endDate: string): Promise<{ clicks: number; impressions: number }> {
  const res = await client.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate, endDate, rowLimit: 1 },
  });
  const row = (res.data.rows as Array<{ clicks?: number; impressions?: number }> | undefined)?.[0];
  return { clicks: row?.clicks ?? 0, impressions: row?.impressions ?? 0 };
}

/** 指定ページの日次クリック/表示を取得し、月曜始まりの週次CTRに畳む（直近4週、古い→新しい順）。 */
async function fetchWeeklyCtrForPage(client: GscClient, page: string, weeks: number): Promise<{ weekStart: string; ctrPercent: number }[]> {
  const startDate = ymd(LAG_DAYS + weeks * 7 - 1);
  const endDate = ymd(LAG_DAYS);
  const res = await client.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: { startDate, endDate, dimensions: ['date'], dimensionFilterGroups: [{ filters: [{ dimension: 'page', expression: page }] }], rowLimit: 1000 },
  });
  const rows = (res.data.rows as Array<{ keys: string[]; clicks: number; impressions: number }> | undefined) ?? [];

  const weekStartOf = (iso: string): string => {
    const d = new Date(`${iso}T00:00:00Z`);
    const day = d.getUTCDay();
    const offset = (day + 6) % 7;
    d.setUTCDate(d.getUTCDate() - offset);
    return d.toISOString().slice(0, 10);
  };
  const buckets = new Map<string, { clicks: number; impressions: number }>();
  for (const r of rows) {
    const ws = weekStartOf(r.keys[0]);
    const b = buckets.get(ws) ?? { clicks: 0, impressions: 0 };
    b.clicks += r.clicks ?? 0;
    b.impressions += r.impressions ?? 0;
    buckets.set(ws, b);
  }
  return [...buckets.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-weeks)
    .map(([weekStart, b]) => ({ weekStart, ctrPercent: b.impressions > 0 ? (b.clicks / b.impressions) * 100 : 0 }));
}

/** ツール面（複数ページ）の今週/前週 imp・click合算。 */
async function fetchToolPagesWoW(client: GscClient): Promise<{ impNow: number; impPrev: number; clicksNow: number; clicksPrev: number }> {
  const curStart = ymd(LAG_DAYS + WINDOW - 1);
  const curEnd = ymd(LAG_DAYS);
  const prevStart = ymd(LAG_DAYS + WINDOW * 2 - 1);
  const prevEnd = ymd(LAG_DAYS + WINDOW);

  const fetchByPage = async (startDate: string, endDate: string) => {
    const res = await client.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: { startDate, endDate, dimensions: ['page'], rowLimit: 1000 },
    });
    const rows = (res.data.rows as Array<{ keys: string[]; clicks: number; impressions: number }> | undefined) ?? [];
    let clicks = 0;
    let impressions = 0;
    for (const r of rows) {
      if (TOOL_PAGE_PREFIXES.some((p) => r.keys[0].startsWith(p))) {
        clicks += r.clicks ?? 0;
        impressions += r.impressions ?? 0;
      }
    }
    return { clicks, impressions };
  };

  const [now, prev] = await Promise.all([fetchByPage(curStart, curEnd), fetchByPage(prevStart, prevEnd)]);
  return { impNow: now.impressions, impPrev: prev.impressions, clicksNow: now.clicks, clicksPrev: prev.clicks };
}

/** ヘッドクエリの今週/前週CTR。 */
async function fetchHeadQueryCtrWoW(client: GscClient): Promise<{ now: number; prev: number }> {
  const curStart = ymd(LAG_DAYS + WINDOW - 1);
  const curEnd = ymd(LAG_DAYS);
  const prevStart = ymd(LAG_DAYS + WINDOW * 2 - 1);
  const prevEnd = ymd(LAG_DAYS + WINDOW);

  const fetchOne = async (startDate: string, endDate: string) => {
    const res = await client.searchanalytics.query({
      siteUrl: SITE_URL,
      requestBody: { startDate, endDate, dimensions: ['query'], dimensionFilterGroups: [{ filters: [{ dimension: 'query', operator: 'equals', expression: HEAD_QUERY }] }], rowLimit: 1 },
    });
    const row = (res.data.rows as Array<{ clicks?: number; impressions?: number }> | undefined)?.[0];
    const clicks = row?.clicks ?? 0;
    const impressions = row?.impressions ?? 0;
    return impressions > 0 ? (clicks / impressions) * 100 : 0;
  };
  const [now, prev] = await Promise.all([fetchOne(curStart, curEnd), fetchOne(prevStart, prevEnd)]);
  return { now, prev };
}

async function main() {
  const saKey = process.env.GSC_SA_KEY;
  if (!saKey) {
    console.error('✗ GSC_SA_KEY が未設定です（サービスアカウントJSON）。gsc-weekly-report.ts 同様に設定してください。');
    process.exit(1);
  }
  const creds = JSON.parse(saKey);
  const auth = new google.auth.JWT({ email: creds.client_email, key: creds.private_key, scopes: ['https://www.googleapis.com/auth/webmasters.readonly'] });
  const client = google.searchconsole({ version: 'v1', auth });

  const curStart = ymd(LAG_DAYS + WINDOW - 1);
  const curEnd = ymd(LAG_DAYS);
  const prevStart = ymd(LAG_DAYS + WINDOW * 2 - 1);
  const prevEnd = ymd(LAG_DAYS + WINDOW);

  console.log(`🔍 週次KPIレポート生成中... (${curStart}〜${curEnd})`);

  const [totalsNow, totalsPrev, hensachiWeeklyCtr, toolPages, headQuery] = await Promise.all([
    fetchTotals(client, curStart, curEnd),
    fetchTotals(client, prevStart, prevEnd),
    fetchWeeklyCtrForPage(client, HENSACHI_PAGE, 4),
    fetchToolPagesWoW(client),
    fetchHeadQueryCtrWoW(client),
  ]);

  const manualDataProvided =
    args.cp !== undefined ||
    args['leads-week'] !== undefined ||
    args['leads-total'] !== undefined ||
    args.conversions !== undefined ||
    args['affiliate-clicks'] !== undefined;

  const data: WeeklyKpiData = {
    weekEnding: curEnd,
    manualDataProvided,
    gsc: { clicksNow: totalsNow.clicks, clicksPrev: totalsPrev.clicks, impNow: totalsNow.impressions, impPrev: totalsPrev.impressions },
    parentLandingViews: num(args.cp),
    leadVelocity: {
      leadsThisWeek: num(args['leads-week']),
      targetPerWeek: num(args['target-per-week'], 140),
      leadsTotal: num(args['leads-total']),
    },
    funnelStages: parseFunnelStages(args.funnel),
    funnelByPlacement: parseFunnelByPlacement(args['funnel-by-placement']),
    aiReferralBySource: parseSourceCounts(args['ai-referral-sources']),
    ga4OrganicSessions: args['ga4-organic-sessions'] !== undefined ? num(args['ga4-organic-sessions']) : undefined,
    conversionsThisMonth: args['conversions-this-month'] !== undefined ? num(args['conversions-this-month']) : undefined,
    affiliateClicks: num(args['affiliate-clicks']),
    confirmedConversions: num(args.conversions),
    gate: {
      clicks: totalsNow.clicks,
      clicksPrev: totalsPrev.clicks,
      leads: num(args['leads-total']),
      conversions: num(args.conversions),
    },
    tripwires: {
      hensachiWeeklyCtr,
      toolPages,
      aiReferralSharePercent: num(args['ai-referral-share']),
      headQueryCtrNow: headQuery.now,
      headQueryCtrPrev: headQuery.prev,
    },
  };

  const { subject, text } = formatWeeklyKpiEmail(data);
  console.log('\n' + text + '\n');

  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const file = path.join(REPORTS_DIR, `weekly-kpi-${data.weekEnding}.txt`);
  fs.writeFileSync(file, `Subject: ${subject}\n\n${text}`, 'utf8');
  console.log(`[saved] ${file}`);

  if (!args.send) {
    console.log('\n[dry-run] 送信していません。実送信は --send を付けてください。');
    return;
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('✗ RESEND_API_KEY が未設定のため送信を中止しました（プレビューは上記の通り生成済み）。');
    process.exit(1);
  }
  const to = typeof args.to === 'string' ? args.to : CONTACT_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL || 'My Naishin <noreply@my-naishin.com>';

  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, text }),
  });
  if (res.ok) {
    console.log(`✓ 送信しました: ${to}`);
  } else {
    console.error(`✗ 送信失敗 (${res.status}): ${await res.text()}`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('週次KPIレポートエラー:', e?.message || e);
  process.exit(1);
});
