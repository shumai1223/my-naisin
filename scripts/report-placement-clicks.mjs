#!/usr/bin/env node
/**
 * T-M1「測り方」§3: placement別のクリック数を週次で出す小道具。
 * 既存の`/go`ログ(D1 clicksテーブル)を`scripts/d1q.mjs`経由で読み取り専用クエリするだけ
 * （新規計装は不要・S9-2のTRIM(placement,'/')表記ゆれ対策も踏襲）。
 *
 * 使い方:
 *   node scripts/report-placement-clicks.mjs [--days=7] [--trusted-only]
 *
 * trustedOnly(既定true)は内部referer付きのみを数える([[LOOP_CONTRACT]] §3-2・bot除外の唯一の正しい条件)。
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function arg(name, fallback) {
  const prefix = `--${name}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

const days = Number(arg('days', '7'));
const trustedOnly = !process.argv.includes('--no-trusted-only'); // 既定でtrusted-only（bot除外）

const trustClause = trustedOnly ? "AND referer LIKE 'https://my-naishin.com/_%'" : '';
const sql = `SELECT TRIM(placement,'/') AS placement, COUNT(*) AS clicks
FROM clicks
WHERE created_at >= datetime('now','-${days} days') ${trustClause}
GROUP BY TRIM(placement,'/')
ORDER BY clicks DESC`;

const result = spawnSync('node', [path.join(__dirname, 'd1q.mjs'), sql], {
  encoding: 'utf-8',
  shell: false,
});

if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(result.status ?? 1);
}

console.log(`直近${days}日・trustedOnly=${trustedOnly}のplacement別クリック数:`);
console.log(result.stdout);
