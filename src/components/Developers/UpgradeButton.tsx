'use client';

import { useState } from 'react';
import { Loader2, Info } from '@/components/icons';

/**
 * Pro / Enterprise へのアップグレード導線（堀B／Stripeループの入口）。
 * POST /api/billing/checkout → 返ってきた Stripe Checkout URL へ遷移。
 * 未接続（503）時は「準備中・お問い合わせ」を案内し、サイレント失敗を避ける。
 *
 * クリックラップ（ops/PRICING_OPTIONS.md #5）: 利用規約への同意チェックを必須にし、
 * 同意時刻をAPIへ送ってStripeのセッション/サブスクリプションmetadataに記録する（押印の代替）。
 */
export function UpgradeButton({
  tier = 'pro',
  label = 'Proにアップグレード',
}: {
  tier?: 'pro' | 'business' | 'scale';
  label?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  async function go() {
    if (!agreed) return;
    setLoading(true);
    setInfo(null);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier, tosAgreedAt: new Date().toISOString() }),
      });
      const data = (await res.json()) as { url?: string; message?: string };
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setInfo(data.message ?? '現在お申し込みを受け付けられません。お問い合わせください。');
    } catch {
      setInfo('通信に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <label className="mb-2 flex min-h-11 items-center gap-3 text-sm text-slate-900">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="h-5 w-5 shrink-0 rounded border-slate-300 accent-brand-700"
        />
        <span>
          <a href="/terms" target="_blank" rel="noreferrer" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
            利用規約
          </a>
          に同意します
        </span>
      </label>
      <button
        type="button"
        onClick={go}
        disabled={loading || !agreed}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-center text-base font-bold text-white transition-colors enabled:hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin" />}
        {label}
      </button>
      {info && (
        <p className="mt-3 flex items-start gap-2 rounded-lg border border-slate-200 bg-brand-50 p-3 text-sm leading-relaxed text-slate-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
          <span>
            {info}{' '}
            <a href="/contact" className="font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800">
              お問い合わせ
            </a>
          </span>
        </p>
      )}
    </div>
  );
}
