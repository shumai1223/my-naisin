#!/usr/bin/env node
/**
 * T-N4-1: 47都道府県横断の内申点比較データをCSVで書き出す（研究者向け）。
 * 既存データ(prefectures.ts)の再集計のみ。優劣の評価・順位付けは一切含まない。
 *
 * 使い方: npx tsx scripts/generate-national-comparison-csv.ts --out=ops/samples/naishin-national-comparison.csv
 */
import { writeFileSync } from 'node:fs';
import { buildNationalComparison, summarizeDistribution, toCsv } from '@/lib/naishin-national-comparison';

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

const outPath = arg('out') ?? 'ops/samples/naishin-national-comparison.csv';
const rows = buildNationalComparison();
const summary = summarizeDistribution(rows);

writeFileSync(outPath, toCsv(rows), 'utf-8');
console.log(`wrote ${rows.length}件 to ${outPath}`);
console.log('分布(記述統計・優劣評価ではない):');
console.log(`  評定段階: 5段階=${summary.scaleDistribution.fivePoint}県 / 10段階=${summary.scaleDistribution.tenPoint}県`);
console.log(`  満点(maxScore): min=${summary.maxScoreRange.min} median=${summary.maxScoreRange.median} max=${summary.maxScoreRange.max}`);
console.log(`  内申点:当日点比率データあり: ${summary.naishinToExamRatioAvailableCount}/${summary.totalPrefectures}県`);
