'use client';

/**
 * 保護者コミュニティ投稿のモデレーション操作ボタン（承認/却下）。Λ-14・内部ツール。
 * JukuReviewModerationActionsと同型（押下後location.reload()で最新一覧を再取得）。
 */
import { useState } from 'react';
import type { CommunityPostStatus } from '@/lib/community-posts';

export function CommunityPostModerationActions({
  id,
  currentStatus,
  token,
}: {
  id: number;
  currentStatus: CommunityPostStatus;
  token: string;
}) {
  const [pending, setPending] = useState<CommunityPostStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const act = async (nextStatus: CommunityPostStatus) => {
    setPending(nextStatus);
    setError(null);
    try {
      const res = await fetch('/api/admin/community-posts/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, id, currentStatus, nextStatus }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? '操作に失敗しました。');
        setPending(null);
        return;
      }
      location.reload();
    } catch {
      setError('通信エラーが発生しました。');
      setPending(null);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        {currentStatus !== 'approved' && (
          <button
            type="button"
            onClick={() => act('approved')}
            disabled={pending !== null}
            className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
          >
            {pending === 'approved' ? '処理中…' : '承認'}
          </button>
        )}
        {currentStatus !== 'rejected' && (
          <button
            type="button"
            onClick={() => act('rejected')}
            disabled={pending !== null}
            className="rounded-md bg-rose-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
          >
            {pending === 'rejected' ? '処理中…' : '却下'}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
