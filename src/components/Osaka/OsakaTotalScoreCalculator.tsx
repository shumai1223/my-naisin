'use client';

import * as React from 'react';
import { RotateCcw } from '@/components/icons';
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

  const getRankLabel = () => osakaRankLabel(total);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">大阪府 総合点を計算（タイプⅠ〜Ⅴ対応）</h2>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 hover:bg-brand-50"
          >
            <RotateCcw className="h-4 w-4" />
            リセット
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-600">内申点・学力検査点・志望校の選抜タイプを入力してください</p>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        {/* 内申点 */}
        <div>
          <label htmlFor="osaka-naishin" className="mb-1 block text-sm font-bold text-slate-900">
            内申点（450点満点）<span className="ml-2 text-xs font-normal text-slate-600">3年間合算・9教科</span>
          </label>
          <input
            id="osaka-naishin"
            type="number"
            value={naishinInput}
            onChange={(e) => setNaishinInput(e.target.value)}
            placeholder="例：350"
            min="0"
            max="450"
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>

        {/* 学力検査 */}
        <div>
          <label htmlFor="osaka-gakuryoku" className="mb-1 block text-sm font-bold text-slate-900">
            学力検査点（450点満点）<span className="ml-2 text-xs font-normal text-slate-600">5教科 × 90点</span>
          </label>
          <input
            id="osaka-gakuryoku"
            type="number"
            value={gakuryokuInput}
            onChange={(e) => setGakuryokuInput(e.target.value)}
            placeholder="例：350"
            min="0"
            max="450"
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>

        {/* 選抜タイプ */}
        <div role="group" aria-labelledby="osaka-type-label">
          <div id="osaka-type-label" className="mb-1 text-sm font-bold text-slate-900">志望校の選抜タイプ（学力:内申）</div>
          <div className="space-y-2">
            {OSAKA_TYPE_OPTIONS.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setTypeIndex(i)}
                aria-pressed={i === typeIndex}
                className={`min-h-[44px] w-full rounded border px-3 py-2 text-left text-sm font-bold transition-colors ${
                  i === typeIndex
                    ? 'border-brand-700 bg-brand-700 text-white'
                    : 'border-slate-300 bg-white text-slate-900 hover:bg-brand-50'
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
        <div className="border-t border-slate-200 bg-brand-50 px-5 py-6 md:px-6">
          <div className="text-center">
            <div className="mb-2 text-sm font-bold text-slate-600">あなたの総合点（900点満点）</div>
            <div className="text-5xl font-bold tabular-nums text-brand-700">{total}<span className="text-xl">点</span></div>
            <div className="mt-1 text-sm tabular-nums text-slate-600">満点比 {percent.toFixed(1)}%</div>
            <div className="mt-4 text-base font-bold text-slate-900">{getRankLabel()}</div>

            <div className="mt-4 border-y border-slate-200 py-3 text-left">
              <div className="mb-2 text-sm font-bold text-slate-900">計算内訳</div>
              <ul className="space-y-1 text-sm tabular-nums text-slate-900">
                <li>学力検査：{gakuryoku} × {type.gakuryoku} ＝ {gakuryokuScore.toFixed(1)}点</li>
                <li>内申点：{naishin} × {type.naishin} ＝ {naishinScore.toFixed(1)}点</li>
                <li className="border-t border-slate-200 pt-1 font-bold">総合点：{gakuryokuScore.toFixed(1)} + {naishinScore.toFixed(1)} ＝ {total}点</li>
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
