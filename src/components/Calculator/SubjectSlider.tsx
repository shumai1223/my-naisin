'use client';

import * as React from 'react';
import { Minus, Plus } from '@/components/icons';

import type { Subject } from '@/lib/types';
import { clamp, cn, getSubjectWeight } from '@/lib/utils';


export interface SubjectSliderProps {
  subject: Subject;
  prefectureCode: string;
  value: number;
  onChange: (nextValue: number) => void;
  maxGrade?: number;
  /** 2026-08-01 Cowork指摘: まだ一度も操作されていない（初期値のまま気づかれていない可能性がある）教科。 */
  isUnconfirmed?: boolean;
}

export function SubjectSlider({ subject, prefectureCode, value, onChange, maxGrade = 5, isUnconfirmed = false }: SubjectSliderProps) {
  const weight = getSubjectWeight(prefectureCode, subject.category);
  const isPractical = subject.category === 'practical';

  const setValue = React.useCallback(
    (next: number) => {
      onChange(clamp(Math.round(next), 1, maxGrade));
    },
    [onChange, maxGrade]
  );

  return (
    // data-no-rage: ステッパー/スライダー/クイック選択の連打はすべて正当な操作なので、カード全体を rage_click から除外（偽陽性の根絶）。
    <div
      className={cn(
        'rounded-lg border bg-white p-4',
        isUnconfirmed ? 'border-dashed border-amber-300' : 'border-slate-200'
      )}
      data-no-rage
    >
      {/* ヘッダー */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="truncate text-sm font-bold text-slate-900">{subject.label}</div>
            {weight > 1 && (
              <span className="shrink-0 whitespace-nowrap rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-bold tabular-nums text-slate-700">
                ×{weight}
              </span>
            )}
            {isUnconfirmed && (
              <span className="shrink-0 whitespace-nowrap rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-900">
                未確認
              </span>
            )}
          </div>
          <div className="mt-0.5 text-xs tabular-nums text-slate-600">
            {isPractical ? '実技教科' : '5教科'} • 評定 {value}
            {weight > 1 ? `（換算 ${value * weight}点）` : ''}
          </div>
        </div>

        {/* スコア表示と+/-ボタン（連打が正当なので rage_click 計測から除外） */}
        <div className="flex shrink-0 items-center gap-2" data-no-rage>
          <button
            type="button"
            onClick={() => setValue(value - 1)}
            disabled={value <= 1}
            className={cn(
              'grid h-11 w-11 place-items-center rounded border transition-colors duration-100',
              value <= 1
                ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-700 opacity-60'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            )}
            aria-label={`${subject.label}を1下げる`}
          >
            <Minus className="h-4 w-4" />
          </button>

          <input
            type="number"
            min={1}
            max={maxGrade}
            value={value}
            onChange={(e) => {
              const num = parseInt(e.target.value, 10);
              if (!isNaN(num)) setValue(num);
            }}
            onBlur={(e) => {
              const num = parseInt(e.target.value, 10);
              if (isNaN(num) || num < 1) setValue(1);
              else if (num > maxGrade) setValue(maxGrade);
            }}
            className="h-11 w-14 rounded border border-slate-300 bg-white text-center text-xl font-bold tabular-nums text-slate-900 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            aria-label={`${subject.label}の内申点を入力`}
          />

          <button
            type="button"
            onClick={() => setValue(value + 1)}
            disabled={value >= maxGrade}
            className={cn(
              'grid h-11 w-11 place-items-center rounded border transition-colors duration-100',
              value >= maxGrade
                ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-700 opacity-60'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            )}
            aria-label={`${subject.label}を1上げる`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* スライダー */}
      <div className="px-1">
        <input
          className="naishin-range"
          type="range"
          min={1}
          max={maxGrade}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label={`${subject.label}の内申点`}
        />
      </div>

      {/* モバイル用クイック選択ボタン */}
      {maxGrade <= 5 && (
        <div className="mt-3 grid grid-cols-5 gap-2 md:hidden" data-no-rage>
          {Array.from({ length: maxGrade }, (_, i) => i + 1).map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setValue(i)}
              aria-label={`${subject.label}の評定を${i}にする`}
              aria-pressed={i === value}
              className={cn(
                'h-11 rounded border text-sm font-bold tabular-nums transition-colors duration-100',
                i === value
                  ? 'border-brand-700 bg-brand-700 text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              )}
            >
              {i}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
