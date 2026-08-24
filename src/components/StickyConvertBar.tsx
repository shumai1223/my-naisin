'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, X } from 'lucide-react';

import { track } from '@/lib/track';
import { lineAddUrl } from '@/lib/line';
import { shouldShowStickyBar, stickyBarCategoryOf, STICKY_ARM_SCROLL, STICKY_DISMISS_KEY } from '@/lib/sticky-bar';

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
 *  - ツール/結果/ブログページのみ（規約・API・管理・開発者は出さない。S8-1でblog除外を解除）。
 *    着地直後は出さず一定スクロール後にarm。
 *  - 閉じたらセッション内・同一カテゴリ内は再表示しない（S8-2・カテゴリを跨げば改めて出る）。
 *    env NEXT_PUBLIC_STICKY_BAR_DISABLED=1 で即停止。
 *  - 広告ではなく“資産形成（名簿）”なので密度リスクに当たらない（[[ExitIntentLineModal]]と同方針）。
 */

export function StickyConvertBar() {
  const pathname = usePathname();
  const [visible, setVisible] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const eligible = shouldShowStickyBar(pathname);
  // S8-2: 「閉じる」の抑制範囲をセッション全体からカテゴリ単位（home/tool/prefecture-tool/school/blog）
  // へ緩める。キーをカテゴリごとに分けるため、カテゴリを跨いだ遷移では改めて判定し直す必要がある
  // （dismissedは前カテゴリの状態を引き継いだままにせず、新カテゴリのキー有無で明示的に更新する）。
  const category = stickyBarCategoryOf(pathname);
  const dismissKey = category ? `${STICKY_DISMISS_KEY}:${category}` : STICKY_DISMISS_KEY;

  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_STICKY_BAR_DISABLED === '1') return;
    if (!eligible) {
      setVisible(false);
      return;
    }
    let alreadyDismissed = false;
    try {
      alreadyDismissed = window.sessionStorage.getItem(dismissKey) === '1';
    } catch {
      /* ストレージ不可でも表示は継続（安全側＝出す） */
    }
    setDismissed(alreadyDismissed);
    if (alreadyDismissed) return;
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
  }, [eligible, pathname, dismissKey]);

  if (!eligible) return null;

  const close = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(dismissKey, '1');
    } catch {
      /* no-op */
    }
  };

  const onLine = () => {
    track('line_friend_click', { source: 'sticky-bar', pref: 'none', page: pathname ?? 'none' });
  };

  // 2026-08-01 Cowork実地UXテストで指摘された「操作中に突然バーが現れてタップ対象が変わる」事故の
  // 是正: 従来はvisible/dismissedの条件でreturn nullする=タップの瞬間に予告なくDOMへ挿入されていた。
  // 常時マウントしtranslate-y+opacityのトランジションで滑らかに出す(fixed要素のため他要素は動かない
  // が、突然の出現によるタップ対象の差し替えを避ける)。
  const show = visible && !dismissed;

  return (
    <div
      aria-hidden={!show}
      // 2026-08-01 Cowork実地UXテストで指摘された「下部固定LINEバナーが狭い画面を常時占有し
      // 圧迫感が強い」の是正: モバイル時はpadding/ボタン高さを縮小し、常時占有する面積を削減
      // （sm:以上＝タブレット・PCでは従来どおりの見た目を維持）。
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-emerald-200 bg-white/95 px-3 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur transition-all duration-300 supports-[backdrop-filter]:bg-white/80 sm:py-2.5 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
      }`}
    >
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
          tabIndex={show ? 0 : -1}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#06C755] px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] sm:flex-none sm:px-6 sm:py-3"
        >
          <MessageCircle className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
          {/* 「無料相談」は1:1返信体制が無く履行できない約束のため、配信ベースの文言に統一(2026-07-15) */}
          <span>LINEで対策情報を受け取る</span>
        </a>
        <button
          type="button"
          onClick={close}
          aria-label="閉じる"
          tabIndex={show ? 0 : -1}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 sm:h-9 sm:w-9"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
