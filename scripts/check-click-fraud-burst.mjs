#!/usr/bin/env node
/**
 * check-click-fraud-burst.mjs — clicks テーブル(内部referer付き=人間クリックの唯一の正しい数え方)に
 * ops/THREATS.md 脅威13(TH-13・2026-08-20発見)と同型のクリック不正の疑いが無いか機械検知する。
 *
 * TH-13で実際に観測されたシグネチャ: 短期間に大量のクリックが集中し、①distinct ip_hash / 総クリック数が
 * ほぼ1(=IPローテーション型bot) ②distinct user_agentが一桁台と少数に偏る、の2条件を同時に満たす日。
 * これは referer/UAを偽装し「人間クリック」フィルタ(referer LIKE 'https://my-naishin.com/_%')を
 * すり抜けるボットの特徴で、正常な多様性のある人間トラフィックとは統計的に区別できる。
 *
 * 使い方: node scripts/check-click-fraud-burst.mjs [--days N]（既定14日）
 * 読み取り専用(d1q.mjs経由)。異常日があれば exit 1・詳細を表示。無ければ exit 0。
 */
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const daysIdx = args.indexOf('--days');
const days = daysIdx >= 0 ? Number(args[daysIdx + 1]) : 14;

// しきい値: TH-13の実測(3日間829件・distinct_ip比0.98・distinct_ua8)を余裕を持って捕捉できる水準
const MIN_DAILY_CLICKS = 50; // これ未満の日は偶然のばらつきが支配的なので対象外
const MIN_IP_RATIO = 0.85; // distinct_ip / total がこれ以上ならIPローテーション型を疑う
const MAX_DISTINCT_UA = 12; // distinct_user_agent がこれ以下なら偽装UAの使い回しを疑う

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

const byDate = new Map();
for (const r of rows) {
  if (!byDate.has(r.d)) byDate.set(r.d, { total: 0, ips: new Set(), uas: new Set() });
  const bucket = byDate.get(r.d);
  bucket.total++;
  bucket.ips.add(r.ip_hash);
  bucket.uas.add(r.user_agent);
}

const flagged = [];
for (const [d, b] of [...byDate.entries()].sort()) {
  if (b.total < MIN_DAILY_CLICKS) continue;
  const ipRatio = b.ips.size / b.total;
  if (ipRatio >= MIN_IP_RATIO && b.uas.size <= MAX_DISTINCT_UA) {
    flagged.push({ date: d, total: b.total, distinctIp: b.ips.size, distinctUa: b.uas.size, ipRatio: +ipRatio.toFixed(3) });
  }
}

if (flagged.length === 0) {
  console.log(`OK: 過去${days}日間にクリック不正の疑いのある日は無し(${rows.length}件を検査)`);
  process.exit(0);
}

console.log(`⚠️ クリック不正の疑いがある日を${flagged.length}件検知(TH-13と同型シグネチャ):`);
for (const f of flagged) {
  console.log(
    `  ${f.date}: 総クリック${f.total} / distinct IP${f.distinctIp}(比率${f.ipRatio}) / distinct UA${f.distinctUa}`
  );
}
console.log('詳細はops/THREATS.md 脅威13(TH-13)を参照。D1書き換えはC7ゲートのためこのスクリプトは検知のみ行う。');
process.exit(1);
