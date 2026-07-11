'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';

import type { StatsMetric } from '@/lib/stats-aggregation';

/**
 * 全国統計の先行閲覧（T-1・UnlockGateの解放後に表示するコンテンツ）。
 *
 * /api/stats/percentile を叩き、自分の値が匿名協力者の中で何%タイルかを表示する。
 * サンプルサイズ不足（k-匿名性未達）の場合は「まだデータが足りません」と誠実に表示する
 * （捏造ゼロ原則・stats-aggregation.tsのbuildSuppressedPercentileと同じ思想）。
 */
export function NationalPercentileReveal({
  metric,
  metricLabel,
  value,
  prefectureCode,
  className = '',
}: {
  metric: StatsMetric;
  metricLabel: string;
  value: number | null | undefined;
  prefectureCode?: string;
  className?: string;
}) {
  const [state, setState] = React.useState<'idle' | 'loading' | 'ready' | 'insufficient' | 'error'>('idle');
  const [percentile, setPercentile] = React.useState<number | null>(null);
  const [count, setCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      setState('idle');
      return;
    }
    let cancelled = false;
    setState('loading');
    const params = new URLSearchParams({ metric, value: String(value) });
    if (prefectureCode) params.set('prefecture', prefectureCode);
    fetch(`/api/stats/percentile?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.insufficientData || !data?.result) {
          setState('insufficient');
          return;
        }
        setPercentile(data.result.percentile);
        setCount(data.result.count);
        setState('ready');
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [metric, value, prefectureCode]);

  if (state === 'idle' || state === 'error') return null;

  return (
    <section className={`overflow-hidden rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white p-6 shadow-sm md:p-7 ${className}`}>
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
        <TrendingUp className="h-3.5 w-3.5" />
        全国統計（先行閲覧・解放済み）
      </div>

      {state === 'loading' && <p className="text-sm text-slate-500">集計中…</p>}

      {state === 'insufficient' && (
        <p className="text-sm leading-relaxed text-slate-600">
          この{metricLabel}についてはまだ協力者のデータが十分に集まっていません。匿名統計への協力者が増えると、ここに全国での立ち位置が表示されます。
        </p>
      )}

      {state === 'ready' && percentile !== null && (
        <>
          <p className="text-sm leading-relaxed text-slate-700">
            あなたの{metricLabel}は、匿名で協力してくれた全国{count}件のデータの中で
          </p>
          <p className="mt-1 text-3xl font-black tracking-tight text-emerald-700">
            上位 {Math.max(1, 100 - percentile)}%
          </p>
          <p className="mt-2 text-xs text-slate-500">
            ※氏名等を含まない匿名の任意提出データ（協力者内での相対値）。学校の成績順位とは異なります。
          </p>
        </>
      )}
    </section>
  );
}
