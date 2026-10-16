'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown } from '@/components/icons';

import { track, funnel } from '@/lib/track';
import { calcAttainableRange, toGaihyou } from '@/lib/gakushu-seiseki';

export function TouseiHanICalculator() {
  const [currentSum, setCurrentSum] = React.useState<string>('');
  const [currentCount, setCurrentCount] = React.useState<string>('');
  const [remainingCount, setRemainingCount] = React.useState<string>('');
  const viewedRef = React.useRef(false);
  const startedRef = React.useRef(false);

  const sumNum = Number(currentSum);
  const countNum = Number(currentCount);
  const remainingNum = Number(remainingCount);
  const valid =
    currentSum !== '' &&
    currentCount !== '' &&
    remainingCount !== '' &&
    !Number.isNaN(sumNum) &&
    !Number.isNaN(countNum) &&
    !Number.isNaN(remainingNum) &&
    countNum >= 0 &&
    remainingNum >= 0 &&
    countNum + remainingNum > 0 &&
    sumNum >= countNum * 1 &&
    sumNum <= countNum * 5;

  const range = valid ? calcAttainableRange(sumNum, countNum, remainingNum) : null;

  const onChange = (setter: (v: string) => void) => (v: string) => {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ tool: 'tousei-han-i', placement: 'gakushu-seiseki-tousei-han-i' });
    }
    setter(v);
  };

  React.useEffect(() => {
    if (range && !viewedRef.current) {
      viewedRef.current = true;
      funnel.calcComplete({ tool: 'tousei-han-i', placement: 'gakushu-seiseki-tousei-han-i' }, { max: range.max, min: range.min });
      track('result_view', { source: 'tousei-han-i' });
    }
  }, [range]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-xl font-bold text-slate-900">現在までの実績を入力</h2>
        <p className="mt-1 text-sm text-slate-600">
          高1終了時点・高2終了時点など、これまでの評定の合計と件数を入力してください。
        </p>
      </div>

      <div className="grid gap-3 px-6 py-4 sm:grid-cols-3 sm:items-end">
        <div>
          <label className="mb-1 block text-sm font-bold text-slate-900">現在までの評定の合計</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={currentSum}
            onChange={(e) => onChange(setCurrentSum)(e.target.value)}
            placeholder="例: 70"
            aria-label="現在までの評定の合計"
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-slate-900">現在までの評定数</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={currentCount}
            onChange={(e) => onChange(setCurrentCount)(e.target.value)}
            placeholder="例: 20"
            aria-label="現在までの評定数"
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-slate-900">残りの評価回数（見込み）</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={remainingCount}
            onChange={(e) => onChange(setRemainingCount)(e.target.value)}
            placeholder="例: 10"
            aria-label="残りの評価回数"
            className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>
      </div>

      {valid && range && (
        <div className="border-t border-slate-200 bg-brand-50 px-6 py-6" role="status" aria-live="polite">
          <dl className="grid grid-cols-1 divide-y divide-slate-300 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="py-4 text-center first:pt-0 last:pb-0 sm:px-4 sm:py-0">
              <dt className="mb-1 flex items-center justify-center gap-1 text-sm font-bold text-brand-700">
                <TrendingUp className="h-4 w-4" />
                残り全部が5なら最大
              </dt>
              <dd>
                <span className="block text-4xl font-bold tabular-nums text-brand-700">{range.max.toFixed(1)}</span>
                <span className="mt-1 block text-sm font-bold text-slate-700">概評 {toGaihyou(range.max)}</span>
              </dd>
            </div>
            <div className="py-4 text-center first:pt-0 last:pb-0 sm:px-4 sm:py-0">
              <dt className="mb-1 flex items-center justify-center gap-1 text-sm font-bold text-slate-600">
                <TrendingDown className="h-4 w-4" />
                残り全部が1でも最低
              </dt>
              <dd>
                <span className="block text-4xl font-bold tabular-nums text-slate-700">{range.min.toFixed(1)}</span>
                <span className="mt-1 block text-sm font-bold text-slate-700">概評 {toGaihyou(range.min)}</span>
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
