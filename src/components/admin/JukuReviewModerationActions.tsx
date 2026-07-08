'use client';

/**
 * 塾口コミのモデレーション操作ボタン（承認/却下）。TIER R-1第3弾・内部ツール。
 * /admin/juku-reviews ページ専用。押下後は location.reload() で最新の一覧を再取得する
 * （このページ自体がサーバーコンポーネントでD1から都度読むため、素朴なreloadで十分）。
 */
import { useState } from 'react';
import type { ReviewStatus } from '@/lib/juku-reviews';

export function JukuReviewModerationActions({
  id,
  currentStatus,
  token,
}: {
  id: number;
  currentStatus: ReviewStatus;
  token: string;
}) {
  const [pending, setPending] = useState<ReviewStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const act = async (nextStatus: ReviewStatus) => {
    setPending(nextStatus);
    setError(null);
    try {
      const res = await fetch('/api/admin/juku-reviews/moderate', {
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
