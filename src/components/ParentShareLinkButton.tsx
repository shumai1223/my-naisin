'use client';

import * as React from 'react';
import { Share2, Check } from 'lucide-react';

import { EVENTS, track } from '@/lib/track';
import { APP_NAME } from '@/lib/constants';
import {
  buildParentShareUrl,
  buildParentShareMessage,
  type ParentShareContext,
} from '@/lib/share';

/**
 * 橋②（生徒→保護者バトン）の軽量な送り手ボタン。
 *
 * 画像生成（html2canvas）を伴う ShareModal と違い、Web Share API ＋ クリップボードだけで
 * 「保護者最適化ページ /hogosha」への文脈付きリンクを共有する。総合得点・偏差値など
 * 内申点以外の結果ページからも、決裁者（保護者）を実数つきの着地ページへ運べる。
 *
 * metricLabel を ctx に載せると、/hogosha の着地バナーが「総合得点の成績レポート」等に切り替わる
 * （未指定なら従来どおり「内申点」）。
 */
export function ParentShareLinkButton({
  ctx,
  className = '',
  tool,
  label = 'おうちの人に結果を送る',
}: {
  ctx: ParentShareContext;
  className?: string;
  /** 計装用のツール識別子（例: 'total-score'）。 */
  tool?: string;
  label?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const onShare = React.useCallback(async () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://my-naishin.com';
    const url = buildParentShareUrl(origin, ctx);
    const text = buildParentShareMessage(ctx);

    track(EVENTS.SHARE_TO_PARENT, {
      pref: ctx.prefectureCode ?? 'none',
      metric: ctx.metricLabel ?? '内申点',
      ...(tool ? { tool } : {}),
    });

    // スマホ＝ネイティブ共有シート（LINE等）。PC/未対応＝クリップボードにコピー。
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: APP_NAME, text, url });
        return;
      } catch (err) {
        // ユーザーキャンセル（AbortError）は何もしない。それ以外はコピーへフォールバック。
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
  }, [ctx, tool]);

  return (
    <button
      type="button"
      onClick={onShare}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-100 ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          リンクをコピーしました
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          {label}
        </>
      )}
    </button>
  );
}
