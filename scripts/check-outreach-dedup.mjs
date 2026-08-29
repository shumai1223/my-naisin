#!/usr/bin/env node
/**
 * アウトリーチ候補を新規追加する前の必須dedup確認（2026-08-30の重複追加事故を受けて新設）。
 *
 * data/outreach-queue.json（未送信キュー）だけでなくdata/outreach-ledger.json（送信済み台帳）も
 * 同時に検索する。既存の対策がqueue側のみのgrepに留まっていたため、ledgerへ移設済みの組織を
 * 「未着手の新規発見」として誤って再追加する事故が起きた([[fable5-loop-protocol]]参照)。
 *
 * 使い方: node scripts/check-outreach-dedup.mjs "検索語(組織名の一部・ドメイン等)"
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const query = process.argv[2];
if (!query) {
  console.error('使い方: node scripts/check-outreach-dedup.mjs "検索語"');
  process.exit(1);
}

const queue = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/outreach-queue.json'), 'utf-8'));
const ledger = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/outreach-ledger.json'), 'utf-8'));

function search(label, entries) {
  const hits = entries.filter((e) => {
    const haystack = JSON.stringify([e.id, e.org, e.contact, e.contactClass]).toLowerCase();
    return haystack.includes(query.toLowerCase());
  });
  console.log(`--- ${label}: ${hits.length}件 ---`);
  for (const h of hits) {
    console.log(`  ${h.id} | ${h.org} | status/lane: ${h.status ?? h.lane} | contact: ${h.contact ?? ''}`);
  }
  return hits.length;
}

const queueHits = search('data/outreach-queue.json', queue.entries);
const ledgerHits = search('data/outreach-ledger.json', ledger.entries);

if (queueHits + ledgerHits > 0) {
  console.log('\n⚠️ 既存エントリが見つかりました。新規追加する前に内容を確認してください。');
  process.exit(2);
} else {
  console.log('\n✅ queue/ledgerとも重複なし。新規候補として追加してよい（ただしGmail下書き作成前は別途gmail_searchも推奨）。');
}
