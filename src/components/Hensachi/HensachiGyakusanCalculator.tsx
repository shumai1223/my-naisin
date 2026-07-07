'use client';

import * as React from 'react';

import { calcHensachi, requiredScoreForHensachi, roundHensachi } from '@/lib/hensachi';
import { funnel } from '@/lib/track';

/**
 * 過去問・模試の得点から今の偏差値を出し、目標偏差値に必要な点数を逆算する計算機。
 * 2つの式はどちらも lib/hensachi.ts の同じ一次式（偏差値=50+10×(score-average)/stdDev）の
 * 順方向・逆方向であり、新しい計算ロジックは増やさない。
 */
export function HensachiGyakusanCalculator() {
  const [score, setScore] = React.useState('');
  const [average, setAverage] = React.useState('');
  const [stdDev, setStdDev] = React.useState('');
  const [targetHensachi, setTargetHensachi] = React.useState('60');
  const trackedRef = React.useRef(false);

  function onFirstUse() {
    if (trackedRef.current) return;
    trackedRef.current = true;
    funnel.toolStart({ tool: 'hensachi-gyakusan', placement: 'hensachi-gyakusan' });
  }

  const scoreNum = Number(score);
  const averageNum = average === '' ? 50 : Number(average);
  const stdDevNum = stdDev === '' ? 15 : Number(stdDev);
  const targetNum = Number(targetHensachi);

  const currentHensachi = score !== '' ? calcHensachi(scoreNum, averageNum, stdDevNum) : null;
  const requiredScore =
    Number.isFinite(targetNum) ? requiredScoreForHensachi(targetNum, averageNum, stdDevNum) : null;
  const gap = requiredScore !== null && score !== '' ? requiredScore - scoreNum : null;

  return (
    <div className="rounded-2xl border-2 border-purple-200 bg-white p-5 shadow-lg md:p-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-slate-600">過去問・模試の得点</span>
          <input
            type="number"
            inputMode="decimal"
            value={score}
            onChange={(e) => {
              onFirstUse();
              setScore(e.target.value);
            }}
            placeholder="例：65"
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-slate-600">平均点（任意・既定50）</span>
          <input
            type="number"
            inputMode="decimal"
            value={average}
            onChange={(e) => {
              onFirstUse();
              setAverage(e.target.value);
            }}
            placeholder="未入力なら50"
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-slate-600">標準偏差（任意・既定15）</span>
          <input
            type="number"
            inputMode="decimal"
            value={stdDev}
            onChange={(e) => {
              onFirstUse();
              setStdDev(e.target.value);
            }}
            placeholder="未入力なら15"
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </label>
      </div>

      {currentHensachi !== null && (
        <div className="mt-4 rounded-xl border border-purple-100 bg-purple-50/60 p-4 text-center">
          <div className="text-xs font-bold text-slate-600">今の得点での偏差値</div>
          <div className="mt-1 text-2xl font-black text-purple-700">{roundHensachi(currentHensachi)}</div>
        </div>
      )}

      <div className="mt-5 border-t border-slate-100 pt-5">
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-slate-600">目標の偏差値</span>
          <input
            type="number"
            inputMode="decimal"
            value={targetHensachi}
            onChange={(e) => {
              onFirstUse();
              setTargetHensachi(e.target.value);
            }}
            placeholder="例：60"
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </label>

        {requiredScore !== null && (
          <div className="mt-4 rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-5 text-center" role="status" aria-live="polite">
            <div className="text-xs font-bold text-slate-600">偏差値{targetHensachi}に必要な点数</div>
            <div className="mt-1 text-4xl font-black text-purple-700">
              {Math.round(requiredScore * 10) / 10}
              <span className="ml-1 text-base font-bold text-slate-500">点</span>
            </div>
            {gap !== null && (
              <div className={`mt-2 text-sm font-bold ${gap <= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {gap <= 0
                  ? `今の得点で目標まで届いています（${Math.round(Math.abs(gap) * 10) / 10}点の余裕）`
                  : `今の得点まであと ${Math.round(gap * 10) / 10} 点`}
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
        ※ 偏差値の式（偏差値 = 50 + 10 ×（点数 − 平均点）÷ 標準偏差）を点数について解いた逆算式で計算しています。
        平均点・標準偏差が分からない場合は一般的な定期テストの目安値（平均50・標準偏差15）で概算します。
      </p>
    </div>
  );
}
