/**
 * 軽量イベント計測ユーティリティ。
 *
 * 目的：橋①（結果ページの取引化）の先行指標、特に「生徒は結果を保護者に転送するのか？」
 * （= 橋②バトンの最大の未知数）を、Bを本格実装する前に安価に検証するための計装。
 *
 * 現状このサイトには GA4 等の計測基盤が無い（AdSenseスクリプトのみ）。
 * そのため本関数は window.gtag / dataLayer が存在すれば送信し、無ければ no-op。
 * → GA4（gtag.js）を1本入れた瞬間に、ここで仕込んだ全イベントが計測開始される設計。
 */
export type TrackParams = Record<string, string | number | boolean | undefined>;

export function track(event: string, params: TrackParams = {}): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  try {
    if (typeof w.gtag === 'function') {
      w.gtag('event', event, params);
      return;
    }
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event, ...params });
    }
  } catch {
    /* 計測失敗はユーザー体験に影響させない */
  }
}
