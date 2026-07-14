'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';

import { track } from '@/lib/track';
import { lineAddUrl } from '@/lib/line';
import { shouldShowStickyBar, STICKY_ARM_SCROLL, STICKY_DISMISS_KEY } from '@/lib/sticky-bar';

/**
 * モバイル主体（実測68%）の常設“ながら”換金バー＝名簿velocity直撃。
 *
 * なぜ（GA4実測）：cta_view 687→line/lead ≈0。結果直後の静的CTAはスクロールで見逃される。
 * 68%のモバイル読者が本文を読み進める“最中”に、常に届く距離でLINE名簿(外部ASP非依存)を提示して
 * 使い捨てトラフィックを資産化する。退出モーダル（離脱時の一本釣り）とは別の“中盤の常設”レイヤー。
 * 表示可否の純ロジックは [[sticky-bar]] に分離（テスト可能）。
 *
 * SEO/AdSense安全・非侵入：
 *  - 本文を覆わない細いボトムバー（コンテンツを隠す interstitial ではない）。閉じる明示。
 *  - ツール/結果ページのみ（ブログ・規約・API・管理は出さない）。着地直後は出さず一定スクロール後にarm。
 *  - 閉じたらセッション内は再表示しない。env NEXT_PUBLIC_STICKY_BAR_DISABLED=1 で即停止。
 *  - 広告ではなく“資産形成（名簿）”なので密度リスクに当たらない（[[ExitIntentLineModal]]と同方針）。
 */

export function StickyConvertBar() {
  const pathname = usePathname();
  const [visible, setVisible] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const eligible = shouldShowStickyBar(pathname);

  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_STICKY_BAR_DISABLED === '1') return;
    if (!eligible) {
      setVisible(false);
      return;
    }
    try {
      if (window.sessionStorage.getItem(STICKY_DISMISS_KEY) === '1') {
        setDismissed(true);
        return;
      }
    } catch {
      /* ストレージ不可でも表示は継続（安全側＝出す） */
    }
    // 2026-07-14: globals.cssの html,body{height:100%;overflow-y:auto} により body がスクロール
    // コンテナになっていて、Chrome/Android系では window.scrollY が常に0（バーが誰にも出ない）。
    // iOS Safariはbodyスクロールをwindowに昇格するため一部ユーザーだけ動いていた。
    // → window/html/body の scrollTop を横断で読み、capture付きリスナーで要素スクロールも拾う。
    const scrolledY = () =>
      Math.max(
        window.scrollY || 0,
        document.documentElement?.scrollTop || 0,
        document.body?.scrollTop || 0
      );
    const onScroll = () => {
      if (scrolledY() > STICKY_ARM_SCROLL) setVisible(true);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', onScroll, { capture: true } as EventListenerOptions);
  }, [eligible, pathname]);

  if (!eligible || dismissed || !visible) return null;

  const close = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(STICKY_DISMISS_KEY, '1');
    } catch {
      /* no-op */
    }
  };

  const onLine = () => {
    track('line_friend_click', { source: 'sticky-bar', pref: 'none', page: pathname ?? 'none' });
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-emerald-200 bg-white/95 px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        <p className="hidden flex-1 text-xs font-medium leading-tight text-slate-600 sm:block">
          <span className="font-bold text-slate-800">志望校に届くか不安？</span>
          <br />
          内申アップのコツと受験情報をLINEで受け取れます。
        </p>
        <a
          href={lineAddUrl('student')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLine}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#06C755] px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] sm:flex-none sm:px-6"
        >
          <MessageCircle className="h-5 w-5 shrink-0" />
          {/* 「無料相談」は1:1返信体制が無く履行できない約束のため、配信ベースの文言に統一(2026-07-15) */}
          <span>LINEで対策情報を受け取る</span>
        </a>
        <button
          type="button"
          onClick={close}
          aria-label="閉じる"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
