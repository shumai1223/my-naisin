#!/usr/bin/env -S npx tsx
/**
 * T-PV2 A-3: 新年度（令和9年度）の倍率を取り込む前の検算を1コマンドで行う（合否と差分の要約を出す）。
 *
 * 使い方: npx tsx scripts/bairitsu-ingest/verify-new-year.ts <県コード> <PDFパス> <parsed.json>
 *   parsed.json は harvest-prefecture.ts --emit の出力（{prefectureCode, rows}）。
 *   ⚠️ harvest-prefecture.ts の検算は基準が現行ファイル（前年度）なので、新年度の実PDFでは
 *      必ずNGになる（予行F1）。新年度の合否はこのコマンドで判定する。
 *
 * 判定の中身は src/lib/bairitsu-ingest/verify-new-year.ts（純関数・テスト済み）。ここはI/Oだけ。
 * 終了コード: 0=全て合格 / 1=どれか不合格（fail-closed）。
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import { diffParsedRecords } from '@/lib/bairitsu-ingest/diff-parsed-records';
import type { ParsedCompetitionRow } from '@/lib/bairitsu-ingest/parse-table-pdf';
import { validateParsedRecords } from '@/lib/bairitsu-ingest/validate-parsed-records';
import { verifyNewYear } from '@/lib/bairitsu-ingest/verify-new-year';
import { PACK_SALES_APPROVED } from '@/lib/nendomatsu-pack';
import { isPublicationRefused } from '@/lib/publication-refused-prefectures';

const ROOT = resolve(__dirname, '..', '..');
const NEW_YEAR_LABEL = '令和9年度';
// 「令和9年度」を書いてよい公開面のファイル（制度・日程の説明であり、倍率データの年度表示ではないもの）。
// 追加するときは、県ごとに出し分けされていることを確認してからにする。
const NEW_YEAR_LABEL_ALLOWLIST: ReadonlySet<string> = new Set([]);

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === '__tests__' || name === 'node_modules') continue;
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}

/** 県ページ・学校ページ系の公開面で「令和9年度」を書いているファイル（許可リストを除く）。 */
function filesWithNewYearLabel(): string[] {
  const targets = [
    ...walk(join(ROOT, 'src', 'app', 'pref')),
    ...readdirSync(join(ROOT, 'src', 'lib'))
      .filter((n) => /^school-page.*\.ts$/.test(n))
      .map((n) => join(ROOT, 'src', 'lib', n)),
  ];
  return targets
    .filter((p) => readFileSync(p, 'utf8').includes(NEW_YEAR_LABEL))
    .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
    .filter((p) => !NEW_YEAR_LABEL_ALLOWLIST.has(p));
}

function loadPrevious(prefectureCode: string): ParsedCompetitionRow[] | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(`../../src/data/competition-rates/${prefectureCode}`);
    const file = mod[`${prefectureCode.toUpperCase()}_COMPETITION_RATES`];
    return file.records.filter((r: { fiscalYear?: string }) => r.fiscalYear === undefined);
  } catch {
    return null;
  }
}

function main(): number {
  const [prefectureCode, pdfPath, parsedPath] = process.argv.slice(2);
  if (!prefectureCode || !pdfPath || !parsedPath) {
    console.error('使い方: npx tsx scripts/bairitsu-ingest/verify-new-year.ts <県コード> <PDFパス> <parsed.json>');
    return 1;
  }
  const parsed = JSON.parse(readFileSync(parsedPath, 'utf8').replace(/^﻿/, '')) as { prefectureCode: string; rows: ParsedCompetitionRow[] };
  if (parsed.prefectureCode !== prefectureCode) {
    console.error(`❌ parsed.json の県コード(${parsed.prefectureCode})が引数(${prefectureCode})と違う`);
    return 1;
  }
  const pdfText = execFileSync('pdftotext', ['-layout', '-enc', 'UTF-8', pdfPath, '-'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

  const rateIssue = validateParsedRecords(parsed.rows, []).issues.find((i) => i.check === 'finalrate-convention');
  const deliveriesDir = join(ROOT, 'ops', 'deliverables', 'nendomatsu-pack-deliveries');
  let deliveryFileNames: string[] = [];
  try {
    deliveryFileNames = readdirSync(deliveriesDir);
  } catch {
    // 納品ディレクトリが無ければ納品ファイル無しとして扱う
  }
  const previous = loadPrevious(prefectureCode);

  const result = verifyNewYear({
    prefectureCode,
    rows: parsed.rows,
    pdfText,
    isRefused: isPublicationRefused,
    deliveryFileNames,
    deliveryYearPrefix: 'R9',
    packSalesApproved: PACK_SALES_APPROVED,
    filesWithNewYearLabel: filesWithNewYearLabel(),
    prefecturesWithNewYearData: new Set(), // オーバーレイ（A-4）登録後はここに県コードが入る
    rateConventionIssue: rateIssue?.message ?? null,
    previousRecordCount: previous?.length,
  });

  console.log(`# ${prefectureCode} 新年度の検算: ${result.ok ? '✅ 合格' : '❌ 不合格'}`);
  for (const c of result.checks) console.log(`  ${c.ok ? '✅' : '❌'} [${c.name}] ${c.detail}`);
  for (const w of result.warnings) console.log(`  ⚠️ ${w}`);
  console.log(`  抽出 ${parsed.rows.length}件 / 募集${result.sums.quota} / 志願${result.sums.finalApplicants}`);
  if (previous) {
    const d = diffParsedRecords(previous, parsed.rows);
    console.log(`  前年差分: 新設${d.added.length} / 消滅${d.removed.length} / 数値変化${d.changed.length} / 変化なし${d.unchangedCount}`);
    for (const r of d.added.slice(0, 5)) console.log(`    新設: ${r.schoolName}/${r.department}`);
    for (const r of d.removed.slice(0, 5)) console.log(`    消滅: ${r.schoolName}/${r.department}`);
  }
  return result.ok ? 0 : 1;
}

process.exit(main());
