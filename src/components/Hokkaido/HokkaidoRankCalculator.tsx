'use client';

import * as React from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
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

  const getRankColor = () => {
    if (['A', 'B'].includes(rankInfo.rank)) return 'text-red-700';
    if (['C', 'D'].includes(rankInfo.rank)) return 'text-orange-700';
    if (['E', 'F', 'G'].includes(rankInfo.rank)) return 'text-amber-700';
    if (['H', 'I'].includes(rankInfo.rank)) return 'text-emerald-700';
    return 'text-blue-700';
  };

  return (
    <div className="rounded-2xl border-2 border-emerald-200 bg-white shadow-lg overflow-hidden">
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Calculator className="h-5 w-5 text-emerald-600" />
            北海道 内申ランク（A〜M）を判定
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
        <p className="mt-2 text-xs text-slate-600">内申点と学力検査点を入力すると、ランクと総合点が判定されます</p>
      </div>

      <div className="p-6 space-y-5">
        {/* 内申点 */}
        <div>
          <label htmlFor="hokkaido-naishin" className="block text-sm font-bold text-slate-800 mb-1">
            内申点（315点満点）<span className="text-xs font-normal text-slate-500 ml-2">中1〜中3 9教科</span>
          </label>
          <input
            id="hokkaido-naishin"
            type="number"
            value={naishinInput}
            onChange={(e) => setNaishinInput(e.target.value)}
            placeholder="例：240"
            min="0"
            max="315"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
          <p className="mt-1 text-xs text-slate-500">
            北海道の内申点は中1×2 + 中2×2 + 中3×3の重みで計算されます（簡略表示）。詳しくは<a href="/hokkaido/naishin" className="text-emerald-600 underline">北海道の内申点計算ツール</a>もご利用ください。
          </p>
        </div>

        {/* 学力検査 */}
        <div>
          <label htmlFor="hokkaido-gakuryoku" className="block text-sm font-bold text-slate-800 mb-1">
            学力検査点（300点満点）<span className="text-xs font-normal text-slate-500 ml-2">5教科 × 60点</span>
          </label>
          <input
            id="hokkaido-gakuryoku"
            type="number"
            value={gakuryokuInput}
            onChange={(e) => setGakuryokuInput(e.target.value)}
            placeholder="例：240"
            min="0"
            max="300"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {/* 結果 */}
      {hasInput && (
        <div className="border-t-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-6">
          <div className="text-center">
            <div className="text-xs font-bold text-slate-600 mb-2">あなたの内申ランク</div>
            <div className={`text-6xl font-black ${getRankColor()}`}>{rankInfo.rank}<span className="text-2xl">ランク</span></div>
            <div className="mt-2 text-sm font-bold text-slate-700">{rankInfo.label}</div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl bg-white border border-emerald-100 p-3">
                <div className="text-xs text-slate-500">内申点</div>
                <div className="text-xl font-black text-emerald-700">{naishin}<span className="text-xs">/315</span></div>
              </div>
              <div className="rounded-xl bg-white border border-emerald-100 p-3">
                <div className="text-xs text-slate-500">学力検査</div>
                <div className="text-xl font-black text-emerald-700">{gakuryoku}<span className="text-xs">/300</span></div>
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-white border border-emerald-100 p-3">
              <div className="text-xs text-slate-500">総合点</div>
              <div className="text-2xl font-black text-emerald-700">{total}<span className="text-sm">/{maxTotal}</span></div>
              <div className="text-xs text-slate-500 mt-1">満点比 {percent.toFixed(1)}%</div>
            </div>
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
