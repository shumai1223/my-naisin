'use client';

import * as React from 'react';
import { ArrowLeftRight } from '@/components/icons';

import { hensachiToUpperPercent, hensachiToRank, rankToHensachi, roundHensachi } from '@/lib/hensachi';
import { funnel } from '@/lib/track';

type Mode = 'fromHensachi' | 'fromRank';

/**
 * 「偏差値→上位%・順位 完全対応表」の数式（hensachi.ts）をそのままUI化した双方向計算機。
 * 表の16行だけでなく任意の値・任意の母集団人数で計算できる（Dataset化済み対応表の補完）。
 */
export function RankHensachiCalculator() {
  const [mode, setMode] = React.useState<Mode>('fromHensachi');
  const [hensachi, setHensachi] = React.useState('60');
  const [rank, setRank] = React.useState('48');
  const [population, setPopulation] = React.useState('300');
  const trackedRef = React.useRef(false);

  function onFirstUse() {
    if (trackedRef.current) return;
    trackedRef.current = true;
    funnel.toolStart({ tool: 'hensachi-rank-calc' });
  }

  const populationNum = Number(population);
  const validPopulation = Number.isFinite(populationNum) && populationNum > 0;

  let resultHensachi: number | null = null;
  let resultUpperPercent: number | null = null;
  let resultRank: number | null = null;

  if (mode === 'fromHensachi') {
    const h = Number(hensachi);
    if (Number.isFinite(h) && validPopulation) {
      resultHensachi = h;
      resultUpperPercent = hensachiToUpperPercent(h);
      resultRank = hensachiToRank(h, populationNum);
    }
  } else {
    const r = Number(rank);
    if (Number.isFinite(r) && r > 0 && validPopulation) {
      resultHensachi = rankToHensachi(r, populationNum);
      resultUpperPercent = resultHensachi !== null ? hensachiToUpperPercent(resultHensachi) : null;
      resultRank = Math.min(r, populationNum);
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <div className="mb-4 flex items-center justify-center gap-2">
        <button
          type="button"
          aria-pressed={mode === 'fromHensachi'}
          onClick={() => {
            onFirstUse();
            setMode('fromHensachi');
          }}
          className={`min-h-[44px] rounded border px-4 text-sm font-bold transition-colors ${
            mode === 'fromHensachi'
              ? 'border-brand-700 bg-brand-700 text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:bg-brand-50'
          }`}
        >
          偏差値 → 順位
        </button>
        <ArrowLeftRight className="h-4 w-4 shrink-0 text-slate-600" />
        <button
          type="button"
          aria-pressed={mode === 'fromRank'}
          onClick={() => {
            onFirstUse();
            setMode('fromRank');
          }}
          className={`min-h-[44px] rounded border px-4 text-sm font-bold transition-colors ${
            mode === 'fromRank'
              ? 'border-brand-700 bg-brand-700 text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:bg-brand-50'
          }`}
        >
          順位 → 偏差値
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {mode === 'fromHensachi' ? (
          <label className="block">
            <span className="mb-1 block text-sm font-bold text-slate-900">偏差値</span>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={hensachi}
              onChange={(e) => {
                onFirstUse();
                setHensachi(e.target.value);
              }}
              className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-brand-700"
            />
          </label>
        ) : (
          <label className="block">
            <span className="mb-1 block text-sm font-bold text-slate-900">自分の順位（上位から）</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={rank}
              onChange={(e) => {
                onFirstUse();
                setRank(e.target.value);
              }}
              className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-brand-700"
            />
          </label>
        )}
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-slate-900">母集団の人数</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={population}
            onChange={(e) => {
              onFirstUse();
              setPopulation(e.target.value);
            }}
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </label>
      </div>

      {resultHensachi !== null && resultUpperPercent !== null && resultRank !== null ? (
        <dl className="mt-4 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 text-center">
          <div className="min-w-0 px-2 py-4">
            <dt className="text-xs text-slate-600">偏差値</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-brand-700">{roundHensachi(resultHensachi)}</dd>
          </div>
          <div className="min-w-0 px-2 py-4">
            <dt className="text-xs text-slate-600">上位</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{resultUpperPercent.toFixed(1)}%</dd>
          </div>
          <div className="min-w-0 px-2 py-4">
            <dt className="break-all text-xs text-slate-600">{population}人中</dt>
            <dd className="mt-1 break-all text-2xl font-bold tabular-nums text-slate-900">{resultRank}位</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-4 text-center text-sm text-slate-600">数値を入力してください</p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-slate-600">
        ※ 正規分布（平均50・標準偏差10）に基づく数学的な換算です。実際の模試の分布は完全な正規分布からややずれるため、
        特に偏差値の端（75以上・25以下）では目安としてご覧ください。
      </p>
    </div>
  );
}
