'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from '@/components/icons';

import { readHistory } from '@/lib/persistence';
import { DEFAULT_PREFECTURE_CODE } from '@/lib/prefectures';
import { calculateTotalScore, calculateMaxScore, calculatePercent } from '@/lib/utils';
import type { SavedHistoryEntry } from '@/lib/types';

interface ScoreProgressChartProps {
  currentTotal: number;
  currentMax: number;
  currentPrefecture: string;
}

interface ChartDataPoint {
  date: string;
  dateLabel: string;
  total: number;
  max: number;
  percent: number;
  memo?: string;
}

export function ScoreProgressChart({ currentTotal, currentMax, currentPrefecture }: ScoreProgressChartProps) {
  const [history, setHistory] = React.useState<SavedHistoryEntry[]>([]);
  const [expanded, setExpanded] = React.useState(true);

  React.useEffect(() => {
    const entries = readHistory();
    setHistory(entries);
  }, [currentTotal, currentMax, currentPrefecture]);

  // Convert history to chart data points
  const chartData: ChartDataPoint[] = React.useMemo(() => {
    const points: ChartDataPoint[] = history
      .slice(0, 10) // Last 10 entries
      .reverse() // Oldest first
      .map((entry) => {
        const prefCode = entry.prefectureCode ?? DEFAULT_PREFECTURE_CODE;
        const total = calculateTotalScore(entry.scores, prefCode);
        const max = calculateMaxScore(prefCode);
        const percent = calculatePercent(total, max);
        const date = new Date(entry.savedAt);
        return {
          date: entry.savedAt,
          dateLabel: `${date.getMonth() + 1}/${date.getDate()}`,
          total,
          max,
          percent,
          memo: entry.memo,
        };
      });

    // Append current session snapshot (latest state) to reflect immediately without reload
    points.push({
      date: 'current',
      dateLabel: '今回',
      total: currentTotal,
      max: currentMax,
      percent: calculatePercent(currentTotal, currentMax),
    });

    return points;
  }, [history, currentTotal, currentMax]);

  // Calculate trend
  const trend = React.useMemo(() => {
    if (chartData.length < 2) return { direction: 'neutral' as const, change: 0 };
    const first = chartData[0].percent;
    const last = chartData[chartData.length - 1].percent;
    const change = last - first;
    if (change > 2) return { direction: 'up' as const, change };
    if (change < -2) return { direction: 'down' as const, change };
    return { direction: 'neutral' as const, change };
  }, [chartData]);

  // Calculate chart dimensions - fixed aspect ratio
  const chartWidth = 100;
  const chartHeight = 50;
  const padding = { top: 8, right: 8, bottom: 12, left: 16 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Calculate min/max for y-axis
  const yMin = Math.max(0, Math.min(...chartData.map(d => d.percent), calculatePercent(currentTotal, currentMax)) - 10);
  const yMax = Math.min(100, Math.max(...chartData.map(d => d.percent), calculatePercent(currentTotal, currentMax)) + 10);

  // Generate SVG path (直線バージョン：確実に点を通ります)
  const generatePath = React.useCallback(() => {
    if (chartData.length === 0) return '';

    const points = chartData.map((d, i) => {
      const x = padding.left + (i / Math.max(chartData.length - 1, 1)) * innerWidth;
      const y = padding.top + innerHeight - ((d.percent - yMin) / (yMax - yMin)) * innerHeight;
      return { x, y };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  }, [chartData, innerWidth, innerHeight, padding, yMin, yMax]);

  // Generate area fill path (直線版)
  const generateAreaPath = React.useCallback(() => {
    if (chartData.length === 0) return '';

    const linePath = generatePath();
    const lastX = padding.left + innerWidth;
    const firstX = padding.left;
    const bottomY = padding.top + innerHeight;

    return `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
  }, [chartData, generatePath, innerWidth, innerHeight, padding]);

  if (chartData.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="text-[17px] font-bold text-slate-900">成績推移グラフ</h3>
        <p className="mt-1 text-sm text-slate-600">記録が増えると推移を確認できます</p>
        <div className="mt-4 border-t border-slate-200 pt-4 text-center">
          <p className="text-sm text-slate-900">まだ十分なデータがありません</p>
          <p className="mt-1 text-sm text-slate-600">
            2回以上保存すると成績の推移グラフが表示されます
          </p>
          <p className="mt-1 text-sm text-slate-600">
            反映されない場合はページを更新してください
          </p>
        </div>
      </div>
    );
  }

  const TrendIcon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus;
  const trendColor = trend.direction === 'up' ? 'text-brand-700' : trend.direction === 'down' ? 'text-amber-900' : 'text-slate-700';
  const trendBg = trend.direction === 'up' ? 'border-brand-200 bg-brand-50' : trend.direction === 'down' ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white';

  // 目盛り線（表示範囲に入るものだけ）
  const gridLines = [0, 25, 50, 75, 100]
    .map((pct) => ({
      pct,
      y: padding.top + innerHeight - ((pct - yMin) / (yMax - yMin)) * innerHeight,
    }))
    .filter(({ y }) => !(y < padding.top - 2 || y > padding.top + innerHeight + 2));

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900">成績推移グラフ</h3>
          <p className="mt-1 text-sm text-slate-600">過去{chartData.length}回分の記録</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-sm font-bold tabular-nums ${trendBg} ${trendColor}`}>
            <TrendIcon className="h-4 w-4" />
            {trend.direction === 'up' && `+${trend.change.toFixed(1)}%`}
            {trend.direction === 'down' && `${trend.change.toFixed(1)}%`}
            {trend.direction === 'neutral' && '安定'}
          </div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="inline-flex min-h-11 items-center gap-1.5 rounded border border-brand-700 bg-white px-4 py-2 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            {expanded ? '閉じる' : '見る'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-5">
          {/* Chart（目盛りの文字とデータ点は HTML で重ねる。SVG 内の文字は拡大縮小されて 12px 未満になるため）。
              数値は下の「記録履歴」にもあるので、読み上げからは外す。 */}
          <div className="relative mb-4" aria-hidden="true">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="block w-full"
              style={{ aspectRatio: '2 / 1' }}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid lines */}
              {gridLines.map(({ pct, y }) => (
                <line
                  key={pct}
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke="#cddad3"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {/* Area fill（単色・薄く） */}
              <path d={generateAreaPath()} fill="#17543e" fillOpacity="0.08" />

              {/* Line */}
              <path
                d={generatePath()}
                fill="none"
                stroke="#17543e"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />

              {/* Y-axis line */}
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={padding.top + innerHeight}
                stroke="#4f6158"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {/* X-axis line */}
              <line
                x1={padding.left}
                y1={padding.top + innerHeight}
                x2={padding.left + innerWidth}
                y2={padding.top + innerHeight}
                stroke="#4f6158"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            {/* Y-axis labels */}
            {gridLines.map(({ pct, y }) => (
              <span
                key={pct}
                className="absolute -translate-y-1/2 text-xs tabular-nums text-slate-600"
                style={{ top: `${(y / chartHeight) * 100}%`, right: `${100 - (padding.left - 2)}%` }}
              >
                {pct}%
              </span>
            ))}

            {/* Data points */}
            {chartData.map((d, i) => {
              const x = padding.left + (i / Math.max(chartData.length - 1, 1)) * innerWidth;
              const y = padding.top + innerHeight - ((d.percent - yMin) / (yMax - yMin)) * innerHeight;
              return (
                <span
                  key={i}
                  className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-700 bg-white"
                  style={{ left: `${(x / chartWidth) * 100}%`, top: `${(y / chartHeight) * 100}%` }}
                />
              );
            })}

            {/* X-axis labels */}
            {chartData.map((d, i) => {
              const x = padding.left + (i / Math.max(chartData.length - 1, 1)) * innerWidth;
              // Only show some labels if too many points（最後の1つ手前は、最後と近すぎて重なるので省く）
              if (chartData.length > 6 && i !== chartData.length - 1 && (i % 2 !== 0 || i === chartData.length - 2)) return null;
              return (
                <span
                  key={i}
                  className="absolute -translate-x-1/2 whitespace-nowrap text-xs tabular-nums text-slate-600"
                  style={{
                    left: `${(x / chartWidth) * 100}%`,
                    top: `calc(${((padding.top + innerHeight) / chartHeight) * 100}% + 6px)`,
                  }}
                >
                  {d.dateLabel}
                </span>
              );
            })}
          </div>

          {/* Stats */}
          <dl className="grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200">
            <div className="px-3 py-3 text-center">
              <dt className="text-xs text-slate-600">初回</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{chartData[0]?.percent.toFixed(0)}%</dd>
              <dd className="text-xs tabular-nums text-slate-600">{chartData[0]?.total}/{chartData[0]?.max}点</dd>
            </div>
            <div className="px-3 py-3 text-center">
              <dt className="text-xs text-slate-600">最新</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-brand-700">
                {chartData[chartData.length - 1]?.percent.toFixed(0)}%
              </dd>
              <dd className="text-xs tabular-nums text-slate-600">
                {chartData[chartData.length - 1]?.total}/{chartData[chartData.length - 1]?.max}点
              </dd>
            </div>
            <div className="px-3 py-3 text-center">
              <dt className="text-xs text-slate-600">変化</dt>
              <dd className={`mt-1 text-2xl font-bold tabular-nums ${trendColor}`}>
                {trend.change >= 0 ? '+' : ''}{trend.change.toFixed(1)}%
              </dd>
              <dd className="text-xs text-slate-600">
                {trend.direction === 'up' ? '上昇' : trend.direction === 'down' ? '要注意' : '安定'}
              </dd>
            </div>
          </dl>

          {/* History list */}
          <div className="mt-5">
            <h4 className="mb-2 text-sm font-bold text-slate-900">記録履歴</h4>
            <ul className="max-h-48 divide-y divide-slate-200 overflow-y-auto border-y border-slate-200">
              {chartData.slice().reverse().map((d, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-sm text-slate-600">
                      {d.date === 'current'
                        ? '今回'
                        : new Date(d.date).toLocaleDateString('ja-JP', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                    </span>
                    {d.memo && (
                      <span className="max-w-[100px] truncate text-sm text-slate-600">
                        ({d.memo})
                      </span>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-2 tabular-nums">
                    <span className="text-sm font-bold text-slate-900">{d.total}点</span>
                    <span className="text-sm text-slate-600">({d.percent.toFixed(0)}%)</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Message */}
          <p className="mt-5 rounded-lg border border-slate-200 bg-brand-50 p-4 text-sm leading-relaxed text-slate-900">
            {trend.direction === 'up' && '着実に上昇しています。この調子で続けましょう。'}
            {trend.direction === 'down' && '一時的な下降は成長の一部です。続けて取り組みましょう。'}
            {trend.direction === 'neutral' && '安定した成績を保っています。'}
          </p>
        </div>
      )}
    </div>
  );
}
