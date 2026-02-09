'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 p-5 text-white">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 backdrop-blur-sm">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold">📚 教科別変化</h3>
            <p className="text-sm text-white/80">前回との比較</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl bg-emerald-50 p-3 text-center border border-emerald-200">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-lg font-bold text-emerald-600">{improvements.length}</span>
            </div>
            <div className="text-[10px] font-medium text-emerald-600">上昇</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-200">
            <div className="flex items-center justify-center gap-1">
              <Minus className="h-4 w-4 text-slate-400" />
              <span className="text-lg font-bold text-slate-600">{stable.length}</span>
            </div>
            <div className="text-[10px] font-medium text-slate-500">維持</div>
          </div>
          <div className="rounded-xl bg-rose-50 p-3 text-center border border-rose-200">
            <div className="flex items-center justify-center gap-1">
              <TrendingDown className="h-4 w-4 text-rose-500" />
              <span className="text-lg font-bold text-rose-600">{declines.length}</span>
            </div>
            <div className="text-[10px] font-medium text-rose-600">下降</div>
          </div>
        </div>

        {/* Improvements */}
        {improvements.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-700">成績UP！</span>
            </div>
            <div className="space-y-2">
              {improvements.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 border border-emerald-100"
                >
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">{item.previous}</span>
                    <ArrowRight className="h-3 w-3 text-emerald-500" />
                    <span className="text-sm font-bold text-emerald-600">{item.current}</span>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-100 px-1.5 py-0.5 rounded">
                      +{item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Declines */}
        {declines.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-rose-500" />
              <span className="text-xs font-bold text-rose-700">要注意</span>
            </div>
            <div className="space-y-2">
              {declines.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2 border border-rose-100"
                >
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">{item.previous}</span>
                    <ArrowRight className="h-3 w-3 text-rose-500" />
                    <span className="text-sm font-bold text-rose-600">{item.current}</span>
                    <span className="text-xs font-bold text-rose-500 bg-rose-100 px-1.5 py-0.5 rounded">
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stable (collapsed view) */}
        {stable.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Minus className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-600">変化なし</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {stable.map((item) => (
                <span
                  key={item.key}
                  className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full"
                >
                  {item.label} ({item.current})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Motivation */}
        <div className="mt-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-3 border border-blue-200">
          <p className="text-xs text-blue-700 text-center">
            {improvements.length > declines.length && '🎉 全体的に上昇傾向！この調子で頑張ろう！'}
            {improvements.length < declines.length && '💪 次回は上昇を目指そう！一歩ずつ前進！'}
            {improvements.length === declines.length && '📊 バランスが取れています。得意を伸ばそう！'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
