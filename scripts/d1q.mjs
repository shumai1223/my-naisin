#!/usr/bin/env node
/**
 * d1q.mjs — 本番D1(my-naishin-leads)に読み取り専用SQLを投げてJSONで返す小道具。
 *
 * 使い方: node scripts/d1q.mjs "SELECT ..."
 * wrangler の --json 出力は先頭に人間向けの行が混ざるため、最後のJSON配列だけを取り出す。
 * 書き込み系(INSERT/UPDATE/DELETE/DROP/ALTER)は C7 の人間ゲートなのでここで弾く。
 */
import { spawnSync } from 'node:child_process';

const sql = process.argv.slice(2).join(' ');
if (!sql.trim()) {
  console.error('usage: node scripts/d1q.mjs "SELECT ..."');
  process.exit(2);
}
if (/\b(insert|update|delete|drop|alter|create|replace)\b/i.test(sql)) {
  console.error('refused: 読み取り専用。書き込みは C7 の人間ゲート。');
  process.exit(2);
}

const res = spawnSync(
  process.execPath,
  ['node_modules/wrangler/bin/wrangler.js', 'd1', 'execute', 'my-naishin-leads', '--remote', '--json', '--command', sql],
  { encoding: 'utf8', env: { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: '0' }, maxBuffer: 64 * 1024 * 1024 }
);

const out = res.stdout || '';
const start = out.indexOf('\n[\n');
const json = start >= 0 ? out.slice(start + 1) : out.slice(out.indexOf('['));
let parsed;
try {
  parsed = JSON.parse(json);
} catch {
  console.error(out.slice(0, 2000));
  console.error(res.stderr?.slice(0, 2000) ?? '');
  process.exit(1);
}
console.log(JSON.stringify(parsed[0]?.results ?? [], null, 1));
