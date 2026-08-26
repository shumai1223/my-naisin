#!/usr/bin/env node
// 商談副操縦士の回帰テストランナー。
//
// サーバーを起動し、testset.mjs の各ケースを本番と同じペイロード形式で投げ、
// ①TTFB(最初の1文字が届くまで) ②総時間 ③機械検証できるアサーション を測る。
//
// 使い方:
//   node scripts/meeting-copilot/run-tests.mjs [--repeat 2] [--tag pii,commit] [--port 3466]
//
// LLM出力は毎回変わるため --repeat で同じケースを複数回流し、「たまたま通った」を弾く。
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CASES } from './testset.mjs';

const DIR = dirname(fileURLToPath(import.meta.url));
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i >= 0 ? process.argv[i + 1] : d; };
const REPEAT = Number(arg('repeat', 2));
const PORT = Number(arg('port', 3466));
const TAGS = arg('tag', '') ? String(arg('tag')).split(',') : null;
const BASE = `http://127.0.0.1:${PORT}`;

const cases = TAGS ? CASES.filter((c) => TAGS.includes(c.tag)) : CASES;

// ── サーバー起動 ─────────────────────────────────────────────
const server = spawn(process.execPath, [join(DIR, 'server.mjs')], {
  cwd: DIR,
  env: { ...process.env, COPILOT_PORT: String(PORT) },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let serverLog = '';
server.stdout.on('data', (d) => { serverLog += d; process.stderr.write('[srv] ' + d); });
server.stderr.on('data', (d) => { serverLog += d; });
const cleanup = () => { try { server.kill(); } catch {} };
process.on('exit', cleanup);
for (const s of ['SIGINT', 'SIGTERM']) process.on(s, () => process.exit(1));

async function waitReady(timeoutMs = 180_000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    try {
      const h = await (await fetch(BASE + '/health')).json();
      if (h.ready) return (Date.now() - t0) / 1000;
      if (h.error) throw new Error(h.error);
    } catch (e) {
      if (String(e.message).match(/limit/i)) throw e;
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('ウォームアップがタイムアウト');
}

// ── 1ケース実行(本番と同じ payload 形式) ──────────────────────
async function ask(utterance) {
  const time = new Date().toTimeString().slice(0, 5);
  const text = `【会話ログ(新規分)】\n${time} ${utterance}\n\n【依頼】自動モード: 直近の発言への回答ヒントを。`;
  const t0 = Date.now();
  const res = await fetch(BASE + '/suggest', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text }),
  });
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let out = '', ttfb = null;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = dec.decode(value, { stream: true });
    if (chunk && ttfb === null) ttfb = Date.now() - t0;
    out += chunk;
  }
  return { out: out.trim(), ttfb: ttfb ?? Date.now() - t0, total: Date.now() - t0 };
}

// ── アサーション(機械的に検証できるものだけ) ────────────────
function check(c, out) {
  const fails = [];
  for (const m of c.must ?? []) if (!out.includes(m)) fails.push(`must「${m}」が無い`);
  for (const n of c.never ?? []) if (out.includes(n)) fails.push(`never「${n}」が出た`);
  for (const r of c.rx ?? []) if (!r.test(out)) fails.push(`rx ${r} に不一致`);
  for (const r of c.nrx ?? []) if (r.test(out)) fails.push(`nrx ${r} に一致(禁止)`);
  const lines = out.split('\n').filter((l) => l.trim());
  if (c.maxLines && lines.length > c.maxLines) fails.push(`${lines.length}行(上限${c.maxLines})`);
  // 全ケース共通の不変条件
  if (out.includes('```')) fails.push('コードブロックが出た');
  if (lines.length && !lines.every((l) => l.trim().startsWith('-'))) fails.push('「- 」始まりでない行がある');
  if (lines.length > 3) fails.push(`${lines.length}行(共通上限3)`);
  return fails;
}

// ── 実行 ─────────────────────────────────────────────────────
const warm = await waitReady();
console.log(`\nウォームアップ ${warm.toFixed(1)}秒 / ${cases.length}ケース × ${REPEAT}回 = ${cases.length * REPEAT}実行\n`);

const results = [];
let n = 0;
for (let rep = 1; rep <= REPEAT; rep++) {
  for (const c of cases) {
    n++;
    let r;
    try {
      // fresh: 履歴ゼロの新セッションから始める(価格の「何度目か」で正解が変わるケース用)
      if (c.fresh) await fetch(BASE + '/reset', { method: 'POST' }).then((x) => x.json());
      // preAsk: 本題の前に1問流して「2度目」の状況を作る
      if (c.preAsk) await ask(c.preAsk);
      r = await ask(c.q);
    } catch (e) { r = { out: 'ERROR ' + e.message, ttfb: 0, total: 0 }; }
    const fails = check(c, r.out);
    results.push({ ...c, rep, out: r.out, ttfb: r.ttfb, total: r.total, fails });
    const mark = fails.length ? '✗' : '✓';
    process.stdout.write(`${mark} ${String(n).padStart(3)}/${cases.length * REPEAT} [${c.tag}] ${(r.ttfb / 1000).toFixed(1)}s ${c.q.slice(0, 26)}\n`);
    if (fails.length) for (const f of fails) console.log(`      └ ${f}\n        ${r.out.replace(/\n/g, ' / ').slice(0, 150)}`);
  }
}

// ── 集計 ─────────────────────────────────────────────────────
const ttfbs = results.map((r) => r.ttfb).sort((a, b) => a - b);
const pct = (p) => ttfbs[Math.min(ttfbs.length - 1, Math.floor(ttfbs.length * p))] / 1000;
const failed = results.filter((r) => r.fails.length);
const byTag = {};
for (const r of results) {
  byTag[r.tag] ??= { n: 0, ng: 0 };
  byTag[r.tag].n++;
  if (r.fails.length) byTag[r.tag].ng++;
}
console.log('\n' + '═'.repeat(64));
console.log(`合格 ${results.length - failed.length}/${results.length}  (${(((results.length - failed.length) / results.length) * 100).toFixed(1)}%)`);
console.log(`TTFB  中央値 ${pct(0.5).toFixed(2)}s / p90 ${pct(0.9).toFixed(2)}s / 最大 ${(ttfbs.at(-1) / 1000).toFixed(2)}s`);
console.log('\nタグ別:');
for (const [t, v] of Object.entries(byTag).sort((a, b) => b[1].ng - a[1].ng)) {
  console.log(`  ${t.padEnd(8)} ${v.n - v.ng}/${v.n}${v.ng ? '  ← ' + v.ng + '件NG' : ''}`);
}
writeFileSync(join(DIR, 'test-results.json'), JSON.stringify(results, null, 1));
console.log(`\n詳細: scripts/meeting-copilot/test-results.json`);
server.kill();
process.exit(failed.length ? 1 : 0);
