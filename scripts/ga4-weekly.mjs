// GA4 週次 換金ファネルレポート（gsc-weekly の GA4版／勝者固定の自動化＝set-and-forget の儀式）。
//
// 目的：毎週「ファネルのどこで詰まり・どの面/案件が効いたか」を1コマンドで出し、
// 勝ち面/勝ち案件を lead-config に昇格させる意思決定を機械化する。
//
// 使い方:
//   npm run ga4:weekly                 # 直近7日 vs その前7日（WoW）。stdout + reports/ に保存
//   node scripts/ga4.mjs ... と同じ .ga4/ のOAuthトークンを使う（先に npm run ga4:auth）
//   --property 123456789               # プロパティID（未指定は config.json / GA4_PROPERTY_ID）
//   --no-save                          # ファイル保存しない
//
// 注：placement/program/pref 別の分解は GA4のカスタムディメンション登録が前提（未登録なら自動でスキップ＋手順を表示）。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyticsdata } from '@googleapis/analyticsdata';
import { getAuthedClient, getPropertyId } from './lib/ga4-client.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = path.resolve(__dirname, '..', 'reports');

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith('--')) {
      const key = t.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) a[key] = true;
      else { a[key] = next; i++; }
    } else a._.push(t);
  }
  return a;
}
const args = parseArgs(process.argv.slice(2));

// 換金ファネルの本線イベント（track.ts の EVENTS と一致させる）。
const FUNNEL_EVENTS = [
  'result_view',
  'cta_view',
  'affiliate_click',
  'form_start',
  'lead_submit',
  'lead_submit_success',
  'line_friend_click',
  'reverse_calc_use',
  'saved_goal_revisit',
  'exit_intent_view',
  'experiment_impression',
  'ai_referral',
];

async function runReport(client, property, body) {
  const { data } = await client.properties.runReport({ property, requestBody: body });
  return data;
}

/** eventName→eventCount の連想配列を返す（指定イベントのみ）。 */
async function eventCounts(client, property, startDate, endDate) {
  const data = await runReport(client, property, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: { filter: { fieldName: 'eventName', inListFilter: { values: FUNNEL_EVENTS } } },
    limit: 100,
  });
  const out = {};
  for (const row of data.rows || []) {
    out[row.dimensionValues[0].value] = Number(row.metricValues[0].value);
  }
  return out;
}

/** あるイベントを pagePath 別に集計（効いている“面”の特定）。 */
async function eventByPage(client, property, startDate, endDate, eventName, limit = 15) {
  const data = await runReport(client, property, {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: { filter: { fieldName: 'eventName', stringFilter: { matchType: 'EXACT', value: eventName } } },
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    limit,
  });
  return (data.rows || []).map((r) => [r.dimensionValues[0].value, Number(r.metricValues[0].value)]);
}

/** カスタムディメンション（customEvent:xxx）別の集計。未登録なら null を返す（呼び出し側で手順表示）。 */
async function eventByCustomDim(client, property, startDate, endDate, eventName, dimName, limit = 20) {
  try {
    const data = await runReport(client, property, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: `customEvent:${dimName}` }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: { filter: { fieldName: 'eventName', stringFilter: { matchType: 'EXACT', value: eventName } } },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit,
    });
    return (data.rows || []).map((r) => [r.dimensionValues[0].value, Number(r.metricValues[0].value)]);
  } catch {
    return null; // 未登録 or 取得不可
  }
}

function pct(n, d) {
  if (!d) return '—';
  return `${((n / d) * 100).toFixed(1)}%`;
}
function delta(now, prev) {
  if (prev === 0) return now > 0 ? '＋new' : '±0';
  const d = ((now - prev) / prev) * 100;
  const sign = d >= 0 ? '＋' : '−';
  return `${sign}${Math.abs(d).toFixed(0)}%`;
}
function mdTable(headers, rows) {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
  return `${head}\n${sep}\n${body}`;
}

