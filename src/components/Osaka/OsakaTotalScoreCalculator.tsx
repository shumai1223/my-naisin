'use client';

import * as React from 'react';
import { Calculator, RotateCcw } from 'lucide-react';
import { TargetDistancePanel } from '@/components/TotalScore/TargetDistancePanel';
import { OSAKA_TYPE_OPTIONS, OSAKA_TOTAL_SCORE_MAX, computeOsakaTotalScore, osakaRankLabel } from '@/lib/total-score/osaka';

export interface OsakaTotalScoreResult {
  total: number;
  max: number;
}

interface OsakaTotalScoreCalculatorProps {
  onResult?: (r: OsakaTotalScoreResult | null) => void;
}

export function OsakaTotalScoreCalculator({ onResult }: OsakaTotalScoreCalculatorProps = {}) {
  const [naishinInput, setNaishinInput] = React.useState('');
  const [gakuryokuInput, setGakuryokuInput] = React.useState('');
  const [typeIndex, setTypeIndex] = React.useState(2); // タイプⅢ（5:5）をデフォルト
  const [targetInput, setTargetInput] = React.useState('');

  const naishin = parseFloat(naishinInput) || 0; // 450点満点（内申点）
  const gakuryoku = parseFloat(gakuryokuInput) || 0; // 450点満点（学力検査）

  const { gakuryokuScore, naishinScore, total, percent, type } = computeOsakaTotalScore({
    naishinRaw: naishin,
    gakuryokuRaw: gakuryoku,
    typeIndex,
  });
  const maxTotal = OSAKA_TOTAL_SCORE_MAX;

  const hasInput = naishinInput !== '' || gakuryokuInput !== '';

  React.useEffect(() => {
    onResult?.(hasInput ? { total, max: maxTotal } : null);
  }, [hasInput, total, maxTotal, onResult]);

  const reset = () => {
    setNaishinInput('');
    setGakuryokuInput('');
    setTypeIndex(2);
    setTargetInput('');
  };

  const getRankColor = () => {
    if (total >= 380) return 'text-red-700';
    if (total >= 340) return 'text-orange-700';
    if (total >= 300) return 'text-amber-700';
    if (total >= 250) return 'text-emerald-700';
    return 'text-blue-700';
  };

  const getRankLabel = () => osakaRankLabel(total);

  return (
    <div className="rounded-2xl border-2 border-orange-200 bg-white shadow-lg overflow-hidden">
      <div className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Calculator className="h-5 w-5 text-orange-600" />
            大阪府 総合点を計算（タイプⅠ〜Ⅴ対応）
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
        <p className="mt-2 text-xs text-slate-600">内申点・学力検査点・志望校の選抜タイプを入力してください</p>
      </div>

      <div className="p-6 space-y-5">
        {/* 内申点 */}
        <div>
          <label htmlFor="osaka-naishin" className="block text-sm font-bold text-slate-800 mb-1">
            内申点（450点満点）<span className="text-xs font-normal text-slate-500 ml-2">3年間合算・9教科</span>
          </label>
          <input
            id="osaka-naishin"
            type="number"
            value={naishinInput}
            onChange={(e) => setNaishinInput(e.target.value)}
            placeholder="例：350"
            min="0"
            max="450"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {/* 学力検査 */}
        <div>
          <label htmlFor="osaka-gakuryoku" className="block text-sm font-bold text-slate-800 mb-1">
            学力検査点（450点満点）<span className="text-xs font-normal text-slate-500 ml-2">5教科 × 90点</span>
          </label>
          <input
            id="osaka-gakuryoku"
            type="number"
            value={gakuryokuInput}
            onChange={(e) => setGakuryokuInput(e.target.value)}
            placeholder="例：350"
            min="0"
            max="450"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {/* 選抜タイプ */}
        <div>
          <label className="block text-sm font-bold text-slate-800 mb-1">志望校の選抜タイプ（学力:内申）</label>
          <div className="space-y-1">
            {OSAKA_TYPE_OPTIONS.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setTypeIndex(i)}
                className={`w-full rounded-lg px-3 py-2 text-xs font-bold transition-all text-left ${
                  i === typeIndex
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 結果 */}
      {hasInput && (
        <div className="border-t-2 border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 px-6 py-6">
          <div className="text-center">
            <div className="text-xs font-bold text-slate-600 mb-2">あなたの総合点（450点満点）</div>
            <div className={`text-5xl font-black ${getRankColor()}`}>{total}<span className="text-xl">点</span></div>
            <div className="mt-1 text-sm text-slate-500">満点比 {percent.toFixed(1)}%</div>
            <div className="mt-4 text-sm font-bold text-slate-700">{getRankLabel()}</div>

            <div className="mt-4 rounded-xl bg-white border border-orange-100 p-3 text-left">
              <div className="text-xs font-bold text-slate-700 mb-2">計算内訳</div>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>学力検査：{gakuryoku} × {type.gakuryoku} ＝ {gakuryokuScore.toFixed(1)}点</li>
                <li>内申点：{naishin} × {type.naishin} ＝ {naishinScore.toFixed(1)}点</li>
                <li className="font-bold pt-1 border-t border-slate-100">総合点：{gakuryokuScore.toFixed(1)} + {naishinScore.toFixed(1)} ＝ {total}点</li>
              </ul>
            </div>
          </div>

          <TargetDistancePanel
            targetInput={targetInput}
            onTargetInputChange={setTargetInput}
            total={total}
            totalMax={maxTotal}
            inputId="osaka-total-score-target"
          />
        </div>
      )}
    </div>
  );
}
