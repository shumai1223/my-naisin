// GA4 Data API クエリCLI。OAuthトークン（自分のアカウント権限）でレポートを取得する。
// 使い方:
//   node scripts/ga4.mjs <preset> [--days 28] [--start 2026-05-01 --end 2026-05-31]
//                                 [--limit 50] [--metrics a,b] [--dimensions a,b]
//                                 [--orderBy metric|dimension] [--asc] [--json]
//                                 [--property 123456789]
//   node scripts/ga4.mjs presets        # プリセット一覧
//
// プリセット例: totals / top-pages / landing / channels / sources / daily / devices / countries / events
import { analyticsdata } from '@googleapis/analyticsdata';
import { getAuthedClient, getPropertyId } from './lib/ga4-client.mjs';
import { PRESETS } from './lib/ga4-presets.mjs';

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith('--')) {
      const key = t.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) a[key] = true;
      else {
        a[key] = next;
        i++;
      }
    } else a._.push(t);
  }
  return a;
}

const args = parseArgs(process.argv.slice(2));
const presetName = args._[0] || 'totals';

if (presetName === 'presets' || args.help || args.h) {
  console.log('プリセット:', Object.keys(PRESETS).join(' / '));
  console.log('例: node scripts/ga4.mjs top-pages --days 28 --limit 20');
  console.log('    node scripts/ga4.mjs daily --start 2026-05-01 --end 2026-06-14');
  console.log('    node scripts/ga4.mjs --metrics screenPageViews --dimensions pagePath,deviceCategory');
  process.exit(0);
}

const preset = PRESETS[presetName] || {};
if (!PRESETS[presetName] && !args.metrics) {
  console.error(`不明なプリセット "${presetName}"。 利用可能: ${Object.keys(PRESETS).join(', ')}（または --metrics で自由指定）`);
  process.exit(1);
}

const metrics = String(args.metrics ?? preset.metrics ?? 'screenPageViews,totalUsers,sessions')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const dimensions = String(args.dimensions ?? preset.dimensions ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const limit = Number(args.limit ?? preset.limit ?? 100);

// 日付: --start/--end 優先、なければ --days（既定28日）の相対指定。
let startDate, endDate;
if (args.start || args.end) {
  startDate = args.start || '28daysAgo';
  endDate = args.end || 'today';
} else {
  const days = Number(args.days ?? 28);
  startDate = `${days}daysAgo`;
  endDate = 'today';
}

const orderByField = args.orderBy ?? preset.orderBy;
const ascending = args.asc === true || preset.asc === true;
let orderBys;
if (orderByField) {
  orderBys = dimensions.includes(orderByField)
    ? [{ dimension: { dimensionName: orderByField }, desc: !ascending }]
    : [{ metric: { metricName: orderByField }, desc: !ascending }];
}

function fmt(name, value) {
  if (name === 'averageSessionDuration') return `${Number(value).toFixed(0)}s`;
  if (name === 'bounceRate' || name === 'engagementRate') return `${(Number(value) * 100).toFixed(1)}%`;
  if (/^\d+$/.test(value)) return Number(value).toLocaleString('en-US');
  return value;
}

function colWidths(headers, rows) {
  return headers.map((h, i) => Math.max(h.length, ...rows.map((r) => String(r[i] ?? '').length)));
}
function printRow(cells, widths) {
  console.log(cells.map((c, i) => String(c ?? '').padEnd(widths[i])).join('  '));
}
function printTable(headers, rows, widths) {
  printRow(headers, widths);
  console.log(widths.map((w) => '-'.repeat(w)).join('  '));
  rows.forEach((r) => printRow(r, widths));
}

async function main() {
  const auth = getAuthedClient();
  const property = `properties/${getPropertyId(args.property)}`;
  const client = analyticsdata({ version: 'v1beta', auth });

  const requestBody = {
    dateRanges: [{ startDate, endDate }],
    metrics: metrics.map((name) => ({ name })),
    limit,
  };
  if (dimensions.length) requestBody.dimensions = dimensions.map((name) => ({ name }));
  if (orderBys) requestBody.orderBys = orderBys;

  const { data } = await client.properties.runReport({ property, requestBody });

  if (args.json) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  const dimHeaders = (data.dimensionHeaders || []).map((h) => h.name);
  const metHeaders = (data.metricHeaders || []).map((h) => h.name);
  const headers = [...dimHeaders, ...metHeaders];

  console.log(`\n${property}  |  ${startDate} → ${endDate}  |  ${data.rowCount ?? 0} rows  |  preset=${presetName}`);

  const rows = (data.rows || []).map((row) => [
    ...(row.dimensionValues || []).map((d) => d.value),
    ...(row.metricValues || []).map((m, i) => fmt(metHeaders[i], m.value)),
  ]);

  if (rows.length === 0) {
    console.log('(データなし — 期間内に計測イベントが無い可能性。GA4が稼働中か・プロパティIDが正しいか確認)');
    return;
  }
  printTable(headers, rows);

  // 合計（ディメンションがある場合のみ意味がある）
  if (dimensions.length && data.totals?.[0]?.metricValues) {
    const totalRow = [
      ...dimHeaders.map((_, i) => (i === 0 ? 'TOTAL' : '')),
      ...data.totals[0].metricValues.map((m, i) => fmt(metHeaders[i], m.value)),
    ];
    printTable([], [totalRow]); // 区切り済みの下にTOTAL行だけ追記
  }
}

main().catch((e) => {
  const msg = e?.errors?.[0]?.message || e?.message || String(e);
  console.error('GA4 APIエラー:', msg);
  if (/PERMISSION_DENIED|403/.test(msg)) {
    console.error(
      '→ 原因候補: (1) このGoogleアカウントが対象GA4プロパティの閲覧権限を持っていない, ' +
        '(2) Google Cloud プロジェクトで「Google Analytics Data API」が有効化されていない。'
    );
  }
  if (/invalid_grant|No refresh token|Token has been expired/.test(msg)) {
    console.error('→ トークン失効。`npm run ga4:auth` を再実行してください。');
  }
  process.exit(1);
});
