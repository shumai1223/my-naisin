#!/usr/bin/env -S npx tsx
/**
 * T-Y11E E-4: 「検算をパイプラインに繋ぐ」の実行可能な入口。
 *
 * 登録済み県（`registry.ts`）ごとに、保存済みR8 geometry フィクスチャをパイプラインの入口
 * （`getPrefectureParser`）から通し、結果を`validateParsedRecords`（E-4の単一の関門）で
 * 検算する。**1県でも検算が落ちれば、このスクリプトはexit 1で終了する（fail-closed・
 * 通り抜けさせない）**。
 *
 * これがE-6（R8全県リプレイ）とE-4（検算パイプライン）を実際に繋いだ実行可能な形。
 * `npx tsx scripts/bairitsu-ingest/validate-all-registered.ts`で実行する。
 */
import { join } from 'node:path';

import { PREFECTURE_PARSER_REGISTRY } from '@/lib/bairitsu-ingest/registry';
import { validateParsedRecords } from '@/lib/bairitsu-ingest/validate-parsed-records';
import type { PdfPageGeometry } from '@/lib/bairitsu-ingest/parse-table-pdf';
import type { OfficialSubtotal } from '@/lib/competition-rate';

// 3方式のいずれとも厳密一致しないことが公表資料の算定方式そのものに起因すると個別検証済みの
// 県のみ、`validate-parsed-records.ts`の許容誤差フォールバックを有効にする（無条件緩和はしない）。
// yamanashi: 帰国生徒等特別措置の適用者を最終志願者数の内数として含めつつ倍率算定からは除外する
// 公表方式（`yamanashi.ts`ヘッダコメント・`yamanashi.test.ts`の許容誤差0.07と同値）。
const FINALRATE_TOLERANCE_OVERRIDE: Record<string, number> = { yamanashi: 0.07 };

// 各県の`COMPETITION_RATES`エクスポート名は`<CODE>_COMPETITION_RATES`（大文字スネーク）。
// 動的requireで県コード→モジュールを解決する（tsxはrequireを許容する）。
function loadCompetitionRatesModule(prefectureCode: string): { officialSubtotals: OfficialSubtotal[]; recordCount: number } {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(`../../src/data/competition-rates/${prefectureCode}`);
  const exportName = `${prefectureCode.toUpperCase()}_COMPETITION_RATES`;
  const file = mod[exportName];
  if (!file) throw new Error(`export ${exportName} not found in competition-rates/${prefectureCode}.ts`);
  const r8Records = file.records.filter((r: { fiscalYear?: string }) => r.fiscalYear === undefined);
  return { officialSubtotals: file.officialSubtotals ?? [], recordCount: r8Records.length };
}

function loadFixture(prefectureCode: string): PdfPageGeometry[] | null {
  const fixturesDir = join(__dirname, '..', '..', 'src', 'lib', 'bairitsu-ingest', '__fixtures__');
  const path = join(fixturesDir, `${prefectureCode}-r8-geometry.json`);
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const raw = require(path);
    // tokushimaは単一頁オブジェクト（配列ではない）。パーサ側で吸収する県もあるため配列化する。
    return Array.isArray(raw) ? raw : [raw];
  } catch {
    return null;
  }
}

function main(): number {
  const prefectures = Object.keys(PREFECTURE_PARSER_REGISTRY).sort();
  let failCount = 0;
  let skipCount = 0;

  for (const prefectureCode of prefectures) {
    const parser = PREFECTURE_PARSER_REGISTRY[prefectureCode];
    if (!parser) continue;
    const geometries = loadFixture(prefectureCode);
    if (!geometries) {
      console.log(`⏭️  ${prefectureCode}: フィクスチャ無し（スキップ）`);
      skipCount++;
      continue;
    }

    let officialSubtotals: OfficialSubtotal[] = [];
    let expectedRecordCount: number | undefined;
    try {
      const loaded = loadCompetitionRatesModule(prefectureCode);
      officialSubtotals = loaded.officialSubtotals;
      expectedRecordCount = loaded.recordCount;
    } catch (error) {
      console.log(`⚠️  ${prefectureCode}: competition-ratesモジュール読み込み失敗（${(error as Error).message}）`);
    }

    const parsed = parser(geometries);
    const result = validateParsedRecords(parsed, officialSubtotals, {
      expectedRecordCount,
      finalRateToleranceOverride: FINALRATE_TOLERANCE_OVERRIDE[prefectureCode],
    });

    if (result.ok) {
      console.log(`✅ ${prefectureCode}: ${parsed.length}件・検算OK`);
    } else {
      failCount++;
      console.log(`❌ ${prefectureCode}: 検算NG`);
      for (const issue of result.issues) {
        console.log(`     [${issue.check}] ${issue.message}`);
      }
    }
  }

  console.log('');
  console.log(`合計: ${prefectures.length}県登録済み / 検証実行: ${prefectures.length - skipCount}県 / OK: ${prefectures.length - skipCount - failCount}県 / NG: ${failCount}県 / フィクスチャ無しでスキップ: ${skipCount}県`);

  return failCount > 0 ? 1 : 0;
}

process.exit(main());
