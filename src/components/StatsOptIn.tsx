'use client';

/**
 * 匿名統計オプトインUI（S-1）。
 *
 * D1 migration 0007（stats_submissions）適用済み・/api/stats/submit実装済み（旧N-3）につき、
 * metric/value等を渡すと同意済みユーザーの結果を自動で匿名送信する（stats-submit-client.ts）。
 * 送信は同一の計算結果に対して1回のみ（signature方式で重複送信を防止）。
 * 同意していない・値が無い場合は何も送信しない（見せかけの機能にしない設計を維持）。
 */
import { useEffect, useRef, useState } from 'react';
import { BarChart3, ShieldCheck } from 'lucide-react';

import { readStatsConsent, grantStatsConsent, revokeStatsConsent } from '@/lib/stats-consent';
import { submitStatsResult } from '@/lib/stats-submit-client';
import { trackEvent, EVENTS } from '@/lib/track';
import type { StatsMetric } from '@/lib/stats-aggregation';

interface StatsOptInProps {
  className?: string;
  /** 送信する指標。value と両方指定された時のみ自動送信する。 */
  metric?: StatsMetric;
  value?: number | null;
  maxValue?: number | null;
  prefectureCode?: string;
}

export function StatsOptIn({ className = '', metric, value, maxValue, prefectureCode }: StatsOptInProps) {
  const [granted, setGranted] = useState(false);
  const [consentedAt, setConsentedAt] = useState<string | null>(null);
  const submittedSignature = useRef<string | null>(null);
  const viewTracked = useRef(false);

  useEffect(() => {
    const state = readStatsConsent();
    setGranted(state.granted);
    setConsentedAt(state.consentedAt);
  }, []);

  // ファネル分母の計装: 「送信可能な結果を伴って表示された」を1マウント1回だけ記録。
  // これが無いと stats_submissions=0 の原因（表示ゼロ/同意ゼロ/送信失敗）を区別できない。
  useEffect(() => {
    if (viewTracked.current || !metric || typeof value !== 'number' || !Number.isFinite(value)) return;
    viewTracked.current = true;
    trackEvent(EVENTS.STATS_OPTIN_VIEW, { metric, pref: prefectureCode ?? 'none' });
  }, [metric, value, prefectureCode]);

  useEffect(() => {
    if (!granted || !metric || typeof value !== 'number' || !Number.isFinite(value)) return;
    const signature = `${metric}:${prefectureCode ?? ''}:${value}:${maxValue ?? ''}`;
    if (submittedSignature.current === signature) return;
    submittedSignature.current = signature;
    void submitStatsResult({ metric, value, maxValue: maxValue ?? undefined, prefectureCode });
  }, [granted, metric, value, maxValue, prefectureCode]);

  const handleToggle = () => {
    if (granted) {
      const state = revokeStatsConsent();
      setGranted(state.granted);
      setConsentedAt(state.consentedAt);
      trackEvent(EVENTS.STATS_OPTIN_REVOKE, { metric: metric ?? 'none' });
    } else {
      const state = grantStatsConsent();
      setGranted(state.granted);
      setConsentedAt(state.consentedAt);
      trackEvent(EVENTS.STATS_OPTIN_GRANT, { metric: metric ?? 'none', pref: prefectureCode ?? 'none' });
    }
  };

  return (
    <div className={`rounded-xl border border-slate-200 bg-slate-50 p-4 ${className}`}>
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={granted}
          onChange={handleToggle}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300"
        />
        <span>
          <span className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <BarChart3 className="h-4 w-4 text-slate-500" />
            匿名で統計に協力する（任意）
          </span>
          <span className="mt-1 block text-xs leading-relaxed text-slate-500">
            氏名等は一切含まれない計算結果（内申点・偏差値等の数値のみ）を、全国の傾向を示す統計データの作成に役立てます。個人を特定できる情報は収集しません。この同意はいつでも撤回できます。
          </span>
        </span>
      </label>
      {granted && consentedAt && (
        <p className="mt-2 flex items-center gap-1 text-[11px] text-emerald-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          {new Date(consentedAt).toLocaleDateString('ja-JP')}に同意済み
        </p>
      )}
    </div>
  );
}
