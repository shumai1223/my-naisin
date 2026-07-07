'use client';

import * as React from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

export interface FukuokaScoreResult {
  total: number;
  max: number;
}

interface Props {
  onResult?: (r: FukuokaScoreResult | null) => void;
}

const MAX_NAISHIN = 45;
const MAX_GAKURYOKU = 300;
const MAX_TOTAL = MAX_NAISHIN + MAX_GAKURYOKU;

/**
 * 福岡県の内申点（中3のみ45点）＋学力検査（300点）の実数計算機（B-5）。
 * 既存/fukuoka/total-scoreは評定パターン別の早見表2枚のみで、両方を入力して
 * 合計点(A群判定の目安)を一度に出す計算機が無かった。
 */
export function FukuokaScoreCalculator({ onResult }: Props) {
  const [naishinInput, setNaishinInput] = React.useState('');
  const [gakuryokuInput, setGakuryokuInput] = React.useState('');

  const naishin = parseFloat(naishinInput) || 0;
  const gakuryoku = parseFloat(gakuryokuInput) || 0;
  const hasInput = naishinInput !== '' || gakuryokuInput !== '';
  const total = naishin + gakuryoku;
  const percent = (total / MAX_TOTAL) * 100;

  React.useEffect(() => {
    onResult?.(hasInput ? { total, max: MAX_TOTAL } : null);
  }, [hasInput, total, onResult]);

  const reset = () => {
    setNaishinInput('');
    setGakuryokuInput('');
  };

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-sky-200 bg-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-blue-50 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <Calculator className="h-5 w-5 text-sky-600" />
          福岡県の内申点＋当日点を計算
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

      <div className="space-y-5 p-6">
        <div>
          <label className="mb-1 block text-sm font-bold text-slate-800">
            内申点（45点満点）<span className="ml-2 text-xs font-normal text-slate-500">中3の9教科のみ</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={MAX_NAISHIN}
            value={naishinInput}
            onChange={(e) => setNaishinInput(e.target.value)}
            placeholder="例：36"
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-slate-800">
            学力検査点（300点満点）<span className="ml-2 text-xs font-normal text-slate-500">5教科×60点</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={MAX_GAKURYOKU}
            value={gakuryokuInput}
            onChange={(e) => setGakuryokuInput(e.target.value)}
            placeholder="例：210"
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      {hasInput && (
        <div className="border-t-2 border-sky-100 bg-gradient-to-br from-sky-50 to-blue-50 px-6 py-6 text-center">
          <div className="mb-1 text-xs font-bold text-slate-600">内申＋当日点の合計（目安）</div>
          <div className="text-5xl font-black text-sky-700">
            {total}
            <span className="text-xl font-bold text-slate-400">/{MAX_TOTAL}</span>
          </div>
          <div className="mt-2 text-xs font-bold text-slate-600">満点比 {percent.toFixed(1)}%</div>
          <div className="mx-auto mt-4 max-w-sm rounded-xl border border-sky-100 bg-white p-3 text-left">
            <div className="mb-2 text-xs font-bold text-slate-700">内訳</div>
            <ul className="space-y-1 text-xs text-slate-600">
              <li>内申点（中3）：{naishin} / {MAX_NAISHIN}点</li>
              <li>学力検査：{gakuryoku} / {MAX_GAKURYOKU}点</li>
              <li className="border-t border-slate-100 pt-1 font-bold">合計：{total} / {MAX_TOTAL}点</li>
            </ul>
          </div>
          <p className="mx-auto mt-3 max-w-sm text-[11px] leading-relaxed text-slate-400">
            ※ 福岡県はA群（学力・内申の両方の順位が合格圏）とB群（総合判断）の二段階選抜です。この合計は目安であり、単純合計の順位だけで合否が決まるわけではありません。
          </p>
        </div>
      )}
    </div>
  );
}
