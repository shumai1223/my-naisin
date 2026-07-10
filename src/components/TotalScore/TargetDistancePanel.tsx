'use client';

import * as React from 'react';

interface TargetDistancePanelProps {
  targetInput: string;
  onTargetInputChange: (value: string) => void;
  /** 実測の総合得点。 */
  total: number;
  /** 総合得点の満点。 */
  totalMax: number;
  /** input要素のid（ページ内に複数配置する場合の重複回避用）。 */
  inputId?: string;
}

/**
 * 「目標の総合得点」入力＋距離表示（S-3①）。
 * 当日自己採点（学力検査＋内申）で実測した総合得点に対し、ユーザー自身が設定した目標との
 * 差を即時表示する。目標値は完全にユーザー入力＝学校別の合格ボーダーを断定しない（捏造ゼロ）。
 * 全13の総合得点計算機（共有/専用コンポーネント問わず）で同一のUI・注記文言を使うための単一ソース。
 */
export function TargetDistancePanel({
  targetInput,
  onTargetInputChange,
  total,
  totalMax,
  inputId = 'total-score-target',
}: TargetDistancePanelProps) {
  const targetTotal = parseFloat(targetInput) || 0;
  const hasTarget = targetInput !== '';
  const distance = hasTarget ? targetTotal - total : null;

  return (
    <div className="mt-6 rounded-xl border border-indigo-100 bg-white p-4">
      <label htmlFor={inputId} className="mb-2 block text-xs font-bold text-slate-600">
        目標の総合得点（任意・ご自身で設定した目安）
      </label>
      <input
        id={inputId}
        type="number"
        inputMode="decimal"
        min="0"
        max={totalMax}
        value={targetInput}
        onChange={(e) => onTargetInputChange(e.target.value)}
        placeholder="例：志望校の目安点"
        className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />
      {hasTarget && distance !== null && (
        <div
          className={`mt-3 rounded-lg p-3 text-center ${
            distance <= 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-indigo-50 text-indigo-800'
          }`}
          role="status"
          aria-live="polite"
        >
          {distance <= 0 ? (
            <span className="text-sm font-bold">目標の総合得点にすでに届いています。</span>
          ) : (
            <>
              <span className="text-xs font-bold">目標まであと</span>
              <span className="mx-1 text-2xl font-black">{Math.round(distance)}</span>
              <span className="text-xs font-bold">点</span>
            </>
          )}
        </div>
      )}
      <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
        ※ 目標の総合得点はご自身で設定した目安です。学校別の合格ボーダーではありません。
      </p>
    </div>
  );
}
