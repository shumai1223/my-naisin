#!/usr/bin/env node
/**
 * X'-1 送信キューレポート。
 *
 * data/outreach-queue.json を読み、src/lib/outreach-queue.ts の純関数で
 * 「👤が上から順に消化するだけでよい」形に整形して表示する。送信は行わない（表示のみ）。
 *
 * 使い方:
 *   npx tsx scripts/outreach-queue-report.ts             # 全件表示
 *   npx tsx scripts/outreach-queue-report.ts --lane kyoiku-i   # レーン絞り込み
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sortQueueByPriority, summarizeQueue, queueReviewTierOf, type QueueEntry } from '@/lib/outreach-queue';
import type { OutreachLane } from '@/lib/outreach-ledger';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const QUEUE_PATH = path.join(ROOT, 'data', 'outreach-queue.json');

function parseArgs(argv: string[]) {
  const a: { lane?: OutreachLane } = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--lane') { a.lane = argv[i + 1] as OutreachLane; i++; }
  }
  return a;
}

const args = parseArgs(process.argv.slice(2));

const raw = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8')) as { asOf: string; entries: QueueEntry[] };
let entries = raw.entries;
if (args.lane) entries = entries.filter((e) => e.lane === args.lane);

console.log(`📮 送信キューレポート（asOf: ${raw.asOf}）\n`);

const summary = summarizeQueue(entries);
console.log(
  `送信可能: line=${summary.queuedByChannel.line} / email=${summary.queuedByChannel.email} / form=${summary.queuedByChannel.form}` +
    `（計${summary.total - summary.excludedCount}件） / 除外グループ=${summary.excludedCount}`
);
console.log('レーン別:', Object.entries(summary.queuedByLane).map(([l, n]) => `${l}=${n}`).join(' / '), '\n');

const sorted = sortQueueByPriority(entries);

if (sorted.length === 0) {
  console.log('✅ 現在キューは空です。');
} else {
  console.log(`⚡ 送信キュー: ${sorted.length}件（channel優先→lane優先の順。上から消化すればよい）\n`);
  for (const e of sorted) {
    const tier = queueReviewTierOf(e);
    console.log(`--- [${e.channel}] ${e.org} (${e.lane} / ${tier}) ---`);
    console.log(`  宛先: ${e.contact ?? '(未確定)'}`);
    if (e.subject) console.log(`  件名: ${e.subject}`);
    if (e.note) console.log(`  備考: ${e.note}`);
    console.log('');
  }
}

const excluded = entries.filter((e) => e.status === 'excluded');
if (excluded.length > 0) {
  console.log(`🚫 除外（送らない・${excluded.length}グループ）`);
  for (const e of excluded) {
    console.log(`  - ${e.org}: ${e.excludeReason ?? '(理由未記載)'}`);
  }
}

console.log('\n本文はdata/outreach-queue.jsonのbodyフィールド、またはリンク先のdocsを参照。送信ボタンはいずれの区分でも👤のみが押す。');
