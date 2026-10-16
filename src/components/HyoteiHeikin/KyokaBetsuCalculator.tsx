'use client';

import * as React from 'react';
import { RotateCcw, Plus, Trash2 } from '@/components/icons';

import { track, funnel } from '@/lib/track';
import { calcKyokaStatus, type Kamoku } from '@/lib/gakushu-seiseki';

const KYOKA_LIST = [
  '国語',
  '地理歴史',
  '公民',
  '数学',
  '理科',
  '保健体育',
  '芸術',
  '外国語',
  '家庭',
  '情報',
  'その他',
] as const;

const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;

interface Row {
  id: string;
  kamoku: string;
  hyotei: 1 | 2 | 3 | 4 | 5;
}

let rowIdCounter = 0;
function nextRowId(): string {
  rowIdCounter += 1;
  return `kyoka-row-${rowIdCounter}`;
}

function emptyRow(): Row {
  return { id: nextRowId(), kamoku: '', hyotei: 3 };
}

export function KyokaBetsuCalculator() {
  const [kyoka, setKyoka] = React.useState<string>(KYOKA_LIST[0]);
  const [rows, setRows] = React.useState<Row[]>(() => [emptyRow(), emptyRow()]);
  const viewedRef = React.useRef(false);
  const startedRef = React.useRef(false);

  const updateRow = (id: string, patch: Partial<Row>) => {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ tool: 'kyoka-betsu', placement: 'gakushu-seiseki-kyoka-betsu' });
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));
  const reset = () => setRows([emptyRow(), emptyRow()]);

  const validRows = rows.filter((r) => r.kamoku.trim() !== '');
  const kamokuList: Kamoku[] = validRows.map((r) => ({
    kyoka,
    kamoku: r.kamoku,
    gakunen: 1,
    hyotei: r.hyotei,
  }));
  const result = validRows.length > 0 ? calcKyokaStatus(kamokuList)[kyoka] : null;

  React.useEffect(() => {
    if (result !== null && result !== undefined && !viewedRef.current) {
      viewedRef.current = true;
      funnel.calcComplete({ tool: 'kyoka-betsu', placement: 'gakushu-seiseki-kyoka-betsu' }, { kyoka, value: result });
      track('result_view', { source: 'kyoka-betsu' });
    }
  }, [result, kyoka]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">教科を選んで科目・評定を入力</h2>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" />
            リセット
          </button>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-sm font-bold text-slate-900">教科</label>
          <select
            value={kyoka}
            onChange={(e) => setKyoka(e.target.value)}
            aria-label="教科"
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700 sm:w-64"
          >
            {KYOKA_LIST.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-6">
        <div className="divide-y divide-slate-200">
          {rows.map((row) => (
            <div key={row.id} className="grid grid-cols-1 gap-2 py-3 first:pt-0 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <input
                type="text"
                value={row.kamoku}
                onChange={(e) => updateRow(row.id, { kamoku: e.target.value })}
                placeholder="科目名（例: 物理基礎）"
                className="h-11 rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
                aria-label="科目名"
              />
              <div className="flex justify-center gap-1.5">
                {RATING_OPTIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={row.hyotei === r}
                    onClick={() => updateRow(row.id, { hyotei: r })}
                    className={`h-11 w-11 rounded border text-base font-bold tabular-nums transition-colors ${
                      row.hyotei === r
                        ? 'border-brand-700 bg-brand-700 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-brand-50'
                    }`}
                    aria-label={`評定${r}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                className="inline-flex items-center justify-center justify-self-end rounded p-3 text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700 sm:justify-self-center"
                aria-label="この科目を削除"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRow}
          className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
        >
          <Plus className="h-4 w-4" />
          科目を追加
        </button>
      </div>

      {result !== null && result !== undefined && (
        <div className="border-t border-slate-200 bg-brand-50 px-6 py-6 text-center" role="status" aria-live="polite">
          <div className="mb-1 text-sm font-bold text-slate-600">{kyoka}の学習成績の状況</div>
          <div className="text-5xl font-bold tabular-nums text-brand-700">{result.toFixed(1)}</div>
          <div className="mt-1 text-sm text-slate-600">/ 5.0</div>
        </div>
      )}
    </div>
  );
}
