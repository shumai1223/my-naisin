'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Zap, Award } from 'lucide-react';

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
    if (pct >= 90) return { text: 'text-emerald-600', bg: 'bg-emerald-500', gradient: 'from-emerald-400 to-green-500' };
    if (pct >= 75) return { text: 'text-blue-600', bg: 'bg-blue-500', gradient: 'from-blue-400 to-indigo-500' };
    if (pct >= 50) return { text: 'text-amber-600', bg: 'bg-amber-500', gradient: 'from-amber-400 to-orange-500' };
    return { text: 'text-slate-600', bg: 'bg-slate-400', gradient: 'from-slate-400 to-slate-500' };
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
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 shadow-lg"
    >
      <div className="p-4">
        {/* メインスコア表示 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br shadow-lg',
              colorStyle.gradient
            )}>
              <Award className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">現在のスコア</div>
              <div className="flex items-baseline gap-1">
                <motion.span
                  key={total}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className={cn('text-3xl font-black', colorStyle.text)}
                >
                  {total}
                </motion.span>
                <span className="text-lg font-semibold text-slate-400">/ {max}</span>
              </div>
            </div>
          </div>

          {/* パーセント表示 */}
          <div className="text-right">
            <div className={cn(
              'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-bold',
              percent >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
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
            <motion.div
              className={cn('h-full rounded-full bg-gradient-to-r', colorStyle.gradient)}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* 教科別サマリー */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-blue-50/80 p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-blue-700">5教科合計</span>
            </div>
            <div className="mt-1 text-lg font-bold text-blue-800">
              {coreSum}<span className="text-sm font-medium text-blue-400">/25</span>
            </div>
          </div>
          <div className="rounded-xl bg-violet-50/80 p-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-violet-500" />
              <span className="text-xs font-medium text-violet-700">実技4教科合計</span>
            </div>
            <div className="mt-1 text-lg font-bold text-violet-800">
              {practicalSum}<span className="text-sm font-medium text-violet-400">/20</span>
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
    </motion.div>
  );
}
