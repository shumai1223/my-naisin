'use client';

import * as React from 'react';

import { SUBJECTS } from '@/lib/constants';
import { DEFAULT_PREFECTURE_CODE } from '@/lib/prefectures';
import { readHistory } from '@/lib/persistence';
import type { ResultData, SavedHistoryEntry, Scores, SubjectKey } from '@/lib/types';
import { cn, calculateTotalScore, calculateMaxScore, calculatePercent } from '@/lib/utils';

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
    <div className="py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-slate-900">{props.label}</div>
          <div className="mt-0.5 text-sm tabular-nums text-slate-600">
            前回 {props.prevValueText} → 今回 {props.currentValueText}
          </div>
        </div>
        {props.deltaText ? (
          <div className="inline-flex shrink-0 items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-sm font-bold tabular-nums text-slate-900">
            {props.deltaText}
          </div>
        ) : null}
      </div>

      <div className="mt-3">
        <div className="relative h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-slate-600/40"
            style={{ width: `${Math.max(0, Math.min(100, props.prevPercent))}%` }}
          />
          <div
            className="relative h-full rounded-full bg-brand-700"
            style={{ width: `${Math.max(0, Math.min(100, props.currentPercent))}%` }}
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

    const sameAsCurrent = (first.prefectureCode ?? DEFAULT_PREFECTURE_CODE) === result.prefectureCode && scoresEqual(first.scores, scores);
    if (sameAsCurrent) return history[1] ?? null;
    return first;
  }, [history, result.prefectureCode, scores]);

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

    const prevPrefCode = previous.prefectureCode ?? DEFAULT_PREFECTURE_CODE;
    if (prevPrefCode !== result.prefectureCode) {
      lines.push(`前回は「${prevPrefCode}」での記録です（比較は平均/達成率ベース）`);
    }

    if (metrics.percentDelta > 0) {
      lines.push(`前回より達成率が ${Math.abs(Math.round(metrics.percentDelta))}% 上がっています`);
    } else if (metrics.percentDelta === 0) {
      lines.push('前回と同じ達成率です');
    } else {
      lines.push(`前回より達成率が ${Math.abs(Math.round(metrics.percentDelta))}% 下がっています`);
    }

    if (metrics.practicalSumDelta > 0) {
      lines.push(`実技4教科の評定が合計で ${metrics.practicalSumDelta} 点上がっています`);
    } else if (metrics.coreSumDelta > 0) {
      lines.push(`5教科の評定が合計で ${metrics.coreSumDelta} 点上がっています`);
    }

    const best = SUBJECTS.map((s) => ({
      label: s.label,
      delta: scores[s.key] - previous.scores[s.key]
    }))
      .filter((d) => d.delta > 0)
      .sort((a, b) => b.delta - a.delta)[0];

    if (best) {
      lines.push(`最も上がった教科は「${best.label}」（${best.delta} 点）です`);
    }

    return lines.slice(0, 3);
  }, [metrics, previous, result.prefectureCode, scores]);

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <div className="text-base font-bold text-slate-900">前回との比較</div>

        {previous ? (
          <div className="text-sm text-slate-600">
            前回：{new Date(previous.savedAt).toLocaleDateString('ja-JP')}
            {previous.memo ? <span className="ml-2">「{previous.memo}」</span> : null}
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        {!previous || !metrics ? (
          <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
            <div className="text-sm font-bold text-slate-900">まだ比較できるデータがありません</div>
            <div className="mt-1 text-sm leading-relaxed text-slate-700">
              {saveEnabled
                ? '保存をONにした状態で結果を出すと、次回からここに伸びが表示されます。'
                : '「記録を保存」をONにすると、次回から前回比較ができます。'}
            </div>
          </div>
        ) : (
          <div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              <BarRow
                label="達成率"
                prevValueText={`${metrics.prevPercent}%`}
                currentValueText={`${metrics.currentPercent}%`}
                prevPercent={metrics.prevPercent}
                currentPercent={metrics.currentPercent}
                deltaText={`${formatSigned(metrics.percentDelta)}%`}
              />
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
              <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4">
                <div className="text-sm font-bold text-slate-900">フィードバック</div>
                <div className="mt-2 space-y-1">
                  {feedback.map((line, i) => (
                    <div key={i} className={cn('text-sm leading-relaxed text-slate-900')}>
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
  const prefCode = entry.prefectureCode ?? DEFAULT_PREFECTURE_CODE;
  const total = calculateTotalScore(entry.scores, prefCode);
  const max = calculateMaxScore(prefCode);
  return calculatePercent(total, max);
}
