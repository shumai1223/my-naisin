'use client';

import * as React from 'react';

import { track, funnel } from '@/lib/track';
import { toGaihyou, type GakushuSeihyou } from '@/lib/gakushu-seiseki';
import { calcRequiredAverageForTarget } from '@/lib/hyotei-heikin';

/** 1つ上の概評に上がるために必要な「全体の学習成績の状況」の下限値。既にAなら次はない。 */
const NEXT_RANK: Record<GakushuSeihyou, { rank: GakushuSeihyou; threshold: number } | null> = {
  A: null,
  B: { rank: 'A', threshold: 4.3 },
  C: { rank: 'B', threshold: 3.5 },
  D: { rank: 'C', threshold: 2.7 },
  E: { rank: 'D', threshold: 1.9 },
};

export function GaihyouDistanceCalculator() {
  const [current, setCurrent] = React.useState<string>('');
  const [currentCount, setCurrentCount] = React.useState<string>('');
  const [remainingCount, setRemainingCount] = React.useState<string>('');
  const viewedRef = React.useRef(false);
  const startedRef = React.useRef(false);

  const currentValue = current === '' ? null : Number(current);
  const valid = currentValue !== null && !Number.isNaN(currentValue) && currentValue >= 1.0 && currentValue <= 5.0;
  const gaihyou = valid ? toGaihyou(currentValue as number) : null;
  const next = gaihyou ? NEXT_RANK[gaihyou] : null;
  const distance = next && valid ? Math.round((next.threshold - (currentValue as number)) * 10) / 10 : null;

  const currentCountNum = Number(currentCount);
  const remainingCountNum = Number(remainingCount);
  const canProject =
    valid && next !== null && currentCount !== '' && remainingCount !== '' && !Number.isNaN(currentCountNum) && !Number.isNaN(remainingCountNum) && remainingCountNum > 0;
  const projection = canProject
    ? calcRequiredAverageForTarget(currentValue as number, currentCountNum, next!.threshold, remainingCountNum)
    : null;

  const onChangeCurrent = (v: string) => {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ tool: 'gaihyou-distance', placement: 'gakushu-seiseki-gaihyou' });
    }
    setCurrent(v);
  };

  React.useEffect(() => {
    if (valid && !viewedRef.current) {
      viewedRef.current = true;
      funnel.calcComplete({ tool: 'gaihyou-distance', placement: 'gakushu-seiseki-gaihyou' }, { current: currentValue ?? 0 });
      track('result_view', { source: 'gaihyou-distance' });
    }
  }, [valid, currentValue]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <h2 className="text-xl font-bold text-slate-900">現在の全体の学習成績の状況を入力</h2>
      </div>

      <div className="px-5 py-4 md:px-6">
        <label className="mb-1 block text-sm font-bold text-slate-900">全体の学習成績の状況（1.0〜5.0）</label>
        <input
          type="number"
          inputMode="decimal"
          min={1.0}
          max={5.0}
          step={0.1}
          value={current}
          onChange={(e) => onChangeCurrent(e.target.value)}
          placeholder="例: 3.4"
          aria-label="全体の学習成績の状況"
          className="h-11 w-full max-w-[10rem] rounded border border-slate-300 bg-white px-3 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-brand-700"
        />
      </div>

      {valid && gaihyou && (
        <div className="border-t border-slate-200 bg-brand-50 px-5 py-6 md:px-6" role="status" aria-live="polite">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="text-center">
              <div className="mb-1 text-sm text-slate-600">現在の学習成績概評</div>
              <div className="text-5xl font-bold text-brand-700">{gaihyou}</div>
            </div>
            <div className="text-center">
              {next ? (
                <>
                  <div className="mb-1 text-sm text-slate-600">
                    {next.rank}まであと
                  </div>
                  <div className="text-5xl font-bold tabular-nums text-brand-700">{distance !== null ? distance.toFixed(1) : '—'}</div>
                  <div className="mt-1 text-sm text-slate-600">全体の学習成績の状況を上げる必要</div>
                </>
              ) : (
                <div className="text-base font-bold text-brand-700">
                  すでに最上位の概評Aです
                </div>
              )}
            </div>
          </div>

          {next && (
            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-2 text-sm font-bold text-slate-900">残りの科目数から逆算する（任意）</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-slate-600">現在までの評定数</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={currentCount}
                    onChange={(e) => setCurrentCount(e.target.value)}
                    placeholder="例: 20"
                    aria-label="現在までの評定数"
                    className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-brand-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-600">残りの評価回数</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={remainingCount}
                    onChange={(e) => setRemainingCount(e.target.value)}
                    placeholder="例: 10"
                    aria-label="残りの評価回数"
                    className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-brand-700"
                  />
                </div>
              </div>
              {projection && (
                <div className="mt-3 text-center">
                  {projection.alreadyAchieved ? (
                    <div className="text-base font-bold text-brand-700">すでに{next.rank}に必要な水準に達しています</div>
                  ) : (
                    <>
                      <div className="text-sm text-slate-600">
                        {next.rank}（{next.threshold.toFixed(1)}以上）に届かせるには、残りの評価で平均
                      </div>
                      <div className="text-3xl font-bold tabular-nums text-brand-700">
                        {projection.requiredAverageForRemaining.toFixed(2)}
                      </div>
                      <div className="text-sm text-slate-600">
                        が必要です{!projection.achievable && '（5段階評価では理論上届きません）'}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
