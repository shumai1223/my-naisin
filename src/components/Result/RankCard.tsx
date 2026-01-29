'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

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
    const timer = window.setTimeout(() => {
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
    return () => window.clearTimeout(timer);
  }, [isS]);

  const rankVisual = React.useMemo(() => {
    const visuals: Record<string, { color: string; bg: string; gradient: string; border: string; glow: string; glowClass: string }> = {
      S: { color: 'text-violet-600', bg: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50', gradient: 'from-violet-500 via-purple-500 to-fuchsia-500', border: 'border-violet-200/60', glow: 'shadow-violet-300/50', glowClass: 'rank-s-glow' },
      A: { color: 'text-indigo-600', bg: 'bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50', gradient: 'from-indigo-500 via-blue-500 to-violet-500', border: 'border-indigo-200/60', glow: 'shadow-indigo-300/40', glowClass: 'rank-a-glow' },
      B: { color: 'text-blue-600', bg: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50', gradient: 'from-blue-500 via-cyan-500 to-sky-500', border: 'border-blue-200/60', glow: 'shadow-blue-300/40', glowClass: 'rank-b-glow' },
      C: { color: 'text-slate-600', bg: 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100', gradient: 'from-slate-400 via-slate-500 to-slate-600', border: 'border-slate-200/60', glow: 'shadow-slate-300/30', glowClass: '' }
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
              <div className={cn('grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br shadow-md', rankVisual.gradient, rankVisual.glow)}>
                {isS ? (
                  <Sparkles className="h-4 w-4 text-white" />
                ) : (
                  <Crown className="h-4 w-4 text-white" />
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">ランク判定</div>
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
                  'relative grid h-24 w-24 place-items-center rounded-3xl bg-gradient-to-br text-5xl font-black text-white',
                  rankVisual.gradient,
                  rankVisual.glowClass
                )}
              >
                {/* Inner shine effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent via-white/10 to-white/20" />
                <span className="relative drop-shadow-lg">{result.rank.code}</span>
              </motion.div>
              <div>
                <div className="text-xl font-bold text-slate-800">
                  {result.rank.title}
                </div>
                <div className="mt-1 text-sm text-slate-500">あなたのランク</div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-5 py-3 text-right shadow-sm">
              <div className="text-xs font-medium text-slate-500">獲得率</div>
              <div className={cn('text-3xl font-bold', rankVisual.color)}>{Math.round(result.percent)}%</div>
            </div>
          </div>

        {nextInfo ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <div className="text-sm font-semibold text-slate-700">次のランクまで</div>
              </div>
              <div className="rounded-full bg-blue-50 px-3 py-1 text-xs">
                あと <span className="font-bold text-blue-600">{nextInfo.diff}</span> 点で <span className="font-black text-blue-600">{nextInfo.nextCode}ランク</span>
              </div>
            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 shadow-sm"
                initial={{ width: 0 }}
                animate={{ width: `${nextInfo.progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        ) : (
          <div className={cn('mt-6 rounded-2xl border p-4', rankVisual.border, rankVisual.bg)}>
            <div className="flex items-center gap-2">
              <Sparkles className={cn('h-5 w-5', rankVisual.color)} />
              <div className={cn('text-sm font-bold', rankVisual.color)}>MAX到達！おめでとう！</div>
            </div>
            <div className="mt-1 text-xs text-slate-600">これ以上は上がらない。シェアで自慢しよう。</div>
          </div>
        )}

        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="text-sm leading-relaxed text-slate-600">{result.rank.message}</p>
        </div>
        </div>
      </motion.div>
    </Card>
  );
}
