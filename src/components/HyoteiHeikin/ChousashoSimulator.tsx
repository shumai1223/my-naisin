'use client';

import * as React from 'react';
import { NotebookPen, Plus, Trash2, RotateCcw } from 'lucide-react';

import { track, funnel } from '@/lib/track';
import { calcKyokaStatus, calcOverallStatus, toGaihyou, type Kamoku } from '@/lib/gakushu-seiseki';

// 出典: 文部科学省「調査書記入上の注意事項等について」別紙様式１（[[T-C4-gakushu-seiseki-engine]]）。
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

const GAKUNEN_LIST = [1, 2, 3, 4] as const;
const RATING_OPTIONS = [1, 2, 3, 4, 5] as const;

interface Row extends Kamoku {
  id: string;
}

let rowIdCounter = 0;
function nextRowId(): string {
  rowIdCounter += 1;
  return `chousasho-row-${rowIdCounter}`;
}

function emptyRow(): Row {
  return { id: nextRowId(), kyoka: KYOKA_LIST[0], kamoku: '', gakunen: 1, hyotei: 3 };
}

const GAIHYOU_STYLE: Record<string, string> = {
  A: 'text-red-700',
  B: 'text-orange-700',
  C: 'text-amber-700',
  D: 'text-blue-700',
  E: 'text-slate-600',
};

/** 「２．各教科・科目等の学習の記録」の表と同じ形（科目ごとに学年別の評定を横に並べる）へ変換する。 */
interface PivotRow {
  key: string;
  kyoka: string;
  kamoku: string;
  byGakunen: Partial<Record<1 | 2 | 3 | 4, number>>;
}

function pivotByKamoku(kamoku: Kamoku[]): PivotRow[] {
  const map = new Map<string, PivotRow>();
  for (const k of kamoku) {
    const key = `${k.kyoka}__${k.kamoku}`;
    const existing = map.get(key);
    if (existing) {
      existing.byGakunen[k.gakunen] = k.hyotei;
    } else {
      map.set(key, { key, kyoka: k.kyoka, kamoku: k.kamoku, byGakunen: { [k.gakunen]: k.hyotei } });
    }
  }
  return Array.from(map.values());
}

