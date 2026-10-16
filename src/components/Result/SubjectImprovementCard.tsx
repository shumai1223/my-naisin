'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from '@/components/icons';

import { readHistory } from '@/lib/persistence';
import { SUBJECTS } from '@/lib/constants';
import type { Scores, SubjectKey } from '@/lib/types';

interface SubjectImprovementCardProps {
  currentScores: Scores;
}

interface SubjectChange {
  key: SubjectKey;
  label: string;
  current: number;
  previous: number;
  change: number;
}

export function SubjectImprovementCard({ currentScores }: SubjectImprovementCardProps) {
  const [changes, setChanges] = React.useState<SubjectChange[]>([]);
  const [hasHistory, setHasHistory] = React.useState(false);

  React.useEffect(() => {
    const history = readHistory();
    if (history.length < 2) {
      setHasHistory(false);
      return;
    }

    setHasHistory(true);
    const previousEntry = history[1]; // Second most recent (since current is first)

    const subjectChanges: SubjectChange[] = SUBJECTS.map((subject) => ({
      key: subject.key,
      label: subject.label,
      current: currentScores[subject.key],
      previous: previousEntry.scores[subject.key],
      change: currentScores[subject.key] - previousEntry.scores[subject.key],
    }));

    // Sort by change (improvements first)
    subjectChanges.sort((a, b) => b.change - a.change);
    setChanges(subjectChanges);
  }, [currentScores]);

  const improvements = changes.filter(c => c.change > 0);
  const declines = changes.filter(c => c.change < 0);
  const stable = changes.filter(c => c.change === 0);

  if (!hasHistory) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      {/* Header */}
      <h3 className="text-[17px] font-bold text-slate-900">教科別変化</h3>
      <p className="mt-1 text-sm text-slate-600">前回との比較</p>

      {/* Summary */}
      <dl className="mt-4 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200">
        <div className="px-3 py-3 text-center">
          <dt className="flex items-center justify-center gap-1 text-xs text-slate-600">
            <TrendingUp className="h-4 w-4 text-brand-700" />
            上昇
          </dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{improvements.length}</dd>
        </div>
        <div className="px-3 py-3 text-center">
          <dt className="flex items-center justify-center gap-1 text-xs text-slate-600">
            <Minus className="h-4 w-4 text-slate-600" />
            維持
          </dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{stable.length}</dd>
        </div>
        <div className="px-3 py-3 text-center">
          <dt className="flex items-center justify-center gap-1 text-xs text-slate-600">
            <TrendingDown className="h-4 w-4 text-amber-800" />
            下降
          </dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{declines.length}</dd>
        </div>
      </dl>

      {/* Improvements */}
      {improvements.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
            <TrendingUp className="h-4 w-4 text-brand-700" />
            上昇した教科
          </h4>
          <ul className="divide-y divide-slate-200 border-y border-slate-200">
            {improvements.map((item) => (
              <li
                key={item.key}
                className="flex items-center justify-between gap-3 py-2"
              >
                <span className="text-sm text-slate-900">{item.label}</span>
                <div className="flex items-center gap-2 text-sm tabular-nums">
                  <span className="text-slate-600">{item.previous}</span>
                  <ArrowRight className="h-4 w-4 text-slate-600" />
                  <span className="font-bold text-slate-900">{item.current}</span>
                  <span className="inline-flex items-center rounded border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-xs font-bold text-brand-800">
                    +{item.change}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Declines */}
      {declines.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
            <TrendingDown className="h-4 w-4 text-amber-800" />
            要注意
          </h4>
          <ul className="divide-y divide-slate-200 border-y border-slate-200">
            {declines.map((item) => (
              <li
                key={item.key}
                className="flex items-center justify-between gap-3 py-2"
              >
                <span className="text-sm text-slate-900">{item.label}</span>
                <div className="flex items-center gap-2 text-sm tabular-nums">
                  <span className="text-slate-600">{item.previous}</span>
                  <ArrowRight className="h-4 w-4 text-slate-600" />
                  <span className="font-bold text-slate-900">{item.current}</span>
                  <span className="inline-flex items-center rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-xs font-bold text-amber-900">
                    {item.change}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stable (collapsed view) */}
      {stable.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
            <Minus className="h-4 w-4 text-slate-600" />
            変化なし
          </h4>
          <ul className="flex flex-wrap gap-2">
            {stable.map((item) => (
              <li
                key={item.key}
                className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
              >
                {item.label} ({item.current})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Message */}
      <p className="mt-5 rounded-lg border border-slate-200 bg-brand-50 p-4 text-sm leading-relaxed text-slate-900">
        {improvements.length > declines.length && '全体的に上昇傾向です。'}
        {improvements.length < declines.length && '次回は上昇を目指しましょう。'}
        {improvements.length === declines.length && 'バランスが取れています。得意を伸ばしましょう。'}
      </p>
    </div>
  );
}
