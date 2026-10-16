'use client';

import * as React from 'react';

import { RANK_DEFINITIONS } from '@/lib/constants';
import { getPrefectureByCode } from '@/lib/prefectures';
import type { ResultData } from '@/lib/types';

import { Card } from '@/components/ui/Card';

export interface RankCardProps {
  result: ResultData;
}

export function RankCard({ result }: RankCardProps) {
  const prefecture = getPrefectureByCode(result.prefectureCode);
  const prefectureLabel = prefecture?.name ?? result.prefectureCode;
  const isS = result.rank.code === 'S';

  React.useEffect(() => {
    if (!isS) return;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      // 動的 import で canvas-confetti を初期バンドルから外す（S ランク演出時のみ読み込む）。
      // 演出は控えめに（粒の数を減らし、ブランド色と緑みの灰だけ。動きを減らす設定では出さない）。
      const confetti = (await import('canvas-confetti')).default;
      if (cancelled) return;
      confetti({
        particleCount: 40,
        spread: 50,
        startVelocity: 25,
        ticks: 120,
        scalar: 0.9,
        origin: { y: 0.5 },
        colors: ['#17543e', '#4f6158', '#cddad3'],
        disableForReducedMotion: true
      });
    }, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isS]);

  const nextInfo = React.useMemo(() => {
    const sorted = [...RANK_DEFINITIONS].sort((a, b) => a.minPercent - b.minPercent);
    const index = sorted.findIndex((r) => r.code === result.rank.code);
    const next = index >= 0 ? sorted[index + 1] : undefined;

    if (!next) return null;

    const targetTotal = Math.ceil((result.max * next.minPercent) / 100);
    const diff = Math.max(0, targetTotal - result.total);
    const currentMin = sorted[index]?.minPercent ?? 0;
    const span = Math.max(1, next.minPercent - currentMin);
    const progress = Math.max(0, Math.min(100, ((result.percent - currentMin) / span) * 100));

    return {
      nextCode: next.code,
      targetTotal,
      diff,
      progress
    };
  }, [result.max, result.percent, result.rank.code, result.total]);

  return (
    <Card className="p-5 text-left">
      {/* Header */}
      <h3 className="text-[17px] font-bold text-slate-900">達成度の目安（当サイト独自）</h3>
      <p className="mt-0.5 text-sm text-slate-600">{prefectureLabel}</p>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-lg border border-slate-300 text-5xl font-bold text-brand-700">
            {result.rank.code}
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">
              {result.rank.title}
            </div>
            <div className="mt-1 text-sm text-slate-600">あなたの達成度</div>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xs text-slate-600">獲得率</div>
          <div className="text-3xl font-bold tabular-nums text-slate-900">{Math.round(result.percent)}%</div>
          <div className="text-sm tabular-nums text-slate-600">{result.total}/{result.max}点</div>
        </div>
      </div>

      {nextInfo ? (
        <div className="mt-5 border-t border-slate-200 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <div className="text-sm font-bold text-slate-900">次のランクまで</div>
            <div className="text-sm text-slate-900">
              あと <span className="font-bold tabular-nums">{nextInfo.diff}</span> 点で <span className="font-bold">{nextInfo.nextCode}ランク</span>
            </div>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand-700"
              style={{ width: `${nextInfo.progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-5 border-t border-slate-200 pt-4">
          <div className="text-sm font-bold text-slate-900">最高ランクに到達しています</div>
          <div className="mt-1 text-sm text-slate-600">これ以上は上がりません。</div>
        </div>
      )}

      <div className="mt-5 rounded-lg border border-slate-200 bg-brand-50 p-4">
        <p className="text-sm leading-relaxed text-slate-900">{result.rank.message}</p>
      </div>
    </Card>
  );
}
