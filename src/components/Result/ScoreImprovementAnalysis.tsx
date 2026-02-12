'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown, Minus, Lightbulb, Target, Zap, Star } from 'lucide-react';

import { readHistory } from '@/lib/persistence';
import { getSubjectWeight } from '@/lib/utils';
import { SUBJECTS } from '@/lib/constants';
import type { Scores, SubjectKey } from '@/lib/types';

interface ScoreImprovementAnalysisProps {
  currentScores: Scores;
  prefectureCode: string;
  targetScore?: number;
}

interface ImprovementSuggestion {
  subject: SubjectKey;
  label: string;
  currentScore: number;
  suggestedScore: number;
  pointGain: number;
  weight: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
}

export function ScoreImprovementAnalysis({ currentScores, prefectureCode, targetScore }: ScoreImprovementAnalysisProps) {
  const [previousScores, setPreviousScores] = React.useState<Scores | null>(null);
  const [expanded, setExpanded] = React.useState(true);

  React.useEffect(() => {
    const history = readHistory();
    if (history.length >= 2) {
      setPreviousScores(history[1].scores);
    }
  }, [currentScores]);

  const diff = React.useMemo(() => {
    if (!previousScores) return null;

    const changes: { subject: SubjectKey; label: string; prev: number; curr: number; diff: number }[] = [];
    
    SUBJECTS.forEach((subject) => {
      const prev = previousScores[subject.key] ?? 3;
      const curr = currentScores[subject.key] ?? 3;
      if (prev !== curr) {
        changes.push({
          subject: subject.key,
          label: subject.label,
          prev,
          curr,
          diff: curr - prev,
        });
      }
    });

    return changes;
  }, [currentScores, previousScores]);

  const suggestions = React.useMemo(() => {
    const result: ImprovementSuggestion[] = [];

    SUBJECTS.forEach((subject) => {
      const current = currentScores[subject.key] ?? 3;
      const weight = getSubjectWeight(prefectureCode, subject.category);

      if (current < 5) {
        const pointGain = weight;
        let priority: 'high' | 'medium' | 'low' = 'low';
        let reason = '';

        if (weight >= 2 && current <= 3) {
          priority = 'high';
          reason = `実技教科で倍率${weight}倍。1点上げるだけで${pointGain}点アップ！`;
        } else if (weight >= 2) {
          priority = 'medium';
          reason = `実技教科で倍率${weight}倍。効率的に点数を稼げます。`;
        } else if (current <= 2) {
          priority = 'high';
          reason = '基礎科目で伸びしろが大きいです。';
        } else {
          reason = '着実に積み上げましょう。';
        }

        result.push({
          subject: subject.key,
          label: subject.label,
          currentScore: current,
          suggestedScore: current + 1,
          pointGain,
          weight,
          priority,
          reason,
        });
      }
    });

    return result.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return b.pointGain - a.pointGain;
    });
  }, [currentScores, prefectureCode]);

  const topSuggestions = suggestions.slice(0, 3);

  if (!diff && suggestions.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <span className="text-base font-bold text-slate-800">成績分析・改善提案</span>
        </div>
        <span className="text-sm text-slate-500">{expanded ? '閉じる' : '開く'}</span>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 p-4">
          {diff && diff.length > 0 && (
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                前回からの変化
              </div>
              <div className="flex flex-wrap gap-2">
                {diff.map((change) => (
                  <div
                    key={change.subject}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                      change.diff > 0
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {change.diff > 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{change.label}</span>
                    <span className="font-bold">
                      {change.diff > 0 ? '+' : ''}{change.diff}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
            <Target className="h-4 w-4 text-blue-500" />
            おすすめ改善ポイント（上位3教科）
          </div>

          <div className="space-y-2">
            {topSuggestions.map((suggestion, index) => (
              <div
                key={suggestion.subject}
                className={`rounded-lg border p-3 ${
                  suggestion.priority === 'high'
                    ? 'border-amber-200 bg-amber-50'
                    : suggestion.priority === 'medium'
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Star className="h-4 w-4 text-amber-500" />}
                    <span className="font-bold text-slate-700">{suggestion.label}</span>
                    {suggestion.weight > 1 && (
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
                        ×{suggestion.weight}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-slate-500">{suggestion.currentScore}</span>
                    <Zap className="h-3 w-3 text-amber-500" />
                    <span className="font-bold text-emerald-600">{suggestion.suggestedScore}</span>
                    <span className="ml-1 rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-bold text-emerald-700">
                      +{suggestion.pointGain}点
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-600">{suggestion.reason}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-gradient-to-r from-indigo-50 to-violet-50 p-3">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-700">
              <Zap className="h-4 w-4" />
              最短ルートの提案
            </div>
            <p className="mt-1 text-xs text-indigo-600">
              {topSuggestions.length > 0 ? (
                <>
                  <strong>{topSuggestions[0].label}</strong>を1点上げると、
                  最も効率よく<strong>+{topSuggestions[0].pointGain}点</strong>獲得できます。
                  {topSuggestions[0].weight > 1 && '実技教科は倍率が高いので優先的に取り組みましょう。'}
                </>
              ) : (
                '各教科で最高評価を達成しています！素晴らしい！'
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
