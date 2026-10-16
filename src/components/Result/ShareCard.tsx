'use client';

import * as React from 'react';

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

    // gradient キーは名前を残しているが、値はランク文字の単色の面（グラデーションは使わない）
    const rankVisual: Record<string, { gradient: string; bg: string; text: string; border: string }> = {
      S: {
        gradient: 'bg-brand-700 text-white',
        bg: 'bg-brand-50',
        text: 'text-brand-700',
        border: 'border-brand-200'
      },
      A: {
        gradient: 'bg-brand-700 text-white',
        bg: 'bg-brand-50',
        text: 'text-brand-700',
        border: 'border-brand-200'
      },
      B: {
        gradient: 'bg-brand-700 text-white',
        bg: 'bg-brand-50',
        text: 'text-brand-700',
        border: 'border-brand-200'
      },
      C: {
        gradient: 'bg-slate-600 text-white',
        bg: 'bg-slate-50',
        text: 'text-slate-700',
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
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-slate-900">{APP_NAME}</div>
            <div className="text-xs text-slate-600">{prefectureLabel}</div>
          </div>
          <div className="inline-flex shrink-0 items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-bold tabular-nums text-slate-700">
            {result.total}/{result.max}点
          </div>
        </div>

        {/* Main Rank Display */}
        <div className={cn('mt-5 rounded-lg border p-5', visual.border, visual.bg)}>
          <div className={cn('text-sm font-bold', visual.text)}>
            {result.rank.code}ランク
          </div>

          <div className="mt-3 flex items-center gap-4">
            <div className={cn(
              'grid h-20 w-20 shrink-0 place-items-center rounded-lg text-4xl font-bold',
              visual.gradient
            )}>
              {result.rank.code}
            </div>
            <div className="min-w-0">
              <div className="text-xl font-bold text-slate-900">{result.rank.title}</div>
              <div className="mt-1 text-sm text-slate-600">{result.rank.message.slice(0, 25)}...</div>
            </div>
          </div>

          {/* Stats */}
          <dl className="mt-4 grid grid-cols-2 divide-x divide-slate-200 border-y border-slate-200">
            <div className="px-3 py-3">
              <dt className="text-xs text-slate-600">獲得率</dt>
              <dd className={cn('text-2xl font-bold tabular-nums', visual.text)}>
                {Math.round(result.percent)}%
              </dd>
            </div>
            <div className="px-3 py-3">
              <dt className="text-xs text-slate-600">内申点</dt>
              <dd className="text-2xl font-bold tabular-nums text-slate-900">
                {result.total}
                <span className="text-sm font-bold text-slate-600">/{result.max}</span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Subject Scores */}
        <div className="mt-5">
          <div className="text-sm font-bold text-slate-900">教科別スコア</div>
          <div className="mt-2 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
            {SUBJECTS.map((s) => (
              <div
                key={s.key}
                className="bg-white px-3 py-2"
              >
                <div className="text-xs text-slate-600">{s.shortLabel}</div>
                <div className="text-lg font-bold tabular-nums text-slate-900">{scores[s.key]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Credit */}
        <div className="mt-5 text-center">
          <div className="text-xs text-slate-600">
            内申点を計算してシェアしよう
          </div>
          <div className="mt-1 text-xs font-bold text-slate-700">#MyNaishin</div>
        </div>
      </div>
    );
  }
);
