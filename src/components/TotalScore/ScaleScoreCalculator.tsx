'use client';

import * as React from 'react';

import { scaleScore } from '@/lib/total-score/engine';
import { funnel } from '@/lib/track';

const RAW_MAX_PRESETS = [100, 135, 200, 300, 500] as const;
const TARGET_MAX_PRESETS = [1000, 500, 100] as const;

/**
 * 任意の満点の得点を、任意の目標満点（既定1000点）に換算する汎用計算機。
 * 新潟県の「調査書135点・学力500点をそれぞれ1000点に換算」方式と同じ比例計算（lib/total-score/engine.ts の scaleScore）を
 * 特定の県に限定せず使えるようにした版。県別の総合得点そのものを計算するツールではない。
 */
export function ScaleScoreCalculator() {
  const [rawMax, setRawMax] = React.useState('500');
  const [targetMax, setTargetMax] = React.useState('1000');
  const [score, setScore] = React.useState('');
  const trackedRef = React.useRef(false);

  function onFirstUse() {
    if (trackedRef.current) return;
    trackedRef.current = true;
    funnel.toolStart({ tool: 'total-score-mantenkan', placement: 'total-score-mantenkan' });
  }

  const rawMaxNum = Number(rawMax);
  const targetMaxNum = Number(targetMax);
  const scoreNum = Number(score);

  const result =
    score !== '' && Number.isFinite(rawMaxNum) && rawMaxNum > 0 && Number.isFinite(targetMaxNum) && targetMaxNum > 0
      ? scaleScore(scoreNum, rawMaxNum, targetMaxNum)
      : null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <div className="mb-4">
        <span className="mb-1 block text-sm font-bold text-slate-900">元の満点</span>
        <div className="flex flex-wrap gap-2">
          {RAW_MAX_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                onFirstUse();
                setRawMax(String(p));
              }}
              aria-pressed={Number(rawMax) === p}
              className={`min-h-[44px] rounded border px-3 text-sm font-bold tabular-nums transition-colors ${
                Number(rawMax) === p
                  ? 'border-brand-700 bg-brand-700 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-brand-50'
              }`}
            >
              {p}点満点
            </button>
          ))}
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={rawMax}
            onChange={(e) => {
              onFirstUse();
              setRawMax(e.target.value);
            }}
            className="h-11 w-28 rounded border border-slate-300 bg-white px-3 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-brand-700"
            aria-label="元の満点を直接入力"
          />
        </div>
      </div>

      <div className="mb-4">
        <span className="mb-1 block text-sm font-bold text-slate-900">換算後の満点</span>
        <div className="flex flex-wrap gap-2">
          {TARGET_MAX_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                onFirstUse();
                setTargetMax(String(p));
              }}
              aria-pressed={Number(targetMax) === p}
              className={`min-h-[44px] rounded border px-3 text-sm font-bold tabular-nums transition-colors ${
                Number(targetMax) === p
                  ? 'border-brand-700 bg-brand-700 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-brand-50'
              }`}
            >
              {p}点満点
            </button>
          ))}
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={targetMax}
            onChange={(e) => {
              onFirstUse();
              setTargetMax(e.target.value);
            }}
            className="h-11 w-28 rounded border border-slate-300 bg-white px-3 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-brand-700"
            aria-label="換算後の満点を直接入力"
          />
        </div>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-bold text-slate-900">自分の点数</span>
        <input
          type="number"
          inputMode="decimal"
          value={score}
          onChange={(e) => {
            onFirstUse();
            setScore(e.target.value);
          }}
          placeholder={`例：${Math.round(rawMaxNum * 0.7) || 350}`}
          className="h-12 w-full rounded border border-slate-300 bg-white px-3 text-base tabular-nums placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
        />
      </label>

      {result !== null ? (
        <div className="mt-5 rounded-lg border border-slate-200 bg-brand-50 p-4 md:p-5" role="status" aria-live="polite">
          <div className="text-sm font-bold text-slate-700">{rawMax}点満点中 {score}点 → {targetMax}点満点に換算すると</div>
          <div className="mt-1 text-4xl font-bold tabular-nums text-brand-700">{result}<span className="ml-1 text-base font-bold text-slate-600">点</span></div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">点数を入力してください</p>
      )}
      <p className="mt-3 text-sm leading-[1.7] text-slate-600">
        ※ 得点 ÷ 元の満点 × 換算後の満点、で比例計算しています（新潟県公立高校入試の「調査書・学力をそれぞれ1000点に換算する」方式と同じ考え方）。
      </p>
    </div>
  );
}
