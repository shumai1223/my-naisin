// GSC の任意期間・任意フィルタのクエリを丸ごとJSONに落とす取得用CLI（分析はしない・保存だけ）。
//
// 使い方:
//   node --use-system-ca scripts/gsc-pull.mjs \
//     --start 2026-07-10 --end 2026-08-07 --dimensions query \
//     --contains 倍率 --limit 1000 --out ops/raw/gsc-bairitsu-28d.json
//
// scripts/gsc.mjs は期間指定とフィルタが無いため、PHASE 0 の分析用に分離した。
import fs from 'node:fs';
import path from 'node:path';
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
const client = searchconsole({ version: 'v1', auth: getAuthedClient() });
const siteUrl = getSiteUrl(args.siteUrl);
const dimensions = String(args.dimensions ?? 'query').split(',');

const filters = [];
if (args.contains) filters.push({ dimension: 'query', operator: 'contains', expression: String(args.contains) });
if (args.pageContains) filters.push({ dimension: 'page', operator: 'contains', expression: String(args.pageContains) });

const res = await client.searchanalytics.query({
  siteUrl,
  requestBody: {
    startDate: String(args.start),
    endDate: String(args.end),
    dimensions,
    rowLimit: Number(args.limit ?? 1000),
    ...(filters.length ? { dimensionFilterGroups: [{ filters }] } : {}),
  },
});

const rows = (res.data.rows || []).map((r) => ({
  ...Object.fromEntries(dimensions.map((d, i) => [d, r.keys[i]])),
  clicks: r.clicks,
  impressions: r.impressions,
  ctr: r.ctr,
  position: r.position,
}));

const payload = {
  siteUrl,
  dateRange: { startDate: String(args.start), endDate: String(args.end) },
  dimensions,
  filters,
  rowCount: rows.length,
  rows,
};

if (args.out) {
  fs.mkdirSync(path.dirname(String(args.out)), { recursive: true });
  fs.writeFileSync(String(args.out), JSON.stringify(payload, null, 1), 'utf8');
  console.log(`wrote ${rows.length} rows -> ${args.out}`);
} else {
  console.log(JSON.stringify(payload, null, 1));
}
