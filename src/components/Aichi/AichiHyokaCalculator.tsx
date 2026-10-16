'use client';

import * as React from 'react';
import { RotateCcw } from '@/components/icons';
import { AICHI_METHODS, computeAichiTotalScore } from '@/lib/total-score/aichi';

export interface AichiHyokaResult {
  total: number;
  max: number;
}

interface Props {
  onResult?: (r: AichiHyokaResult | null) => void;
}

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

  const { hyoteitokuten, total, method } = computeAichiTotalScore({
    naishinSumRaw: naishinSum,
    gakuryokuRaw: gakuryoku,
    methodIndex,
  });

  const hasInput = naishinSumInput !== '' || gakuryokuInput !== '';

  React.useEffect(() => {
    onResult?.(hasInput ? { total, max: method.max } : null);
  }, [hasInput, total, method.max, onResult]);

  const reset = () => {
    setNaishinSumInput('');
    setGakuryokuInput('');
    setMethodIndex(0);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 md:px-6">
        <h2 className="text-xl font-bold text-slate-900">愛知県の総合得点（評価方法Ⅰ〜Ⅴ）を計算</h2>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] items-center gap-1 rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
        >
          <RotateCcw className="h-4 w-4" />
          リセット
        </button>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        <div>
          <label htmlFor="aichi-naishin-sum" className="mb-1 block text-sm font-bold text-slate-900">
            9教科の評定合計（45点満点）<span className="ml-2 text-xs font-normal text-slate-600">中3のみ対象</span>
          </label>
          <input
            id="aichi-naishin-sum"
            type="number"
            inputMode="decimal"
            min={0}
            max={45}
            value={naishinSumInput}
            onChange={(e) => setNaishinSumInput(e.target.value)}
            placeholder="例：36"
            className="h-12 w-full rounded border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
          {naishinSumInput !== '' && (
            <div className="mt-2 text-sm tabular-nums text-slate-600">→ 評定得点：{hyoteitokuten}点 / 90点</div>
          )}
        </div>

        <div>
          <label htmlFor="aichi-gakuryoku" className="mb-1 block text-sm font-bold text-slate-900">
            学力検査点（110点満点）<span className="ml-2 text-xs font-normal text-slate-600">5教科×22点</span>
          </label>
          <input
            id="aichi-gakuryoku"
            type="number"
            inputMode="decimal"
            min={0}
            max={110}
            value={gakuryokuInput}
            onChange={(e) => setGakuryokuInput(e.target.value)}
            placeholder="例：95"
            className="h-12 w-full rounded border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>

        <fieldset className="min-w-0">
          <legend className="mb-1 text-sm font-bold text-slate-900">志望校の評価方法</legend>
          <div className="grid grid-cols-5 gap-2">
            {AICHI_METHODS.map((m, i) => (
              <button
                key={m.type}
                type="button"
                onClick={() => setMethodIndex(i)}
                aria-pressed={i === methodIndex}
                aria-label={`評価方法${m.type}`}
                className={`min-h-[44px] rounded border px-2 text-center text-base font-bold transition-colors ${
                  i === methodIndex
                    ? 'border-brand-700 bg-brand-700 text-white'
                    : 'border-slate-300 bg-white text-slate-900 hover:bg-brand-50'
                }`}
              >
                {m.type}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-slate-600">{method.label}（満点{method.max}点）</p>
        </fieldset>
      </div>

      {hasInput && (
        <div className="rounded-b-lg border-t border-slate-200 bg-brand-50 px-5 py-6 text-center md:px-6">
          <div className="mb-1 text-sm font-bold text-slate-900">あなたの総合得点（評価方法{method.type}）</div>
          <div className="text-4xl font-bold tabular-nums text-slate-900">
            {total}
            <span className="text-xl font-bold text-slate-600">/{method.max}</span>
          </div>
          <div className="mx-auto mt-4 max-w-sm border-t border-slate-200 pt-3 text-left">
            <div className="mb-2 text-sm font-bold text-slate-900">計算内訳</div>
            <ul className="space-y-1 text-sm tabular-nums text-slate-900">
              <li>評定得点：{hyoteitokuten} × {method.naishinMul} ＝ {Math.round(hyoteitokuten * method.naishinMul * 10) / 10}点</li>
              <li>学力検査：{gakuryoku} × {method.gakuryokuMul} ＝ {Math.round(gakuryoku * method.gakuryokuMul * 10) / 10}点</li>
              <li className="border-t border-slate-200 pt-2 font-bold">総合得点：{total}点</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
