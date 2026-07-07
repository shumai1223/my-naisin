#!/usr/bin/env node
/**
 * worklog追記ツール（時刻はこのスクリプトが実測する＝エージェントの時刻手書き禁止）。
 *
 * 背景: 2026-07-06、無人ループがworklogの時刻を推測で記入し未来時刻が混入する事故。
 * LLMは体内時計を持たないため、行動ルールでなく構造で防ぐ——追記はこのスクリプト経由のみとし、
 * タイムスタンプは実行時のシステム時刻から生成する（JST固定・実行環境のTZ非依存）。
 *
 * 使い方: node scripts/worklog.mjs "▶開始 A-6（満点変換独立URL）"
 *         node scripts/worklog.mjs "✅完了 A-6: tsc0/jest690 commit abc1234"
 */
import fs from 'node:fs';
import path from 'node:path';

const msg = process.argv.slice(2).join(' ').trim();
if (!msg) {
  console.error('usage: node scripts/worklog.mjs "メッセージ"');
  process.exit(1);
}

// JST = UTC+9（マシンのタイムゾーン設定に依存させない）
const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
const pad = (n) => String(n).padStart(2, '0');
const dateStr = `${jst.getUTCFullYear()}-${pad(jst.getUTCMonth() + 1)}-${pad(jst.getUTCDate())}`;
const timeStr = `${pad(jst.getUTCHours())}:${pad(jst.getUTCMinutes())}`;

const dir = path.join(process.cwd(), 'docs', 'worklog');
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, `${dateStr}.md`);
if (!fs.existsSync(file)) {
  fs.writeFileSync(file, `# ${dateStr} worklog\n\n`, 'utf8');
}
fs.appendFileSync(file, `${timeStr} ${msg}\n`, 'utf8');
console.log(`[worklog] ${dateStr}.md <- ${timeStr} ${msg}`);
