'use client';

import * as React from 'react';

import { calcHensachi, roundHensachi } from '@/lib/hensachi';
import { funnel } from '@/lib/track';

const FULL_SCORE_PRESETS = [100, 300, 500, 900, 1000] as const;

/**
 * 満点が100点以外(500点満点・1000点満点など)のテスト・模試向けの偏差値計算機。
 * 偏差値の式は満点の大小に依存しない(score/average/stdDevの比が同じなら同じ偏差値)ため、
 * lib/hensachi.ts の calcHensachi をそのまま使う。標準偏差の既定値だけ満点に比例させる。
 */
export function FullScoreHensachiCalculator() {
  const [fullScore, setFullScore] = React.useState<string>('500');
  const [score, setScore] = React.useState('');
  const [average, setAverage] = React.useState('');
  const [stdDev, setStdDev] = React.useState('');
  const trackedRef = React.useRef(false);

  function onFirstUse() {
    if (trackedRef.current) return;
    trackedRef.current = true;
    funnel.toolStart({ tool: 'hensachi-mantenkan', placement: 'hensachi-mantenkan' });
  }

  const fullScoreNum = Number(fullScore);
  const scoreNum = Number(score);
  const averageNum = average === '' ? fullScoreNum * 0.5 : Number(average);
  const stdDevNum = stdDev === '' ? fullScoreNum * 0.15 : Number(stdDev);

  const hensachi =
    score !== '' && Number.isFinite(fullScoreNum) && fullScoreNum > 0
      ? calcHensachi(scoreNum, averageNum, stdDevNum)
      : null;

  return (
    <div className="rounded-2xl border-2 border-purple-200 bg-white p-5 shadow-lg md:p-6">
      <div className="mb-4">
        <span className="mb-1 block text-xs font-bold text-slate-600">満点</span>
        <div className="flex flex-wrap gap-2">
          {FULL_SCORE_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                onFirstUse();
                setFullScore(String(p));
              }}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                Number(fullScore) === p ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {p}点満点
            </button>
          ))}
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={fullScore}
            onChange={(e) => {
              onFirstUse();
              setFullScore(e.target.value);
            }}
            className="h-8 w-24 rounded-full border border-slate-200 px-3 text-xs outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            aria-label="満点を直接入力"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-slate-600">自分の点数</span>
          <input
            type="number"
            inputMode="decimal"
            value={score}
            onChange={(e) => {
              onFirstUse();
              setScore(e.target.value);
            }}
            placeholder={`例：${Math.round(fullScoreNum * 0.7) || 350}`}
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-slate-600">平均点（任意）</span>
          <input
            type="number"
            inputMode="decimal"
            value={average}
            onChange={(e) => {
              onFirstUse();
              setAverage(e.target.value);
            }}
            placeholder={`未入力なら${Math.round(fullScoreNum * 0.5) || 250}`}
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-slate-600">標準偏差（任意）</span>
          <input
            type="number"
            inputMode="decimal"
            value={stdDev}
            onChange={(e) => {
              onFirstUse();
              setStdDev(e.target.value);
            }}
            placeholder={`未入力なら${Math.round(fullScoreNum * 0.15) || 75}`}
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </label>
      </div>

      {hensachi !== null ? (
        <div className="mt-5 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-5 text-center" role="status" aria-live="polite">
          <div className="text-xs font-bold text-slate-600">{fullScore}点満点中 {score}点の偏差値</div>
          <div className="mt-1 text-4xl font-black text-purple-700">{roundHensachi(hensachi)}</div>
        </div>
      ) : (
        <p className="mt-4 text-center text-xs text-slate-400">点数を入力してください</p>
      )}
      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
        ※ 偏差値の式は満点の大きさに左右されません（点数・平均点・標準偏差の関係が同じなら、100点満点でも1000点満点でも同じ偏差値になります）。
        平均点・標準偏差が分からない場合は、平均点=満点の50%・標準偏差=満点の15%を仮定した目安値で計算します。
      </p>
    </div>
  );
}
