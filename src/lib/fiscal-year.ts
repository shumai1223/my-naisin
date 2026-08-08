/**
 * 「年度」表記の単一ソース（B-12）。
 *
 * サイト全体に「2026年度」「令和8年度」のような年度表記が散在しており（92ファイル超）、
 * 12月の年度切替（2026→2027年度）のたびに全箇所を手作業で置換するのはミスの元になる。
 * ここで管理する定数を参照する箇所は、CURRENT_FISCAL_YEAR を1つ書き換えるだけで一括更新できる。
 *
 * 移行方針：西暦↔和暦の変換や、total-score registry/explainers のような「同じ値を何十件も
 * 繰り返し書く」箇所から順にこの定数へ寄せる。JSX本文中の地の文（「〜2026年度入試対応」等）は
 * 機械的な一括置換がリスクになるため、ページを触るタイミングで順次移行する。
 */

/** 対象の学年度（西暦）。12月の年度切替時はここだけ書き換える。 */
export const CURRENT_FISCAL_YEAR = 2026;

/** 西暦の学年度を文字列で（total-score の TsSource.fiscalYear 等、string型フィールド用）。 */
export const CURRENT_FISCAL_YEAR_STRING = String(CURRENT_FISCAL_YEAR);

/** 西暦→令和年（令和1年=2019年）。 */
export function reiwaYear(adYear: number): number {
  return adYear - 2018;
}

/** 対象年度の令和年（数値）。 */
export const CURRENT_REIWA_YEAR = reiwaYear(CURRENT_FISCAL_YEAR);

/** '2026年度' */
export const FISCAL_YEAR_LABEL = `${CURRENT_FISCAL_YEAR}年度`;

/** '令和8年度' */
export const REIWA_YEAR_LABEL = `令和${CURRENT_REIWA_YEAR}年度`;

/** '令和8年度（2026年度）'：サイト内で最も使われる併記フォーマット。 */
export const FISCAL_YEAR_FULL_LABEL = `${REIWA_YEAR_LABEL}（${FISCAL_YEAR_LABEL}）`;

/** 次年度の令和年（数値）。12月の年度切替前でも「次の入試」の表記に使う。 */
export const NEXT_REIWA_YEAR = CURRENT_REIWA_YEAR + 1;

/** '令和9年度' */
export const NEXT_REIWA_YEAR_LABEL = `令和${NEXT_REIWA_YEAR}年度`;

/**
 * 年度表記の年度遅れ注記（2026-08-08 loop-question-note・👤裁定「暫定値です」の明記で対応）。
 *
 * CURRENT_FISCAL_YEARは12月の年度切替時にしか更新しない設計のため、切替前の春〜秋の期間は
 * 「今年度の入試（CURRENT）はすでに実施済みで、今の受験生が実際に受けるのは次年度（NEXT）の
 * 入試」という年度ズレが生じる。全箇所の数値を年度切替前に前倒しするのは誤りのリスクが高い
 * ため、既存の計算根拠はそのまま維持しつつ、フッター（全ページ共通）にこの一文だけを足す。
 */
export const FISCAL_YEAR_PROVISIONAL_NOTE = `${REIWA_YEAR_LABEL}要綱に基づく暫定値です。${NEXT_REIWA_YEAR_LABEL}要綱の公表後、順次更新します。`;
