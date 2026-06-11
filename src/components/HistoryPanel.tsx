'use client';

import * as React from 'react';
import Link from 'next/link';
import { History, Trash2, Clock, ChevronDown, ChevronUp, LineChart, ArrowRight } from 'lucide-react';

import { readHistory, clearHistory } from '@/lib/persistence';
import { DEFAULT_PREFECTURE_CODE } from '@/lib/prefectures';
import { calculateTotalScore, calculateMaxScore, calculatePercent } from '@/lib/utils';
import type { SavedHistoryEntry } from '@/lib/types';

interface HistoryPanelProps {
  onLoadEntry?: (entry: SavedHistoryEntry) => void;
}

export function HistoryPanel({ onLoadEntry }: HistoryPanelProps) {
  const [history, setHistory] = React.useState<SavedHistoryEntry[]>([]);
  const [isExpanded, setIsExpanded] = React.useState(false);

  React.useEffect(() => {
    setHistory(readHistory());
  }, []);

  const handleClearHistory = () => {
    if (confirm('履歴をすべて削除しますか？')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleLoadEntry = (entry: SavedHistoryEntry) => {
    onLoadEntry?.(entry);
  };

  // 達成率の推移（県が混在しても比較できるよう % で時系列化。古い→新しい）
  const series = React.useMemo(() => {
    return history
      .slice(0, 12)
      .reverse()
      .map((e) => {
        const code = e.prefectureCode ?? DEFAULT_PREFECTURE_CODE;
        const total = calculateTotalScore(e.scores, code);
        const max = calculateMaxScore(code);
        return calculatePercent(total, max);
      });
  }, [history]);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 shadow-sm">
            <History className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-slate-800">計算履歴</div>
            <div className="text-xs text-slate-500">{history.length}件の記録</div>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-slate-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-slate-100 px-5 py-4">
          {series.length >= 2 && (
            <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">達成率の推移</span>
                <span className="text-xs font-bold text-blue-600">最新 {series[series.length - 1]}%</span>
              </div>
              <Sparkline values={series} />
            </div>
          )}

          {/* 製品ループ：保存→ダッシュボードで中1→中3の推移を継続トラッキング */}
          <Link
            href="/dashboard"
            className="mb-4 flex items-center justify-between gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100"
          >
            <span className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              ダッシュボードで推移グラフを見る
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="space-y-2">
            {history.slice(0, 10).map((entry) => {
              const prefCode = entry.prefectureCode ?? DEFAULT_PREFECTURE_CODE;
              const total = calculateTotalScore(entry.scores, prefCode);
              const max = calculateMaxScore(prefCode);
              const percent = calculatePercent(total, max);
              const date = new Date(entry.savedAt);

              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => handleLoadEntry(entry)}
                  className="w-full rounded-xl border border-slate-100 bg-slate-50 p-3 text-left transition-colors hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold text-slate-800">
                        {total}<span className="text-sm text-slate-400">/{max}</span>
                      </div>
                      <div className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        {Math.round(percent)}%
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">{prefCode}</div>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-500">
                      {date.toLocaleDateString('ja-JP')} {date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {entry.memo && (
                      <span className="truncate text-xs text-slate-600">• {entry.memo}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {history.length > 10 && (
            <div className="mt-3 text-center text-xs text-slate-400">
              他{history.length - 10}件の履歴があります
            </div>
          )}

          <button
            type="button"
            onClick={handleClearHistory}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            履歴をクリア
          </button>
        </div>
      )}
    </div>
  );
}

/** 達成率の推移を見せる軽量な自前SVGスパークライン（recharts非依存・§12）。 */
function Sparkline({ values }: { values: number[] }) {
  const W = 280;
  const H = 56;
  const P = 6;
  const n = values.length;
  const x = (i: number) => P + (i * (W - 2 * P)) / (n - 1);
  const y = (v: number) => H - P - (Math.min(100, Math.max(0, v)) / 100) * (H - 2 * P);
  const line = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${P},${H - P} ${line} ${W - P},${H - P}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="達成率の推移グラフ">
      <defs>
        <linearGradient id="sparkArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#sparkArea)" />
      <polyline points={line} fill="none" stroke="#3b82f6" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={2.5} fill="#3b82f6">
          <title>{`${v}%`}</title>
        </circle>
      ))}
    </svg>
  );
}
