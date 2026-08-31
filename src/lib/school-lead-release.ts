/**
 * 学校ページ保護者向けリードフォーム（C10-2）の公開日ゲート。
 *
 * [[loop-question-note]]のデプロイ順計画: C10-1(アフィリ枠=M1-2)を09-05に投入し、
 * 2週間の単独効果を計測してからC10-2(このフォーム)を09-19に投入する
 * （同時に入れると「どちらの施策の効果か」を切り分けられなくなるため）。
 *
 * このリポジトリは push = Cloudflare Workers 自動デプロイのため、コード実装自体は
 * 前倒しで完了させつつ（[[loop-question-note]]「両方いま実装してよい」）、実際に
 * ページ上へ表示するタイミングだけをこの日付ゲートで09-19以降に遅らせる。
 * env/フラグ点火のような👤ゲート操作は不要（このモジュール自身が判定するだけ）。
 */

export const SCHOOL_LEAD_FORM_RELEASE_DATE = '2026-09-19' as const;

/** 指定日時（省略時は現在時刻）がC10-2の公開日を過ぎているか。 */
export function isSchoolLeadFormReleased(now: Date = new Date()): boolean {
  return now.getTime() >= new Date(`${SCHOOL_LEAD_FORM_RELEASE_DATE}T00:00:00+09:00`).getTime();
}
