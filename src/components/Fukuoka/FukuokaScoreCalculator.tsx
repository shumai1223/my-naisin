'use client';

import * as React from 'react';
import { RotateCcw } from '@/components/icons';
import { TargetDistancePanel } from '@/components/TotalScore/TargetDistancePanel';
import { FUKUOKA_MAX_NAISHIN, FUKUOKA_MAX_GAKURYOKU, FUKUOKA_MAX_TOTAL, computeFukuokaScore } from '@/lib/total-score/fukuoka';

export interface FukuokaScoreResult {
  total: number;
  max: number;
}

interface Props {
  onResult?: (r: FukuokaScoreResult | null) => void;
}

/**
 * 福岡県の内申点（中3のみ45点）＋学力検査（300点）の実数計算機（B-5）。
 * 既存/fukuoka/total-scoreは評定パターン別の早見表2枚のみで、両方を入力して
 * 合計点(A群判定の目安)を一度に出す計算機が無かった。
 */
export function FukuokaScoreCalculator({ onResult }: Props) {
  const [naishinInput, setNaishinInput] = React.useState('');
  const [gakuryokuInput, setGakuryokuInput] = React.useState('');
  const [targetInput, setTargetInput] = React.useState('');

  const naishin = parseFloat(naishinInput) || 0;
  const gakuryoku = parseFloat(gakuryokuInput) || 0;
  const hasInput = naishinInput !== '' || gakuryokuInput !== '';
  const { total, percent } = computeFukuokaScore({ naishinRaw: naishin, gakuryokuRaw: gakuryoku });

  React.useEffect(() => {
    onResult?.(hasInput ? { total, max: FUKUOKA_MAX_TOTAL } : null);
  }, [hasInput, total, onResult]);

  const reset = () => {
    setNaishinInput('');
    setGakuryokuInput('');
    setTargetInput('');
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 md:px-6">
        <h2 className="text-xl font-bold text-slate-900">福岡県の内申点＋当日点を計算</h2>
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 hover:bg-brand-50"
        >
          <RotateCcw className="h-4 w-4" />
          リセット
        </button>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        <div>
          <label htmlFor="fukuoka-naishin" className="mb-1 block text-sm font-bold text-slate-900">
            内申点（45点満点）<span className="ml-2 text-xs font-normal text-slate-600">中3の9教科のみ</span>
          </label>
          <input
            id="fukuoka-naishin"
            type="number"
            inputMode="decimal"
            min={0}
            max={FUKUOKA_MAX_NAISHIN}
            value={naishinInput}
            onChange={(e) => setNaishinInput(e.target.value)}
            placeholder="例：36"
            className="h-12 w-full rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>

        <div>
          <label htmlFor="fukuoka-gakuryoku" className="mb-1 block text-sm font-bold text-slate-900">
            学力検査点（300点満点）<span className="ml-2 text-xs font-normal text-slate-600">5教科×60点</span>
          </label>
          <input
            id="fukuoka-gakuryoku"
            type="number"
            inputMode="decimal"
            min={0}
            max={FUKUOKA_MAX_GAKURYOKU}
            value={gakuryokuInput}
            onChange={(e) => setGakuryokuInput(e.target.value)}
            placeholder="例：210"
            className="h-12 w-full rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>
      </div>

      {hasInput && (
        <div className="border-t border-slate-200 bg-brand-50 px-5 py-6 text-center md:px-6">
          <div className="mb-1 text-sm font-bold text-slate-600">内申＋当日点の合計（目安）</div>
          <div className="text-5xl font-bold tabular-nums text-brand-700">
            {total}
            <span className="text-xl font-bold text-slate-600">/{FUKUOKA_MAX_TOTAL}</span>
          </div>
          <div className="mt-2 text-sm font-bold tabular-nums text-slate-600">満点比 {percent.toFixed(1)}%</div>
          <div className="mx-auto mt-4 max-w-sm border-y border-slate-200 py-3 text-left">
            <div className="mb-2 text-sm font-bold text-slate-900">内訳</div>
            <ul className="space-y-1 text-sm tabular-nums text-slate-900">
              <li>内申点（中3）：{naishin} / {FUKUOKA_MAX_NAISHIN}点</li>
              <li>学力検査：{gakuryoku} / {FUKUOKA_MAX_GAKURYOKU}点</li>
              <li className="border-t border-slate-200 pt-1 font-bold">合計：{total} / {FUKUOKA_MAX_TOTAL}点</li>
            </ul>
          </div>
          <p className="mx-auto mt-3 max-w-sm text-left text-sm leading-[1.8] text-slate-600">
            ※ 福岡県はA群（学力・内申の両方の順位が合格圏）とB群（総合判断）の二段階選抜です。この合計は目安であり、単純合計の順位だけで合否が決まるわけではありません。
          </p>

          <div className="mx-auto max-w-sm text-left">
            <TargetDistancePanel
              targetInput={targetInput}
              onTargetInputChange={setTargetInput}
              total={total}
              totalMax={FUKUOKA_MAX_TOTAL}
              inputId="fukuoka-total-score-target"
            />
          </div>
        </div>
      )}
    </div>
  );
}
