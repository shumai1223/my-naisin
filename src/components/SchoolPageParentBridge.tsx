'use client';

import * as React from 'react';
import { Send, Check } from 'lucide-react';

import { track, EVENTS } from '@/lib/track';
import { beaconParentFunnelEvent } from '@/lib/parent-funnel-beacon';

interface SchoolPageParentBridgeProps {
  schoolName: string;
  prefectureCode: string;
  className?: string;
}

/**
 * 学校ページ（Λ-2）の保護者ブリッジ＝結果画面の橋②（ParentShareLinkButton・onSendToParent）と
 * 同型のパターンをここにも置く（2026-08-08 loop-question-note【A】④）。
 *
 * 学校ページ側のCTAはこれまで`/reverse`（収益なし）・`/juku-shindan`（収益あり）・
 * LINE友だち追加（生徒向け）の3本のみで、保護者向けの導線が無かった。実測で収益は
 * 保護者からしか出ていない（`result_view → share_to_parent → parent_landing`）ため、
 * 学校ページへの流入を増やす前に保護者へ橋渡しする経路をまず用意する。
 *
 * 結果画面のParentShareLinkButtonと異なり、学校ページには「内申点スコア」という
 * ParentShareContext必須フィールド（score/max）に自然に対応する値が無いため、
 * /hogosha（スコア比較の文脈で作られた保護者ランディング）へは送らず、この学校ページ自体の
 * URLをそのまま共有する軽量実装にした（Web Share API→クリップボードのフォールバックのみ、
 * 画像添付なし）。計装は結果画面と同じ`SHARE_TO_PARENT`イベント＋保護者ファネルD1
 * （`beaconParentFunnelEvent`）に一次記録し、`tool: 'school-page'`で発生源を区別する。
 */
export function SchoolPageParentBridge({ schoolName, prefectureCode, className = '' }: SchoolPageParentBridgeProps) {
  const [copied, setCopied] = React.useState(false);

  const onShare = React.useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://my-naishin.com/pref/${prefectureCode}`;
    const text = `${schoolName}の募集人員・志願者数・倍率を調べました。よかったら見てもらえますか？`;
    const medium = typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? 'native' : 'copy';

    track(EVENTS.SHARE_TO_PARENT, { pref: prefectureCode, tool: 'school-page', medium });
    beaconParentFunnelEvent('share_to_parent', { medium, prefectureCode });

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: `${schoolName}の倍率 | My Naishin`, text, url });
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
      // クリップボードも不可なら何もしない（最低限ボタンは壊さない）
    }
  }, [schoolName, prefectureCode]);

  return (
    <div className={`rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 shadow-sm ${className}`}>
      <p className="mb-3 text-sm leading-relaxed text-slate-700">
        受験の相談は、おうちの人と一緒に。{schoolName}の情報をそのまま共有できます。
      </p>
      <button
        type="button"
        onClick={onShare}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            リンクをコピーしました
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            おうちの人に送る
          </>
        )}
      </button>
    </div>
  );
}
