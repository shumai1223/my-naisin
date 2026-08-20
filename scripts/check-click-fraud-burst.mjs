#!/usr/bin/env node
/**
 * check-click-fraud-burst.mjs — clicks テーブル(内部referer付き=人間クリックの唯一の正しい数え方)に
 * ops/THREATS.md 脅威13(TH-13・2026-08-20発見)と同型のクリック不正の疑いが無いか機械検知する。
 *
 * 判定ロジックは scripts/lib/click-fraud-detector.mjs（daily-brief-healthと共有）を使う。
 *
 * 使い方: node scripts/check-click-fraud-burst.mjs [--days N]（既定14日）
 * 読み取り専用(d1q.mjs経由)。異常日があれば exit 1・詳細を表示。無ければ exit 0。
 */
import { spawnSync } from 'node:child_process';
import { analyzeClickFraudByDay } from './lib/click-fraud-detector.mjs';

const args = process.argv.slice(2);
const daysIdx = args.indexOf('--days');
const days = daysIdx >= 0 ? Number(args[daysIdx + 1]) : 14;

const sql =
  "SELECT date(created_at) as d, ip_hash, user_agent FROM clicks " +
  "WHERE referer LIKE 'https://my-naishin.com/_%' " +
  `AND created_at >= datetime('now','-${days} days')`;

const res = spawnSync(process.execPath, ['scripts/d1q.mjs', sql], {
  encoding: 'utf8',
  maxBuffer: 64 * 1024 * 1024,
});

if (res.status !== 0) {
  console.error('d1q.mjs failed:');
  console.error(res.stdout);
  console.error(res.stderr);
  process.exit(1);
}

let rows;
try {
  rows = JSON.parse(res.stdout);
} catch {
  console.error('d1q.mjs の出力をJSONとして解釈できなかった:', res.stdout.slice(0, 500));
  process.exit(1);
}

const results = analyzeClickFraudByDay(rows);
const flagged = results.filter((r) => r.flagged);

if (flagged.length === 0) {
  console.log(`OK: 過去${days}日間にクリック不正の疑いのある日は無し(${rows.length}件を検査)`);
  process.exit(0);
}

console.log(`⚠️ クリック不正の疑いがある日を${flagged.length}件検知(TH-13と同型シグネチャ):`);
for (const f of flagged) {
  console.log(
    `  ${f.date}: 総クリック${f.total} / distinct IP${f.distinctIp}(比率${f.ipRatio.toFixed(3)}) / distinct UA${f.distinctUa}`
  );
}
console.log('詳細はops/THREATS.md 脅威13(TH-13)を参照。D1書き換えはC7ゲートのためこのスクリプトは検知のみ行う。');
process.exit(1);
