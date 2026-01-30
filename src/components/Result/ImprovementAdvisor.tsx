'use client';

import * as React from 'react';
import { TrendingUp, Target, Lightbulb, ChevronUp } from 'lucide-react';

import { SUBJECTS } from '@/lib/constants';
import { getPrefectureByCode } from '@/lib/prefectures';
import type { Scores, SubjectKey } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ImprovementAdvisorProps {
  scores: Scores;
  prefectureCode: string;
}

interface SubjectAnalysis {
  key: SubjectKey;
  label: string;
  currentScore: number;
  maxScore: number;
  multiplier: number;
  potentialGain: number;
  priority: 'high' | 'medium' | 'low';
  improvementRoom: number;
}

export function ImprovementAdvisor({ scores, prefectureCode }: ImprovementAdvisorProps) {
  const prefecture = getPrefectureByCode(prefectureCode);

  const analysis = React.useMemo(() => {
    if (!prefecture) return [];

    const results: SubjectAnalysis[] = SUBJECTS.map((subject) => {
      const currentScore = scores[subject.key];
      const multiplier = subject.category === 'core' 
        ? prefecture.coreMultiplier 
        : prefecture.practicalMultiplier;
      const maxScore = 5;
      const improvementRoom = maxScore - currentScore;
      const potentialGain = improvementRoom * multiplier;

      let priority: 'high' | 'medium' | 'low' = 'low';
      if (currentScore <= 2 && multiplier >= 1.5) priority = 'high';
      else if (currentScore <= 3 && multiplier >= 1.5) priority = 'high';
      else if (currentScore <= 3 || multiplier >= 1.5) priority = 'medium';

      return {
        key: subject.key,
        label: subject.label,
        currentScore,
        maxScore,
        multiplier,
        potentialGain,
        priority,
        improvementRoom,
      };
    });

    return results
      .filter((r) => r.improvementRoom > 0)
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return b.potentialGain - a.potentialGain;
      });
  }, [scores, prefecture]);

  const topRecommendations = analysis.slice(0, 3);
  const totalPotentialGain = analysis.reduce((sum, a) => sum + a.potentialGain, 0);

  if (analysis.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-100">
          <Target className="h-6 w-6 text-emerald-600" />
        </div>
        <div className="text-lg font-bold text-emerald-800">完璧なスコア！</div>
        <div className="mt-1 text-sm text-emerald-600">
          すべての教科で満点を達成しています
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
          <Lightbulb className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">成績アップ優先度アドバイス</h3>
          <p className="text-xs text-slate-500">効率的に内申点を上げるための提案</p>
        </div>
      </div>

      {/* 総合ポテンシャル */}
      <div className="mb-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">伸びしろ合計</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-blue-600">+{totalPotentialGain}</span>
            <span className="text-sm text-slate-500">点</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          全教科を満点にした場合の上昇幅
        </div>
      </div>

      {/* 優先度高い教科 */}
      <div className="mb-3 text-sm font-semibold text-slate-700">優先的に取り組む教科</div>
      <div className="space-y-2">
        {topRecommendations.map((item, index) => (
          <div
            key={item.key}
            className={cn(
              'flex items-center gap-3 rounded-xl p-3 transition-colors',
              item.priority === 'high' && 'bg-red-50 border border-red-100',
              item.priority === 'medium' && 'bg-amber-50 border border-amber-100',
              item.priority === 'low' && 'bg-slate-50 border border-slate-100'
            )}
          >
            <div className={cn(
              'grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold text-white',
              item.priority === 'high' && 'bg-red-500',
              item.priority === 'medium' && 'bg-amber-500',
              item.priority === 'low' && 'bg-slate-400'
            )}>
              {index + 1}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{item.label}</span>
                {item.multiplier > 1 && (
                  <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
                    ×{item.multiplier}
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                現在 {item.currentScore} → 5にすると +{item.potentialGain}点
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 text-emerald-600">
              <ChevronUp className="h-4 w-4" />
              <span className="text-sm font-bold">+{item.potentialGain}</span>
            </div>
          </div>
        ))}
      </div>

      {/* アドバイス */}
      <div className="mt-4 rounded-xl bg-slate-50 p-3">
        <div className="flex items-start gap-2">
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          <p className="text-xs leading-relaxed text-slate-600">
            {topRecommendations[0]?.multiplier > 1
              ? `「${topRecommendations[0]?.label}」は倍率が高いため、1点上げるだけで${topRecommendations[0]?.multiplier}点分の効果があります。`
              : `「${topRecommendations[0]?.label}」を優先的に改善することで、効率よく内申点を上げられます。`}
          </p>
        </div>
      </div>
    </div>
  );
}
