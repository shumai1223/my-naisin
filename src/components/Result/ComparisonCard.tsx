'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

import { MODE_CONFIG, SUBJECTS } from '@/lib/constants';
import { readHistory } from '@/lib/persistence';
import type { ResultData, SavedHistoryEntry, Scores, SubjectKey } from '@/lib/types';
import { cn } from '@/lib/utils';

import { Card } from '@/components/ui/Card';

export interface ComparisonCardProps {
  result: ResultData;
  scores: Scores;
  saveEnabled: boolean;
  lastSavedId?: string;
}

function getSum(scores: Scores, keys: SubjectKey[]) {
  return keys.reduce((sum, key) => sum + scores[key], 0);
}

function scoresEqual(a: Scores, b: Scores) {
  return SUBJECTS.every((s) => a[s.key] === b[s.key]);
}

function formatSigned(value: number, digits = 0) {
  const rounded = digits > 0 ? Number(value.toFixed(digits)) : Math.round(value);
  if (rounded === 0) return '±0';
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

function BarRow(props: {
  label: string;
  prevValueText: string;
  currentValueText: string;
  prevPercent: number;
  currentPercent: number;
  deltaText?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-slate-700">{props.label}</div>
          <div className="mt-0.5 text-[11px] text-slate-500">
            前回 {props.prevValueText} → 今回 {props.currentValueText}
          </div>
        </div>
        {props.deltaText ? (
          <div className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
            {props.deltaText}
          </div>
        ) : null}
      </div>

      <div className="mt-3">
        <div className="relative h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-slate-400/40"
            style={{ width: `${Math.max(0, Math.min(100, props.prevPercent))}%` }}
          />
          <motion.div
            className="relative h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, props.currentPercent))}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}

export function ComparisonCard({ result, scores, saveEnabled, lastSavedId }: ComparisonCardProps) {
  const [history, setHistory] = React.useState<SavedHistoryEntry[]>([]);

  React.useEffect(() => {
    setHistory(readHistory());
  }, [lastSavedId]);

  const previous = React.useMemo(() => {
    const first = history[0];
    if (!first) return null;

    const sameAsCurrent = first.mode === result.mode && scoresEqual(first.scores, scores);
    if (sameAsCurrent) return history[1] ?? null;
    return first;
  }, [history, result.mode, scores]);

  const metrics = React.useMemo(() => {
    if (!previous) return null;

    const coreKeys = SUBJECTS.filter((s) => s.category === 'core').map((s) => s.key);
    const practicalKeys = SUBJECTS.filter((s) => s.category === 'practical').map((s) => s.key);

    const prevTotalRaw = previous.scores;

    const prevCoreSum = getSum(prevTotalRaw, coreKeys);
    const prevPracticalSum = getSum(prevTotalRaw, practicalKeys);
    const currentCoreSum = getSum(scores, coreKeys);
    const currentPracticalSum = getSum(scores, practicalKeys);

    const prevCoreAvg = prevCoreSum / Math.max(1, coreKeys.length);
    const prevPracticalAvg = prevPracticalSum / Math.max(1, practicalKeys.length);
    const currentCoreAvg = currentCoreSum / Math.max(1, coreKeys.length);
    const currentPracticalAvg = currentPracticalSum / Math.max(1, practicalKeys.length);

    const percentDelta = result.percent - previousPercent(previous);

    return {
      prevPercent: previousPercent(previous),
      currentPercent: result.percent,
      percentDelta,
      prevCoreAvg,
      currentCoreAvg,
      coreAvgDelta: currentCoreAvg - prevCoreAvg,
      prevPracticalAvg,
      currentPracticalAvg,
      practicalAvgDelta: currentPracticalAvg - prevPracticalAvg,
      coreSumDelta: currentCoreSum - prevCoreSum,
      practicalSumDelta: currentPracticalSum - prevPracticalSum
    };
  }, [previous, result.percent, scores]);

  const feedback = React.useMemo(() => {
    if (!previous || !metrics) return [] as string[];

    const lines: string[] = [];

    if (previous.mode !== result.mode) {
      lines.push(`前回は「${MODE_CONFIG[previous.mode].label}」での記録です（比較は平均/達成率ベース）`);
    }

    if (metrics.percentDelta > 0) {
      lines.push(`前回より達成率が ${formatSigned(metrics.percentDelta)}%！いい感じに伸びてる`);
    } else if (metrics.percentDelta === 0) {
      lines.push('前回と同じ達成率！安定してるのが強い');
    } else {
      lines.push(`今回は達成率が ${formatSigned(metrics.percentDelta)}% だけ変化。ここから取り返せる`);
    }

    if (metrics.practicalSumDelta > 0) {
      lines.push(`実技4教科が ${formatSigned(metrics.practicalSumDelta)} 点アップ！ここ伸びると強い`);
    } else if (metrics.coreSumDelta > 0) {
      lines.push(`5教科が ${formatSigned(metrics.coreSumDelta)} 点アップ！基礎力が上がってる`);
    }

    const best = SUBJECTS.map((s) => ({
      label: s.label,
      delta: scores[s.key] - previous.scores[s.key]
    }))
      .filter((d) => d.delta > 0)
      .sort((a, b) => b.delta - a.delta)[0];

    if (best) {
      lines.push(`特に「${best.label}」が ${formatSigned(best.delta)}！その調子`);
    }

    return lines.slice(0, 3);
  }, [metrics, previous, result.mode, scores]);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-blue-50 to-violet-50 px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-200">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">前回との比較</div>
              <div className="text-xs text-slate-500">Progress Comparison</div>
            </div>
          </div>

          {previous ? (
            <div className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-slate-600 shadow-sm">
              前回：{new Date(previous.savedAt).toLocaleDateString('ja-JP')}
              {previous.memo ? <span className="ml-2 text-slate-500">「{previous.memo}」</span> : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-6">
        {!previous || !metrics ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-bold text-slate-800">まだ比較できるデータがありません</div>
            <div className="mt-1 text-xs leading-relaxed text-slate-600">
              {saveEnabled
                ? '保存をONにした状態で結果を出すと、次回からここに伸びが表示されます。'
                : '「記録を保存」をONにすると、次回から前回比較ができます。'}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <BarRow
              label="達成率"
              prevValueText={`${metrics.prevPercent}%`}
              currentValueText={`${metrics.currentPercent}%`}
              prevPercent={metrics.prevPercent}
              currentPercent={metrics.currentPercent}
              deltaText={`${formatSigned(metrics.percentDelta)}%`}
            />

            <div className="grid gap-3 md:grid-cols-2">
              <BarRow
                label="5教科（平均）"
                prevValueText={`${metrics.prevCoreAvg.toFixed(1)}/5`}
                currentValueText={`${metrics.currentCoreAvg.toFixed(1)}/5`}
                prevPercent={(metrics.prevCoreAvg / 5) * 100}
                currentPercent={(metrics.currentCoreAvg / 5) * 100}
                deltaText={formatSigned(metrics.coreAvgDelta, 1)}
              />
              <BarRow
                label="実技4教科（平均）"
                prevValueText={`${metrics.prevPracticalAvg.toFixed(1)}/5`}
                currentValueText={`${metrics.currentPracticalAvg.toFixed(1)}/5`}
                prevPercent={(metrics.prevPracticalAvg / 5) * 100}
                currentPercent={(metrics.currentPracticalAvg / 5) * 100}
                deltaText={formatSigned(metrics.practicalAvgDelta, 1)}
              />
            </div>

            {feedback.length ? (
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                <div className="text-xs font-bold text-slate-700">フィードバック</div>
                <div className="mt-2 space-y-1">
                  {feedback.map((line, i) => (
                    <div key={i} className={cn('text-sm leading-relaxed text-slate-700')}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </Card>
  );
}

function previousPercent(entry: SavedHistoryEntry) {
  const max = MODE_CONFIG[entry.mode].max;
  if (max <= 0) return 0;

  const weights = MODE_CONFIG[entry.mode].weights;
  const total = SUBJECTS.reduce((sum, subject) => {
    const raw = entry.scores[subject.key];
    const safe = Math.min(5, Math.max(1, Math.round(raw)));
    const weight = subject.category === 'core' ? weights.core : weights.practical;
    return sum + safe * weight;
  }, 0);

  return Math.floor((total / max) * 100);
}
