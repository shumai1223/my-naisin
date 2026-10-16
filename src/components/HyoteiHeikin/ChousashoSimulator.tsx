'use client';

import * as React from 'react';
import { Plus, Trash2, RotateCcw } from '@/components/icons';

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
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4 md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">科目を入力する</h2>
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 hover:bg-brand-50"
            >
              <RotateCcw className="h-4 w-4" />
              リセット
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            入力すると、下に実際の調査書 様式１と同じ並び（教科・科目→教科別学習成績の状況→全体→概評）で結果が表示されます。
          </p>
        </div>
        <div className="px-4 py-4 sm:px-6">
          <div className="space-y-2">
            {rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_1fr_auto_auto_auto] md:items-center"
              >
                <select
                  value={row.kyoka}
                  onChange={(e) => updateRow(row.id, { kyoka: e.target.value })}
                  className="h-11 rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
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
                  className="h-11 rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
                  aria-label="科目名"
                />
                <select
                  value={row.gakunen}
                  onChange={(e) => updateRow(row.id, { gakunen: Number(e.target.value) as Kamoku['gakunen'] })}
                  className="h-11 rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
                  aria-label="学年"
                >
                  {GAKUNEN_LIST.map((g) => (
                    <option key={g} value={g}>
                      {g}年
                    </option>
                  ))}
                </select>
                <div className="flex justify-center gap-1">
                  {RATING_OPTIONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => updateRow(row.id, { hyotei: r })}
                      aria-pressed={row.hyotei === r}
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
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center justify-self-end rounded text-slate-600 hover:bg-red-50 hover:text-red-700 md:justify-self-center"
                  aria-label="この科目を削除"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-slate-600">
            保健体育のように複数学年で履修する科目は、学年ごとに行を分けて入力してください（各学年1科目分として計算します）。
          </p>
          <button
            type="button"
            onClick={addRow}
            className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 hover:bg-brand-50"
          >
            <Plus className="h-4 w-4" />
            科目を追加
          </button>
        </div>
      </div>

      {/* 調査書 様式風の結果表示 */}
      {pivotRows.length > 0 && overall !== null && gaihyou !== null && (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white" role="status" aria-live="polite">
          <div className="border-b border-slate-900 px-5 py-3 md:px-6">
            <div className="text-center text-base font-bold text-slate-900">調　査　書（様式１）</div>
          </div>

          {/* ２．各教科・科目等の学習の記録 */}
          <div className="px-4 py-4 sm:px-6">
            <div className="mb-2 text-sm font-bold text-slate-900">２．各教科・科目等の学習の記録</div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-900 text-slate-600">
                    <th className="px-2 py-2 text-left font-bold">教科</th>
                    <th className="px-2 py-2 text-left font-bold">科目</th>
                    <th className="px-2 py-2 text-center font-bold" title="このツールでは入力を受け付けません（計算に使わないため）">
                      修得単位数
                    </th>
                    {GAKUNEN_LIST.map((g) => (
                      <th key={g} className="px-2 py-2 text-center font-bold">
                        第{g}学年
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pivotRows.map((row) => (
                    <tr key={row.key} className="border-b border-slate-200">
                      <td className="px-2 py-2 font-bold text-slate-900">{row.kyoka}</td>
                      <td className="px-2 py-2 text-slate-900">{row.kamoku}</td>
                      <td className="px-2 py-2 text-center text-slate-600">—</td>
                      {GAKUNEN_LIST.map((g) => (
                        <td key={g} className="px-2 py-2 text-center tabular-nums text-slate-900">
                          {row.byGakunen[g] ?? ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-slate-600">
              ※「修得単位数」欄は実際の調査書には記載されますが、学習成績の状況の計算には使用しません（文部科学省の計算例に基づく）。
            </p>
          </div>

          {/* ３．各教科の学習成績の状況 */}
          <div className="border-t border-slate-200 px-4 py-4 sm:px-6">
            <div className="mb-2 text-sm font-bold text-slate-900">３．各教科の学習成績の状況</div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {Object.entries(kyokaStatus).map(([kyoka, value]) => (
                    <tr key={kyoka} className="border-b border-slate-200">
                      <td className="px-3 py-2 font-bold text-slate-900">{kyoka}</td>
                      <td className="px-3 py-2 text-right font-bold tabular-nums text-slate-900">
                        {value.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ４．学習成績概評 */}
          <div className="border-t border-slate-200 bg-brand-50 px-4 py-5 sm:px-6">
            <div className="mb-2 text-sm font-bold text-slate-900">４．学習成績概評</div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="text-center">
                <div className="mb-1 text-sm text-slate-600">全体の学習成績の状況</div>
                <div className="text-4xl font-bold tabular-nums text-brand-700">{overall.toFixed(1)}</div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-sm text-slate-600">学習成績概評</div>
                <div className="text-4xl font-bold text-brand-700">{gaihyou}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
