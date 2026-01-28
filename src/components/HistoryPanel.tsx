'use client';

import * as React from 'react';
import { History, Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';

import { readHistory, clearHistory } from '@/lib/persistence';
import { calculateTotalScore, calculateMaxScore, calculatePercent } from '@/lib/utils';
import { MODE_CONFIG } from '@/lib/constants';
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
          <div className="space-y-2">
            {history.slice(0, 10).map((entry) => {
              const total = calculateTotalScore(entry.scores, entry.mode);
              const max = calculateMaxScore(entry.mode);
              const percent = calculatePercent(total, max);
              const modeLabel = MODE_CONFIG[entry.mode].label;
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
                    <div className="text-xs text-slate-400">{modeLabel}</div>
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
