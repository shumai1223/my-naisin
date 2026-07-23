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

/**
 * PLAYBOOK移植メモ（F-7）: track() 本体・FunnelContext・ctxParams はサイト非依存でそのままコピー可能。
 * 他サイト（例: my-shingaku）へ移植する際は、EVENTS の語彙（result_view/cta_view 等の概念は流用しつつ、
 * 指標名は対象サイトの計算対象＝大学受験・学費相談等）に合わせて書き換えること。
 */
export const EVENTS = {
  // ── ファネル本線 ──
  TOOL_START: 'tool_start', // 計算機の入力開始（最初の操作）
  CALC_COMPLETE: 'calc_complete', // 計算が成立（必要入力が揃った）
  RESULT_VIEW: 'result_view', // 結果セクションの表示（換金の分母）
  CTA_VIEW: 'cta_view', // 換金CTAが視界に入った
  AFFILIATE_CLICK: 'affiliate_click', // アフィリンククリック（AffiliateClickTracker が自動送出）
  FORM_START: 'form_start', // 名簿フォームへの最初の入力（lead_submit の分母＝歩留まり計測）
  LEAD_SUBMIT: 'lead_submit', // 名簿登録の送信
  LEAD_SUBMIT_SUCCESS: 'lead_submit_success',
  LINE_FRIEND_CLICK: 'line_friend_click',
  // ── リードマグネット（登録の“即時の見返り”＝互恵性で lead_submit を底上げ） ──
  LEAD_MAGNET_VIEW: 'lead_magnet_view', // 登録成功後の見返り一式が表示された
  LEAD_MAGNET_CARD: 'lead_magnet_card', // 登録者が成績カード（画像）を開いた
  LEAD_MAGNET_PARENT: 'lead_magnet_parent', // 登録者が「おうちの人に送る」を押した（橋②）
  LEAD_MAGNET_NEXT: 'lead_magnet_next', // 登録者が「次の一手」リンクへ進んだ（内部回遊）
  // ── 橋①/橋② 先行指標 ──
  GAP_TARGET_SET: 'gap_target_set',
  SHARE_TO_PARENT: 'share_to_parent', // 生徒が「保護者に送る」を押した（橋②バトンの送り手側）
  SHARE_IMAGE: 'share_image', // 成績レポート“画像”を共有/保存した（視覚カード＝LINE開封率の主因）
  SHARE_QR_REVEAL: 'share_qr_reveal', // その場でQRコードを表示した（同じ部屋にいる保護者にその場で読み取ってもらう導線）
  PARENT_LANDING_VIEW: 'parent_landing_view', // 共有リンクから保護者が着地した（橋②バトンの受け手側＝決裁者到達）
  MET_BRIDGE_CLICK: 'met_bridge_click',
  SAVED_GOAL_REVISIT: 'saved_goal_revisit',
  // ── 行動計装 ──
  SCROLL_DEPTH: 'scroll_depth',
  RAGE_CLICK: 'rage_click',
  REVERSE_CALC_USE: 'reverse_calc_use', // 逆算ツールの利用
  // ── AI送客（GEO）計装 ──
  AI_REFERRAL: 'ai_referral', // ChatGPT/Perplexity/Copilot 等のAI経由の着地（GEOのROI可視化）
  // ── 名簿velocity（離脱直前の最後の捕捉） ──
  EXIT_INTENT_VIEW: 'exit_intent_view', // 退出インテントでLINE誘導モーダルを表示
  EXIT_INTENT_DISMISS: 'exit_intent_dismiss', // 閉じた（出し過ぎ検知の分母）
  // ── 実験基盤 ──
  EXPERIMENT_IMPRESSION: 'experiment_impression',
  // ── 掲載枠スポンサー（D-3・直販の県×面固定枠。AFFILIATES/lead-configとは別商流） ──
  SPONSOR_CLICK: 'sponsor_click',
  // ── 紹介・解放機構（T-1・G1名簿velocityの主エンジン） ──
  UNLOCK_TEASER_VIEW: 'unlock_teaser_view', // ロック中コンテンツ（解放前の誘い）が表示された
  UNLOCK_GRANTED: 'unlock_granted', // 共有/LINE追加で解放された（分母=unlock_teaser_view）
  // ── 匿名統計オプトイン（S-1一次データ堀のファネル計装 2026-07-13） ──
  // 背景: 結線後2日で stats_submissions=0 だが「表示ゼロ/同意ゼロ/送信失敗」を区別する
  // 計測が無く盲目だった。この4段でファネルのどこが細いかを特定する。
  STATS_OPTIN_VIEW: 'stats_optin_view', // 送信可能な結果と共にオプトインUIが表示された（分母）
  STATS_OPTIN_GRANT: 'stats_optin_grant', // 同意チェックON
  STATS_OPTIN_REVOKE: 'stats_optin_revoke', // 同意撤回
  STATS_SUBMIT_OK: 'stats_submit_ok', // /api/stats/submit が2xx＝サーバ受領まで実証
  STATS_SUBMIT_FAIL: 'stats_submit_fail', // 送信失敗（status付き）＝パイプ破断の検知
  // ── パーセンタイル・フック（ZZ-1b・データフライホイールの投稿インセンティブ計装） ──
  PERCENTILE_VIEW: 'percentile_view', // NationalPercentileRevealが全国/県内いずれかの実データを表示した（n不足のみの場合は含まない）
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

/* ────────────────────────────────────────────────────────────────────────
 * AI送客（GEO）の判定
 *
 * ChatGPT Search / Perplexity / Copilot 等から着地したかを referrer・URLパラメータで判定する。
 * AI経由の実数を可視化しないと「GEO（堀B/引用最適化）に投資すべきか」の意思決定が盲目になる。
 * 純粋関数（window非依存）＝ユニットテスト可能。判定不能なら null。
 * ──────────────────────────────────────────────────────────────────────── */
const AI_REFERRER_PATTERNS: { source: string; test: RegExp }[] = [
  { source: 'chatgpt', test: /(^|\.)chatgpt\.com$|(^|\.)chat\.openai\.com$|(^|\.)openai\.com$/ },
  { source: 'perplexity', test: /(^|\.)perplexity\.ai$/ },
  { source: 'copilot', test: /(^|\.)copilot\.microsoft\.com$|(^|\.)bing\.com$/ },
  { source: 'gemini', test: /(^|\.)gemini\.google\.com$|(^|\.)bard\.google\.com$/ },
  { source: 'claude', test: /(^|\.)claude\.ai$/ },
  { source: 'you', test: /(^|\.)you\.com$/ },
  { source: 'felo', test: /(^|\.)felo\.ai$/ },
  { source: 'genspark', test: /(^|\.)genspark\.ai$/ },
];

/** 多くのAIアシスタントは utm_source / ref に自分のドメインを載せる（referrerが空でも拾える）。 */
function aiSourceFromParam(value: string): string | null {
  const v = value.toLowerCase();
  for (const { source, test } of AI_REFERRER_PATTERNS) {
    // utm値は 'chatgpt.com' のようなホスト名 or 'chatgpt' のような素の名前が来る
    if (test.test(v) || v === source) return source;
  }
  return null;
}

/**
 * referrer（document.referrer）と URL のクエリ文字列から AI送客元を判定する。
 * @param referrer document.referrer（フルURL or 空文字）
 * @param locationSearch window.location.search（'?utm_source=chatgpt.com' 等）
 */
export function classifyAiReferrer(referrer: string, locationSearch = ''): string | null {
  // 1) referrer のホスト名で判定
  if (referrer) {
    try {
      const host = new URL(referrer).hostname.toLowerCase();
      for (const { source, test } of AI_REFERRER_PATTERNS) {
        if (test.test(host)) return source;
      }
    } catch {
      /* 不正なURLは無視してパラメータ判定にフォールバック */
    }
  }
  // 2) utm_source / ref / source パラメータで判定（referrerが落ちるAIアプリ内ブラウザ対策）
  try {
    const params = new URLSearchParams(locationSearch);
    for (const key of ['utm_source', 'ref', 'source', 'referrer']) {
      const val = params.get(key);
      if (val) {
        const src = aiSourceFromParam(val);
        if (src) return src;
      }
    }
  } catch {
    /* no-op */
  }
  return null;
}

/** スクロール深度（25/50/75/100）を一度ずつ送る計装をページに仕込む。返り値で解除。SSR安全。 */
export function installScrollDepthTracking(ctx: FunnelContext = {}): () => void {
  if (typeof window === 'undefined') return () => {};
  const milestones = [25, 50, 75, 100];
  const fired = new Set<number>();
  // 2026-07-14: bodyがスクロールコンテナの構造（globals.css html,body{height:100%}）では
  // Chrome/Android系で window.scrollY が常に0になり深度が測れない（iOS Safariのみ動く偏り）。
  // window/html/body を横断で読み、capture付きで要素スクロールのイベントも拾う。
  const onScroll = () => {
    const doc = document.documentElement;
    const body = document.body;
    const contentH = Math.max(doc.scrollHeight, body?.scrollHeight ?? 0);
    const scrollable = contentH - window.innerHeight;
    if (scrollable <= 0) return;
    const y = Math.max(window.scrollY || 0, doc.scrollTop || 0, body?.scrollTop ?? 0);
    const pct = Math.min(100, Math.round((y / scrollable) * 100));
    for (const m of milestones) {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        track(EVENTS.SCROLL_DEPTH, { ...ctxParams(ctx), depth: m });
      }
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true, capture: true });
  return () => window.removeEventListener('scroll', onScroll, { capture: true } as EventListenerOptions);
}
