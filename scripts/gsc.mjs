// Search Console 疎通確認 / 簡易クエリCLI（gsc-mcp.mjsと同じlibを使う最小版）。
// 使い方:
//   node scripts/gsc.mjs sites                              # 疎通確認（アクセス可能なプロパティ一覧）
//   node scripts/gsc.mjs totals [--days 7]
//   node scripts/gsc.mjs query --dimensions query [--days 7] [--limit 20]
import { searchconsole } from '@googleapis/searchconsole';
import { getAuthedClient, getSiteUrl } from './lib/gsc-client.mjs';

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
const cmd = args._[0] || 'sites';
const client = searchconsole({ version: 'v1', auth: getAuthedClient() });

function ymd(daysAgo) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

if (cmd === 'sites') {
  const res = await client.sites.list({});
  console.log(JSON.stringify(res.data.siteEntry || [], null, 2));
} else if (cmd === 'totals') {
  const days = Number(args.days ?? 7);
  const siteUrl = getSiteUrl(args.siteUrl);
  const res = await client.searchanalytics.query({
    siteUrl,
    requestBody: { startDate: ymd(3 + days), endDate: ymd(3), rowLimit: 1 },
  });
  console.log(JSON.stringify({ siteUrl, ...(res.data.rows?.[0] || {}) }, null, 2));
} else if (cmd === 'query') {
  const days = Number(args.days ?? 7);
  const siteUrl = getSiteUrl(args.siteUrl);
  const dimensions = String(args.dimensions ?? 'query').split(',');
  const res = await client.searchanalytics.query({
    siteUrl,
    requestBody: { startDate: ymd(3 + days), endDate: ymd(3), dimensions, rowLimit: Number(args.limit ?? 20) },
  });
  console.log(JSON.stringify(res.data.rows || [], null, 2));
} else {
  console.error(`不明なコマンド "${cmd}"。 利用可能: sites / totals / query`);
  process.exit(1);
}
