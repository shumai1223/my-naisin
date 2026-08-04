#!/usr/bin/env node
/**
 * X'-5 スコアボードレポート。
 *
 * data/link-building-scoreboard.json を読み、5KWの最新順位と直前スナップショットからの
 * 差分を表示する（MCP呼び出しは行わない・表示のみ）。実測値の追記は週次でloopが
 * gsc_query MCPを叩いてdata/link-building-scoreboard.jsonへ手動追記する運用。
 *
 * 使い方:
 *   npx tsx scripts/link-building-scoreboard-report.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeKeywordTrends, type ScoreboardSnapshot } from '@/lib/link-building-scoreboard';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LOG_PATH = path.join(ROOT, 'data', 'link-building-scoreboard.json');

const snapshots = JSON.parse(fs.readFileSync(LOG_PATH, 'utf8')) as ScoreboardSnapshot[];
const trends = computeKeywordTrends(snapshots).sort((a, b) => a.latest.position - b.latest.position);

console.log(`📈 被リンクスコアボード（X'-5・${trends.length}KW）\n`);
for (const t of trends) {
  const deltaStr =
    t.positionDelta === undefined
      ? '(初回スナップショット・差分なし)'
      : `前回比 ${t.positionDelta > 0 ? '+' : ''}${t.positionDelta}位 / クリック${t.clicksDelta! > 0 ? '+' : ''}${t.clicksDelta}`;
  console.log(`--- ${t.keyword} ---`);
  console.log(`  順位: ${t.latest.position.toFixed(2)}位 (${t.latest.date}時点・直近${t.latest.windowDays}日) ${deltaStr}`);
  console.log(`  clicks=${t.latest.clicks} / impressions=${t.latest.impressions}`);
  console.log('');
}

console.log('参照ドメイン数の追跡は有料ツール(Ahrefs等)未契約のため未実装。GSCにはリンク元一覧APIが無い。');
console.log('次回更新: gsc_query MCP(dimensions=["query"], queryContains=各KW, days=28)で実測し、data/link-building-scoreboard.jsonへ新しい日付のエントリを追記すること。');
