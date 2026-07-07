'use client';

import * as React from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

export interface AichiHyokaResult {
  total: number;
  max: number;
}

interface Props {
  onResult?: (r: AichiHyokaResult | null) => void;
}

const METHODS = [
  { type: 'Ⅰ', naishinMul: 1, gakuryokuMul: 1, max: 200, label: '等倍（標準）' },
  { type: 'Ⅱ', naishinMul: 1.5, gakuryokuMul: 1, max: 245, label: 'やや内申重視' },
  { type: 'Ⅲ', naishinMul: 1, gakuryokuMul: 1.5, max: 255, label: 'やや当日点重視' },
  { type: 'Ⅳ', naishinMul: 2, gakuryokuMul: 1, max: 290, label: '内申最重視' },
  { type: 'Ⅴ', naishinMul: 1, gakuryokuMul: 2, max: 310, label: '当日点最重視' },
] as const;

/**
 * 愛知県の評価方法Ⅰ〜Ⅴの実数計算機（B-5）。
 * 既存/aichi/total-scoreは評価方法ごとの満点・式の早見表のみで、実際の評定合計・当日点を
 * 入力して校内順位の合計点を出す計算機が無かった。
 */
export function AichiHyokaCalculator({ onResult }: Props) {
  const [naishinSumInput, setNaishinSumInput] = React.useState(''); // 9教科評定合計（45点満点）
  const [gakuryokuInput, setGakuryokuInput] = React.useState(''); // 学力検査（110点満点）
  const [methodIndex, setMethodIndex] = React.useState(0);

  const naishinSum = parseFloat(naishinSumInput) || 0;
  const gakuryoku = parseFloat(gakuryokuInput) || 0;
  const hyoteitokuten = naishinSum * 2; // 評定得点（90点満点）
  const method = METHODS[methodIndex];

  const hasInput = naishinSumInput !== '' || gakuryokuInput !== '';
  const total = Math.round((hyoteitokuten * method.naishinMul + gakuryoku * method.gakuryokuMul) * 10) / 10;

  React.useEffect(() => {
    onResult?.(hasInput ? { total, max: method.max } : null);
  }, [hasInput, total, method.max, onResult]);

  const reset = () => {
    setNaishinSumInput('');
    setGakuryokuInput('');
    setMethodIndex(0);
  };

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-rose-200 bg-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-100 bg-gradient-to-r from-rose-50 to-red-50 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <Calculator className="h-5 w-5 text-rose-600" />
          愛知県の総合得点（評価方法Ⅰ〜Ⅴ）を計算
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
            9教科の評定合計（45点満点）<span className="ml-2 text-xs font-normal text-slate-500">中3のみ対象</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={45}
            value={naishinSumInput}
            onChange={(e) => setNaishinSumInput(e.target.value)}
            placeholder="例：36"
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
          />
          {naishinSumInput !== '' && (
            <div className="mt-2 text-xs text-rose-700">→ 評定得点：{hyoteitokuten}点 / 90点</div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-slate-800">
            学力検査点（110点満点）<span className="ml-2 text-xs font-normal text-slate-500">5教科×22点</span>
          </label>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={110}
            value={gakuryokuInput}
            onChange={(e) => setGakuryokuInput(e.target.value)}
            placeholder="例：95"
            className="h-12 w-full rounded-xl border border-slate-200 px-4 text-base outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-bold text-slate-800">志望校の評価方法</label>
          <div className="grid grid-cols-5 gap-2">
            {METHODS.map((m, i) => (
              <button
                key={m.type}
                type="button"
                onClick={() => setMethodIndex(i)}
                className={`rounded-lg px-2 py-2 text-center text-xs font-bold transition-all ${
                  i === methodIndex ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {m.type}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">{method.label}（満点{method.max}点）</p>
        </div>
      </div>

      {hasInput && (
        <div className="border-t-2 border-rose-100 bg-gradient-to-br from-rose-50 to-red-50 px-6 py-6 text-center">
          <div className="mb-1 text-xs font-bold text-slate-600">あなたの総合得点（評価方法{method.type}）</div>
          <div className="text-5xl font-black text-rose-700">
            {total}
            <span className="text-xl font-bold text-slate-400">/{method.max}</span>
          </div>
          <div className="mx-auto mt-4 max-w-sm rounded-xl border border-rose-100 bg-white p-3 text-left">
            <div className="mb-2 text-xs font-bold text-slate-700">計算内訳</div>
            <ul className="space-y-1 text-xs text-slate-600">
              <li>評定得点：{hyoteitokuten} × {method.naishinMul} ＝ {Math.round(hyoteitokuten * method.naishinMul * 10) / 10}点</li>
              <li>学力検査：{gakuryoku} × {method.gakuryokuMul} ＝ {Math.round(gakuryoku * method.gakuryokuMul * 10) / 10}点</li>
              <li className="border-t border-slate-100 pt-1 font-bold">総合得点：{total}点</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
