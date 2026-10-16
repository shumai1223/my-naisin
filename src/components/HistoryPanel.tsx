'use client';

import * as React from 'react';
import Link from 'next/link';
import { Trash2, ChevronDown, ChevronUp, ArrowRight } from '@/components/icons';

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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="flex min-h-11 w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-brand-50"
      >
        <div>
          <div className="text-base font-bold text-slate-900">計算履歴</div>
          <div className="text-sm text-slate-600">{history.length}件の記録</div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-slate-600" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-slate-600" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-slate-200 px-5 py-4">
          {series.length >= 2 && (
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">達成率の推移</span>
                <span className="text-sm font-bold tabular-nums text-brand-700">最新 {series[series.length - 1]}%</span>
              </div>
              <Sparkline values={series} />
            </div>
          )}

          {/* 製品ループ：保存→ダッシュボードで中1→中3の推移を継続トラッキング */}
          <Link
            href="/dashboard"
            className="mb-4 flex min-h-11 items-center justify-between gap-2 rounded border border-brand-700 bg-white px-4 py-2 text-sm font-bold text-brand-700 hover:bg-brand-50"
          >
            ダッシュボードで推移グラフを見る
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
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left hover:border-brand-700 hover:bg-brand-50"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold tabular-nums text-slate-900">
                        {total}<span className="text-sm font-normal text-slate-600">/{max}</span>
                      </div>
                      <div className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs tabular-nums text-slate-700">
                        {Math.round(percent)}%
                      </div>
                    </div>
                    <div className="text-xs text-slate-600">{prefCode}</div>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm tabular-nums text-slate-600">
                      {date.toLocaleDateString('ja-JP')} {date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {entry.memo && (
                      <span className="truncate text-sm text-slate-600">• {entry.memo}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {history.length > 10 && (
            <div className="mt-3 text-center text-sm text-slate-600">
              他{history.length - 10}件の履歴があります
            </div>
          )}

          <button
            type="button"
            onClick={handleClearHistory}
            className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-800 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            履歴をクリア
          </button>
        </div>
      )}
    </div>
  );
}

/** 達成率の推移を見せる軽量な自前SVGスパークライン（recharts非依存・§12）。単色（深緑）で描く。 */
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
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-auto w-full max-w-xl text-brand-700"
      role="img"
      aria-label="達成率の推移グラフ"
    >
      <polygon points={area} fill="currentColor" fillOpacity={0.1} />
      <polyline points={line} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={2.5} fill="currentColor">
          <title>{`${v}%`}</title>
        </circle>
      ))}
    </svg>
  );
}
