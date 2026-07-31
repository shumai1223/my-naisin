'use client';

/**
 * 送客ログの操作パネル（連絡済み/辞退/成約報告）。Λ-7・admin/juku-matching専用・内部ツール。
 * 招待フロー（塾側ログイン）が未実装のため、現時点では管理者がこの画面から代行操作する。
 * 押下後は location.reload() で最新の一覧を再取得する（JukuReviewModerationActionsと同方針）。
 */
import { useState } from 'react';
import type { JukuReferralStatus } from '@/lib/juku-matching-db';

export function JukuReferralActions({
  referralId,
  currentStatus,
  token,
}: {
  referralId: number;
  currentStatus: JukuReferralStatus;
  token: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCommissionForm, setShowCommissionForm] = useState(false);
  const [grossAmountYen, setGrossAmountYen] = useState('');
  const [billingPeriod, setBillingPeriod] = useState('');

  const updateStatus = async (status: 'contacted' | 'declined') => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/juku-matching/referral-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, referralId, status }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? '操作に失敗しました。');
        setPending(false);
        return;
      }
      location.reload();
    } catch {
      setError('通信エラーが発生しました。');
      setPending(false);
    }
  };

  const submitCommission = async () => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/juku-matching/commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          referralId,
          grossAmountYen: Number(grossAmountYen),
          billingPeriod,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? '登録に失敗しました。');
        setPending(false);
        return;
      }
      location.reload();
    } catch {
      setError('通信エラーが発生しました。');
      setPending(false);
    }
  };

  if (currentStatus === 'converted' || currentStatus === 'declined') {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {currentStatus === 'sent' && (
          <button
            type="button"
            onClick={() => updateStatus('contacted')}
            disabled={pending}
            className="rounded-md bg-blue-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
          >
            連絡済みにする
          </button>
        )}
        <button
          type="button"
          onClick={() => setShowCommissionForm((v) => !v)}
          disabled={pending}
          className="rounded-md bg-emerald-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
        >
          成約報告
        </button>
        <button
          type="button"
          onClick={() => updateStatus('declined')}
          disabled={pending}
          className="rounded-md bg-rose-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
        >
          辞退
        </button>
      </div>
      {showCommissionForm && (
        <div className="flex flex-wrap items-center gap-2 rounded-md bg-slate-50 p-2">
          <input
            type="number"
            aria-label="成約金額(円)"
            placeholder="成約金額(円)"
            value={grossAmountYen}
            onChange={(e) => setGrossAmountYen(e.target.value)}
            className="w-28 rounded border border-slate-300 px-2 py-1 text-xs"
          />
          <input
            type="text"
            aria-label="請求月(YYYY-MM)"
            placeholder="YYYY-MM"
            value={billingPeriod}
            onChange={(e) => setBillingPeriod(e.target.value)}
            className="w-24 rounded border border-slate-300 px-2 py-1 text-xs"
          />
          <button
            type="button"
            onClick={submitCommission}
            disabled={pending}
            className="rounded-md bg-emerald-700 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
          >
            {pending ? '処理中…' : '登録'}
          </button>
        </div>
      )}
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
