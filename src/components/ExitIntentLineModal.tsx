'use client';

import * as React from 'react';
import { MessageCircle, X } from '@/components/icons';

import { EVENTS, track } from '@/lib/track';
import { lineAddUrl, LINE_UNFRIEND_HELP_TEXT } from '@/lib/line';

/**
 * 退出インテントの最後の捕捉＝LINE名簿への一本釣り（名簿velocity直撃のKPI施策）。
 *
 * 重要な設計（SEO安全・非侵入）：
 *  - 「入口」ではなく「退出」トリガーのみ（Googleの intrusive interstitial ペナルティは入口型が対象）。
 *  - 着地直後は出さない（ENGAGE_MS 経過＋一定スクロール後のみアーム）。
 *  - トリガーは「PCでページ上端からマウスが出る」と「タブが隠れる（visibilitychange）」だけ。
 *    スマホで上へスクロールを戻しただけでは出さない（2026-10-16 👤決定・読書の妨げにしない）。
 *    リンクをクリックした直後（5秒以内）のタブ切替も出さない（別タブでリンクを開いただけで離脱ではない。広告のタップも含む）。
 *  - 1端末あたり frequency cap（既定10日に1回）＋同一セッション1回。閉じたら当面出さない。
 *  - 全画面で本文を覆わない控えめなボトムシート／カード。閉じるは大きく明示。
 *  - 広告ではなく“資産形成（名簿）”なので AdSense密度リスクには当たらない。
 *  - env NEXT_PUBLIC_EXIT_MODAL_DISABLED=1 で即停止できるキルスイッチ付き。
 */
const LAST_SHOWN_KEY = 'mn_exit_modal_last';
const FREQ_MS = 10 * 24 * 60 * 60 * 1000; // 10日に1回まで
const ENGAGE_MS = 8000; // 着地後この時間は出さない（誤爆・侵入防止）
const ARM_SCROLL = 400; // これ以上スクロールして“読んだ”人だけ対象

/** いま表示してよいか（frequency cap）。純粋関数＝テスト可能。 */
export function canShowExitModal(lastShownMs: number | null, now: number): boolean {
  if (lastShownMs === null) return true;
  return now - lastShownMs >= FREQ_MS;
}

const LINK_CLICK_WINDOW_MS = 5000; // リンクをクリックしてから、この時間内のタブ切替は「離脱」ではなく操作の結果とみなす

/**
 * 直前（LINK_CLICK_WINDOW_MS 以内）にリンクをクリックしていたか。純粋関数＝テスト可能。
 * 別タブでリンク（アフィリエイトの /go・LINE追加など）を開いた直後の visibilitychange は、離脱ではない。
 * そこで出すと、行動の直後に割り込み、頻度上限（10日に1回）も消費してしまう（2026-10-16 👤決定）。
 * 5秒にしているのは、新しいタブの生成が遅い端末や、同じタブでの遷移（新ページの応答が来てから旧ページが隠れる）でも拾うため。
 * 誤って1回出さないコストは、誤って割り込むコストより小さい。
 * 対象は <a href> のクリックと、広告 iframe へのフォーカス移動（広告のタップ）だけ。共有ボタン・navigator.share・
 * コンテキストメニューの「新しいタブで開く」は対象外。
 */
export function isRecentLinkClick(lastLinkClickMs: number | null, now: number): boolean {
  if (lastLinkClickMs === null) return false;
  const elapsed = now - lastLinkClickMs;
  return elapsed >= 0 && elapsed < LINK_CLICK_WINDOW_MS;
}

