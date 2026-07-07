'use client';

import * as React from 'react';
import { Target, TrendingUp, PartyPopper, CalendarRange } from 'lucide-react';

import { buildHensachiWeeklyPlan, roundHensachi } from '@/lib/hensachi';
import { track } from '@/lib/track';

interface HensachiGapToTargetProps {
  /** 現在の合計偏差値（HensachiCalculator の onResult から受け取る）。 */
  value: number | null;
  /** 目標・ギャップが決まるたびに呼ばれる（親がSaveResultCTAへ結線するため）。 */
  onTargetChange?: (target: number | null, gap: number | null) => void;
}

type GapState = 'met' | 'close' | 'far';

/**
 * 偏差値版ギャップ表示＋週次計画ジェネレータ（naishin用 Result/GapToTarget.tsx の偏差値版）。
 *
 * 目標の既定値は「偏差値+5」＝reachBandsForHensachi のチャレンジ帯と同じ経験則。
 * 週次計画は buildHensachiWeeklyPlan（現在値→目標値の直線按分）で生成し、断定的な学習計画は主張しない。
 * target/gap は親（HensachiResultFlow）へ伝え、既存の SaveResultCTA（LINE保存）の文脈に載せる＝C_p接続。
 */
export function HensachiGapToTarget({ value, onTargetChange }: HensachiGapToTargetProps) {
  const [target, setTarget] = React.useState<number | null>(null);
  const initializedRef = React.useRef(false);

  // 初回、現在値が出た瞬間に既定目標（+5＝チャレンジ帯）をセットする。
  React.useEffect(() => {
    if (value !== null && !initializedRef.current) {
      initializedRef.current = true;
      setTarget(roundHensachi(value + 5));
    }
  }, [value]);

  const gap = target !== null && value !== null ? roundHensachi(target - value) : null;
  const state: GapState | null = gap === null ? null : gap <= 0 ? 'met' : gap <= 2 ? 'close' : 'far';
  const plan = target !== null && value !== null ? buildHensachiWeeklyPlan(value, target, 5) : [];

  React.useEffect(() => {
    onTargetChange?.(target, gap);
  }, [target, gap, onTargetChange]);

  function handleTargetInput(raw: string) {
    if (raw === '') {
      setTarget(null);
      return;
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    setTarget(n);
    if (value !== null) {
      track('gap_target_set', { tool: 'hensachi', target: n, gap: roundHensachi(n - value) });
    }
  }

  if (value === null) return null;

  return (
    <div className="rounded-2xl border-2 border-purple-200 bg-white p-5 shadow-lg md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Target className="h-5 w-5 text-purple-600" />
        <div className="text-base font-bold text-slate-800">目標偏差値までの週次プラン</div>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-bold text-slate-600">
          目標偏差値（既定＝今の偏差値+5＝チャレンジ帯の目安）
        </span>
        <input
          type="number"
          inputMode="decimal"
          value={target ?? ''}
          onChange={(e) => handleTargetInput(e.target.value)}
          className="h-11 w-full max-w-[10rem] rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
        />
      </label>

      {state && gap !== null && target !== null && (
        <div className="mt-4 space-y-4">
          <div
            className={`rounded-xl border-2 p-4 text-center ${
              state === 'far'
                ? 'border-rose-200 bg-rose-50/70'
                : state === 'close'
                  ? 'border-amber-200 bg-amber-50/70'
                  : 'border-emerald-200 bg-emerald-50/70'
            }`}
          >
            {state === 'met' ? (
              <div className="flex items-center justify-center gap-2 text-emerald-800">
                <PartyPopper className="h-5 w-5" />
                <span className="text-base font-black">目標偏差値{target}に到達しています</span>
              </div>
            ) : (
              <div className={state === 'far' ? 'text-rose-800' : 'text-amber-800'}>
                <div className="text-xs font-bold opacity-80">目標偏差値{target}まで</div>
                <div className="text-2xl font-black tracking-tight">
                  あと <span className="text-3xl">{gap}</span>
                </div>
              </div>
            )}
          </div>

          {plan.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <CalendarRange className="h-3.5 w-3.5" />5週間で目標へ直線的に近づく場合の目安
              </div>
              <ul className="grid grid-cols-5 gap-1.5">
                {plan.map((p) => (
                  <li
                    key={p.week}
                    className="rounded-lg border border-purple-100 bg-purple-50/60 px-1 py-2 text-center"
                  >
                    <div className="text-[10px] font-bold text-slate-500">{p.week}週目</div>
                    <div className="text-sm font-black text-purple-700">{p.targetHensachi}</div>
                  </li>
                ))}
              </ul>
              <p className="mt-2 flex items-center gap-1 text-[11px] leading-relaxed text-slate-400">
                <TrendingUp className="h-3 w-3 shrink-0" />
                実際の伸びは一直線にはなりません。あくまで「均等に近づけた場合」の目安です。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
