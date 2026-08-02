'use client';

import type { ReactNode } from 'react';

import { ParentShareInvite } from '@/components/ParentShareInvite';
import type { ParentShareContext } from '@/lib/share';

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
 * 2026-08-02（TIER Σ-1）: 共有・LINEのお誘いUIは`ParentShareInvite`へ抽出した
 * （hensachi専用だった導線をhyotei-heikinでも単独利用できるようにするため）。挙動は変えていない。
 */
export function UnlockGate({
  children,
  shareCtx,
  tool,
  placement,
  className = '',
}: {
  children: ReactNode;
  shareCtx: Omit<ParentShareContext, 'max'> & { max?: number | null };
  tool?: string;
  placement: string;
  /** @deprecated ロック撤去に伴い未使用。呼び出し側の削除が済むまで型だけ残す。 */
  teaserTitle?: string;
  /** @deprecated ロック撤去に伴い未使用。呼び出し側の削除が済むまで型だけ残す。 */
  teaserBody?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {children}

      {/* 共有・LINEのお誘い（ロックではない。押さなくても上の内容は読める） */}
      <ParentShareInvite shareCtx={shareCtx} tool={tool} placement={placement} className="mt-4" />
    </div>
  );
}
