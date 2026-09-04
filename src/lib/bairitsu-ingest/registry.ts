import type { PdfPageGeometry, ParsedCompetitionRow } from './parse-table-pdf';
import { parseToyama } from './parsers/toyama';
import { parseAomori } from './parsers/aomori';
import { parseIwate } from './parsers/iwate';

/**
 * T-Y11E E-1: 県コード → パーサ関数 のレジストリ。
 *
 * `src/lib/bairitsu-ingest/__tests__/*.test.ts` に散在している30本以上のパーサは、
 * これまでjestテストの中（凍結フィクスチャ相手）でしか呼ばれていなかった。
 * このレジストリは、各県のパース処理を `src/lib/bairitsu-ingest/parsers/<pref>.ts` の
 * 純関数として抽出し、県コード文字列から引けるようにする（将来のR9収穫パイプラインの
 * 入口。詳細は`ops/tasks/T-Y11E-r9-harvest-pipeline.md`）。
 *
 * ⚠️1県ずつ移設する。既存テストはこのレジストリ経由で同じ結果を出すことを確認してから
 * 次の県に進む（`ops/tasks/T-Y11E-r9-harvest-pipeline.md`のE-1節参照）。
 */
export type PrefectureParser = (geometries: PdfPageGeometry[]) => ParsedCompetitionRow[];

export const PREFECTURE_PARSER_REGISTRY: Partial<Record<string, PrefectureParser>> = {
  toyama: parseToyama,
  aomori: parseAomori,
  iwate: parseIwate,
};

export function getPrefectureParser(prefectureCode: string): PrefectureParser | undefined {
  return PREFECTURE_PARSER_REGISTRY[prefectureCode];
}
