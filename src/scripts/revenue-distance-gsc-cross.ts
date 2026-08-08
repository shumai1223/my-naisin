/**
 * 掛-5 第2周: revenue-distance.tsの構造距離とGSC実測(28日・page次元)を突合し、
 * 「距離2以上 かつ 流入の多い順」の優先着手リストを作る。
 *
 * GSCデータはmcp__gsc__gsc_queryの生JSONをファイル入力として渡す(このスクリプト自体は
 * GSC APIを呼ばない・MCP呼び出しは対話セッション側で行い、その出力をスクラッチパッド経由で渡す)。
 *
 * 実行: npx tsx src/scripts/revenue-distance-gsc-cross.ts <gsc-page-query-result.json>
 */
import fs from 'fs';
import path from 'path';
import { computeSiteRevenueDistances } from '../lib/revenue-distance';

const gscFilePath = process.argv[2];
if (!gscFilePath) {
  console.error('Usage: npx tsx revenue-distance-gsc-cross.ts <gsc-page-query-result.json>');
  process.exit(1);
}

interface GscRow {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

const gscData: { rows: GscRow[] } = JSON.parse(fs.readFileSync(gscFilePath, 'utf8'));

const appDir = path.join(__dirname, '..', 'app');
const srcDir = path.join(__dirname, '..');
const entries = computeSiteRevenueDistances(appDir, srcDir);

/** ルートテンプレート(例 /pref/[code]/school/[schoolCode])を正規表現化する。 */
function templateToRegex(template: string): RegExp {
  const escaped = template
    .split('/')
    .map((seg) => (seg.startsWith('[') && seg.endsWith(']') ? '[^/]+' : seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
    .join('/');
  return new RegExp(`^${escaped || '/'}$`);
}

// 動的セグメントを含むテンプレートは具体的(静的)なテンプレートより後に評価する
// (先に評価すると/hiyou等の静的ルートが誤って広いワイルドカードに吸われるのを防ぐ必要はないが、
// 念のため静的ルートを優先してマッチさせる=完全一致を先に試す)
const staticEntries = entries.filter((e) => !e.route.includes('['));
const dynamicEntries = entries.filter((e) => e.route.includes('['));
const dynamicPatterns = dynamicEntries.map((e) => ({ entry: e, re: templateToRegex(e.route) }));

function matchTemplate(urlPath: string): (typeof entries)[number] | null {
  const staticMatch = staticEntries.find((e) => e.route === urlPath);
  if (staticMatch) return staticMatch;
  for (const { entry, re } of dynamicPatterns) {
    if (re.test(urlPath)) return entry;
  }
  return null;
}

interface Aggregated {
  route: string;
  distance: number;
  clicks: number;
  impressions: number;
  urlCount: number;
  sampleUrls: string[];
}

const agg = new Map<string, Aggregated>();
let unmatchedCount = 0;
const unmatchedSamples: string[] = [];

for (const row of gscData.rows) {
  let urlPath: string;
  try {
    urlPath = new URL(row.page).pathname.replace(/\/$/, '') || '/';
  } catch {
    continue;
  }
  const matched = matchTemplate(urlPath);
  if (!matched) {
    unmatchedCount++;
    if (unmatchedSamples.length < 15) unmatchedSamples.push(urlPath);
    continue;
  }
  const key = matched.route;
  const cur = agg.get(key) ?? {
    route: key,
    distance: matched.distance,
    clicks: 0,
    impressions: 0,
    urlCount: 0,
    sampleUrls: [],
  };
  cur.clicks += row.clicks;
  cur.impressions += row.impressions;
  cur.urlCount += 1;
  if (cur.sampleUrls.length < 3) cur.sampleUrls.push(urlPath);
  agg.set(key, cur);
}

const aggregated = [...agg.values()].sort((a, b) => {
  const da = a.distance === Infinity ? 999 : a.distance;
  const db = b.distance === Infinity ? 999 : b.distance;
  if (da !== db) return db - da; // 距離が大きい方を先に
  return b.clicks - a.clicks; // 同distanceならクリック数が多い方を先に
});

console.log(`GSC行数: ${gscData.rows.length} / テンプレートに突合できた行: ${gscData.rows.length - unmatchedCount} / 突合不能: ${unmatchedCount}`);
if (unmatchedSamples.length > 0) {
  console.log('突合不能サンプル(最大15件):', unmatchedSamples);
}

console.log(`\n距離×流入 優先着手リスト(距離降順→クリック数降順・上位30件):`);
for (const a of aggregated.slice(0, 30)) {
  const distLabel = a.distance === Infinity ? '∞' : String(a.distance);
  console.log(`  距離${distLabel} | clicks=${a.clicks} impressions=${a.impressions} urlCount=${a.urlCount} | ${a.route}`);
}

const totalClicks = gscData.rows.reduce((s, r) => s + r.clicks, 0);
const distance1Clicks = aggregated.filter((a) => a.distance === 1).reduce((s, a) => s + a.clicks, 0);
const distance2Clicks = aggregated.filter((a) => a.distance === 2).reduce((s, a) => s + a.clicks, 0);
const distance3PlusClicks = aggregated.filter((a) => a.distance >= 3).reduce((s, a) => s + a.clicks, 0);
const infClicks = aggregated.filter((a) => a.distance === Infinity).reduce((s, a) => s + a.clicks, 0);

console.log(`\nクリック配分: 総clicks=${totalClicks} / 距離1=${distance1Clicks}(${((distance1Clicks / totalClicks) * 100).toFixed(1)}%) / 距離2=${distance2Clicks}(${((distance2Clicks / totalClicks) * 100).toFixed(1)}%) / 距離3+=${distance3PlusClicks} / ∞=${infClicks}`);

const outPath = path.join(__dirname, '..', '..', 'docs', 'revenue-distance-cycle2-gsc-cross-2026-08-09.md');
const lines: string[] = [];
lines.push('# 掛-5 収益距離 第2周（GSC実測突合）— 2026-08-09');
lines.push('');
lines.push(
  `GSC(28日・${gscData.rows.length}行・sc-domain:my-naishin.com)の\`page\`次元データを` +
    '`revenue-distance-cycle1-2026-08-09.md`の構造距離表と突合。動的ルート(school-page等)は' +
    '実URLをテンプレート(`/pref/[code]/school/[schoolCode]`等)にマッチさせて集計している。'
);
lines.push('');
lines.push(
  `- 突合できたGSC行: ${gscData.rows.length - unmatchedCount}/${gscData.rows.length}件（突合不能${unmatchedCount}件は下記参照）`
);
lines.push(
  `- クリック配分: 距離1=${distance1Clicks}(${((distance1Clicks / totalClicks) * 100).toFixed(1)}%) / ` +
    `距離2=${distance2Clicks}(${((distance2Clicks / totalClicks) * 100).toFixed(1)}%) / ` +
    `距離3+=${distance3PlusClicks} / ∞=${infClicks}`
);
lines.push('');
lines.push('## 優先着手リスト（距離降順→クリック数降順・上位30テンプレート）');
lines.push('');
lines.push('| 距離 | clicks | impressions | 実URL数 | ルート |');
lines.push('|---|---|---|---|---|');
for (const a of aggregated.slice(0, 30)) {
  const distLabel = a.distance === Infinity ? '∞' : String(a.distance);
  lines.push(`| ${distLabel} | ${a.clicks} | ${a.impressions} | ${a.urlCount} | \`${a.route}\` |`);
}
lines.push('');
if (unmatchedSamples.length > 0) {
  lines.push('## 突合不能サンプル');
  lines.push('');
  lines.push('テンプレート推定に失敗したURL（新規ルート・削除済みルート・特殊文字等の可能性）。');
  lines.push('');
  for (const u of unmatchedSamples) lines.push(`- \`${u}\``);
  lines.push('');
}
fs.writeFileSync(outPath, lines.join('\n'));
console.log(`\nレポート書き出し: ${outPath}`);
