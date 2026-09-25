// T-JUKU1 Step1: GSCのページ別クリックを全行(ページネーション)取得し、県ごとに集計する。
// 使い方: node --use-system-ca scripts/juku1-gsc-by-pref.mjs --start 2026-08-26 --end 2026-09-22 --out ops/raw/juku1-gsc-pages.json
// 県の判定: 第1セグメントが県コード(/tokyo/...)、または /pref/<県コード>/school/...
import fs from 'node:fs';
import path from 'node:path';
import { searchconsole } from '@googleapis/searchconsole';
import { getAuthedClient, getSiteUrl } from './lib/gsc-client.mjs';

const a = {};
for (let i = 2; i < process.argv.length; i += 2) a[process.argv[i].slice(2)] = process.argv[i + 1];
const client = searchconsole({ version: 'v1', auth: getAuthedClient() });
const siteUrl = getSiteUrl('sc-domain:my-naishin.com');
const prefs = fs.readdirSync('src/data/competition-rates').filter((f) => f.endsWith('.ts') && f !== 'index.ts').map((f) => f.replace('.ts', ''));

const rows = [];
for (let startRow = 0; ; startRow += 25000) {
  const res = await client.searchanalytics.query({
    siteUrl,
    requestBody: { startDate: a.start, endDate: a.end, dimensions: ['page'], rowLimit: 25000, startRow },
  });
  const r = res.data.rows || [];
  for (const x of r) rows.push({ page: x.keys[0], clicks: x.clicks, impressions: x.impressions, position: x.position });
  if (r.length < 25000) break;
}
fs.mkdirSync(path.dirname(a.out), { recursive: true });
fs.writeFileSync(a.out, JSON.stringify({ siteUrl, start: a.start, end: a.end, rowCount: rows.length, rows }), 'utf8');

const agg = {};
const nat = { clicks: 0, impressions: 0, pages: 0 };
for (const x of rows) {
  const p = new URL(x.page).pathname.split('/').filter(Boolean);
  let pref = null, kind = 'calc';
  if (p[0] === 'pref' && prefs.includes(p[1])) { pref = p[1]; kind = p[2] === 'school' ? 'school' : 'calc'; }
  else if (prefs.includes(p[0])) pref = p[0];
  if (!pref) { nat.clicks += x.clicks; nat.impressions += x.impressions; nat.pages++; continue; }
  const g = (agg[pref] ??= { calcClicks: 0, schoolClicks: 0, imp: 0, posW: 0 });
  if (kind === 'school') g.schoolClicks += x.clicks; else g.calcClicks += x.clicks;
  g.imp += x.impressions; g.posW += x.position * x.impressions;
}
const out = Object.entries(agg).map(([pref, g]) => ({ pref, calc: g.calcClicks, school: g.schoolClicks, total: g.calcClicks + g.schoolClicks, imp: g.imp, pos: +(g.posW / g.imp).toFixed(1) })).sort((x, y) => y.total - x.total);
console.log(JSON.stringify({ rows: rows.length, national: nat, prefs: out }, null, 1));
