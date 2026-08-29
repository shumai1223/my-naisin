#!/usr/bin/env node
/**
 * T-N1-4: 学校別倍率の前年比較レポート生成（Markdown）。
 * N1-5（商品化・👤ゲート）に持ち込む前の技術的な「見本」を作るためのスクリプト。
 * 事実の提示のみ（予測・推奨は書かない）。生成後にfindOverclaimPhrasesで自己点検する。
 *
 * 使い方:
 *   npx tsx scripts/generate-rate-yoy-report.ts --prefecture=aichi --limit=10
 *   npx tsx scripts/generate-rate-yoy-report.ts --prefecture=aichi --limit=10 --out=ops/samples/rate-yoy-aichi-sample.md
 */
import { writeFileSync } from 'node:fs';
import { COMPETITION_RATE_BY_PREFECTURE } from '@/data/competition-rates';
import { computeSchoolRateYoy, topMovers, type SchoolRateYoyEntry } from '@/lib/exam-competition-rate-yoy';
import { findOverclaimPhrases } from '@/lib/exam-system-diff-types';

function arg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

const prefectureCode = arg('prefecture');
const limit = Number(arg('limit') ?? '10');
const outPath = arg('out');

if (!prefectureCode) {
  console.error('使い方: npx tsx scripts/generate-rate-yoy-report.ts --prefecture=<code> [--limit=10] [--out=path]');
  process.exit(1);
}

const file = COMPETITION_RATE_BY_PREFECTURE[prefectureCode];
if (!file) {
  console.error(`未収録の都道府県コード: ${prefectureCode}`);
  process.exit(1);
}

const entries = computeSchoolRateYoy(file);
const up = topMovers(entries, prefectureCode, 'up', limit);
const down = topMovers(entries, prefectureCode, 'down', limit);

function row(e: SchoolRateYoyEntry): string {
  const sign = e.rateDelta > 0 ? '+' : '';
  return `| ${e.schoolName} | ${e.department} | ${e.previousRate} | ${e.currentRate} | ${sign}${e.rateDelta} | [前年度](${e.previousSourceUrl ?? ''}) / [今年度](${e.currentSourceUrl ?? ''}) |`;
}

const lines: string[] = [];
lines.push(`# ${file.prefectureCode} 公立高校 倍率の前年比較（見本）`);
lines.push('');
lines.push(
  `本比較は${entries.length}件の校・学科レコード（前年度と今年度の両方が公表資料に収録されている組のみ）を対象にしています。` +
    '対象外（片方の年度のみ収録・学科名変更等で突合不能）は含みません。'
);
lines.push('');
lines.push('## 倍率が上がった高校（上位）');
lines.push('');
lines.push('| 学校 | 学科 | 前年度倍率 | 今年度倍率 | 差 | 出典 |');
lines.push('|---|---|---|---|---|---|');
for (const e of up) lines.push(row(e));
lines.push('');
lines.push('## 倍率が下がった高校（上位）');
lines.push('');
lines.push('| 学校 | 学科 | 前年度倍率 | 今年度倍率 | 差 | 出典 |');
lines.push('|---|---|---|---|---|---|');
for (const e of down) lines.push(row(e));
lines.push('');
lines.push(
  '※本レポートは公表された倍率の実績値の比較のみを示します。来年度の倍率の予測・推奨は一切含みません。'
);

const markdown = lines.join('\n') + '\n';

const overclaims = findOverclaimPhrases(markdown);
if (overclaims.length > 0) {
  console.error(`N1-0違反: 生成された文面に証明不可能な主張が含まれています: ${overclaims.join(', ')}`);
  process.exit(1);
}

if (outPath) {
  writeFileSync(outPath, markdown, 'utf-8');
  console.log(`wrote ${outPath}`);
} else {
  console.log(markdown);
}
