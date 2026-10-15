'use client';

import * as React from 'react';
import { Sparkles, Trophy, TrendingUp } from '@/components/icons';

import { APP_NAME, SUBJECTS } from '@/lib/constants';
import { getPrefectureByCode } from '@/lib/prefectures';
import type { ResultData, Scores } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface ShareCardProps {
  result: ResultData;
  scores: Scores;
}

export const ShareCard = React.forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ result, scores }, ref) {
    const prefecture = getPrefectureByCode(result.prefectureCode);
    const prefectureLabel = prefecture?.name ?? result.prefectureCode;

    const rankVisual: Record<string, { gradient: string; bg: string; text: string; border: string }> = {
      S: { 
        gradient: 'bg-brand-500', 
        bg: 'bg-brand-50', 
        text: 'text-brand-600',
        border: 'border-brand-200'
      },
      A: { 
        gradient: 'bg-brand-500', 
        bg: 'bg-brand-50', 
        text: 'text-brand-600',
        border: 'border-brand-200'
      },
      B: { 
        gradient: 'bg-brand-500', 
        bg: 'bg-brand-50', 
        text: 'text-brand-600',
        border: 'border-brand-200'
      },
      C: { 
        gradient: 'bg-slate-400', 
        bg: 'bg-slate-100', 
        text: 'text-slate-600',
        border: 'border-slate-200'
      }
    };
    const visual = rankVisual[result.rank.code] ?? rankVisual.C;

    return (
      <div
        ref={ref}
        className="w-[375px] bg-white p-6"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('grid h-10 w-10 place-items-center rounded-lg ', visual.gradient)}>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{APP_NAME}</div>
              <div className="text-xs text-slate-500">{prefectureLabel}</div>
            </div>
          </div>
          <div className={cn('rounded-full px-3 py-1 text-xs font-bold', visual.bg, visual.text)}>
            {result.total}/{result.max}点
          </div>
        </div>

        {/* Main Rank Display */}
        <div className={cn('mt-5 rounded-lg border p-5', visual.border, visual.bg)}>
          <div className="flex items-center gap-2">
            <Trophy className={cn('h-5 w-5', visual.text)} />
            <span className={cn('text-sm font-bold', visual.text)}>
              {result.rank.code}ランク達成！
            </span>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className={cn(
              'grid h-20 w-20 place-items-center rounded-lg text-4xl font-bold text-white',
              visual.gradient
            )}>
              {result.rank.code}
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800">{result.rank.title}</div>
              <div className="mt-1 text-sm text-slate-600">{result.rank.message.slice(0, 25)}...</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-white/50 bg-white p-3">
              <div className="text-xs text-slate-500">獲得率</div>
              <div className={cn('text-2xl font-bold', visual.text)}>
                {Math.round(result.percent)}%
              </div>
            </div>
            <div className="rounded-lg border border-white/50 bg-white p-3">
              <div className="text-xs text-slate-500">内申点</div>
              <div className="text-2xl font-bold text-slate-800">
                {result.total}
                <span className="text-sm font-bold text-slate-400">/{result.max}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Scores */}
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <TrendingUp className="h-4 w-4" />
            教科別スコア
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {SUBJECTS.map((s) => (
              <div 
                key={s.key} 
                className="rounded-lg border border-slate-200 bg-white px-3 py-2"
              >
                <div className="text-xs text-slate-500">{s.shortLabel}</div>
                <div className="text-lg font-bold text-slate-800">{scores[s.key]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Credit */}
        <div className="mt-5 text-center">
          <div className="text-xs text-slate-400">
            内申点を計算してシェアしよう
          </div>
          <div className="mt-1 flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3 text-brand-500" />
            <span className="text-xs font-bold text-slate-600">#MyNaishin</span>
          </div>
        </div>
      </div>
    );
  }
);
