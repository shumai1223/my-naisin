'use client';

import * as React from 'react';
import { Target, ChevronDown } from 'lucide-react';

import type { TotalScoreSystem } from '@/lib/total-score/types';
import { requiredAcademicRaw } from '@/lib/total-score/engine';
import { EVENTS, track } from '@/lib/track';

interface Props {
  system: TotalScoreSystem;
}

/**
 * 総合得点方式の県向け「あと何点」逆算（B-2：/reverse の calcType 方式とは別に、
 * total-score/engine.ts の統一エンジンを使う registry 5県に reverse を展開する）。
 * 目標総合点・現在の内申素点から、必要な学力検査の素点を requiredAcademicRaw で逆算する。
 */
export function TotalScoreReverseCalculator({ system }: Props) {
  const [reportInput, setReportInput] = React.useState('');
  const [targetInput, setTargetInput] = React.useState('');
  const [optionId, setOptionId] = React.useState(system.ratioOptions[0].id);
  const trackedRef = React.useRef(false);
  const multipleOptions = system.ratioOptions.length > 1;

  function onFirstUse() {
    if (trackedRef.current) return;
    trackedRef.current = true;
    track(EVENTS.REVERSE_CALC_USE, { pref: system.code, tool: 'total-score' });
  }

  const reportRaw = parseFloat(reportInput) || 0;
  const targetTotal = parseFloat(targetInput) || 0;
  const hasInput = reportInput !== '' && targetInput !== '';

  const result = hasInput
    ? requiredAcademicRaw(system, { targetTotal, reportRaw, ratioOptionId: optionId })
    : null;

  const status: 'met' | 'unreachable' | 'normal' | null =
    result === null
      ? null
      : result.requiredAcademicRaw <= 0
        ? 'met'
        : result.requiredAcademicRaw > system.academic.rawMax
          ? 'unreachable'
          : 'normal';

  return (
    <div className="rounded-2xl border-2 border-indigo-200 bg-white p-5 shadow-lg md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Target className="h-5 w-5 text-indigo-600" />
        <h2 className="text-base font-bold text-slate-800">
          目標の総合得点から、必要な学力検査点を逆算
        </h2>
      </div>

      {multipleOptions && (
        <div className="mb-4">
          <label htmlFor="total-score-reverse-ratio" className="mb-2 block text-sm font-bold text-slate-700">
            志望校の「内申：学力」の比率
          </label>
          <div className="relative">
            <select
              id="total-score-reverse-ratio"
              value={optionId}
              onChange={(e) => {
                onFirstUse();
                setOptionId(e.target.value);
              }}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              {system.ratioOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-slate-600">
            今の内申点（{system.report.rawMax}点満点）
          </span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            max={system.report.rawMax}
            value={reportInput}
            onChange={(e) => {
              onFirstUse();
              setReportInput(e.target.value);
            }}
            placeholder={`例：${Math.round(system.report.rawMax * 0.75)}`}
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-bold text-slate-600">目標の総合得点</span>
          <input
            type="number"
            inputMode="decimal"
            min={0}
            value={targetInput}
            onChange={(e) => {
              onFirstUse();
              setTargetInput(e.target.value);
            }}
            placeholder="例：志望校の目安点"
            className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </label>
      </div>

      {status && result && (
        <div
          className={`mt-5 rounded-xl border-2 p-5 text-center ${
            status === 'unreachable'
              ? 'border-rose-200 bg-rose-50/70'
              : status === 'met'
                ? 'border-emerald-200 bg-emerald-50/70'
                : 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50'
          }`}
          role="status"
          aria-live="polite"
        >
          {status === 'met' && (
            <div className="text-sm font-bold text-emerald-800">
              今の内申点だけで、目標の総合得点にすでに届いています。
            </div>
          )}
          {status === 'unreachable' && (
            <div className="text-sm font-bold text-rose-800">
              学力検査で満点（{system.academic.rawMax}点）を取っても、目標には届きません。目標総合得点を見直すか、内申点を上げる必要があります。
            </div>
          )}
          {status === 'normal' && (
            <>
              <div className="text-xs font-bold text-slate-600">学力検査で必要な点数</div>
              <div className="mt-1 text-4xl font-black text-indigo-700">
                {Math.round(result.requiredAcademicRaw)}
                <span className="ml-1 text-base font-bold text-slate-500">/{system.academic.rawMax}点</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                得点率 {((result.requiredAcademicRaw / system.academic.rawMax) * 100).toFixed(1)}%
              </div>
            </>
          )}
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
        ※ 目標の総合得点はご自身で設定した目安です。学校別の合格ボーダーではありません。実際の合否は倍率・他の受験者の得点で変動します。
      </p>
    </div>
  );
}
