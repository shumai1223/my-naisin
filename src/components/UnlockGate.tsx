'use client';

import * as React from 'react';
import { Lock, MessageCircle, Sparkles, Share2, Check } from 'lucide-react';

import { EVENTS, track } from '@/lib/track';
import { readUnlockGate, markUnlockAction } from '@/lib/unlock-gate';
import { lineAddUrl } from '@/lib/line';
import { APP_NAME } from '@/lib/constants';
import { ParentShareLinkButton } from '@/components/ParentShareLinkButton';
import type { ParentShareContext } from '@/lib/share';
import { useExperiment } from '@/components/ab/useExperiment';

function isNum(v: number | null | undefined): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

/** unlock-teaser-copy-2026（U-3・[[experiments]]）のアーム。安定参照のためモジュールレベルに置く。 */
const UNLOCK_TEASER_ARMS = [{ id: 'control' as const }, { id: 'loss' as const }, { id: 'benefit' as const }];

/** unlock-teaser-copy-2026 の各アームのティザー文言（experiments.ts のheading/bodyと同一内容）。 */
const UNLOCK_TEASER_COPY: Record<'control' | 'loss' | 'benefit', { title: string; body: string }> = {
  control: {
    title: '全国の協力者と比べてみませんか？',
    body: 'おうちの人に結果を送るか、保護者向けLINEに登録すると、全国の協力者データと比べた「あなたの立ち位置」が見られるようになります。',
  },
  loss: {
    title: 'あなたの立ち位置、まだ見れていません',
    body: 'おうちの人に送るかLINE登録をするまで、全国の協力者データと比べた「あなたの立ち位置」は見られないままです。',
  },
  benefit: {
    title: '同学年・同都道府県との差が、数字でわかります',
    body: 'おうちの人に送るかLINE登録をすると、同学年・同都道府県の受験生と比べた実際の順位（パーセンタイル）がすぐにわかります。',
  },
};

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
 * teaserTitle/teaserBody未指定時は unlock-teaser-copy-2026（U-3）のA/Bで決まる既定文言を使う
 * （全設置面共通・呼び出し側で明示指定した場合はそちらを優先しA/Bの対象外にする）。
 */
export function UnlockGate({
  children,
  shareCtx,
  tool,
  placement,
  teaserTitle,
  teaserBody,
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
  const teaserVariant = useExperiment('unlock-teaser-copy-2026', UNLOCK_TEASER_ARMS);
  const resolvedTeaserTitle = teaserTitle ?? UNLOCK_TEASER_COPY[teaserVariant].title;
  const resolvedTeaserBody = teaserBody ?? UNLOCK_TEASER_COPY[teaserVariant].body;

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
    const medium = typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? 'native' : 'copy';
    track(EVENTS.SHARE_TO_PARENT, {
      pref: shareCtx.prefectureCode ?? 'none',
      metric: shareCtx.metricLabel ?? '内申点',
      medium,
      ...(tool ? { tool } : {}),
    });
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://my-naishin.com';
    const url = `${origin}/hogosha`;
    const text = '受験対策について、おうちの人に相談したくて。いまの状況をまとめたページを送ります。';
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
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
      className={`relative overflow-hidden rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 shadow-lg shadow-indigo-100/70 md:p-7 ${className}`}
    >
      {/* 視線を止めるアクセント光（2026-07-14: 旧デザインは灰色破線で存在感が無く素通りされた👤指摘） */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-300/30 blur-2xl" />

      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
        <Lock className="h-3.5 w-3.5" />
        解放コンテンツ
      </div>
      <h3 className="mb-2 flex items-center gap-1.5 text-lg font-bold leading-snug text-slate-900 md:text-xl">
        <Sparkles className="h-5 w-5 text-amber-500" />
        {resolvedTeaserTitle}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-slate-600">{resolvedTeaserBody}</p>

      {/* ロック中プレビュー＝見返りの「形」をぼかしで見せる（数値は?? のみ。実数の捏造はしない） */}
      <div className="relative mb-4 select-none overflow-hidden rounded-xl border border-indigo-100 bg-white/85 p-4">
        <div className="blur-[6px]" aria-hidden="true">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-bold text-slate-700">全国の協力者の中でのあなたの位置</span>
            <span className="whitespace-nowrap text-2xl font-black text-indigo-600">上位 ??%</span>
          </div>
          <div className="mt-2.5 h-3 w-full rounded-full bg-slate-100">
            <div className="h-3 w-2/3 rounded-full bg-gradient-to-r from-indigo-400 to-violet-500" />
          </div>
        </div>
        <div className="absolute inset-0 grid place-items-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3.5 py-1.5 text-xs font-bold text-white shadow">
            <Lock className="h-3.5 w-3.5" />
            解放すると表示されます
          </span>
        </div>
      </div>

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
