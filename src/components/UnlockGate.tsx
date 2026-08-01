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
 * 保護者への共有・LINE登録のお誘い（旧・解放ゲート／T-1）。
 *
 * ⚠️2026-08-01 設計変更: **ロック機構を撤去した**。以前は「保護者に送る」か「LINE登録」を
 * するまで children（全国統計）を隠す解放ゲートだったが、実測と実地検証で3つの問題が出た:
 *
 *  1. **実効性が無い**: `unlock_teaser_view` 393 に対し `unlock_granted` は **2**。
 *     391人がここで止まり、得ていたのは月2件の意思表明だけだった。
 *  2. **文言と実装が食い違っていた**: ボタンは「保護者に送って解放する」と書いてあるが、
 *     `navigator.share` が無い環境（PCブラウザの多く）では **クリップボードにコピーした
 *     時点で解放**されていた。誰にも送っていなくても解ける。実地検証で
 *     「押すだけで解除できるなら最初から出せばいいのでは」という不信を招くと指摘された。
 *  3. **解放しても中身が空のことがあった**: 協力者データが不足している指標では
 *     「まだ十分に集まっていません」しか出ず、行動させて何も渡さない形になっていた。
 *
 * このサイトの差別化は「公表値のみ・捏造ゼロ」という信頼であり、限定感を演出するための
 * 見せかけのロックはその一貫性を損なう。よって **children は常に表示し**、共有とLINEは
 * 本文の下の「お誘い」に格下げした（導線自体は残す）。
 *
 * 計装の変更: `UNLOCK_TEASER_VIEW` / `UNLOCK_GRANTED` は**もう送らない**（存在しない
 * ゲートの指標であり、送り続けると前後のデータの意味が混ざるため）。実際の行動である
 * `SHARE_TO_PARENT` / `LINE_FRIEND_CLICK` は従来どおり送る。
 *
 * shareCtx.max（満点）が無い指標（例：偏差値には自然な満点が無い）では、
 * ParentShareLinkButton の成績カード（score/max表示）を使わず、素の共有
 * （テキスト+リンクのみ・数値の分母を捏造しない）にフォールバックする。
 */
export function UnlockGate({
  children,
  shareCtx,
  tool,
  placement,
  className = '',
}: {
  children: React.ReactNode;
  shareCtx: Omit<ParentShareContext, 'max'> & { max?: number | null };
  tool?: string;
  placement: string;
  /** @deprecated ロック撤去に伴い未使用。呼び出し側の削除が済むまで型だけ残す。 */
  teaserTitle?: string;
  /** @deprecated ロック撤去に伴い未使用。呼び出し側の削除が済むまで型だけ残す。 */
  teaserBody?: string;
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
    <div className={className}>
      {children}

      {/* 共有・LINEのお誘い（ロックではない。押さなくても上の内容は読める） */}
      <section className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
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
    </div>
  );
}
