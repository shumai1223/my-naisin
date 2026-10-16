'use client';

import * as React from 'react';
import { RotateCcw, Plus, Trash2 } from '@/components/icons';

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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">科目ごとの評定を入力</h2>
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
          教科・科目名・学年・評定（5段階）を入力してください。
          <strong className="font-bold text-brand-700">修得単位数は入力欄がありません</strong>
          （文部科学省の計算例では単位数の大小にかかわらず評定数1として数えるため。詳しくは下記の「なぜ単位数を入れないのか」参照）。
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
        <button
          type="button"
          onClick={addRow}
          className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 hover:bg-brand-50"
        >
          <Plus className="h-4 w-4" />
          科目を追加
        </button>
      </div>

      {overall !== null && gaihyou !== null && (
        <div className="border-t border-slate-200 bg-brand-50 px-5 py-6 md:px-6" role="status" aria-live="polite">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="text-center">
              <div className="mb-1 text-sm text-slate-600">全体の学習成績の状況</div>
              <div className="text-5xl font-bold tabular-nums text-brand-700">{overall.toFixed(1)}</div>
              <div className="mt-1 text-sm text-slate-600">/ 5.0（旧称：評定平均）</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-sm text-slate-600">学習成績概評</div>
              <div className="text-5xl font-bold text-brand-700">{gaihyou}</div>
              <div className="mt-1 text-sm text-slate-600">A〜Eの5段階</div>
            </div>
          </div>

          {Object.keys(kyokaStatus).length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-sm font-bold text-slate-900">教科ごとの学習成績の状況</div>
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    {Object.entries(kyokaStatus).map(([kyoka, value]) => (
                      <tr key={kyoka} className="border-b border-slate-200 last:border-b-0">
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
          )}
        </div>
      )}
    </div>
  );
}
