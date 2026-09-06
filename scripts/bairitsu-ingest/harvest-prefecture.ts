#!/usr/bin/env -S npx tsx
/**
 * T-Y11E DoD: 「県コード → PDF → レコード」が1本のコマンドで通る、の薄いCLIラッパー（I/O層）。
 *
 * 純関数コア（`src/lib/bairitsu-ingest/harvest-prefecture.ts`のharvestPrefecture()）に対し、
 * 実際のPDFファイル→ジオメトリ抽出（`extract-pdf-geometry.py`をページごとに呼び出し）を
 * 配線する。ページ番号（0始まり・カンマ区切りで複数可）は呼び出し側が明示的に指定する
 * （県ごとに表が何ページ目にあるかを自動判定する仕組みは無く、既存のR8フィクスチャ作成時も
 * 人間が目視でページを特定してきた運用を踏襲する。自動化すると誤ったページを検算に通し
 * fail-closedの意味が薄れるリスクの方が大きいと判断）。
 *
 * 使い方: npx tsx scripts/bairitsu-ingest/harvest-prefecture.ts <県コード> <PDFパス> <ページ番号,...>
 *
 * 前段（PDF取得）は`scripts/bairitsu-ingest/archive-changed-pdfs.mjs`が既に担っており、
 * このスクリプトはその保存先（`ops/raw/bairitsu-pdf-archive/<pref>/<sha256>.pdf`）を
 * 受け取る想定。R9公表前の現時点では実データが無いため、このスクリプト自体はダミーPDFで
 * 配線（spawn→JSON.parse→純関数呼び出し→exit code）のみを検証済み（詳細はworklog参照）。
 */
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

import { harvestPrefecture } from '@/lib/bairitsu-ingest/harvest-prefecture';
import type { PdfPageGeometry } from '@/lib/bairitsu-ingest/parse-table-pdf';
import type { OfficialSubtotal } from '@/lib/competition-rate';

const EXTRACT_SCRIPT_PATH = resolve(__dirname, 'extract-pdf-geometry.py');

function extractPageGeometry(pdfPath: string, pageNo: number): PdfPageGeometry {
  const stdout = execFileSync('python', [EXTRACT_SCRIPT_PATH, pdfPath, String(pageNo)], {
    encoding: 'utf-8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return JSON.parse(stdout) as PdfPageGeometry;
}

// `validate-all-registered.ts`のloadCompetitionRatesModuleと同じ規約（動的require・
// `<CODE>_COMPETITION_RATES`エクスポート名）を踏襲する。
function loadCompetitionRatesModule(prefectureCode: string): { officialSubtotals: OfficialSubtotal[]; recordCount: number } {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(`../../src/data/competition-rates/${prefectureCode}`);
  const exportName = `${prefectureCode.toUpperCase()}_COMPETITION_RATES`;
  const file = mod[exportName];
  if (!file) throw new Error(`export ${exportName} not found in competition-rates/${prefectureCode}.ts`);
  const r8Records = file.records.filter((r: { fiscalYear?: string }) => r.fiscalYear === undefined);
  return { officialSubtotals: file.officialSubtotals ?? [], recordCount: r8Records.length };
}

function main(): number {
  const [prefectureCode, pdfPath, pageArg] = process.argv.slice(2);
  if (!prefectureCode || !pdfPath || !pageArg) {
    console.error('使い方: npx tsx scripts/bairitsu-ingest/harvest-prefecture.ts <県コード> <PDFパス> <ページ番号,...>');
    return 1;
  }
  const pageNumbers = pageArg.split(',').map((s) => Number.parseInt(s.trim(), 10));
  if (pageNumbers.some((n) => Number.isNaN(n))) {
    console.error(`ページ番号の解析に失敗しました: "${pageArg}"`);
    return 1;
  }

  const geometries = pageNumbers.map((pageNo) => extractPageGeometry(pdfPath, pageNo));

  let officialSubtotals: OfficialSubtotal[] = [];
  let expectedRecordCount: number | undefined;
  try {
    const loaded = loadCompetitionRatesModule(prefectureCode);
    officialSubtotals = loaded.officialSubtotals;
    expectedRecordCount = loaded.recordCount;
  } catch (error) {
    console.log(`⚠️  ${prefectureCode}: competition-ratesモジュール読み込み失敗（${(error as Error).message}）。検算は公表小計無しで実行する。`);
  }

  const result = harvestPrefecture({ prefectureCode, geometries, officialSubtotals, expectedRecordCount });

  if (result.status === 'no-parser') {
    console.log(`⏭️  ${prefectureCode}: 未登録の県コード（パーサ無し）`);
    return 1;
  }
  if (result.status === 'validation-failed') {
    console.log(`❌ ${prefectureCode}: ${result.parsed.length}件抽出・検算NG`);
    for (const issue of result.validation.issues) {
      console.log(`     [${issue.check}] ${issue.message}`);
    }
    return 1;
  }
  console.log(`✅ ${prefectureCode}: ${result.parsed.length}件抽出・検算OK`);
  return 0;
}

process.exit(main());
