'use client';

import * as React from 'react';
import { RotateCcw } from '@/components/icons';
import { TargetDistancePanel } from '@/components/TotalScore/TargetDistancePanel';
import { HOKKAIDO_TOTAL_SCORE_MAX, computeHokkaidoRank } from '@/lib/total-score/hokkaido';

export interface HokkaidoRankResult {
  total: number;
  max: number;
}

interface Props {
  /** 総合点(概算)が変わるたびに呼ばれる（結果連動の名簿導線に使う）。 */
  onResult?: (r: HokkaidoRankResult | null) => void;
}

export function HokkaidoRankCalculator({ onResult }: Props = {}) {
  const [naishinInput, setNaishinInput] = React.useState('');
  const [gakuryokuInput, setGakuryokuInput] = React.useState('');
  const [targetInput, setTargetInput] = React.useState('');

  const naishin = parseFloat(naishinInput) || 0; // 315点満点
  const gakuryoku = parseFloat(gakuryokuInput) || 0; // 300点満点（5教科 × 60点 = 300点）

  const { rank: rankInfo, total, percent } = computeHokkaidoRank({ naishinRaw: naishin, gakuryokuRaw: gakuryoku });
  const maxTotal = HOKKAIDO_TOTAL_SCORE_MAX;

  const hasInput = naishinInput !== '' || gakuryokuInput !== '';

  React.useEffect(() => {
    onResult?.(hasInput ? { total, max: maxTotal } : null);
  }, [hasInput, total, maxTotal, onResult]);

  const reset = () => {
    setNaishinInput('');
    setGakuryokuInput('');
    setTargetInput('');
  };

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">北海道 内申ランク（A〜M）を判定</h2>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 hover:bg-brand-50"
          >
            <RotateCcw className="h-4 w-4" />
            リセット
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-600">内申点と学力検査点を入力すると、ランクと総合点が判定されます</p>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        {/* 内申点 */}
        <div>
          <label htmlFor="hokkaido-naishin" className="mb-1 block text-sm font-bold text-slate-900">
            内申点（315点満点）<span className="ml-2 text-xs font-normal text-slate-600">中1〜中3 9教科</span>
          </label>
          <input
            id="hokkaido-naishin"
            type="number"
            value={naishinInput}
            onChange={(e) => setNaishinInput(e.target.value)}
            placeholder="例：240"
            min="0"
            max="315"
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
          />
          <p className="mt-1 text-sm leading-[1.8] text-slate-600">
            北海道の内申点は中1×2 + 中2×2 + 中3×3の重みで計算されます（簡略表示）。詳しくは<a href="/hokkaido/naishin" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">北海道の内申点計算ツール</a>もご利用ください。
          </p>
        </div>

        {/* 学力検査 */}
        <div>
          <label htmlFor="hokkaido-gakuryoku" className="mb-1 block text-sm font-bold text-slate-900">
            学力検査点（300点満点）<span className="ml-2 text-xs font-normal text-slate-600">5教科 × 60点</span>
          </label>
          <input
            id="hokkaido-gakuryoku"
            type="number"
            value={gakuryokuInput}
            onChange={(e) => setGakuryokuInput(e.target.value)}
            placeholder="例：240"
            min="0"
            max="300"
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>
      </div>

      {/* 結果 */}
      {hasInput && (
        <div className="border-t border-slate-200 bg-brand-50 px-5 py-6 md:px-6">
          <div className="text-center">
            <div className="mb-2 text-sm font-bold text-slate-600">あなたの内申ランク</div>
            <div className="text-6xl font-bold text-brand-700">{rankInfo.rank}<span className="text-2xl">ランク</span></div>
            <div className="mt-2 text-base font-bold text-slate-900">{rankInfo.label}</div>

            <dl className="mt-4 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200">
              <div className="px-2 py-3">
                <dt className="text-xs text-slate-600">内申点</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{naishin}<span className="text-xs font-normal text-slate-600">/315</span></dd>
              </div>
              <div className="px-2 py-3">
                <dt className="text-xs text-slate-600">学力検査</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{gakuryoku}<span className="text-xs font-normal text-slate-600">/300</span></dd>
              </div>
              <div className="px-2 py-3">
                <dt className="text-xs text-slate-600">総合点</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-brand-700">{total}<span className="text-xs font-normal text-slate-600">/{maxTotal}</span></dd>
              </div>
            </dl>
            <p className="mt-2 text-sm tabular-nums text-slate-600">満点比 {percent.toFixed(1)}%</p>
          </div>

          <TargetDistancePanel
            targetInput={targetInput}
            onTargetInputChange={setTargetInput}
            total={total}
            totalMax={maxTotal}
            inputId="hokkaido-total-score-target"
          />
        </div>
      )}
    </div>
  );
}
