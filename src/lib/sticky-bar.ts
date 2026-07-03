/**
 * 常設換金バーの純ロジック（クライアント依存なし・テスト可能）。
 * ツール/結果ページにだけ出し、情報/法務/計測系ページには出さない。
 */

/** 着地直後の誤爆を避け、これ以上スクロールした“読んでいる”人にだけ出す。 */
export const STICKY_ARM_SCROLL = 500;
/** セッション内で閉じたら再表示しないためのキー。 */
export const STICKY_DISMISS_KEY = 'mn_sticky_bar_dismissed';

/** ツール/結果ページか。ブログ・規約・API・管理・開発者ページは除外。 */
export function shouldShowStickyBar(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  // 除外（情報/法務/計測系）
  if (/^\/(blog|api|admin|developers|privacy|terms|disclaimer|contact|about|partner|embed)(\/|$)/.test(pathname)) {
    return false;
  }
  // トップ（内申計算のホーム）
  if (pathname === '/') return true;
  // 明示のツール/保護者費用ページ
  if (/^\/(hensachi|hyotei-heikin|reverse|tools|hiyou|koukou-hiyou|juken-schedule|shinro-hiyou|juku-hiyou|mendan)(\/|$)/.test(pathname)) {
    return true;
  }
  // 県別ツール（/{pref}/naishin, /{pref}/total-score, /{pref}/s-value, /{pref}/rank）
  if (/^\/[a-z]+\/(naishin|total-score|s-value|rank)(\/|$)/.test(pathname)) return true;
  return false;
}