export function ChousashoSimulator() {
  const [rows, setRows] = React.useState<Row[]>(() => [emptyRow(), emptyRow(), emptyRow()]);
  const viewedRef = React.useRef(false);
  const startedRef = React.useRef(false);

  const updateRow = (id: string, patch: Partial<Kamoku>) => {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ tool: 'chousasho-simulator', placement: 'gakushu-seiseki-chousasho' });
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));
  const reset = () => setRows([emptyRow(), emptyRow(), emptyRow()]);

  const validRows = rows.filter((r) => r.kamoku.trim() !== '');
  const kamokuList: Kamoku[] = validRows.map(({ id, ...k }) => k);
  const pivotRows = pivotByKamoku(kamokuList);
  const kyokaStatus = calcKyokaStatus(kamokuList);
  const overall = validRows.length > 0 ? calcOverallStatus(kamokuList) : null;
  const gaihyou = overall !== null ? toGaihyou(overall) : null;

  React.useEffect(() => {
    if (overall !== null && !viewedRef.current) {
      viewedRef.current = true;
      funnel.calcComplete({ tool: 'chousasho-simulator', placement: 'gakushu-seiseki-chousasho' }, { overall });
      track('result_view', { source: 'chousasho-simulator' });
    }
  }, [overall]);

  return (
    <div className="space-y-6">
      {/* 入力エリア */}
      <div className="rounded-2xl border-2 border-emerald-200 bg-white shadow-lg overflow-hidden">
        <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <NotebookPen className="h-5 w-5 text-emerald-600" />
              科目を入力する
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
          <p className="mt-2 text-xs text-slate-600">
            入力すると、下に実際の調査書 様式１と同じ並び（教科・科目→教科別学習成績の状況→全体→概評）で結果が表示されます。
          </p>
        </div>
        <div className="px-4 py-4 sm:px-6">
          <div className="space-y-2">
            {rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-1 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto_auto_auto] sm:items-center"
              >
                <select
                  value={row.kyoka}
                  onChange={(e) => updateRow(row.id, { kyoka: e.target.value })}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                  aria-label="教科"
                >
                  {KYOKA_LIST.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={row.kamoku}
                  onChange={(e) => updateRow(row.id, { kamoku: e.target.value })}
                  placeholder="科目名（例: 物理基礎）"
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                  aria-label="科目名"
                />
                <select
                  value={row.gakunen}
                  onChange={(e) => updateRow(row.id, { gakunen: Number(e.target.value) as Kamoku['gakunen'] })}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                  aria-label="学年"
                >
                  {GAKUNEN_LIST.map((g) => (
                    <option key={g} value={g}>
                      {g}年
                    </option>
                  ))}
                </select>
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
          <p className="mt-2 text-[11px] text-slate-500">
            保健体育のように複数学年で履修する科目は、学年ごとに行を分けて入力してください（各学年1科目分として計算します）。
          </p>
          <button
            type="button"
            onClick={addRow}
            className="mt-3 inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
          >
            <Plus className="h-3.5 w-3.5" />
            科目を追加
          </button>
        </div>
      </div>

      {/* 調査書 様式風の結果表示 */}
      {pivotRows.length > 0 && overall !== null && gaihyou !== null && (
        <div className="rounded-2xl border-2 border-slate-300 bg-white shadow-lg overflow-hidden" role="status" aria-live="polite">
          <div className="border-b-2 border-slate-300 bg-slate-800 px-6 py-3">
            <div className="text-center text-sm font-bold tracking-widest text-white">調　査　書（様式１）</div>
          </div>

          {/* ２．各教科・科目等の学習の記録 */}
          <div className="px-4 py-4 sm:px-6">
            <div className="mb-2 text-xs font-bold text-slate-500">２．各教科・科目等の学習の記録</div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700">
                    <th className="border border-slate-300 px-2 py-1.5 font-bold">教科</th>
                    <th className="border border-slate-300 px-2 py-1.5 font-bold">科目</th>
                    <th className="border border-slate-300 px-2 py-1.5 font-bold text-slate-400" title="このツールでは入力を受け付けません（計算に使わないため）">
                      修得単位数
                    </th>
                    {GAKUNEN_LIST.map((g) => (
                      <th key={g} className="border border-slate-300 px-2 py-1.5 font-bold">
                        第{g}学年
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pivotRows.map((row) => (
                    <tr key={row.key} className="odd:bg-white even:bg-slate-50">
                      <td className="border border-slate-200 px-2 py-1.5 font-bold text-slate-700">{row.kyoka}</td>
                      <td className="border border-slate-200 px-2 py-1.5 text-slate-700">{row.kamoku}</td>
                      <td className="border border-slate-200 px-2 py-1.5 text-center text-slate-300">—</td>
                      {GAKUNEN_LIST.map((g) => (
                        <td key={g} className="border border-slate-200 px-2 py-1.5 text-center font-mono">
                          {row.byGakunen[g] ?? ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              ※「修得単位数」欄は実際の調査書には記載されますが、学習成績の状況の計算には使用しません（文部科学省の計算例に基づく）。
            </p>
          </div>

          {/* ３．各教科の学習成績の状況 */}
          <div className="border-t border-slate-200 px-4 py-4 sm:px-6">
            <div className="mb-2 text-xs font-bold text-slate-500">３．各教科の学習成績の状況</div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs sm:text-sm">
                <tbody>
                  {Object.entries(kyokaStatus).map(([kyoka, value]) => (
                    <tr key={kyoka} className="odd:bg-white even:bg-emerald-50/40">
                      <td className="border border-slate-200 px-3 py-1.5 font-bold text-slate-700">{kyoka}</td>
                      <td className="border border-slate-200 px-3 py-1.5 text-right font-mono text-emerald-800">
                        {value.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ４．学習成績概評 */}
          <div className="border-t-2 border-slate-300 bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-5 sm:px-6">
            <div className="mb-2 text-xs font-bold text-slate-500">４．学習成績概評</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="text-center">
                <div className="text-xs font-bold text-slate-600 mb-1">全体の学習成績の状況</div>
                <div className="text-4xl font-black text-emerald-700">{overall.toFixed(1)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-slate-600 mb-1">学習成績概評</div>
                <div className={`text-4xl font-black ${GAIHYOU_STYLE[gaihyou]}`}>{gaihyou}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
