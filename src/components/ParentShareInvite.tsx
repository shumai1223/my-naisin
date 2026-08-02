'use client';

import * as React from 'react';
import { MessageCircle, Share2, Check } from 'lucide-react';

import { EVENTS, track } from '@/lib/track';
import { lineAddUrl } from '@/lib/line';
import { APP_NAME } from '@/lib/constants';
import { ParentShareLinkButton } from '@/components/ParentShareLinkButton';
import type { ParentShareContext } from '@/lib/share';

function isNum(v: number | null | undefined): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

/**
 * 「おうちの人に送る／保護者向けLINE登録」のお誘いブロック（TIER Σ-1で抽出）。
 *
 * 元は UnlockGate.tsx にインライン実装されていた（2026-08-01のロック機構撤去時に固定化）。
 * hensachi/hyotei-heikin いずれの最大流入面でも「共有導線は存在するが埋もれている」
 * （Σ実測: share_to_parentが結果閲覧の0.99%）ことが判明したため、単独の主導線として
 * 結果直後に置けるよう UnlockGate から切り出した。UnlockGate は本コンポーネントを内包する形に
 * 変更（挙動は変えない）。新しいCTA種別を作らず、既存の共有UIをそのまま再利用する。
 *
 * shareCtx.max（満点）が無い指標（例：偏差値には自然な満点が無い）では、
 * ParentShareLinkButton の成績カード（score/max表示）を使わず、素の共有
 * （テキスト+リンクのみ・数値の分母を捏造しない）にフォールバックする。
 */
export function ParentShareInvite({
  shareCtx,
  tool,
  placement,
  className = '',
}: {
  shareCtx: Omit<ParentShareContext, 'max'> & { max?: number | null };
  tool?: string;
  placement: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const onLineClick = React.useCallback(() => {
    track(EVENTS.LINE_FRIEND_CLICK, { source: `${placement}-unlock`, pref: shareCtx.prefectureCode ?? 'none' });
  }, [placement, shareCtx.prefectureCode]);

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
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // クリップボードも不可なら何もしない（最低限ボタンは壊さない）。
    }
  }, [shareCtx.prefectureCode, shareCtx.metricLabel, tool]);

  const hasCard = isNum(shareCtx.max);

  return (
    <section className={`rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:p-5 ${className}`}>
      <p className="mb-3 text-sm leading-relaxed text-slate-600">
        この結果は、おうちの人に共有できます。保護者向けのLINEでは、費用や進路の情報もお届けしています。
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {hasCard ? (
          <ParentShareLinkButton ctx={shareCtx as ParentShareContext} tool={tool} label="おうちの人に送る" />
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
                おうちの人に送る
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
          保護者向けLINEに登録する
        </a>
      </div>
    </section>
  );
}
