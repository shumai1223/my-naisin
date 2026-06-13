/**
 * LINE公式アカウント 友だち追加URLの単一ソース（名簿の点灯口）。
 *
 * 堀A（名簿化）の設計：生徒名簿と保護者名簿を分離する。
 *  - 生徒（偏差値/内申の計算結果直下）と保護者（成績レポート報告・/hogosha）では
 *    配信したいメッセージも、追える単価（保護者＝決裁者）も全く違う。
 *  - そのため別アカウント（別友だち追加URL）に分けられるよう env を2系統用意する。
 *
 * env（いずれも公開値）：
 *  - NEXT_PUBLIC_LINE_ADD_URL         … 生徒向けアカウント（既定）。
 *  - NEXT_PUBLIC_LINE_ADD_URL_PARENT  … 保護者向けアカウント。未設定なら生徒アカウントにフォールバック
 *                                       （＝設定するまで現行挙動から一切変わらない安全設計）。
 */

/** 直書きの既定（公開情報のためビルド変数事故なしで確実に点灯）。env があれば上書き。 */
const STUDENT_LINE_URL = process.env.NEXT_PUBLIC_LINE_ADD_URL || 'https://lin.ee/8tQMAxX';
const PARENT_LINE_URL = process.env.NEXT_PUBLIC_LINE_ADD_URL_PARENT || STUDENT_LINE_URL;

export type LineAudience = 'student' | 'parent';

/** 名簿の対象（生徒/保護者）に応じた友だち追加URLを返す。保護者URL未設定時は生徒URLにフォールバック。 */
export function lineAddUrl(audience: LineAudience = 'student'): string {
  return audience === 'parent' ? PARENT_LINE_URL : STUDENT_LINE_URL;
}
