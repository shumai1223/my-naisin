// W-9: クリック上位20クエリの「クリック加重平均順位」を週次で出す（ops/tasks/T-R1-recurring-checks.md W-9）。
// 使い方: node --use-system-ca scripts/w9-weighted-rank.mjs [--weeks 8]
// ・query次元をAPI全行で取得（MCPの1,000行上限を避ける）
// ・2通りで出す: (A)各週の上位20 ／ (B)最新週の上位20を固定集合として過去週に遡る
//   (A)は顔ぶれの入れ替わりで動くため、順位の悪化を見るのは(B)が正。
// ・アラート: (B)が前週比 +0.5位以上悪化 → 質問ノートに「いつ・どのクエリが・何位から何位へ」だけを書く
import { searchconsole } from '@googleapis/searchconsole';
import { getAuthedClient } from './lib/gsc-client.mjs';
const c = searchconsole({ version: 'v1', auth: getAuthedClient() });
const site = 'sc-domain:my-naishin.com';
const weeks = Number((process.argv.find((a, i) => process.argv[i - 1] === '--weeks')) ?? 8);
const ymd = (d) => d.toISOString().slice(0, 10);
async function pull(s, e) {
  const out = new Map(); let start = 0;
  for (;;) {
    const r = await c.searchanalytics.query({ siteUrl: site, requestBody: { startDate: s, endDate: e, dimensions: ['query'], rowLimit: 25000, startRow: start } });
    const rows = r.data.rows || []; for (const x of rows) out.set(x.keys[0], x); if (rows.length < 25000) break; start += 25000;
  }
  return out;
}
const end = new Date(); end.setUTCDate(end.getUTCDate() - 3);
const W = [];
for (let i = weeks - 1; i >= 0; i--) { const e = new Date(end); e.setUTCDate(e.getUTCDate() - 7 * i); const s = new Date(e); s.setUTCDate(s.getUTCDate() - 6); W.push([ymd(s), ymd(e)]); }
const data = []; for (const [s, e] of W) data.push(await pull(s, e));
const wavg = (m, keys) => { let n = 0, d = 0; for (const k of keys) { const r = m.get(k); if (r && r.clicks) { n += r.position * r.clicks; d += r.clicks; } } return d ? n / d : NaN; };
const top = (m) => [...m.values()].sort((a, b) => b.clicks - a.clicks).slice(0, 20).map((r) => r.keys[0]);
const fixed = top(data[data.length - 1]);
console.log('週              (A)各週上位20   (B)最新週の20固定   (B)前週比   総クリック');
let prev;
data.forEach((m, i) => {
  const a = wavg(m, top(m)), b = wavg(m, fixed); const tot = [...m.values()].reduce((s, r) => s + r.clicks, 0);
  const diff = prev === undefined ? '' : `${b - prev >= 0 ? '+' : ''}${(b - prev).toFixed(2)}${b - prev >= 0.5 ? ' ⚠️ALERT' : ''}`;
  console.log(`${W[i][0]}〜${W[i][1].slice(5)}   ${a.toFixed(2).padStart(6)}          ${b.toFixed(2).padStart(6)}          ${diff.padEnd(14)} ${tot}`);
  prev = b;
});
console.log('\n最新週の上位20（固定集合）の週次順位:');
for (const q of fixed) {
  const seq = data.map((m) => { const r = m.get(q); return r ? r.position.toFixed(1).padStart(5) : '   --'; }).join(' ');
  const cl = data[data.length - 1].get(q).clicks;
  console.log(`${String(cl).padStart(4)}cl ${seq}  ${q}`);
}
