#!/usr/bin/env node
/**
 * Y-10 年次更新機械 — 年度ギャップ検知レポート。
 *
 * src/lib/annual-update-queue.ts の純関数で「収録済みの最新年度が、本来もう取り込めているはずの
 * 年度より遅れている県」を検知して表示する（表示のみ・実際のPDF転記作業はこのスクリプトの範囲外）。
 *
 * 使い方:
 *   npx tsx scripts/annual-update-check.ts
 */
import { buildAnnualUpdateQueue, expectedLatestReiwaYear } from '@/lib/annual-update-queue';

const now = new Date();
const expected = expectedLatestReiwaYear(now);
const queue = buildAnnualUpdateQueue(now);

console.log(`📅 Y-10 年次更新チェック（基準日: ${now.toISOString().slice(0, 10)} / 本来収録できているはずの年度: 令和${expected}年度）\n`);

if (queue.length === 0) {
  console.log('✅ ギャップ0件。全都道府県が令和' + expected + '年度分まで収録済みです。');
} else {
  console.log(`⚠️  年度ギャップを検知: ${queue.length}県`);
  for (const e of queue) {
    const held = e.latestHeldReiwaYear === null ? '(未収録)' : `令和${e.latestHeldReiwaYear}年度`;
    console.log(`   - ${e.prefectureCode}: 保持=${held} / 期待=令和${e.expectedReiwaYear}年度 / ギャップ=${e.gap}年`);
  }
  console.log('\n次の掛-1/T-A1と同型の作業で、ギャップが大きい県から順に新年度分のPDF転記に着手すること。');
}
