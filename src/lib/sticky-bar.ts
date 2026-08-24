/**
 * 常設換金バーの純ロジック（クライアント依存なし・テスト可能）。
 * ツール/結果ページにだけ出し、法務・API・管理・開発者ページには出さない。
 */

/** 着地直後の誤爆を避け、これ以上スクロールした“読んでいる”人にだけ出す。 */
export const STICKY_ARM_SCROLL = 500;
/** セッション内で閉じたら再表示しないためのキーの接頭辞（S8-2でカテゴリ単位に分割）。 */
export const STICKY_DISMISS_KEY = 'mn_sticky_bar_dismissed';

export type StickyBarCategory = 'home' | 'tool' | 'prefecture-tool' | 'school' | 'blog';

/**
 * ページを常設バーの表示カテゴリに分類する（S8-2）。対象外ページは null。
 * 「閉じる」の抑制範囲をこのカテゴリ単位に緩める（1回閉じてもセッション中の
 * 全ページが永久に沈黙する現状の設計を是正）。
 */
export function stickyBarCategoryOf(pathname: string | null | undefined): StickyBarCategory | null {
  if (!pathname) return null;
  // 除外（法務/計測系。S8-1でblogはここから外し独立カテゴリへ）
  if (/^\/(api|admin|developers|privacy|terms|disclaimer|contact|about|partner|embed)(\/|$)/.test(pathname)) {
    return null;
  }
  // ブログ（S8-1・28日クリック1,497＝現行対象面合計に対し+20.9%の露出プール拡大）
  if (/^\/blog(\/|$)/.test(pathname)) return 'blog';
  // トップ（内申計算のホーム）
  if (pathname === '/') return 'home';
  // 明示のツール/保護者費用ページ
  if (/^\/(hensachi|hyotei-heikin|reverse|tools|hiyou|koukou-hiyou|juken-schedule|shinro-hiyou|juku-hiyou|mendan)(\/|$)/.test(pathname)) {
    return 'tool';
  }
  // 県別ツール（/{pref}/naishin, /{pref}/total-score, /{pref}/s-value, /{pref}/rank）
  if (/^\/[a-z]+\/(naishin|total-score|s-value|rank)(\/|$)/.test(pathname)) return 'prefecture-tool';
  // 学校別ページ（/pref/{code}/school/{schoolCode}・Λ-2）＝倍率を見て終わる離脱を防ぐ換金導線
  if (/^\/pref\/[a-z]+\/school\//.test(pathname)) return 'school';
  return null;
}

/** ツール/結果ページか。 */
export function shouldShowStickyBar(pathname: string | null | undefined): boolean {
  return stickyBarCategoryOf(pathname) !== null;
}
