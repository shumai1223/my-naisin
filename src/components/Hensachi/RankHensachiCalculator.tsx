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
          onClick={() => {
            onFirstUse();
            setMode('fromHensachi');
          }}
          className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
            mode === 'fromHensachi' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          偏差値 → 順位
        </button>
        <ArrowLeftRight className="h-4 w-4 text-slate-400" />
        <button
          type="button"
          onClick={() => {
            onFirstUse();
            setMode('fromRank');
          }}
          className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
            mode === 'fromRank' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          順位 → 偏差値
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {mode === 'fromHensachi' ? (
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-600">偏差値</span>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={hensachi}
              onChange={(e) => {
                onFirstUse();
                setHensachi(e.target.value);
              }}
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </label>
        ) : (
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-600">自分の順位（上位から）</span>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={rank}
              onChange={(e) => {
                onFirstUse();
                setRank(e.target.value);
              }}
              className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </label>
        )}
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-slate-600">母集団の人数</span>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={population}
            onChange={(e) => {
              onFirstUse();
              setPopulation(e.target.value);
            }}
            className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </label>
      </div>

      {resultHensachi !== null && resultUpperPercent !== null && resultRank !== null ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-brand-100 bg-brand-50/50 p-3 text-center">
            <div className="text-lg font-bold text-brand-700">{roundHensachi(resultHensachi)}</div>
            <div className="mt-0.5 text-xs font-bold text-brand-600">偏差値</div>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 text-center">
            <div className="text-lg font-bold text-slate-700">{resultUpperPercent.toFixed(1)}%</div>
            <div className="mt-0.5 text-xs font-bold text-slate-600">上位</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
            <div className="text-lg font-bold text-slate-700">{resultRank}位</div>
            <div className="mt-0.5 text-xs font-bold text-slate-600">{population}人中</div>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-center text-xs text-slate-400">数値を入力してください</p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-slate-400">
        ※ 正規分布（平均50・標準偏差10）に基づく数学的な換算です。実際の模試の分布は完全な正規分布からややずれるため、
        特に偏差値の端（75以上・25以下）では目安としてご覧ください。
      </p>
    </div>
  );
}
