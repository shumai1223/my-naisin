'use client';

/**
 * 提携塾の招待トークン発行ボタン（Λ-7・admin/juku-matching専用・内部ツール）。
 * 発行された平文トークンはこの画面でしか見えない（DBにはハッシュのみ保存）。
 * メール送信等は行わない＝管理者が表示された値を手動で塾担当者へ伝える運用（build-not-launch）。
 */
import { useState } from 'react';

export function JukuPartnerInviteButton({ jukuPartnerId, token }: { jukuPartnerId: number; token: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issuedToken, setIssuedToken] = useState<string | null>(null);

  const issue = async () => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/juku-matching/partner/invite-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, jukuPartnerId }),
      });
      const body = (await res.json().catch(() => ({}))) as { inviteToken?: string; error?: string };
      if (!res.ok || !body.inviteToken) {
        setError(body.error ?? '発行に失敗しました。');
        setPending(false);
        return;
      }
      setIssuedToken(body.inviteToken);
      setPending(false);
    } catch {
      setError('通信エラーが発生しました。');
      setPending(false);
    }
  };

  if (issuedToken) {
    const dashboardUrl = `/juku/matching/dashboard?token=${encodeURIComponent(issuedToken)}`;
    return (
      <div className="mt-1 rounded-md bg-emerald-50 p-2 text-[11px] text-emerald-700">
        発行済み(この画面でしか表示されません): <code className="break-all">{dashboardUrl}</code>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={issue}
        disabled={pending}
        className="rounded-md bg-slate-600 px-2 py-0.5 text-xs font-medium text-white disabled:opacity-50"
      >
        {pending ? '発行中…' : '招待トークン発行'}
      </button>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
