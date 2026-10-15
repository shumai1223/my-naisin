'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Calendar, ChevronDown, ChevronUp, History } from '@/components/icons';

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
      dateLabel: 'Now',
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="rounded-lg border border-slate-200 bg-white overflow-hidden"
      >
        <div className="bg-brand-500 p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-white">
              <History className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">📈 成績推移グラフ</h3>
              <p className="text-sm text-white/80">記録を続けると成長が見える！</p>
            </div>
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-slate-100">
            <TrendingUp className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-sm text-slate-600">まだ十分なデータがありません</p>
          <p className="mt-1 text-xs text-slate-400">
            2回以上保存すると成績の推移グラフが表示されます
          </p>
          <p className="mt-1 text-xs text-slate-400">
            反映されない場合はページを更新してください
          </p>
        </div>
      </motion.div>
    );
  }

  const TrendIcon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus;
  const trendColor = trend.direction === 'up' ? 'text-brand-500' : trend.direction === 'down' ? 'text-red-500' : 'text-slate-400';
  const trendBg = trend.direction === 'up' ? 'bg-brand-50' : trend.direction === 'down' ? 'bg-red-50' : 'bg-slate-50';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-lg border border-slate-200 bg-white overflow-hidden"
    >
      {/* Header */}
      <div className="w-full bg-brand-500 p-5 text-white">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-white">
              <History className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">📈 成績推移グラフ</h3>
              <p className="text-sm text-white/80">過去{chartData.length}回分の記録</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`rounded-full px-3 py-1 ${trendBg}`}>
              <div className={`flex items-center gap-1 text-sm font-bold ${trendColor}`}>
                <TrendIcon className="h-4 w-4" />
                {trend.direction === 'up' && `+${trend.change.toFixed(1)}%`}
                {trend.direction === 'down' && `${trend.change.toFixed(1)}%`}
                {trend.direction === 'neutral' && '安定'}
              </div>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-brand-700 transition"
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
      </div>

      {expanded && (
        <div className="p-5">
          {/* Chart */}
          <div className="relative mb-4">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full"
              style={{ aspectRatio: '2 / 1' }}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid lines with Y-axis labels */}
              {[0, 25, 50, 75, 100].map((pct) => {
                const y = padding.top + innerHeight - ((pct - yMin) / (yMax - yMin)) * innerHeight;
                if (y < padding.top - 2 || y > padding.top + innerHeight + 2) return null;
                return (
                  <g key={pct}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={padding.left + innerWidth}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth="0.2"
                      strokeDasharray="1,1"
                    />
                    <text
                      x={padding.left - 2}
                      y={y + 1}
                      textAnchor="end"
                      className="fill-slate-400"
                      style={{ fontSize: '2.5px' }}
                    >
                      {pct}%
                    </text>
                  </g>
                );
              })}

              {/* Area fill - ふわっと表示 */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <motion.path
                d={generateAreaPath()}
                fill="url(#areaGradient)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />

              {/* Line - 左から右へ描くアニメーション */}
              <motion.path
                d={generatePath()}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.5 }}
              />
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Data points - 左から順に表示 */}
              {chartData.map((d, i) => {
                const x = padding.left + (i / Math.max(chartData.length - 1, 1)) * innerWidth;
                const y = padding.top + innerHeight - ((d.percent - yMin) / (yMax - yMin)) * innerHeight;
                return (
                  <motion.g
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r="1.5"
                      fill="white"
                      stroke="#14b8a6"
                      strokeWidth="0.6"
                    />
                  </motion.g>
                );
              })}

              {/* X-axis labels */}
              {chartData.map((d, i) => {
                const x = padding.left + (i / Math.max(chartData.length - 1, 1)) * innerWidth;
                // Only show some labels if too many points
                if (chartData.length > 6 && i % 2 !== 0 && i !== chartData.length - 1) return null;
                return (
                  <text
                    key={i}
                    x={x}
                    y={chartHeight - 1}
                    textAnchor="middle"
                    className="fill-slate-400"
                    style={{ fontSize: '2.5px' }}
                  >
                    {d.dateLabel}
                  </text>
                );
              })}

              {/* Y-axis line */}
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={padding.top + innerHeight}
                stroke="#cbd5e1"
                strokeWidth="0.3"
              />
              {/* X-axis line */}
              <line
                x1={padding.left}
                y1={padding.top + innerHeight}
                x2={padding.left + innerWidth}
                y2={padding.top + innerHeight}
                stroke="#cbd5e1"
                strokeWidth="0.3"
              />
            </svg>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-slate-50 p-3 text-center">
              <div className="text-xs text-slate-500">初回</div>
              <div className="mt-1 text-lg font-bold text-slate-700">{chartData[0]?.percent.toFixed(0)}%</div>
              <div className="text-xs text-slate-400">{chartData[0]?.total}/{chartData[0]?.max}点</div>
            </div>
            <div className="rounded-lg bg-brand-50 p-3 text-center border border-brand-200">
              <div className="text-xs text-brand-600">最新</div>
              <div className="mt-1 text-lg font-bold text-brand-700">
                {chartData[chartData.length - 1]?.percent.toFixed(0)}%
              </div>
              <div className="text-xs text-brand-500">
                {chartData[chartData.length - 1]?.total}/{chartData[chartData.length - 1]?.max}点
              </div>
            </div>
            <div className={`rounded-lg p-3 text-center ${trendBg}`}>
              <div className="text-xs text-slate-500">変化</div>
              <div className={`mt-1 text-lg font-bold ${trendColor}`}>
                {trend.change >= 0 ? '+' : ''}{trend.change.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-400">
                {trend.direction === 'up' ? '成長中！' : trend.direction === 'down' ? '要注意' : '安定'}
              </div>
            </div>
          </div>

          {/* History list */}
          <div className="mt-4">
            <div className="text-xs font-bold text-slate-600 mb-2">📋 記録履歴</div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {chartData.slice().reverse().map((d, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs text-slate-600">
                      {new Date(d.date).toLocaleDateString('ja-JP', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {d.memo && (
                      <span className="text-xs text-slate-400 truncate max-w-[100px]">
                        ({d.memo})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">{d.total}点</span>
                    <span className="text-xs text-slate-400">({d.percent.toFixed(0)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivation message */}
          <div className="mt-4 rounded-lg bg-brand-50 p-3 border border-brand-200">
            <p className="text-xs text-brand-700 text-center">
              {trend.direction === 'up' && '🎉 着実に成長しています！この調子で頑張ろう！'}
              {trend.direction === 'down' && '💪 一時的な下降は成長の一部。諦めずに続けよう！'}
              {trend.direction === 'neutral' && '📊 安定した成績をキープ中。さらなる高みを目指そう！'}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
