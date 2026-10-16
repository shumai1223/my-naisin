'use client';

import * as React from 'react';

import { SUBJECTS } from '@/lib/constants';
import { getPrefectureByCode } from '@/lib/prefectures';
import type { Scores } from '@/lib/types';
import { calculateTotalScore, calculateMaxScore, calculatePercent } from '@/lib/utils';

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

  // 満点に対する割合を事実の文で示す（称賛・励ましの表現は使わない）
  const getMessage = (pct: number) => {
    if (pct >= 90) return '満点の90%以上です';
    if (pct >= 75) return '満点の75%以上です';
    if (pct >= 50) return '満点の50%以上です';
    return '満点の50%未満です';
  };

  return (
    <div className="mb-5 overflow-hidden rounded-lg border border-slate-200 bg-white motion-safe:animate-fade-in">
      <div className="p-4">
        {/* メインスコア表示 */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs text-slate-600">現在のスコア</div>
            <div className="flex items-baseline gap-1 tabular-nums">
              <span className="text-3xl font-bold text-brand-700">
                {total}
              </span>
              <span className="text-lg font-bold text-slate-600">/ {max}</span>
            </div>
          </div>

          {/* パーセント表示 */}
          <div className="text-right">
            <div className="text-2xl font-bold tabular-nums text-brand-700">{Math.round(percent)}%</div>
            <div className="mt-1 text-sm text-slate-600">{getMessage(percent)}</div>
          </div>
        </div>

        {/* プログレスバー */}
        <div className="mt-4">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand-700 motion-safe:transition-[width] motion-safe:duration-150"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* 教科別サマリー */}
        <dl className="mt-4 grid grid-cols-2 divide-x divide-slate-200 border-y border-slate-200">
          <div className="py-3 pr-4">
            <dt className="text-xs text-slate-600">5教科合計</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
              {coreSum}<span className="text-sm font-normal text-slate-600">/25</span>
            </dd>
          </div>
          <div className="py-3 pl-4">
            <dt className="text-xs text-slate-600">実技4教科合計</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
              {practicalSum}<span className="text-sm font-normal text-slate-600">/20</span>
            </dd>
          </div>
        </dl>

        {/* 都道府県情報 */}
        {prefecture && (
          <p className="mt-3 text-sm text-slate-600">
            {prefecture.name}方式で計算中（{prefecture.maxScore}点満点）
          </p>
        )}
      </div>
    </div>
  );
}
