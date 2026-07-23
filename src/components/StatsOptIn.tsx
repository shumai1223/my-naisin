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
import { useExperiment } from '@/components/ab/useExperiment';
import { getExperiment, type ExperimentArm } from '@/lib/experiments';
import type { StatsMetric } from '@/lib/stats-aggregation';

/** ZZ-1c（投稿インセンティブUX+A/B）: 価値交換コピーの実験ID。レジストリに無くても壊さないフォールバック付き。 */
const STATS_OPTIN_EXPERIMENT_ID = 'stats-optin-value-exchange-2026';
const FALLBACK_ARMS: ExperimentArm[] = [{ id: 'control', label: '既定' }];

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

  const def = getExperiment(STATS_OPTIN_EXPERIMENT_ID);
  const arms = def?.arms?.length ? def.arms : FALLBACK_ARMS;
  const variantId = useExperiment(
    STATS_OPTIN_EXPERIMENT_ID,
    arms.map((a) => ({ id: a.id, weight: a.weight }))
  );
  const arm = arms.find((a) => a.id === variantId) ?? arms[0];

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
    trackEvent(EVENTS.STATS_OPTIN_VIEW, { metric, pref: prefectureCode ?? 'none', variant: variantId });
  }, [metric, value, prefectureCode, variantId]);

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
      trackEvent(EVENTS.STATS_OPTIN_REVOKE, { metric: metric ?? 'none', variant: variantId });
    } else {
      const state = grantStatsConsent();
      setGranted(state.granted);
      setConsentedAt(state.consentedAt);
      trackEvent(EVENTS.STATS_OPTIN_GRANT, { metric: metric ?? 'none', pref: prefectureCode ?? 'none', variant: variantId });
    }
  };

  const heading = arm.heading ?? '匿名で全国統計に協力する（任意）';
  const body = arm.body;

  return (
    <div
      className={`rounded-2xl border-2 p-4 shadow-sm transition-colors ${
        granted
          ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50'
          : 'border-sky-300 bg-gradient-to-br from-sky-50 to-cyan-50'
      } ${className}`}
    >
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={granted}
          onChange={handleToggle}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-sky-400 accent-sky-600"
        />
        <span>
          <span className="flex items-center gap-2 text-[15px] font-bold text-slate-900">
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${granted ? 'bg-emerald-100' : 'bg-sky-100'}`}>
              <BarChart3 className={`h-4 w-4 ${granted ? 'text-emerald-600' : 'text-sky-600'}`} />
            </span>
            {heading}
          </span>
          <span className="mt-1.5 block text-xs leading-relaxed text-slate-600">
            {body ?? (
              <>
                協力が増えるほど、あなたと同じ都道府県・学年の分布データが正確になります。送られるのは
                <strong className="text-slate-800">計算結果の数値のみ</strong>
                ——氏名など個人を特定できる情報は一切収集しません。同意はいつでも撤回できます。
              </>
            )}
          </span>
        </span>
      </label>
      {granted && consentedAt && (
        <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          ご協力ありがとうございます（{new Date(consentedAt).toLocaleDateString('ja-JP')}に同意済み）
        </p>
      )}
    </div>
  );
}