async function main() {
  const auth = getAuthedClient();
  const property = `properties/${getPropertyId(args.property)}`;
  const client = analyticsdata({ version: 'v1beta', auth });

  // WoW：直近7日 vs その前7日
  const cur = { start: '7daysAgo', end: 'today' };
  const prev = { start: '14daysAgo', end: '8daysAgo' };

  const [now, was] = await Promise.all([
    eventCounts(client, property, cur.start, cur.end),
    eventCounts(client, property, prev.start, prev.end),
  ]);

  const g = (k, src) => src[k] ?? 0;
  const lines = [];
  lines.push(`# GA4 週次ファネル｜直近7日 vs 前週`);
  lines.push('');
  lines.push(`生成: ${new Date().toISOString().slice(0, 10)}　${property}`);
  lines.push('');

  // ── ファネル本線（WoW） ──
  lines.push('## 換金ファネル（WoW）');
  lines.push('');
  const funnelRows = FUNNEL_EVENTS.map((e) => [
    e, g(e, now).toLocaleString('en-US'), g(e, was).toLocaleString('en-US'), delta(g(e, now), g(e, was)),
  ]);
  lines.push(mdTable(['event', '今週', '前週', 'WoW'], funnelRows));
  lines.push('');

  // ── 歩留まり（率） ──
  const rv = g('result_view', now), cv = g('cta_view', now), ac = g('affiliate_click', now);
  const fs0 = g('form_start', now), ls = g('lead_submit', now);
  lines.push('## 歩留まり（今週）');
  lines.push('');
  lines.push(mdTable(['指標', '値', '意味'], [
    ['cta_view / result_view', pct(cv, rv), '結果→CTA到達率'],
    ['affiliate_click / cta_view', pct(ac, cv), '換金CTR（最重要）'],
    ['lead_submit / form_start', pct(ls, fs0), '名簿フォームの完了率'],
  ]));
  lines.push('');

  // ── 効いている面（cta_view / affiliate_click を pagePath 別） ──
  const [cvPages, acPages] = await Promise.all([
    eventByPage(client, property, cur.start, cur.end, 'cta_view'),
    eventByPage(client, property, cur.start, cur.end, 'affiliate_click'),
  ]);
  if (cvPages.length) {
    lines.push('## cta_view 上位ページ（今週）');
    lines.push('');
    lines.push(mdTable(['page', 'cta_view'], cvPages.map(([p, c]) => [p, c.toLocaleString('en-US')])));
    lines.push('');
  }
  if (acPages.length) {
    lines.push('## affiliate_click 上位ページ（今週＝換金が起きた面）');
    lines.push('');
    lines.push(mdTable(['page', 'affiliate_click'], acPages.map(([p, c]) => [p, c.toLocaleString('en-US')])));
    lines.push('');
  }

  // ── カスタムディメンション別（placement / program）。未登録なら手順を表示 ──
  const acByPlacement = await eventByCustomDim(client, property, cur.start, cur.end, 'affiliate_click', 'placement');
  const acByProgram = await eventByCustomDim(client, property, cur.start, cur.end, 'affiliate_click', 'program');
  if (acByPlacement || acByProgram) {
    lines.push('## 換金の勝者（affiliate_click 別／今週）');
    lines.push('');
    if (acByPlacement?.length) {
      lines.push('### 面（placement）別');
      lines.push('');
      lines.push(mdTable(['placement', 'click'], acByPlacement.map(([p, c]) => [p || '(set)', c.toLocaleString('en-US')])));
      lines.push('');
    }
    if (acByProgram?.length) {
      lines.push('### 案件（program）別');
      lines.push('');
      lines.push(mdTable(['program', 'click'], acByProgram.map(([p, c]) => [p || '(set)', c.toLocaleString('en-US')])));
      lines.push('');
    }
    lines.push('> 勝った placement×program を lead-config.ts の表へ昇格（PLACEMENT/PREFECTURE_PLACEMENT_LEAD_OVERRIDES）。');
  } else {
    lines.push('## 換金の勝者（placement/program別）');
    lines.push('');
    lines.push('> ⚠️ カスタムディメンション未登録のため面×案件の分解ができません。GA4管理 > カスタム定義 で');
    lines.push('> イベントスコープのカスタムディメンションを登録してください（24〜48hで反映）：');
    lines.push('> `placement` / `program` / `pref` / `depth`（いずれもパラメータ名＝そのままの文字列）。');
    lines.push('> 登録後、本レポートが自動で面×案件の勝者表を出します。');
  }
  lines.push('');

  const out = lines.join('\n');
  console.log(out);

  if (args.save !== false && args['no-save'] !== true) {
    if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
    const file = path.join(REPORTS_DIR, `ga4-weekly-${new Date().toISOString().slice(0, 10)}.md`);
    fs.writeFileSync(file, out);
    console.error(`\n[saved] ${file}`);
  }
}

main().catch((e) => {
  const msg = e?.errors?.[0]?.message || e?.message || String(e);
  console.error('GA4 週次レポートエラー:', msg);
  process.exit(1);
});
