'use client';

import * as React from 'react';
import { Calculator, RotateCcw, Plus, Trash2 } from 'lucide-react';

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
    <div className="rounded-2xl border-2 border-emerald-200 bg-white shadow-lg overflow-hidden">
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Calculator className="h-5 w-5 text-emerald-600" />
            教科を選んで科目・評定を入力
          </h2>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            リセット
          </button>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs font-bold text-slate-600">教科</label>
          <select
            value={kyoka}
            onChange={(e) => setKyoka(e.target.value)}
            aria-label="教科"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:w-64"
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
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="grid grid-cols-1 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
              <input
                type="text"
                value={row.kamoku}
                onChange={(e) => updateRow(row.id, { kamoku: e.target.value })}
                placeholder="科目名（例: 物理基礎）"
                className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                aria-label="科目名"
              />
              <div className="flex gap-1 justify-center">
                {RATING_OPTIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => updateRow(row.id, { hyotei: r })}
                    className={`h-9 w-9 rounded-lg text-sm font-bold transition-all ${
                      row.hyotei === r
                        ? 'bg-emerald-600 text-white shadow-md scale-110'
                        : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-emerald-50'
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
                className="justify-self-end rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 sm:justify-self-center"
                aria-label="この科目を削除"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRow}
          className="mt-3 inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
        >
          <Plus className="h-3.5 w-3.5" />
          科目を追加
        </button>
      </div>

      {result !== null && result !== undefined && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-6 border-t-2 border-emerald-200 text-center" role="status" aria-live="polite">
          <div className="text-xs font-bold text-slate-600 mb-1">{kyoka}の学習成績の状況</div>
          <div className="text-5xl font-black text-emerald-700">{result.toFixed(1)}</div>
          <div className="text-xs text-slate-500 mt-1">/ 5.0</div>
        </div>
      )}
    </div>
  );
}
