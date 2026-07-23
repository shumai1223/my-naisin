'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';

import { trackEvent, EVENTS } from '@/lib/track';
import type { StatsMetric } from '@/lib/stats-aggregation';

/**
 * 全国統計の先行閲覧（T-1・UnlockGateの解放後に表示するコンテンツ）。
 * Ω-1（TIER Ω・パーセンタイル・フック）: 「全国◯%・県内◯位相当」を同時に見せることで
 * 投稿インセンティブ（自分の位置がより詳しく分かる）を強める。
 *
 * /api/stats/percentile を叩き、自分の値が匿名協力者の中で何%タイルかを表示する。
 * prefectureCodeを渡した場合は全国パーセンタイルに加えて県内パーセンタイルも表示する
 * （k-匿名性はAPI側で全国・県内それぞれ独立に適用済み・不足時は個別に「まだデータが
 * 足りません」と誠実に表示する＝捏造ゼロ原則）。
 */
export function NationalPercentileReveal({
  metric,
  metricLabel,
  value,
  prefectureCode,
  prefectureName,
  className = '',
}: {
  metric: StatsMetric;
  metricLabel: string;
  value: number | null | undefined;
  prefectureCode?: string;
  /** 県内パーセンタイル表示用のラベル（例:「東京都」）。未指定時は「県内」と汎用表記する。 */
  prefectureName?: string;
  className?: string;
}) {
  const [state, setState] = React.useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [national, setNational] = React.useState<{ percentile: number; count: number } | null>(null);
  const [prefecture, setPrefecture] = React.useState<{ percentile: number; count: number } | null>(null);
  const viewTracked = React.useRef(false);

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
        setNational(data?.result ?? null);
        setPrefecture(data?.prefectureResult ?? null);
        setState('ready');
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [metric, value, prefectureCode]);

  // ファネル計装: 実際に「全国◯%・県内◯位相当」を目にした回数のみを数える
  // （n不足で何も表示できなかった場合はカウントしない＝解放後の実効到達率を測る）。
  React.useEffect(() => {
    if (viewTracked.current || state !== 'ready' || (!national && !prefecture)) return;
    viewTracked.current = true;
    trackEvent(EVENTS.PERCENTILE_VIEW, {
      metric,
      pref: prefectureCode ?? 'none',
      hasNational: Boolean(national),
      hasPrefecture: Boolean(prefecture),
    });
  }, [state, national, prefecture, metric, prefectureCode]);

  if (state === 'idle' || state === 'error') return null;
  // 全国・県内の両方が不足でも「まだデータが足りない」ことは誠実に見せる（何も出さずに消えない）。

  const prefLabel = prefectureName ? `${prefectureName}内` : '県内';

  return (
    <section className={`overflow-hidden rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white p-6 shadow-sm md:p-7 ${className}`}>
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
        <TrendingUp className="h-3.5 w-3.5" />
        全国統計（先行閲覧・解放済み）
      </div>

      {state === 'loading' && <p className="text-sm text-slate-500">集計中…</p>}

      {state === 'ready' && !national && !prefecture && (
        <p className="text-sm leading-relaxed text-slate-600">
          この{metricLabel}についてはまだ協力者のデータが十分に集まっていません。匿名統計への協力者が増えると、ここに立ち位置が表示されます。
        </p>
      )}

      {state === 'ready' && national && (
        <div>
          <p className="text-sm leading-relaxed text-slate-700">
            あなたの{metricLabel}は、匿名で協力してくれた全国{national.count}件のデータの中で
          </p>
          <p className="mt-1 text-3xl font-black tracking-tight text-emerald-700">
            上位 {Math.max(1, 100 - national.percentile)}%
          </p>
        </div>
      )}

      {state === 'ready' && prefectureCode && prefecture && (
        <div className={national ? 'mt-4 border-t border-emerald-100 pt-4' : ''}>
          <p className="text-sm leading-relaxed text-slate-700">
            {prefLabel}の協力者{prefecture.count}件の中では
          </p>
          <p className="mt-1 text-2xl font-black tracking-tight text-teal-700">
            上位 {Math.max(1, 100 - prefecture.percentile)}%相当
          </p>
        </div>
      )}

      {state === 'ready' && prefectureCode && !prefecture && national && (
        <div className="mt-4 border-t border-emerald-100 pt-4">
          <p className="text-xs leading-relaxed text-slate-500">
            {prefLabel}の協力者データはまだ十分に集まっていません（全国集計のみ表示中）。
          </p>
        </div>
      )}

      {(national || prefecture) && (
        <p className="mt-3 text-xs text-slate-500">
          ※氏名等を含まない匿名の任意提出データ（協力者内での相対値）。学校の成績順位とは異なります。
        </p>
      )}
    </section>
  );
}
