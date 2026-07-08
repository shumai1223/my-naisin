'use client';

import * as React from 'react';

import { calcRequiredAverageForTarget } from '@/lib/hyotei-heikin';
import { funnel } from '@/lib/track';

export interface HyoteiHeikinGyakusanResult {
  /** 現在の評定平均。 */
  currentAverage: number;
  /** 目標の評定平均。 */
  targetAverage: number;
  /** 残りで必要な平均（達成可能かに関わらずそのままの理論値）。 */
  requiredAverageForRemaining: number;
  /** 目標までの差（評定平均単位・正=不足）。他の結果連動フローと同じ単位に揃える。 */
  gap: number;
}

interface HyoteiHeikinGyakusanCalculatorProps {
  /** 結果連動CTA：現在/目標/残り必要平均/差を親へ持ち上げる。 */
  onResult?: (result: HyoteiHeikinGyakusanResult | null) => void;
}

const TARGET_PRESETS = [3.5, 4.0, 4.3, 4.5, 5.0];

/**
 * 「推薦・総合型選抜に必要な評定平均に届かせるには、残りの評価で平均いくつ取ればよいか」を逆算する計算機。
 * 大学・学校ごとの出願基準は書かず（捏造回避）、ユーザー自身の現在の実績と残り回数から
 * 純粋な算数で解く（[[hyotei-heikin.ts]]のcalcRequiredAverageForTarget）。
 */
export function HyoteiHeikinGyakusanCalculator({ onResult }: HyoteiHeikinGyakusanCalculatorProps = {}) {
  const [currentAverage, setCurrentAverage] = React.useState('');
  const [currentCount, setCurrentCount] = React.useState('18');
  const [targetAverage, setTargetAverage] = React.useState('4.3');
  const [remainingCount, setRemainingCount] = React.useState('9');
  const trackedRef = React.useRef(false);

  function onFirstUse() {
    if (trackedRef.current) return;
    trackedRef.current = true;
    funnel.toolStart({ tool: 'hyotei-heikin-gyakusan', placement: 'hyotei-heikin-gyakusan' });
  }

  const currentAverageNum = Number(currentAverage);
  const currentCountNum = Number(currentCount) || 0;
  const targetAverageNum = Number(targetAverage);
  const remainingCountNum = Number(remainingCount) || 0;

  const hasInput = currentAverage !== '' && Number.isFinite(currentAverageNum) && Number.isFinite(targetAverageNum);

  const plan = hasInput
    ? calcRequiredAverageForTarget(currentAverageNum, currentCountNum, targetAverageNum, remainingCountNum)
    : null;

  React.useEffect(() => {
    if (!plan) {
      onResult?.(null);
      return;
    }
    onResult?.({
      currentAverage: currentAverageNum,
      targetAverage: targetAverageNum,
      requiredAverageForRemaining: plan.requiredAverageForRemaining,
      gap: targetAverageNum - currentAverageNum,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, currentAverageNum, targetAverageNum, onResult]);

  return (
    <div className="rounded-2xl border-2 border-emerald-200 bg-white p-5 shadow-lg md:p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <label htmlFor="hyotei-gyakusan-current-average" className="block">
          <span className="mb-1 block text-xs font-bold text-slate-600">現在の評定平均</span>
          <input
            id="hyotei-gyakusan-current-average"
            type="number"
            inputMode="decimal"
            min={1}
            max={5}
            step="0.1"
            value={currentAverage}
            onChange={(e) => {
              onFirstUse();
              setCurrentAverage(e.target.value);
            }}
            placeholder="例：4.0"
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
        <label htmlFor="hyotei-gyakusan-current-count" className="block">
          <span className="mb-1 block text-xs font-bold text-slate-600">現在までの評価済み回数（9教科×学期数）</span>
          <input
            id="hyotei-gyakusan-current-count"
            type="number"
            inputMode="numeric"
            min={0}
            value={currentCount}
            onChange={(e) => {
              onFirstUse();
              setCurrentCount(e.target.value);
            }}
            placeholder="例：18（9教科×2学期）"
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-5">
        <label htmlFor="hyotei-gyakusan-target" className="block">
          <span className="mb-1 block text-xs font-bold text-slate-600">目標の評定平均</span>
          <input
            id="hyotei-gyakusan-target"
            type="number"
            inputMode="decimal"
            min={1}
            max={5}
            step="0.1"
            value={targetAverage}
            onChange={(e) => {
              onFirstUse();
              setTargetAverage(e.target.value);
            }}
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {TARGET_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                onFirstUse();
                setTargetAverage(String(preset));
              }}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                targetAverage === String(preset)
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200'
              }`}
            >
              {preset.toFixed(1)}
            </button>
          ))}
        </div>

        <label htmlFor="hyotei-gyakusan-remaining" className="mt-4 block">
          <span className="mb-1 block text-xs font-bold text-slate-600">残りの評価回数（出願までにあと何回評価されるか）</span>
          <input
            id="hyotei-gyakusan-remaining"
            type="number"
            inputMode="numeric"
            min={0}
            value={remainingCount}
            onChange={(e) => {
              onFirstUse();
              setRemainingCount(e.target.value);
            }}
            placeholder="例：9（残り1学期分）"
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>

        {plan && (
          <div className="mt-4 rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 text-center" role="status" aria-live="polite">
            {plan.alreadyAchieved ? (
              <div className="text-sm font-bold text-emerald-700">
                現在の評定平均ですでに目標{targetAverage}に届いています
              </div>
            ) : remainingCountNum === 0 ? (
              <div className="text-sm font-bold text-rose-700">残りの評価回数が0のため、これ以上平均は変わりません</div>
            ) : (
              <>
                <div className="text-xs font-bold text-slate-600">目標{targetAverage}に必要な、残り{remainingCountNum}回の平均</div>
                <div className="mt-1 text-4xl font-black text-emerald-700">
                  {Math.round(plan.requiredAverageForRemaining * 100) / 100}
                  <span className="ml-1 text-base font-bold text-slate-500">/ 5.0</span>
                </div>
                <div className="mt-2 text-sm font-bold text-slate-700">
                  合計であと{plan.requiredTotalForRemaining}点（残り{remainingCountNum}回分）
                </div>
                {!plan.achievable && (
                  <div className="mt-2 text-xs font-bold text-rose-600">
                    5段階評価の最大値（オール5）でも届かない差です。目標の見直しや対策の相談も検討してください。
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
        ※ 「目標平均×（現在+残り回数）－現在の合計」を残り回数で割った逆算式で計算しています。
        推薦・総合型選抜で対象になる評価範囲（学年・学期）は学校・大学によって異なるため、
        現在の評定平均・評価済み回数・残り回数はご自身の状況に合わせて入力してください。
      </p>
    </div>
  );
}
