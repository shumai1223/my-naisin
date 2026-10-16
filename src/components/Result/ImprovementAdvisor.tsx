'use client';

import * as React from 'react';
import { ChevronUp } from '@/components/icons';

import { SUBJECTS, RANK_DEFINITIONS } from '@/lib/constants';
import { getPrefectureByCode } from '@/lib/prefectures';
import type { Scores, SubjectKey } from '@/lib/types';
import { calculateTotalScore, calculateMaxScore, calculatePercent, getRankForPercent } from '@/lib/utils';

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

// 優先度は色ではなく文字でも示す
const PRIORITY_LABEL: Record<SubjectAnalysis['priority'], string> = {
  high: '高',
  medium: '中',
  low: '低',
};

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
      <div className="rounded-lg border border-slate-200 bg-brand-50 p-5">
        <h3 className="text-[17px] font-bold text-slate-900">満点です</h3>
        <p className="mt-1 text-sm text-slate-600">
          各教科で満点を達成しています
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-[17px] font-bold text-slate-900">成績アップ優先度アドバイス</h3>
      <p className="mt-1 text-sm text-slate-600">効率的に内申点を上げるための提案</p>

      <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
        {/* 次のランクまで */}
        {nextRankInfo && nextRankInfo.pointsNeeded > 0 && (
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
            <dt className="text-sm text-slate-900">
              次のランク「{nextRankInfo.nextRank.code}」まで
            </dt>
            <dd className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums text-slate-900">あと{nextRankInfo.pointsNeeded}</span>
              <span className="text-sm text-slate-600">点</span>
            </dd>
            {topRecommendations[0] && (
              <dd className="basis-full text-sm text-slate-600">
                「{topRecommendations[0].label}」を1点上げれば +{topRecommendations[0].multiplier}点
                {nextRankInfo.pointsNeeded <= topRecommendations[0].multiplier && (
                  <span className="ml-1 font-bold text-slate-900">→ ランクアップ可能です</span>
                )}
              </dd>
            )}
          </div>
        )}

        {/* 総合ポテンシャル */}
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
          <dt className="text-sm text-slate-900">伸びしろ合計</dt>
          <dd className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tabular-nums text-brand-700">+{totalPotentialGain}</span>
            <span className="text-sm text-slate-600">点</span>
          </dd>
          <dd className="basis-full text-sm text-slate-600">
            全教科を満点にした場合の上昇幅
          </dd>
        </div>
      </dl>

      {/* 優先度高い教科 */}
      <h4 className="mt-5 text-sm font-bold text-slate-900">優先的に取り組む教科</h4>
      <ol className="mt-2 divide-y divide-slate-200 border-y border-slate-200">
        {topRecommendations.map((item, index) => (
          <li key={item.key} className="flex items-center gap-3 py-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded border border-slate-300 text-sm font-bold tabular-nums text-slate-900">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-900">{item.label}</span>
                {item.multiplier > 1 && (
                  <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs tabular-nums text-slate-700">
                    ×{item.multiplier}
                  </span>
                )}
                <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                  優先度 {PRIORITY_LABEL[item.priority]}
                </span>
              </div>
              <div className="mt-0.5 text-sm tabular-nums text-slate-600">
                現在 {item.currentScore} → 5にすると +{item.potentialGain}点
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 text-brand-700">
              <ChevronUp className="h-4 w-4" />
              <span className="text-sm font-bold tabular-nums">+{item.potentialGain}</span>
            </div>
          </li>
        ))}
      </ol>

      {/* アドバイス */}
      <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4">
        <p className="text-sm font-bold text-slate-900">ポイント</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-900">
          {topRecommendations[0]?.multiplier > 1
            ? `「${topRecommendations[0]?.label}」は倍率が高いため、1点上げるだけで${topRecommendations[0]?.multiplier}点分の効果があります。`
            : `「${topRecommendations[0]?.label}」を優先的に改善することで、効率よく内申点を上げられます。`}
        </p>
      </div>
    </div>
  );
}
