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

/* ────────────────────────────────────────────────────────────────────────
 * 命名規約（GA4イベントの単一ソース）
 *
 * 目的：イベント名を文字列で散らさず、ここに集約してファネルを「設計図」にする。
 * 完全ファネル：流入 → 計算開始 → 計算完了 → result_view → cta_view → affiliate_click → lead_submit
 *
 * 既存コードの track('lead_submit', …) 等はそのまま動く（後方互換）。新規箇所は EVENTS と
 * 下のヘルパーを使うことで、命名ゆれ・計測漏れを型で防ぐ。
 * ──────────────────────────────────────────────────────────────────────── */

export const EVENTS = {
  // ── ファネル本線 ──
  TOOL_START: 'tool_start', // 計算機の入力開始（最初の操作）
  CALC_COMPLETE: 'calc_complete', // 計算が成立（必要入力が揃った）
  RESULT_VIEW: 'result_view', // 結果セクションの表示（換金の分母）
  CTA_VIEW: 'cta_view', // 換金CTAが視界に入った
  AFFILIATE_CLICK: 'affiliate_click', // アフィリンククリック（AffiliateClickTracker が自動送出）
  LEAD_SUBMIT: 'lead_submit', // 名簿登録の送信
  LEAD_SUBMIT_SUCCESS: 'lead_submit_success',
  LINE_FRIEND_CLICK: 'line_friend_click',
  // ── 橋①/橋② 先行指標 ──
  GAP_TARGET_SET: 'gap_target_set',
  SHARE_TO_PARENT: 'share_to_parent', // 生徒が「保護者に送る」を押した（橋②バトンの送り手側）
  PARENT_LANDING_VIEW: 'parent_landing_view', // 共有リンクから保護者が着地した（橋②バトンの受け手側＝決裁者到達）
  MET_BRIDGE_CLICK: 'met_bridge_click',
  SAVED_GOAL_REVISIT: 'saved_goal_revisit',
  // ── 行動計装 ──
  SCROLL_DEPTH: 'scroll_depth',
  RAGE_CLICK: 'rage_click',
  REVERSE_CALC_USE: 'reverse_calc_use', // 逆算ツールの利用
  // ── 実験基盤 ──
  EXPERIMENT_IMPRESSION: 'experiment_impression',
} as const;

export type AnalyticsEvent = (typeof EVENTS)[keyof typeof EVENTS];

/** 文脈パラメータ（県・面・ページ）。全ファネルで一貫した次元で集計できるよう正規化する。 */
export interface FunnelContext {
  /** 都道府県コード（例: tokyo）。未指定は 'none'。 */
  pref?: string;
  /** 設置面（result / hensachi / hyotei-heikin / prefecture など）。 */
  placement?: string;
  /** ツール種別（naishin / hensachi / hyotei-heikin / reverse など）。 */
  tool?: string;
}

function ctxParams(ctx: FunnelContext = {}): TrackParams {
  return {
    pref: ctx.pref ?? 'none',
    ...(ctx.placement ? { placement: ctx.placement } : {}),
    ...(ctx.tool ? { tool: ctx.tool } : {}),
  };
}

/** 型付きラッパー。EVENTS 定数のみを受けるので命名ゆれを型で防ぐ。 */
export function trackEvent(event: AnalyticsEvent, params: TrackParams = {}): void {
  track(event, params);
}

// ── ファネル各段の薄いヘルパー（呼び出し側を1行にして計測漏れを減らす） ──
export const funnel = {
  toolStart: (ctx: FunnelContext = {}) => track(EVENTS.TOOL_START, ctxParams(ctx)),
  calcComplete: (ctx: FunnelContext = {}, extra: TrackParams = {}) =>
    track(EVENTS.CALC_COMPLETE, { ...ctxParams(ctx), ...extra }),
  resultView: (ctx: FunnelContext = {}, extra: TrackParams = {}) =>
    track(EVENTS.RESULT_VIEW, { ...ctxParams(ctx), ...extra }),
  ctaView: (ctx: FunnelContext = {}, extra: TrackParams = {}) =>
    track(EVENTS.CTA_VIEW, { ...ctxParams(ctx), ...extra }),
  leadSubmit: (ctx: FunnelContext = {}, extra: TrackParams = {}) =>
    track(EVENTS.LEAD_SUBMIT, { ...ctxParams(ctx), ...extra }),
};

/** スクロール深度（25/50/75/100）を一度ずつ送る計装をページに仕込む。返り値で解除。SSR安全。 */
export function installScrollDepthTracking(ctx: FunnelContext = {}): () => void {
  if (typeof window === 'undefined') return () => {};
  const milestones = [25, 50, 75, 100];
  const fired = new Set<number>();
  const onScroll = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100));
    for (const m of milestones) {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        track(EVENTS.SCROLL_DEPTH, { ...ctxParams(ctx), depth: m });
      }
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}
