#!/usr/bin/env -S npx tsx
/**
 * T-Y11F F-4/DoD-4:「速報パーサがR7/R8リプレイに合格」の大阪府版実行可能な入口。
 *
 * 大阪府の志願者数xlsx（速報・確定とも同一フォーマット）を読み、単一学科校のみを
 * `InterimRateRecord[]`へ抽出し、`src/data/competition-rates/osaka.ts`の確定(R8)レコードと
 * `validateInterimSubmission()`で構造照合する。
 *
 * 使い方: `npx tsx scripts/bairitsu-ingest/replay-interim-osaka.ts <速報xlsxのパス>`
 * （速報xlsxは`https://www.pref.osaka.lg.jp/documents/125698/r08_ippan_sigansya_0305.xlsx`を
 * 事前にダウンロードしておくこと。本スクリプトはネットワークアクセスしない）。
 *
 * ⚠️既知の制約（2026-09-07時点）: 複数学科を1行にまとめた行（例:「旭」普通科+国際文化科）は
 * 列のズレが学校ごとに一定でないため今回はスキップしている（165件中96件=単一学科校のみ抽出・
 * 27件が複数学科でスキップ）。市岡/槻の木/鳳/東住吉総合の4校は確定側で「（単位制）」
 * 「（クリエイティブスクール）」の学科名suffixが付くため、抽出した学科名（suffixなし）と
 * 一致せず`missing-in-confirmed`として残る（マッチ率95.8%・issues4件でpassed=falseのまま）。
 * 複数学科行の安全な分解と単位制/クリエイティブ判定の両方を解決すれば100%に近づく見込み。
 */
import { parseXlsxFile } from '@/lib/xlsx-parse';
import { OSAKA_COMPETITION_RATES } from '@/data/competition-rates/osaka';
import { validateInterimSubmission, type InterimRateRecord } from '@/lib/interim-rate';

const path = process.argv[2];
if (!path) {
  console.error('使い方: npx tsx scripts/bairitsu-ingest/replay-interim-osaka.ts <速報xlsxのパス>');
  process.exit(1);
}

const wb = parseXlsxFile(path);
const rows = wb.sheets['sheet1'];
if (!rows) {
  console.error('sheet1が見つからない（想定外のxlsx構造）');
  process.exit(1);
}

const interimRecords: InterimRateRecord[] = [];
let skippedMultiDept = 0;
let skippedOther = 0;

for (const row of rows) {
  if (!row || row.length < 11) continue;
  const [prefixOrCode, name, dept, quota, , applicants, dept2, , , , rate] = row;
  if (typeof name !== 'string' || typeof dept !== 'string') continue;
  if (prefixOrCode !== '府立' && !(typeof prefixOrCode === 'string' && prefixOrCode.endsWith('市立'))) continue;
  if (dept2 !== null && dept2 !== undefined) {
    skippedMultiDept += 1;
    continue;
  }
  if (typeof quota !== 'number' || typeof applicants !== 'number') {
    skippedOther += 1;
    continue;
  }
  const schoolName = (typeof prefixOrCode === 'string' && prefixOrCode.endsWith('市立') ? `${prefixOrCode}${name}` : name).trim();
  const department = dept.endsWith('科') ? dept : `${dept}科`;
  interimRecords.push({ schoolName, department, quota, interimApplicants: applicants, interimRate: typeof rate === 'number' ? rate : null });
}

console.log(`抽出: ${interimRecords.length}件（単一学科校のみ）・スキップ: 複数学科${skippedMultiDept}件・その他${skippedOther}件`);

const confirmedR8 = OSAKA_COMPETITION_RATES.records.filter((r) => !r.fiscalYear || r.fiscalYear === '令和8年度（2026年度）');
console.log(`確定(R8)レコード総数: ${confirmedR8.length}件`);

const result = validateInterimSubmission(interimRecords, confirmedR8, 30);
console.log(`matchRatio=${result.matchRatio.toFixed(3)} passed=${result.passed} issues=${result.issues.length}`);
for (const issue of result.issues) console.log(JSON.stringify(issue));

process.exit(result.passed ? 0 : 1);
