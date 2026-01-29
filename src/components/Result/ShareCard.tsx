'use client';

import * as React from 'react';
import { Sparkles, Trophy, TrendingUp } from 'lucide-react';

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
        gradient: 'from-indigo-500 via-violet-500 to-purple-500', 
        bg: 'bg-indigo-50', 
        text: 'text-indigo-600',
        border: 'border-indigo-200'
      },
      A: { 
        gradient: 'from-blue-500 to-indigo-500', 
        bg: 'bg-blue-50', 
        text: 'text-blue-600',
        border: 'border-blue-200'
      },
      B: { 
        gradient: 'from-sky-500 to-blue-500', 
        bg: 'bg-sky-50', 
        text: 'text-sky-600',
        border: 'border-sky-200'
      },
      C: { 
        gradient: 'from-slate-400 to-slate-500', 
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
            <div className={cn('grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br shadow-md', visual.gradient)}>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{APP_NAME}</div>
              <div className="text-[10px] text-slate-500">{prefectureLabel}</div>
            </div>
          </div>
          <div className={cn('rounded-full px-3 py-1 text-xs font-bold', visual.bg, visual.text)}>
            {result.total}/{result.max}点
          </div>
        </div>

        {/* Main Rank Display */}
        <div className={cn('mt-5 rounded-2xl border p-5', visual.border, visual.bg)}>
          <div className="flex items-center gap-2">
            <Trophy className={cn('h-5 w-5', visual.text)} />
            <span className={cn('text-sm font-bold', visual.text)}>
              {result.rank.code}ランク達成！
            </span>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className={cn(
              'grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br text-4xl font-black text-white shadow-lg',
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
            <div className="rounded-xl border border-white/50 bg-white p-3 shadow-sm">
              <div className="text-[10px] font-medium text-slate-500">獲得率</div>
              <div className={cn('text-2xl font-bold', visual.text)}>
                {Math.round(result.percent)}%
              </div>
            </div>
            <div className="rounded-xl border border-white/50 bg-white p-3 shadow-sm">
              <div className="text-[10px] font-medium text-slate-500">内申点</div>
              <div className="text-2xl font-bold text-slate-800">
                {result.total}
                <span className="text-sm font-semibold text-slate-400">/{result.max}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Scores */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <TrendingUp className="h-4 w-4" />
            教科別スコア
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {SUBJECTS.map((s) => (
              <div 
                key={s.key} 
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
              >
                <div className="text-[10px] text-slate-500">{s.shortLabel}</div>
                <div className="text-lg font-bold text-slate-800">{scores[s.key]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Credit */}
        <div className="mt-5 text-center">
          <div className="text-[11px] text-slate-400">
            内申点を計算してシェアしよう
          </div>
          <div className="mt-1 flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3 text-blue-500" />
            <span className="text-xs font-bold text-slate-600">#MyNaishin</span>
          </div>
        </div>
      </div>
    );
  }
);
