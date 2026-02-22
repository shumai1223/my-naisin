'use client';

import * as React from 'react';
import { MapPin, ArrowRight, Info } from 'lucide-react';

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

  const getPercentColor = (percent: number) => {
    if (percent >= 90) return 'text-emerald-600 bg-emerald-50';
    if (percent >= 75) return 'text-blue-600 bg-blue-50';
    if (percent >= 60) return 'text-amber-600 bg-amber-50';
    return 'text-slate-600 bg-slate-50';
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500">
          <MapPin className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">都道府県別スコア比較</h3>
          <p className="text-xs text-slate-500">同じ成績でも地域で点数が変わります</p>
        </div>
      </div>

      {/* 現在の都道府県の順位 */}
      <div className="mb-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">現在の選択</div>
            <div className="mt-0.5 font-bold text-slate-800">{currentPrefecture?.name}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">全国順位</div>
            <div className="mt-0.5 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-indigo-600">{currentRank}</span>
              <span className="text-sm text-slate-500">/ 47位</span>
            </div>
          </div>
        </div>
      </div>

      {/* 比較リスト */}
      <div className="space-y-2">
        {displayedComparisons.map((item, index) => (
          <div
            key={item.code}
            className={cn(
              'flex items-center gap-3 rounded-xl p-3 transition-colors',
              item.isCurrent 
                ? 'bg-indigo-50 border-2 border-indigo-200' 
                : 'bg-slate-50 border border-transparent'
            )}
          >
            <div className={cn(
              'grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold',
              index < 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'
            )}>
              {index + 1}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'text-sm',
                  item.isCurrent ? 'font-bold text-indigo-700' : 'font-medium text-slate-700'
                )}>
                  {item.name}
                </span>
                {item.isCurrent && (
                  <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">
                    現在
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                {item.total}点 / {item.max}点満点
              </div>
            </div>

            <div className={cn(
              'shrink-0 rounded-lg px-2 py-1 text-sm font-bold',
              getPercentColor(item.percent)
            )}>
              {item.percent}%
            </div>
          </div>
        ))}
      </div>

      {/* もっと見るボタン */}
      {comparisons.length > 5 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-slate-100 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
        >
          {showAll ? '閉じる' : `他${comparisons.length - 5}件を表示`}
          <ArrowRight className={cn('h-4 w-4 transition-transform', showAll && 'rotate-90')} />
        </button>
      )}

      {/* 補足情報 */}
      <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
        <p className="text-xs leading-relaxed text-slate-500">
          各都道府県で計算方法（倍率）が異なるため、同じ成績でも内申点が変わります。
          引っ越しや私立受験の参考にしてください。
        </p>
      </div>
    </div>
  );
}
