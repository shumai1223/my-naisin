'use client';

import * as React from 'react';
import { TrendingUp, Target, Lightbulb, ChevronUp } from '@/components/icons';

import { SUBJECTS, RANK_DEFINITIONS } from '@/lib/constants';
import { getPrefectureByCode } from '@/lib/prefectures';
import type { Scores, SubjectKey } from '@/lib/types';
import { cn, calculateTotalScore, calculateMaxScore, calculatePercent, getRankForPercent } from '@/lib/utils';

interface ImprovementAdvisorProps {
  scores: Scores;
  prefectureCode: string;
  targetPercent?: number;
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

export function ImprovementAdvisor({ scores, prefectureCode, targetPercent }: ImprovementAdvisorProps) {
  const prefecture = getPrefectureByCode(prefectureCode);
  
  // 現在のスコアと達成率を計算
  const currentTotal = calculateTotalScore(scores, prefectureCode);
  const maxScore = calculateMaxScore(prefectureCode);
  const currentPercent = calculatePercent(currentTotal, maxScore);
  const currentRank = getRankForPercent(currentPercent);
  
  // 次のランクまでの計算
  const nextRankInfo = React.useMemo(() => {
    const currentRankIndex = RANK_DEFINITIONS.findIndex(r => r.code === currentRank.code);
    if (currentRankIndex <= 0) return null; // すでに最高ランク
    
    const nextRank = RANK_DEFINITIONS[currentRankIndex - 1];
    const targetPercentForNextRank = nextRank.minPercent;
    const targetScoreForNextRank = Math.ceil((targetPercentForNextRank / 100) * maxScore);
    const pointsNeeded = targetScoreForNextRank - currentTotal;
    
    return {
      nextRank,
      targetScore: targetScoreForNextRank,
      pointsNeeded: Math.max(0, pointsNeeded),
    };
  }, [currentRank, currentTotal, maxScore]);

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
      <div className="rounded-lg border border-brand-200 bg-brand-50 p-6 text-center">
        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand-100">
          <Target className="h-6 w-6 text-brand-600" />
        </div>
        <div className="text-lg font-bold text-brand-800">完璧なスコア！</div>
        <div className="mt-1 text-sm text-brand-600">
          各教科で満点を達成しています
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400">
          <Lightbulb className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">成績アップ優先度アドバイス</h3>
          <p className="text-xs text-slate-500">効率的に内申点を上げるための提案</p>
        </div>
      </div>

      {/* 次のランクまで */}
      {nextRankInfo && nextRankInfo.pointsNeeded > 0 && (
        <div className="mb-4 rounded-lg bg-slate-50 p-4 border border-slate-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-700">
              次のランク「{nextRankInfo.nextRank.code}」まで
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-600">あと{nextRankInfo.pointsNeeded}</span>
              <span className="text-sm text-slate-500">点</span>
            </div>
          </div>
          {topRecommendations[0] && (
            <div className="mt-2 text-xs text-slate-600">
              💡 「{topRecommendations[0].label}」を1点上げれば +{topRecommendations[0].multiplier}点
              {nextRankInfo.pointsNeeded <= topRecommendations[0].multiplier && (
                <span className="ml-1 font-bold">→ ランクアップ可能！</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* 総合ポテンシャル */}
      <div className="mb-4 rounded-lg bg-brand-50 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">伸びしろ合計</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-brand-600">+{totalPotentialGain}</span>
            <span className="text-sm text-slate-500">点</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          全教科を満点にした場合の上昇幅
        </div>
      </div>

      {/* 優先度高い教科 */}
      <div className="mb-3 text-sm font-bold text-slate-700">優先的に取り組む教科</div>
      <div className="space-y-2">
        {topRecommendations.map((item, index) => (
          <div
            key={item.key}
            className={cn(
              'flex items-center gap-3 rounded-lg p-3 transition-colors',
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
                <span className="font-bold text-slate-800">{item.label}</span>
                {item.multiplier > 1 && (
                  <span className="rounded bg-brand-100 px-1.5 py-0.5 text-xs font-bold text-brand-600">
                    ×{item.multiplier}
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-xs text-slate-500">
                現在 {item.currentScore} → 5にすると +{item.potentialGain}点
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 text-brand-600">
              <ChevronUp className="h-4 w-4" />
              <span className="text-sm font-bold">+{item.potentialGain}</span>
            </div>
          </div>
        ))}
      </div>

      {/* アドバイス */}
      <div className="mt-4 rounded-lg bg-slate-50 p-3">
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
