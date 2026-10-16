'use client';

import * as React from 'react';
import { ChevronDown, ChevronUp } from '@/components/icons';

import { PREFECTURES, getPrefectureByCode } from '@/lib/prefectures';
import type { Scores } from '@/lib/types';
import { calculateTotalScore, calculateMaxScore, calculatePercent, cn } from '@/lib/utils';

interface PrefectureComparisonProps {
  scores: Scores;
  currentPrefectureCode: string;
}

interface ComparisonItem {
  code: string;
  name: string;
  total: number;
  max: number;
  percent: number;
  isCurrent: boolean;
}

export function PrefectureComparison({ scores, currentPrefectureCode }: PrefectureComparisonProps) {
  const [showAll, setShowAll] = React.useState(false);

  const comparisons = React.useMemo(() => {
    const results: ComparisonItem[] = PREFECTURES.map((pref) => {
      const total = calculateTotalScore(scores, pref.code);
      const max = calculateMaxScore(pref.code);
      const percent = calculatePercent(total, max);

      return {
        code: pref.code,
        name: pref.name,
        total,
        max,
        percent,
        isCurrent: pref.code === currentPrefectureCode,
      };
    });

    return results.sort((a, b) => b.percent - a.percent);
  }, [scores, currentPrefectureCode]);

  const currentRank = comparisons.findIndex((c) => c.isCurrent) + 1;
  const currentPrefecture = getPrefectureByCode(currentPrefectureCode);
  const displayedComparisons = showAll ? comparisons : comparisons.slice(0, 5);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-[17px] font-bold text-slate-900">都道府県別スコア比較</h3>
      <p className="mt-1 text-sm text-slate-600">同じ成績でも地域で点数が変わります</p>

      {/* 現在の都道府県の順位 */}
      <dl className="mt-4 grid grid-cols-2 divide-x divide-slate-200 border-y border-slate-200">
        <div className="py-3 pr-4">
          <dt className="text-xs text-slate-600">現在の選択</dt>
          <dd className="mt-1 text-base font-bold text-slate-900">{currentPrefecture?.name}</dd>
        </div>
        <div className="py-3 pl-4 text-right">
          <dt className="text-xs text-slate-600">全国順位</dt>
          <dd className="mt-1 flex items-baseline justify-end gap-1 tabular-nums">
            <span className="text-2xl font-bold text-slate-900">{currentRank}</span>
            <span className="text-sm text-slate-600">/ 47位</span>
          </dd>
        </div>
      </dl>

      {/* 比較リスト */}
      <ol className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
        {displayedComparisons.map((item, index) => (
          <li
            key={item.code}
            className={cn(
              'flex items-center gap-3 px-3 py-3',
              item.isCurrent && 'bg-brand-50'
            )}
          >
            <span className="w-6 shrink-0 text-sm font-bold tabular-nums text-slate-600">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn('text-sm text-slate-900', item.isCurrent && 'font-bold')}>
                  {item.name}
                </span>
                {item.isCurrent && (
                  <span className="inline-flex items-center rounded border border-brand-700 bg-white px-2 py-0.5 text-xs font-bold text-brand-700">
                    現在
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-xs tabular-nums text-slate-600">
                {item.total}点 / {item.max}点満点
              </div>
            </div>

            <div className="shrink-0 text-base font-bold tabular-nums text-slate-900">
              {item.percent}%
            </div>
          </li>
        ))}
      </ol>

      {/* もっと見るボタン */}
      {comparisons.length > 5 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          aria-expanded={showAll}
          className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-1 rounded border border-brand-700 bg-white px-5 py-3 text-sm font-bold text-brand-700 hover:bg-brand-50"
        >
          {showAll ? '閉じる' : `他${comparisons.length - 5}件を表示`}
          {showAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      )}

      {/* 補足情報 */}
      <p className="mt-4 border-t border-slate-200 pt-3 text-sm leading-relaxed text-slate-600">
        各都道府県で計算方法（倍率）が異なるため、同じ成績でも内申点が変わります。
        引っ越しや私立受験の参考にしてください。
      </p>
    </div>
  );
}
