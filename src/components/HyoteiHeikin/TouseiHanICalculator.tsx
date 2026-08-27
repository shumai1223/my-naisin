'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown, Gauge } from 'lucide-react';

import { track, funnel } from '@/lib/track';
import { calcAttainableRange, toGaihyou, type GakushuSeihyou } from '@/lib/gakushu-seiseki';

const GAIHYOU_STYLE: Record<GakushuSeihyou, string> = {
  A: 'text-red-700',
  B: 'text-orange-700',
  C: 'text-amber-700',
  D: 'text-blue-700',
  E: 'text-slate-600',
};

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
    <div className="rounded-2xl border-2 border-emerald-200 bg-white shadow-lg overflow-hidden">
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <Gauge className="h-5 w-5 text-emerald-600" />
          現在までの実績を入力
        </h2>
        <p className="mt-2 text-xs text-slate-600">
          高1終了時点・高2終了時点など、これまでの評定の合計と件数を入力してください。
        </p>
      </div>

      <div className="grid gap-3 px-6 py-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-600">現在までの評定の合計</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={currentSum}
            onChange={(e) => onChange(setCurrentSum)(e.target.value)}
            placeholder="例: 70"
            aria-label="現在までの評定の合計"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-600">現在までの評定数</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={currentCount}
            onChange={(e) => onChange(setCurrentCount)(e.target.value)}
            placeholder="例: 20"
            aria-label="現在までの評定数"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-slate-600">残りの評価回数（見込み）</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={remainingCount}
            onChange={(e) => onChange(setRemainingCount)(e.target.value)}
            placeholder="例: 10"
            aria-label="残りの評価回数"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          />
        </div>
      </div>

      {valid && range && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-6 border-t-2 border-emerald-200" role="status" aria-live="polite">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border-2 border-emerald-300 bg-white p-4 text-center">
              <div className="mb-1 flex items-center justify-center gap-1 text-xs font-bold text-emerald-700">
                <TrendingUp className="h-4 w-4" />
                残り全部が5なら最大
              </div>
              <div className="text-4xl font-black text-emerald-700">{range.max.toFixed(1)}</div>
              <div className={`mt-1 text-xs font-bold ${GAIHYOU_STYLE[toGaihyou(range.max)]}`}>
                概評 {toGaihyou(range.max)}
              </div>
            </div>
            <div className="rounded-xl border-2 border-slate-300 bg-white p-4 text-center">
              <div className="mb-1 flex items-center justify-center gap-1 text-xs font-bold text-slate-600">
                <TrendingDown className="h-4 w-4" />
                残り全部が1でも最低
              </div>
              <div className="text-4xl font-black text-slate-700">{range.min.toFixed(1)}</div>
              <div className={`mt-1 text-xs font-bold ${GAIHYOU_STYLE[toGaihyou(range.min)]}`}>
                概評 {toGaihyou(range.min)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
