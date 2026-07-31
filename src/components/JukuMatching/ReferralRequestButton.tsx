'use client';

import { useState } from 'react';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';

import { track } from '@/lib/track';
import { EVENTS } from '@/lib/track';

/**
 * 保護者向け「この塾に紹介を依頼する」ボタン（Λ-7残作業・Ω-6公開送客導線）。
 * PIIは一切入力させない（クリックのみで完結・studentRefはサーバー側で生成する匿名UUID）。
 * 成功後は連絡先の直接入力ではなく「担当者からのご連絡をお待ちください」に留める
 * （現時点ではadmin側が代行で連絡する運用のため、メール等の追加PII収集はしない）。
 */
export function ReferralRequestButton({
  jukuPartnerId,
  prefectureCode,
}: {
  jukuPartnerId: number;
  prefectureCode?: string;
}) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function onClick() {
    setStatus('submitting');
    try {
      const res = await fetch('/api/juku-matching/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jukuPartnerId, prefectureCode }),
      });
      if (!res.ok) {
        setStatus('error');
        return;
      }
      track(EVENTS.JUKU_REFERRAL_REQUEST, { juku_partner_id: jukuPartnerId, pref: prefectureCode ?? 'none' });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
        <CheckCircle2 className="h-4 w-4" />
        依頼を受け付けました。担当者からのご連絡をお待ちください。
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={status === 'submitting'}
        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 disabled:opacity-60"
      >
        {status === 'submitting' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        この塾に紹介を依頼する
      </button>
      {status === 'error' && (
        <p className="mt-1.5 text-[11px] text-red-500">送信に失敗しました。時間をおいて再度お試しください。</p>
      )}
    </div>
  );
}
