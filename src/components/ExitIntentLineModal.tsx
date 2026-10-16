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

    // モバイル：下に読み進めた後の“上方向スクロール反転”（戻る/読み終わりの前兆）。
    // 閾値を緩和（velUp 1.2→0.8 / y<600→900）。モバイルでは「読み終えて上に戻す」動作が離脱の主要シグナル。
    let lastY = window.scrollY;
    let lastT = Date.now();
    const onScrollMobile = () => {
      const y = window.scrollY;
      const t = Date.now();
      const dy = y - lastY;
      const dt = t - lastT || 1;
      const velUp = -dy / dt; // 上方向の速度（px/ms）
      if (velUp > 0.8 && y < 900 && scrolledRef.current) trigger();
      lastY = y;
      lastT = t;
    };

    // モバイル最重要：タブ切替/ホームボタン/画面ロック/タブを閉じる＝visibilitychange→hidden。
    // mouseout が発火しないモバイル(全体の71%)での離脱を確実に捕捉する。モーダルは復帰時に見える。
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') trigger();
    };

    armedRef.current = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mouseout', onMouseOut);
    window.addEventListener('scroll', onScrollMobile, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.clearTimeout(engageTimer);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mouseout', onMouseOut);
      window.removeEventListener('scroll', onScrollMobile);
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
