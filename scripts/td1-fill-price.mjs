#!/usr/bin/env node
/**
 * T-TD1 TD-7: メール下書きファイルの {{PRICE}} を、確定した価格で一括置換する。
 *
 * 価格の出所は src/data/nendomatsu-pack-pricing.json の1か所だけ（👤が status を "confirmed" にし、
 * confirmedYenTaxIncluded に税込の整数を入れる）。
 *
 * ⚠️ 価格が確定していなければ、何も書き換えずに終了する（exit 0）。Gmail下書きは価格確定までは1件も
 *    置かない規則(👤指示 2026-09-24)なので、このスクリプトが「未確定のまま置換して進む」ことは無い。
 * ⚠️ 置換漏れ({{...}} が1つでも残る)があれば、1ファイルも書き換えずに exit 1 で止まる。
 *
 * 使い方:
 *   node scripts/td1-fill-price.mjs                       # 既定の drafts/ を置換
 *   node scripts/td1-fill-price.mjs --dry-run             # 書き込まず結果だけ表示
 *   node scripts/td1-fill-price.mjs --drafts <dir> --pricing <json>   # テスト用
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const dryRun = args.includes('--dry-run');
const draftsDir = opt('--drafts', 'ops/deliverables/nendomatsu-pack-sample/drafts');
const pricingPath = opt('--pricing', 'src/data/nendomatsu-pack-pricing.json');

const pricing = JSON.parse(fs.readFileSync(pricingPath, 'utf8'));
const confirmed =
  pricing.status === 'confirmed' &&
  Number.isInteger(pricing.confirmedYenTaxIncluded) &&
  pricing.confirmedYenTaxIncluded > 0;

if (!confirmed) {
  console.log(`価格が未確定です(status=${pricing.status})。何も変更しません。Gmail下書きも置かないでください。`);
  process.exit(0);
}

const label = `¥${pricing.confirmedYenTaxIncluded.toLocaleString('en-US')}（税込）`;
const SKIP = new Set(['README.md', 'INDEX.md']);
const files = fs.readdirSync(draftsDir).filter((f) => f.endsWith('.md') && !SKIP.has(f)).sort();

const next = new Map();
let targets = 0;
const problems = [];
for (const f of files) {
  const before = fs.readFileSync(path.join(draftsDir, f), 'utf8');
  const after = before.split('{{PRICE}}').join(label);
  if (after !== before) targets++;
  const leftover = after.match(/\{\{[^}]*\}\}/g);
  if (leftover) problems.push(`${f}: 未置換の差し込み口が残っています ${[...new Set(leftover)].join(' ')}`);
  next.set(f, after);
}
if (problems.length > 0) {
  console.error('置換を中止しました(1ファイルも書き換えていません):');
  for (const p of problems) console.error(' - ' + p);
  process.exit(1);
}
if (dryRun) {
  console.log(`[dry-run] ${files.length}ファイル中 ${targets}ファイルが置換対象 → ${label}`);
  process.exit(0);
}
for (const [f, text] of next) fs.writeFileSync(path.join(draftsDir, f), text, 'utf8');
console.log(`${files.length}ファイル中 ${targets}ファイルの {{PRICE}} を ${label} に置換しました。`);
console.log('次: INDEX.md の状態を確認 → メール窓口の相手だけ Gmail下書きを設置(1晩10〜15社まで)。送信は👤。');
