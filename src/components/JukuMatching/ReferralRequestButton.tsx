'use client';

import { useState } from 'react';
import { Loader2, Send, CheckCircle2 } from '@/components/icons';

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
      <div className="flex items-start gap-1.5 rounded-lg border border-slate-200 bg-brand-50 px-3 py-2 text-sm font-bold text-brand-700">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
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
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded bg-brand-700 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-800 disabled:opacity-60"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        この塾に紹介を依頼する
      </button>
      {status === 'error' && (
        <p className="mt-2 text-sm text-red-800">送信に失敗しました。時間をおいて再度お試しください。</p>
      )}
    </div>
  );
}