export function ExitIntentLineModal() {
  const [open, setOpen] = React.useState(false);
  const armedRef = React.useRef(false);
  const engagedRef = React.useRef(false);
  const scrolledRef = React.useRef(false);
  const firedRef = React.useRef(false);

  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_EXIT_MODAL_DISABLED === '1') return;

    // frequency cap
    let lastShown: number | null = null;
    try {
      const raw = window.localStorage.getItem(LAST_SHOWN_KEY);
      lastShown = raw ? Number(raw) : null;
      if (window.sessionStorage.getItem('mn_exit_modal_seen') === '1') return; // セッション内は1回
    } catch {
      /* ストレージ不可環境では出さない（安全側） */
      return;
    }
    if (!canShowExitModal(lastShown, Date.now())) return;

    const engageTimer = window.setTimeout(() => {
      engagedRef.current = true;
    }, ENGAGE_MS);

    const onScroll = () => {
      if (window.scrollY > ARM_SCROLL) scrolledRef.current = true;
    };

    const trigger = () => {
      if (firedRef.current || !engagedRef.current || !scrolledRef.current) return;
      firedRef.current = true;
      try {
        window.localStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
        window.sessionStorage.setItem('mn_exit_modal_seen', '1');
      } catch {
        /* no-op */
      }
      setOpen(true);
      track(EVENTS.EXIT_INTENT_VIEW, { page: window.location.pathname });
    };

    // デスクトップ：ページ上端から離脱（タブを閉じる/URLバーへ）
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };

    // 2026-10-16 👤決定: スマホの「上方向スクロール反転」では出さない。
    // スクロールの不具合（window.scrollY が常に0だった）を直したことで、読んでいる最中に上へ戻しただけで
    // モーダルが出るようになってしまうため（保護者の読書を邪魔しない）。スマホの離脱は下の visibilitychange で捕捉する。

    // モバイル最重要：タブ切替/ホームボタン/画面ロック/タブを閉じる＝visibilitychange→hidden。
    // mouseout が発火しないモバイル(全体の71%)での離脱を確実に捕捉する。モーダルは復帰時に見える。
    // 直前にリンクをクリックしていたら出さない（別タブでリンクを開いた直後は離脱ではない）。
    let lastLinkClickAt: number | null = null;
    const onLinkClick = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (el && typeof el.closest === 'function' && el.closest('a[href]')) lastLinkClickAt = Date.now();
    };

    // 広告（AdSense の iframe）のタップは、別ドキュメントの中で起きるので上の click には届かない。
    // 代わりに、親ウィンドウの blur のあと、フォーカスが広告の iframe に移っていれば「リンクを押した」とみなす
    // （タブ切替による blur では document.hasFocus() が false なので、誤って拾わない）。ベストエフォート。
    const onWindowBlur = () => {
      window.setTimeout(() => {
        const a = document.activeElement;
        if (a && a.tagName === 'IFRAME' && document.hasFocus()) lastLinkClickAt = Date.now();
      }, 0);
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden' && !isRecentLinkClick(lastLinkClickAt, Date.now())) trigger();
    };

    armedRef.current = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('blur', onWindowBlur);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('click', onLinkClick, true);
    document.addEventListener('auxclick', onLinkClick, true); // 中ボタンクリック（新しいタブで開く）
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearTimeout(engageTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('blur', onWindowBlur);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('click', onLinkClick, true);
      document.removeEventListener('auxclick', onLinkClick, true);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  if (!open) return null;

  const close = () => {
    setOpen(false);
    track(EVENTS.EXIT_INTENT_DISMISS, { page: window.location.pathname });
  };

  const onLineClick = () => {
    track(EVENTS.LINE_FRIEND_CLICK, { source: 'exit-intent', pref: 'none' });
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="LINEで受験情報を受け取る"
      onClick={close}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-white shadow-overlay"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-brand-50 px-5 py-5">
          <button
            type="button"
            onClick={close}
            aria-label="閉じる"
            className="absolute right-1 top-1 rounded p-3 text-slate-600 hover:bg-white hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
          <h3 className="pr-10 text-lg font-bold leading-snug text-slate-900">
            受験情報・内申点アップのコツをLINEで受け取りませんか？
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            出願日程や対策のタイミングを、必要なときにLINEでお知らせします。登録は無料・数秒、いつでも解除できます。
          </p>
        </div>
        <div className="flex flex-col gap-2 p-5">
          <a
            href={lineAddUrl('student')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onLineClick}
            className="flex items-center justify-center gap-2 rounded bg-[#06C755] px-5 py-3 text-base font-bold text-white transition-colors hover:bg-[#05b34c]"
          >
            <MessageCircle className="h-5 w-5" />
            LINEで友だち追加（無料）
          </a>
          <p className="text-center text-sm leading-relaxed text-slate-600">{LINE_UNFRIEND_HELP_TEXT}</p>
          <button
            type="button"
            onClick={close}
            className="min-h-[44px] text-center text-sm text-slate-600 underline underline-offset-2 hover:text-slate-900"
          >
            あとで
          </button>
        </div>
      </div>
    </div>
  );
}
