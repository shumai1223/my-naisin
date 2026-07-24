#!/usr/bin/env node
/**
 * AA-1 追撃（フォローアップ）候補レポート。
 *
 * data/outreach-ledger.json（Gmail MCPの実測を手動反映した送信台帳）を読み、
 * src/lib/outreach-ledger.ts の純関数で「今、追撃すべき相手」を決定論で抽出して表示する。
 * 送信は行わない（表示のみ）。実際の追撃文面は docs/aa1-followup-templates.md を参照して👤/loopが個別に作成する。
 *
 * 使い方:
 *   npm run outreach:followup            # 今日時点の候補を表示
 *   npx tsx scripts/outreach-followup-report.ts --date 2026-08-01   # 基準日を変えて先読み
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeFollowupCandidates, summarizeByLane, type OutreachEntry } from '@/lib/outreach-ledger';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LEDGER_PATH = path.join(ROOT, 'data', 'outreach-ledger.json');

function parseArgs(argv: string[]) {
  const a: { date?: string } = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--date') { a.date = argv[i + 1]; i++; }
  }
  return a;
}

const args = parseArgs(process.argv.slice(2));
const todayISO = args.date ?? new Date().toISOString().slice(0, 10);

const raw = JSON.parse(fs.readFileSync(LEDGER_PATH, 'utf8')) as { asOf: string; entries: OutreachEntry[] };
const entries = raw.entries;

console.log(`📮 追撃候補レポート（基準日: ${todayISO}・台帳asOf: ${raw.asOf}）\n`);

const laneCounts = summarizeByLane(entries);
console.log('レーン別件数:', Object.entries(laneCounts).filter(([, n]) => n > 0).map(([l, n]) => `${l}=${n}`).join(' / '));

const awaiting = entries.filter((e) => e.status === 'awaiting').length;
const meeting = entries.filter((e) => e.status === 'meeting').length;
console.log(`状態: awaiting=${awaiting} / meeting=${meeting} / 総数=${entries.length}\n`);

const candidates = computeFollowupCandidates(entries, todayISO);

if (candidates.length === 0) {
  console.log('✅ 今追撃すべき相手はいません（7日未満、または既に追撃済み/対応済み）。');
  process.exit(0);
}

console.log(`⚡ 追撃候補: ${candidates.length}件（経過日数が長い順）\n`);
for (const c of candidates) {
  console.log(`  ${c.daysSinceLastContact}日経過  ${c.entry.org}（${c.entry.lane} / ${c.entry.sourceTaskId ?? '-'}）`);
  if (c.entry.note) console.log(`           ${c.entry.note}`);
}
console.log('\n文面テンプレは docs/aa1-followup-templates.md を参照。送信は👤の判断・実行のみ。');
