'use client';

import * as React from 'react';
import { TrendingUp, Target, Zap, Award } from '@/components/icons';

import { SUBJECTS } from '@/lib/constants';
import { getPrefectureByCode } from '@/lib/prefectures';
import type { Scores } from '@/lib/types';
import { calculateTotalScore, calculateMaxScore, calculatePercent, cn } from '@/lib/utils';

interface LiveScorePreviewProps {
  scores: Scores;
  prefectureCode: string;
}

export function LiveScorePreview({ scores, prefectureCode }: LiveScorePreviewProps) {
  const total = calculateTotalScore(scores, prefectureCode);
  const max = calculateMaxScore(prefectureCode);
  const percent = calculatePercent(total, max);
  const prefecture = getPrefectureByCode(prefectureCode);

  // 5教科と実技4教科の合計を計算
  const coreSum = SUBJECTS.filter(s => s.category === 'core').reduce((sum, s) => sum + scores[s.key], 0);
  const practicalSum = SUBJECTS.filter(s => s.category === 'practical').reduce((sum, s) => sum + scores[s.key], 0);

  // パーセントに応じた色
  const getColor = (pct: number) => {
    if (pct >= 90) return { text: 'text-brand-600', bg: 'bg-brand-500', gradient: 'bg-brand-400' };
    if (pct >= 75) return { text: 'text-brand-600', bg: 'bg-brand-500', gradient: 'bg-brand-400' };
    if (pct >= 50) return { text: 'text-amber-600', bg: 'bg-amber-500', gradient: 'bg-amber-400' };
    return { text: 'text-slate-600', bg: 'bg-slate-400', gradient: 'bg-slate-400' };
  };

  const colorStyle = getColor(percent);

  // 励ましメッセージ
  const getMessage = (pct: number) => {
    if (pct >= 90) return '素晴らしい！最高レベルです 🎉';
    if (pct >= 75) return 'いい調子！あと少しで最高ランク';
    if (pct >= 50) return '順調です！まだまだ伸ばせる';
    return 'ここから伸ばしていこう！';
  };

  return (
    <div className="mb-5 animate-fade-in overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="p-4">
        {/* メインスコア表示 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'grid h-14 w-14 place-items-center rounded-lg ',
              colorStyle.gradient
            )}>
              <Award className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="text-xs text-slate-500">現在のスコア</div>
              <div className="flex items-baseline gap-1">
                {/* key={total} で値が変わるたび remount → CSS の score-pop を再生（framer-motion非依存） */}
                <span
                  key={total}
                  className={cn('text-3xl font-bold', colorStyle.text)}
                >
                  {total}
                </span>
                <span className="text-lg font-bold text-slate-400">/ {max}</span>
              </div>
            </div>
          </div>

          {/* パーセント表示 */}
          <div className="text-right">
            <div className={cn(
              'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold',
              percent >= 75 ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600'
            )}>
              <Zap className="h-4 w-4" />
              {Math.round(percent)}%
            </div>
            <div className="mt-1 text-xs text-slate-500">{getMessage(percent)}</div>
          </div>
        </div>

        {/* プログレスバー */}
        <div className="mt-4">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={cn('h-full rounded-full transition-[width] duration-500 ease-out', colorStyle.gradient)}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* 教科別サマリー */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-brand-50/80 p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-500" />
              <span className="text-xs text-brand-700">5教科合計</span>
            </div>
            <div className="mt-1 text-lg font-bold text-brand-800">
              {coreSum}<span className="text-sm text-brand-400">/25</span>
            </div>
          </div>
          <div className="rounded-lg bg-slate-50/80 p-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-slate-500" />
              <span className="text-xs text-slate-700">実技4教科合計</span>
            </div>
            <div className="mt-1 text-lg font-bold text-slate-800">
              {practicalSum}<span className="text-sm text-slate-400">/20</span>
            </div>
          </div>
        </div>

        {/* 都道府県情報 */}
        {prefecture && (
          <div className="mt-3 rounded-lg bg-slate-100/80 px-3 py-2 text-center">
            <span className="text-xs text-slate-600">
              📍 {prefecture.name}方式で計算中（{prefecture.maxScore}点満点）
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
