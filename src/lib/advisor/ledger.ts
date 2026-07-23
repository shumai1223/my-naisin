/**
 * グラウンデッドAIアドバイザー（ZZ-3）の台帳（GroundingLedger）。
 * 準拠必須仕様: docs/zz-specs/zz3-grounded-advisor-spec.md §1-3。
 *
 * 核心原則: 回答に含まれる全ての数値は、この台帳のエントリ由来でなければならない。
 * 数値のフォーマット（丸め・単位付与）はエンジン→台帳登録時に一度だけ行い、
 * 台帳には表示形そのものを格納する（レンダラ側での再丸め・再計算は禁止）。
 */

export type GroundingSource = 'naishin-engine' | 'total-score-engine' | 'hensachi-engine' | 'prefectures' | 'system';

export interface LedgerEntry {
  /** 表示形そのもの（丸め済み・単位付き）。レンダラはこの文字列をそのまま埋め込む。 */
  value: string;
  source: GroundingSource;
  /** 都道府県コード（構造定数・県非依存の値は'none'）。 */
  context: string;
}

export type GroundingLedger = LedgerEntry[];

/** 台帳へ1エントリ追加した新しい配列を返す（純粋関数・破壊的変更なし）。 */
export function addEntry(ledger: GroundingLedger, value: string, source: GroundingSource, context: string): GroundingLedger {
  return [...ledger, { value, source, context }];
}

/**
 * 台帳外で使用を許可する唯一の数値・構造語彙（§3）。
 * これ以外の「作文された数値」は検証器（verify.ts・ZZ-3b）がviolationとして検出する。
 * 追加する場合はこのファイルへの差分として必ず可視化すること（無断追加を禁止する設計）。
 */
export const ADVISOR_STRUCTURAL_CONSTANTS: readonly string[] = [
  '9教科',
  '5教科',
  // 「4教科」は仕様書に明記された5語彙(9教科/5教科/5段階/47都道府県/1〜3年生/1〜3学期)には無いが、
  // 「実技4教科」という表現がテンプレ文で頻出するため構造定数として追加（県ごとに変わらない教科数のため）。
  '4教科',
  '5段階',
  '47都道府県',
  '1〜3年生',
  '1〜3学期',
  '2026年度',
  '2027年度',
];
