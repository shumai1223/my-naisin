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

// S8-3: sortQueueByPriority()はchannel優先(line→email→form)を第1キーにするため、
// リンク価値が最も高いkyoiku-i(.lg.jp・BAR§0-3実測)がレポートの先頭に来るとは限らない。
// 送信優先度の設計(sortQueueByPriority)自体は他の利用箇所への影響を避けるため変更せず、
// この別枠のみで「👤が最初に見るべき33件」を経過日数付きで提示する。
const kyoikuIQueued = entries
  .filter((e) => e.lane === 'kyoiku-i' && e.status === 'queued')
  .sort((a, b) => (a.draftedAt ?? '').localeCompare(b.draftedAt ?? ''));

if (kyoikuIQueued.length > 0) {
  console.log(`🏛️ 最優先（.lg.jp・権威価値最高＝BAR§0-3実測・${kyoikuIQueued.length}件・下書きが古い順）\n`);
  for (const e of kyoikuIQueued) {
    const days = e.draftedAt ? Math.floor((Date.now() - new Date(e.draftedAt).getTime()) / 86400000) : null;
    console.log(`--- [${e.channel}] ${e.org}${days !== null ? `（下書きから${days}日経過）` : ''} ---`);
    console.log(`  宛先: ${e.contact ?? '(未確定)'}`);
    if (e.subject) console.log(`  件名: ${e.subject}`);
    console.log('');
  }
}

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
