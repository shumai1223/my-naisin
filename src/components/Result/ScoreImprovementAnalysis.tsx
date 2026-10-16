'use client';

import * as React from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ArrowRight } from '@/components/icons';

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
          reason = `実技教科で倍率${weight}倍。1点上げるだけで${pointGain}点アップ。`;
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
    <div className="rounded-lg border border-slate-200 bg-white">
      <h3 className="text-[17px] font-bold text-slate-900">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className="flex min-h-11 w-full items-center justify-between gap-3 p-4 text-left"
        >
          <span>成績分析・改善提案</span>
          <span className="text-sm font-normal text-slate-600">{expanded ? '閉じる' : '開く'}</span>
        </button>
      </h3>

      {expanded && (
        <div className="border-t border-slate-200 p-4">
          {diff && diff.length > 0 && (
            <div className="mb-5">
              <h4 className="mb-2 text-sm font-bold text-slate-900">前回からの変化</h4>
              <ul className="flex flex-wrap gap-2">
                {diff.map((change) => (
                  <li
                    key={change.subject}
                    className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-sm tabular-nums ${
                      change.diff > 0
                        ? 'border-slate-200 bg-white text-slate-900'
                        : 'border-amber-200 bg-amber-50 text-amber-900'
                    }`}
                  >
                    {change.diff > 0 ? (
                      <TrendingUp className="h-4 w-4 text-brand-700" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{change.label}</span>
                    <span className="font-bold">
                      {change.diff > 0 ? '+' : ''}{change.diff}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <h4 className="mb-2 text-sm font-bold text-slate-900">おすすめ改善ポイント（上位3教科）</h4>

          <ul className="divide-y divide-slate-200 border-y border-slate-200">
            {topSuggestions.map((suggestion) => (
              <li key={suggestion.subject} className="py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">{suggestion.label}</span>
                    {suggestion.weight > 1 && (
                      <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-bold tabular-nums text-slate-700">
                        ×{suggestion.weight}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm tabular-nums">
                    <span className="text-slate-600">{suggestion.currentScore}</span>
                    <ArrowRight className="h-4 w-4 text-slate-600" />
                    <span className="font-bold text-slate-900">{suggestion.suggestedScore}</span>
                    <span className="inline-flex items-center rounded border border-brand-200 bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-800">
                      +{suggestion.pointGain}点
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-sm text-slate-600">{suggestion.reason}</p>
              </li>
            ))}
          </ul>

          <div className="mt-5 rounded-lg border border-slate-200 bg-brand-50 p-4">
            <div className="text-sm font-bold text-slate-900">最短ルートの提案</div>
            <p className="mt-1 text-sm leading-relaxed text-slate-900">
              {topSuggestions.length > 0 ? (
                <>
                  <strong>{topSuggestions[0].label}</strong>を1点上げると、
                  効率よく<strong>+{topSuggestions[0].pointGain}点</strong>獲得できます。
                  {topSuggestions[0].weight > 1 && '実技教科は倍率が高いので優先的に取り組みましょう。'}
                </>
              ) : (
                '各教科で最高評価を達成しています。'
              )}
            </p>
          </div>

          {/* 広告前提UX：次に見るべき記事 */}
          <div className="mt-6">
            <h4 className="text-sm font-bold text-slate-900">次に見るべき攻略記事</h4>
            <ul className="mt-2 divide-y divide-slate-200 border-y border-slate-200">
              <li>
                <Link
                  href="/blog/naishin-guide"
                  className="flex min-h-11 items-center justify-between gap-3 py-3 hover:bg-brand-50"
                >
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-brand-700 underline underline-offset-2">内申点の基礎から理解する</span>
                    <span className="block text-sm text-slate-600">9教科の評価方法と上げ方のコツ</span>
                  </span>
                  <span className="inline-flex shrink-0 items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">必読</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/tokyo-kansan-naishin-guide"
                  className="flex min-h-11 items-center justify-between gap-3 py-3 hover:bg-brand-50"
                >
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-brand-700 underline underline-offset-2">実技教科攻略ガイド</span>
                    <span className="block text-sm text-slate-600">倍率の高い実技で効率よく点数を上げる</span>
                  </span>
                  <span className="inline-flex shrink-0 items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">実技特化</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/naishinten-calculation-by-prefecture"
                  className="flex min-h-11 items-center justify-between gap-3 py-3 hover:bg-brand-50"
                >
                  <span className="min-w-0">
                    <span className="block text-base font-bold text-brand-700 underline underline-offset-2">提出物・観点別評価対策</span>
                    <span className="block text-sm text-slate-600">テスト以外で内申点を上げる方法</span>
                  </span>
                  <span className="inline-flex shrink-0 items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">日常対策</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
