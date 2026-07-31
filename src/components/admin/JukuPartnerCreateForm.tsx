'use client';

/** 提携塾の新規登録フォーム（Λ-7・admin/juku-matching専用・内部ツール）。 */
import { useState } from 'react';

export function JukuPartnerCreateForm({ token }: { token: string }) {
  const [name, setName] = useState('');
  const [commissionRatePercent, setCommissionRatePercent] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setPending(true);
    setError(null);
    try {
      const percent = Number(commissionRatePercent);
      const commissionRateBps = Math.round(percent * 100);
      const res = await fetch('/api/admin/juku-matching/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, name, commissionRateBps }),
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

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md bg-slate-50 p-3">
      <input
        type="text"
        aria-label="塾名"
        placeholder="塾名"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-40 rounded border border-slate-300 px-2 py-1 text-xs"
      />
      <input
        type="number"
        aria-label="take-rate(%)"
        placeholder="take-rate(%)"
        value={commissionRatePercent}
        onChange={(e) => setCommissionRatePercent(e.target.value)}
        className="w-24 rounded border border-slate-300 px-2 py-1 text-xs"
      />
      <button
        type="button"
        onClick={submit}
        disabled={pending}
        className="rounded-md bg-blue-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
      >
        {pending ? '処理中…' : '提携塾を登録'}
      </button>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
