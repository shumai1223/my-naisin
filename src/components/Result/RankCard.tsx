'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles } from '@/components/icons';

import { RANK_DEFINITIONS } from '@/lib/constants';
import { getPrefectureByCode } from '@/lib/prefectures';
import type { ResultData } from '@/lib/types';
import { cn } from '@/lib/utils';

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
      const confetti = (await import('canvas-confetti')).default;
      if (cancelled) return;
      confetti({
        particleCount: 80,
        spread: 60,
        startVelocity: 35,
        ticks: 200,
        scalar: 1,
        origin: { y: 0.5 },
        colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb']
      });
    }, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isS]);

  const rankVisual = React.useMemo(() => {
    const visuals: Record<string, { color: string; bg: string; gradient: string; border: string; glow: string; glowClass: string }> = {
      S: { color: 'text-slate-600', bg: 'bg-slate-50', gradient: 'bg-slate-500', border: 'border-slate-200/60', glow: '', glowClass: 'rank-s-glow' },
      A: { color: 'text-brand-600', bg: 'bg-brand-50', gradient: 'bg-brand-500', border: 'border-brand-200/60', glow: '', glowClass: 'rank-a-glow' },
      B: { color: 'text-brand-600', bg: 'bg-brand-50', gradient: 'bg-brand-500', border: 'border-brand-200/60', glow: '', glowClass: 'rank-b-glow' },
      C: { color: 'text-slate-600', bg: 'bg-slate-50', gradient: 'bg-slate-400', border: 'border-slate-200/60', glow: '', glowClass: '' }
    };
    return visuals[result.rank.code] ?? visuals.C;
  }, [result.rank.code]);

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
    <Card className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Header with gradient */}
        <div className={cn('border-b px-6 py-4', rankVisual.border, rankVisual.bg)}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className={cn('grid h-8 w-8 place-items-center rounded-lg ', rankVisual.gradient, rankVisual.glow)}>
                {isS ? (
                  <Sparkles className="h-4 w-4 text-white" />
                ) : (
                  <Crown className="h-4 w-4 text-white" />
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">達成度の目安（当サイト独自）</div>
                <div className="text-xs text-slate-500">{prefectureLabel}</div>
              </div>
            </div>
            <div className={cn('rounded-full px-3 py-1 text-xs font-bold', rankVisual.bg, rankVisual.color)}>
              {result.total}/{result.max}点
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                key={result.rank.code}
                initial={{ scale: 0.8, rotate: -5, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={cn(
                  'relative grid h-24 w-24 place-items-center rounded-lg text-5xl font-bold text-white',
                  rankVisual.gradient,
                  rankVisual.glowClass
                )}
              >
                {/* Inner shine effect */}
                <div className="absolute inset-0 rounded-lg bg-transparent" />
                <span className="relative">{result.rank.code}</span>
              </motion.div>
              <div>
                <div className="text-xl font-bold text-slate-800">
                  {result.rank.title}
                </div>
                <div className="mt-1 text-sm text-slate-500">あなたの達成度</div>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-3 text-right">
              <div className="text-xs text-slate-500">獲得率</div>
              <div className={cn('text-3xl font-bold', rankVisual.color)}>{Math.round(result.percent)}%</div>
            </div>
          </div>

        {nextInfo ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-brand-500" />
                <div className="text-sm font-bold text-slate-700">次のランクまで</div>
              </div>
              <div className="rounded-full bg-brand-50 px-3 py-1 text-xs">
                あと <span className="font-bold text-brand-600">{nextInfo.diff}</span> 点で <span className="font-bold text-brand-600">{nextInfo.nextCode}ランク</span>
              </div>
            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                className="h-full rounded-full bg-brand-400"
                initial={{ width: 0 }}
                animate={{ width: `${nextInfo.progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        ) : (
          <div className={cn('mt-6 rounded-lg border p-4', rankVisual.border, rankVisual.bg)}>
            <div className="flex items-center gap-2">
              <Sparkles className={cn('h-5 w-5', rankVisual.color)} />
              <div className={cn('text-sm font-bold', rankVisual.color)}>MAX到達！おめでとう！</div>
            </div>
            <div className="mt-1 text-xs text-slate-600">これ以上は上がらない。シェアで自慢しよう。</div>
          </div>
        )}

        <div className="mt-5 rounded-lg bg-slate-50 p-4">
          <p className="text-sm leading-relaxed text-slate-600">{result.rank.message}</p>
        </div>
        </div>
      </motion.div>
    </Card>
  );
}
