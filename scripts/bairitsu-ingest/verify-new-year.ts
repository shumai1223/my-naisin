#!/usr/bin/env -S npx tsx
/**
 * T-PV2 A-3: 新年度（令和9年度）の倍率を取り込む前の検算を1コマンドで行う（合否と差分の要約を出す）。
 *
 * 使い方: npx tsx scripts/bairitsu-ingest/verify-new-year.ts <県コード> <PDFパス> <parsed.json>
 *   parsed.json は harvest-prefecture.ts --emit の出力（{prefectureCode, rows}）。
 *   ⚠️ harvest-prefecture.ts の検算は基準が現行ファイル（前年度）なので、新年度の実PDFでは
 *      必ずNGになる（予行F1）。新年度の合否はこのコマンドで判定する。
 *
 * 判定の中身は src/lib/bairitsu-ingest/verify-new-year.ts（純関数・テスト済み）。I/Oは lib/new-year-io.ts。
 * 終了コード: 0=全て合格 / 1=どれか不合格（fail-closed）。
 */
import { readFileSync } from 'node:fs';

import type { ParsedCompetitionRow } from '@/lib/bairitsu-ingest/parse-table-pdf';

import { printVerification, runNewYearVerification } from './lib/new-year-io';

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
  const v = runNewYearVerification(prefectureCode, pdfPath, parsed.rows);
  printVerification(prefectureCode, parsed.rows.length, v);
  return v.result.ok ? 0 : 1;
}

process.exit(main());
