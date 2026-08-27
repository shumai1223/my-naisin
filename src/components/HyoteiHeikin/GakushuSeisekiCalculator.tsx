'use client';

import * as React from 'react';
import { Calculator, RotateCcw, Plus, Trash2 } from 'lucide-react';

import { track, funnel } from '@/lib/track';
import { calcKyokaStatus, calcOverallStatus, toGaihyou, type Kamoku } from '@/lib/gakushu-seiseki';

// 出典: 文部科学省「令和９年度大学入学者選抜実施要項について（通知）」別紙様式１
// 「調査書記入上の注意事項等について」に掲載の教科区分（[[T-C4-gakushu-seiseki-engine]]）。
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
  return `row-${rowIdCounter}`;
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

interface GakushuSeisekiCalculatorProps {
  onResult?: (overall: number | null) => void;
}

export function GakushuSeisekiCalculator({ onResult }: GakushuSeisekiCalculatorProps = {}) {
  const [rows, setRows] = React.useState<Row[]>(() => [emptyRow(), emptyRow(), emptyRow()]);
  const viewedRef = React.useRef(false);
  const startedRef = React.useRef(false);

  const updateRow = (id: string, patch: Partial<Kamoku>) => {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ tool: 'gakushu-seiseki', placement: 'gakushu-seiseki' });
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));
  const reset = () => setRows([emptyRow(), emptyRow(), emptyRow()]);

  const validRows = rows.filter((r) => r.kamoku.trim() !== '');
  const kamokuList: Kamoku[] = validRows.map(({ id, ...k }) => k);
  const kyokaStatus = calcKyokaStatus(kamokuList);
  const overall = validRows.length > 0 ? calcOverallStatus(kamokuList) : null;
  const gaihyou = overall !== null ? toGaihyou(overall) : null;

  React.useEffect(() => {
    if (overall !== null && !viewedRef.current) {
      viewedRef.current = true;
      funnel.calcComplete({ tool: 'gakushu-seiseki', placement: 'gakushu-seiseki' }, { overall });
      track('result_view', { source: 'gakushu-seiseki' });
    }
  }, [overall]);

  React.useEffect(() => {
    onResult?.(overall);
  }, [overall, onResult]);

  return (
    <div className="rounded-2xl border-2 border-emerald-200 bg-white shadow-lg overflow-hidden">
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Calculator className="h-5 w-5 text-emerald-600" />
            科目ごとの評定を入力
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
          教科・科目名・学年・評定（5段階）を入力してください。
          <strong className="text-emerald-700">修得単位数は入力欄がありません</strong>
          （文部科学省の計算例では単位数の大小にかかわらず評定数1として数えるため。詳しくは下記の「なぜ単位数を入れないのか」参照）。
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
        <button
          type="button"
          onClick={addRow}
          className="mt-3 inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
        >
          <Plus className="h-3.5 w-3.5" />
          科目を追加
        </button>
      </div>

      {overall !== null && gaihyou !== null && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-6 border-t-2 border-emerald-200" role="status" aria-live="polite">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="text-center">
              <div className="text-xs font-bold text-slate-600 mb-1">全体の学習成績の状況</div>
              <div className="text-5xl font-black text-emerald-700">{overall.toFixed(1)}</div>
              <div className="text-xs text-slate-500 mt-1">/ 5.0（旧称：評定平均）</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-slate-600 mb-1">学習成績概評</div>
              <div className={`text-5xl font-black ${GAIHYOU_STYLE[gaihyou]}`}>{gaihyou}</div>
              <div className="text-xs text-slate-500 mt-1">A〜Eの5段階</div>
            </div>
          </div>

          {Object.keys(kyokaStatus).length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-xs font-bold text-slate-600">教科ごとの学習成績の状況</div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
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
          )}
        </div>
      )}
    </div>
  );
}
