'use client';

import * as React from 'react';
import { Lock, MessageCircle, Sparkles, Share2, Check } from 'lucide-react';

import { EVENTS, track } from '@/lib/track';
import { readUnlockGate, markUnlockAction } from '@/lib/unlock-gate';
import { lineAddUrl } from '@/lib/line';
import { APP_NAME } from '@/lib/constants';
import { ParentShareLinkButton } from '@/components/ParentShareLinkButton';
import type { ParentShareContext } from '@/lib/share';

function isNum(v: number | null | undefined): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

/**
 * 紹介・解放機構（T-1）の解放ゲート。
 *
 * 「保護者に送る」か「保護者向けLINEに友だち追加」のどちらかを行うと children（全国統計の
 * 先行閲覧等）が解放される。既存 ParentShareLinkButton/lineAddUrl の上に薄く構築し、新規の
 * 外部送信・依存追加はゼロ。解放はクリック（意図表明）で成立するベストエフォート設計
 * （サーバー確認のあるlead_submit等とは別軸＝unlock-gate.tsのコメント参照）。
 *
 * shareCtx.max（満点）が無い指標（例：偏差値には自然な満点が無い）では、ParentShareLinkButton
 * の成績カード（score/max表示）を使わず、素の共有（テキスト+リンクのみ・数値の分母を捏造しない）
 * にフォールバックする。既存のParentWindowBridgeも同じ理由でhensachi系にはmaxを渡していない
 * （[[fable5-loop-protocol]]の捏造ゼロ原則を share/カード表示にも適用）。
 *
 * teaserTitle/teaserBody未指定時は既定の「全国統計」向け文言を使う。
 */
export function UnlockGate({
  children,
  shareCtx,
  tool,
  placement,
  teaserTitle = '全国の協力者と比べてみませんか？',
  teaserBody = 'おうちの人に結果を送るか、保護者向けLINEに登録すると、全国の協力者データと比べた「あなたの立ち位置」が見られるようになります。',
  className = '',
}: {
  children: React.ReactNode;
  shareCtx: Omit<ParentShareContext, 'max'> & { max?: number | null };
  tool?: string;
  placement: string;
  teaserTitle?: string;
  teaserBody?: string;
  className?: string;
}) {
  const [unlocked, setUnlocked] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const viewedRef = React.useRef(false);

  React.useEffect(() => {
    setUnlocked(readUnlockGate().granted);
  }, []);

  React.useEffect(() => {
    if (unlocked || viewedRef.current) return;
    viewedRef.current = true;
    track(EVENTS.UNLOCK_TEASER_VIEW, { placement, pref: shareCtx.prefectureCode ?? 'none' });
    // unlocked/shareCtx.prefectureCodeは初回マウント時点の値で十分（毎回打ち直す必要はない）。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocked]);

  const grant = React.useCallback(
    (action: 'share' | 'line') => {
      markUnlockAction(action);
      setUnlocked(true);
      track(EVENTS.UNLOCK_GRANTED, { placement, action, pref: shareCtx.prefectureCode ?? 'none' });
    },
    [placement, shareCtx.prefectureCode]
  );

  const onLineClick = React.useCallback(() => {
    track(EVENTS.LINE_FRIEND_CLICK, { source: `${placement}-unlock`, pref: shareCtx.prefectureCode ?? 'none' });
    grant('line');
  }, [grant, placement, shareCtx.prefectureCode]);

  // 満点の無い指標（偏差値等）向けの素の共有（スコアカードなし・数値の分母を捏造しない）。
  const onPlainShare = React.useCallback(async () => {
    track(EVENTS.SHARE_TO_PARENT, {
      pref: shareCtx.prefectureCode ?? 'none',
      metric: shareCtx.metricLabel ?? '内申点',
      ...(tool ? { tool } : {}),
    });
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://my-naishin.com';
    const url = `${origin}/hogosha`;
    const text = '受験対策について、おうちの人に相談したくて。いまの状況をまとめたページを送ります。';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: APP_NAME, text, url });
        grant('share');
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
      grant('share');
    } catch {
      // クリップボードも不可なら何もしない（最低限ボタンは壊さない）。
    }
  }, [grant, shareCtx.prefectureCode, shareCtx.metricLabel, tool]);

  if (unlocked) return <>{children}</>;

  const hasCard = isNum(shareCtx.max);

  return (
    <section
      className={`overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 md:p-7 ${className}`}
    >
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
        <Lock className="h-3.5 w-3.5" />
        解放コンテンツ
      </div>
      <h3 className="mb-2 flex items-center gap-1.5 text-lg font-bold leading-snug text-slate-900 md:text-xl">
        <Sparkles className="h-5 w-5 text-amber-500" />
        {teaserTitle}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-slate-600">{teaserBody}</p>

      <div className="grid gap-2 sm:grid-cols-2">
        {hasCard ? (
          <ParentShareLinkButton
            ctx={shareCtx as ParentShareContext}
            tool={tool}
            label="保護者に送って解放する"
            onShared={() => grant('share')}
          />
        ) : (
          <button
            type="button"
            onClick={onPlainShare}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-100"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                リンクをコピーしました
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                保護者に送って解放する
              </>
            )}
          </button>
        )}
        <a
          href={lineAddUrl('parent')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLineClick}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#06C755] bg-[#06C755] px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
        >
          <MessageCircle className="h-4 w-4" />
          LINE登録で解放する
        </a>
      </div>
    </section>
  );
}
