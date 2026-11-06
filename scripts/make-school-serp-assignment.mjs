// T-SC1 学校ページSERP実験の割り当て表を作る（決定的・再実行しても同じ結果）。
//
// 入力: ops/baselines/school-serp-baseline-2026-11.json（GSCのページ別・基準期間）
// 出力: src/data/school-serp-experiment-2026-11.json（学校ごとの群 A/B/C）
//
// 方式: 基準期間の表示数で降順に並べ、3校ずつのブロックに区切る。各ブロックの中で
// sha256(salt + キー)の昇順に A,B,C を割り当てる（＝群間の基準表示数の偏りが最小）。
// 対象: 基準期間に表示が MIN_IMPRESSIONS 以上のindex済み学校ページ。それ未満は実験外（現行のまま）。
// 割り当て表は実験開始後に変更しない（結果を見て割り当てを変えると差の差が成り立たない）。
//
// 使い方: node scripts/make-school-serp-assignment.mjs
import crypto from 'node:crypto';
import fs from 'node:fs';

const SALT = 'school-serp-2026-11';
const MIN_IMPRESSIONS = 20;
const ARMS = ['A', 'B', 'C'];

const baseline = JSON.parse(fs.readFileSync('ops/baselines/school-serp-baseline-2026-11.json', 'utf8'));

// INDEXED_SCHOOL_PAGE_PREFECTURE_CODES を実ファイルから読む（コメント内の県名は拾わない）。
const lookupSrc = fs.readFileSync('src/lib/school-page-lookup.ts', 'utf8');
const block = lookupSrc.match(/INDEXED_SCHOOL_PAGE_PREFECTURE_CODES = \[([\s\S]*?)\];/)[1];
const indexed = new Set(
  block
    .split('\n')
    .map((l) => l.replace(/\/\/.*$/, '').trim())
    .map((l) => l.match(/^'([a-z]+)',?$/)?.[1])
    .filter(Boolean),
);

const eligible = baseline.pages
  .filter((p) => indexed.has(p.code) && p.impressions >= MIN_IMPRESSIONS)
  .map((p) => ({ ...p, key: `${p.code}/${p.schoolCode}` }))
  .sort((a, b) => b.impressions - a.impressions || (a.key < b.key ? -1 : 1));

const h = (key) => crypto.createHash('sha256').update(`${SALT}:${key}`).digest('hex');
const assignment = {};
const stats = Object.fromEntries(ARMS.map((a) => [a, { schools: 0, impressions: 0, clicks: 0 }]));

for (let i = 0; i < eligible.length; i += 3) {
  const block3 = eligible.slice(i, i + 3).sort((a, b) => (h(a.key) < h(b.key) ? -1 : 1));
  block3.forEach((p, j) => {
    const arm = ARMS[j];
    assignment[p.key] = arm;
    stats[arm].schools++;
    stats[arm].impressions += p.impressions;
    stats[arm].clicks += p.clicks;
  });
}

for (const a of ARMS) stats[a].ctr = Number(((stats[a].clicks / stats[a].impressions) * 100).toFixed(3));

const out = {
  experiment: 'school-serp-2026-11',
  salt: SALT,
  minImpressions: MIN_IMPRESSIONS,
  baselinePeriod: baseline.period,
  eligibleSchools: eligible.length,
  armBaseline: stats,
  arms: {
    A: '現行（title・descriptionとも変更なし）',
    B: 'titleに収録年度を付ける（校名・倍率は残す）。descriptionは現行',
    C: 'descriptionから倍率の数値を外す。titleは現行',
  },
  assignment,
};
fs.writeFileSync('src/data/school-serp-experiment-2026-11.json', JSON.stringify(out, null, 1) + '\n');
console.log(JSON.stringify({ eligible: eligible.length, indexedPrefectures: indexed.size, stats }, null, 1));
