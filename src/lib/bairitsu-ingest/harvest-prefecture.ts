/**
 * T-Y11E DoD: 「県コード → PDF → レコード」が1本のコマンドで通る、のパイプライン中核（純関数）。
 *
 * これまでのE-1〜E-5は個別のモジュールとして存在した:
 *   E-1 registry.ts        : 県コード → パーサ関数
 *   E-4 validate-parsed-records.ts : 検算（fail-closed）
 *   E-5 diff-parsed-records.ts     : 前年度との差分
 *
 * `scripts/bairitsu-ingest/validate-all-registered.ts`はこれらをE-6（R8全県リプレイ）の
 * 文脈で「登録済み全県×フィクスチャ」に対して一括実行するが、**単一の県コードに対して
 * 単一のPDF（ジオメトリ）を渡して1件分の結果を返す**、という粒度の関数は存在しなかった。
 * このモジュールはその欠けていた1段（県コード+ジオメトリ → パース→検算→差分の結果）を
 * 純関数として提供する。実際のPDF取得・ジオメトリ抽出（Pythonスクリプト呼び出し）という
 * I/Oは`scripts/bairitsu-ingest/harvest-prefecture.ts`（CLI・薄いラッパー）側に分離する
 * （E-2のarchive-changed-pdfs.mjs/bairitsu-pdf-archive.tsと同じ設計方針）。
 */

import { getPrefectureParser } from './registry';
import type { ParsedCompetitionRow, PdfPageGeometry } from './parse-table-pdf';
import { validateParsedRecords, type ValidationResult } from './validate-parsed-records';
import { diffParsedRecords, type RecordDiffResult } from './diff-parsed-records';
import type { OfficialSubtotal } from '@/lib/competition-rate';

export interface HarvestPrefectureInput {
  prefectureCode: string;
  geometries: PdfPageGeometry[];
  /** 検算の基準となる公表小計。県のcompetition-rates/<pref>.tsのofficialSubtotalsをそのまま渡す。 */
  officialSubtotals: OfficialSubtotal[];
  /** 検算のレコード件数チェックに使う期待件数（省略時はレコード件数チェックをスキップ）。 */
  expectedRecordCount?: number;
  /** 個別に検証済みの許容誤差の例外（例: yamanashiの0.07）。無条件緩和はしない。 */
  finalRateToleranceOverride?: number;
  /** 差分を取りたい場合、前年度（または前回取得時）のレコードを渡す。省略時は差分を計算しない。 */
  previousRecords?: ParsedCompetitionRow[];
}

export type HarvestPrefectureResult =
  | {
      status: 'no-parser';
      prefectureCode: string;
    }
  | {
      status: 'ok' | 'validation-failed';
      prefectureCode: string;
      parsed: ParsedCompetitionRow[];
      validation: ValidationResult;
      diff?: RecordDiffResult;
    };

/**
 * 県コード＋ジオメトリ（PDFから抽出済み）を受け取り、パース→検算→（任意で）差分までを
 * 1回の呼び出しで実行する。**検算NGでも例外を投げず`status: 'validation-failed'`として
 * 返す**（呼び出し側＝CLIがexitコードで通り抜けさせない判断をする。この関数自体はfail-closedの
 * 判定結果を返すだけで、プロセスの終了制御はしない＝純関数として保つ）。
 *
 * 登録されていない県コードを渡した場合は`status: 'no-parser'`を返す（例外にしない。
 * 未パイプライン化の11県〈xlsx直接パース等〉を扱う呼び出し側が、通常のエラーハンドリングでなく
 * 分岐で正しく処理できるようにするため）。
 */
export function harvestPrefecture(input: HarvestPrefectureInput): HarvestPrefectureResult {
  const parser = getPrefectureParser(input.prefectureCode);
  if (!parser) {
    return { status: 'no-parser', prefectureCode: input.prefectureCode };
  }

  const parsed = parser(input.geometries);

  const validation = validateParsedRecords(parsed, input.officialSubtotals, {
    expectedRecordCount: input.expectedRecordCount,
    finalRateToleranceOverride: input.finalRateToleranceOverride,
  });

  const diff = input.previousRecords ? diffParsedRecords(input.previousRecords, parsed) : undefined;

  return {
    status: validation.ok ? 'ok' : 'validation-failed',
    prefectureCode: input.prefectureCode,
    parsed,
    validation,
    ...(diff ? { diff } : {}),
  };
}
