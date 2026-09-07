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
 * 27件が複数学科でスキップ）。
 *
 * 市岡/槻の木/鳳/東住吉総合の4校は速報xlsx上ではsheet1に他の普通科/総合学科校と同じ形式
 * （「普通」「総合学」等・suffixなし）で並んでいるが、確定側（osaka.ts）では出典元PDFの表構成
 * （単位制専用の表・クリエイティブスクール専用の表）に由来して「（単位制）」「（クリエイティブ
 * スクール）」というsuffix付き学科名で登録されている。quota（募集人員）はいずれも完全一致
 * （例: 市岡280=280・槻の木240=240・鳳240=240・東住吉総合234=234）しており、同一校の同一
 * データであることは確実なため、下記EXPECTED_DEPARTMENT_SUFFIXESで明示的に対応関係を記録し、
 * 一致しない場合のみsuffixを付けて再照合する（未知の学校を勝手にsuffix付けすることはしない）。
 */
const EXPECTED_DEPARTMENT_SUFFIXES: Record<string, string> = {
  市岡: '（単位制）',
  槻の木: '（単位制）',
  鳳: '（単位制）',
  東住吉総合: '（クリエイティブスクール）',
};
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
  const baseDepartment = dept.endsWith('科') ? dept : `${dept}科`;
  const department = EXPECTED_DEPARTMENT_SUFFIXES[schoolName] ? `${baseDepartment}${EXPECTED_DEPARTMENT_SUFFIXES[schoolName]}` : baseDepartment;
  interimRecords.push({ schoolName, department, quota, interimApplicants: applicants, interimRate: typeof rate === 'number' ? rate : null });
}

console.log(`抽出: ${interimRecords.length}件（単一学科校のみ）・スキップ: 複数学科${skippedMultiDept}件・その他${skippedOther}件`);

const confirmedR8 = OSAKA_COMPETITION_RATES.records.filter((r) => !r.fiscalYear || r.fiscalYear === '令和8年度（2026年度）');
console.log(`確定(R8)レコード総数: ${confirmedR8.length}件`);

const result = validateInterimSubmission(interimRecords, confirmedR8, 30);
console.log(`matchRatio=${result.matchRatio.toFixed(3)} passed=${result.passed} issues=${result.issues.length}`);
for (const issue of result.issues) console.log(JSON.stringify(issue));

process.exit(result.passed ? 0 : 1);
