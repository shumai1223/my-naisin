'use client';

import * as React from 'react';
import { RotateCcw } from '@/components/icons';
import { TargetDistancePanel } from '@/components/TotalScore/TargetDistancePanel';
import { KANAGAWA_RATIO_OPTIONS, KANAGAWA_S_VALUE_MAX, computeKanagawaSValue, kanagawaRankLabel } from '@/lib/total-score/kanagawa';

export interface KanagawaSValueResult {
  total: number;
  max: number;
}

interface KanagawaSValueCalculatorProps {
  onResult?: (r: KanagawaSValueResult | null) => void;
}

export function KanagawaSValueCalculator({ onResult }: KanagawaSValueCalculatorProps = {}) {
  const [naishinInput, setNaishinInput] = React.useState('');
  const [gakuryokuInput, setGakuryokuInput] = React.useState('');
  const [tokushokuInput, setTokushokuInput] = React.useState('');
  const [ratioIndex, setRatioIndex] = React.useState(0);
  const [targetInput, setTargetInput] = React.useState('');

  const naishin = parseFloat(naishinInput) || 0; // 135点満点
  const gakuryoku = parseFloat(gakuryokuInput) || 0; // 500点満点
  const tokushoku = parseFloat(tokushokuInput) || 0; // 最大100点（学校による）

  const { naishinConverted, gakuryokuConverted, s1, s2, ratio } = computeKanagawaSValue({
    naishinRaw: naishin,
    gakuryokuRaw: gakuryoku,
    tokushokuRaw: tokushoku,
    ratioIndex,
  });

  const hasInput = naishinInput !== '' || gakuryokuInput !== '';

  React.useEffect(() => {
    onResult?.(hasInput ? { total: s1, max: KANAGAWA_S_VALUE_MAX } : null);
  }, [hasInput, s1, onResult]);

  const reset = () => {
    setNaishinInput('');
    setGakuryokuInput('');
    setTokushokuInput('');
    setRatioIndex(0);
    setTargetInput('');
  };

  const getRankLabel = () => kanagawaRankLabel(s1);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">神奈川S値（S1・S2）を計算</h2>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 hover:bg-brand-50"
          >
            <RotateCcw className="h-4 w-4" />
            リセット
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-600">内申点・学力検査点・志望校の比率を入力してください</p>
      </div>

      <div className="space-y-5 p-5 md:p-6">
        {/* 内申点 */}
        <div>
          <label htmlFor="kanagawa-naishin" className="mb-1 block text-sm font-bold text-slate-900">
            内申点（135点満点）<span className="ml-2 text-xs font-normal text-slate-600">中2＋中3×2 / 9教科</span>
          </label>
          <input
            id="kanagawa-naishin"
            type="number"
            value={naishinInput}
            onChange={(e) => setNaishinInput(e.target.value)}
            placeholder="例：110"
            min="0"
            max="135"
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>

        {/* 学力検査 */}
        <div>
          <label htmlFor="kanagawa-gakuryoku" className="mb-1 block text-sm font-bold text-slate-900">
            学力検査点（500点満点）<span className="ml-2 text-xs font-normal text-slate-600">5教科 × 100点</span>
          </label>
          <input
            id="kanagawa-gakuryoku"
            type="number"
            value={gakuryokuInput}
            onChange={(e) => setGakuryokuInput(e.target.value)}
            placeholder="例：400"
            min="0"
            max="500"
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>

        {/* 志望校の比率 */}
        <div role="group" aria-labelledby="kanagawa-ratio-label">
          <div id="kanagawa-ratio-label" className="mb-1 text-sm font-bold text-slate-900">志望校の比率（内申：学力）</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {KANAGAWA_RATIO_OPTIONS.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setRatioIndex(i)}
                aria-pressed={i === ratioIndex}
                className={`min-h-[44px] rounded border px-3 py-2 text-sm font-bold transition-colors ${
                  i === ratioIndex
                    ? 'border-brand-700 bg-brand-700 text-white'
                    : 'border-slate-300 bg-white text-slate-900 hover:bg-brand-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 特色検査（任意） */}
        <div>
          <label htmlFor="kanagawa-tokushoku" className="mb-1 block text-sm font-bold text-slate-900">
            特色検査（任意・最大100点）<span className="ml-2 text-xs font-normal text-slate-600">難関校のみ実施</span>
          </label>
          <input
            id="kanagawa-tokushoku"
            type="number"
            value={tokushokuInput}
            onChange={(e) => setTokushokuInput(e.target.value)}
            placeholder="例：70（実施しない場合は空欄）"
            min="0"
            max="100"
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>
      </div>

      {/* 結果 */}
      {hasInput && (
        <div className="border-t border-slate-200 bg-brand-50 px-5 py-6 md:px-6">
          <div className="text-center">
            <div className="mb-2 text-sm font-bold text-slate-600">あなたのS1値（1000点満点）</div>
            <div className="text-5xl font-bold tabular-nums text-brand-700">{s1}<span className="text-xl">点</span></div>
            {tokushoku > 0 && (
              <div className="mt-3">
                <div className="text-sm font-bold text-slate-600">S2値（特色検査込み）</div>
                <div className="text-3xl font-bold tabular-nums text-brand-700">{s2}<span className="text-base">点</span></div>
              </div>
            )}
            <div className="mt-4 text-base font-bold text-slate-900">{getRankLabel()}</div>

            <div className="mt-4 border-y border-slate-200 py-3 text-left">
              <div className="mb-2 text-sm font-bold text-slate-900">計算内訳</div>
              <ul className="space-y-1 text-sm tabular-nums text-slate-900">
                <li>内申点換算：{naishin} ÷ 135 × 100 × {ratio.naishin} ＝ {Math.round(naishinConverted)}点</li>
                <li>学力検査換算：{gakuryoku} ÷ 500 × 100 × {ratio.gakuryoku} ＝ {Math.round(gakuryokuConverted)}点</li>
                <li className="border-t border-slate-200 pt-1 font-bold">S1値：{Math.round(naishinConverted)} + {Math.round(gakuryokuConverted)} ＝ {s1}点</li>
                {tokushoku > 0 && (
                  <li className="font-bold">S2値：S1 + 特色検査{tokushoku}×5 ＝ {s2}点</li>
                )}
              </ul>
            </div>
          </div>

          <TargetDistancePanel
            targetInput={targetInput}
            onTargetInputChange={setTargetInput}
            total={s1}
            totalMax={KANAGAWA_S_VALUE_MAX}
            inputId="kanagawa-total-score-target"
          />
        </div>
      )}
    </div>
  );
}
