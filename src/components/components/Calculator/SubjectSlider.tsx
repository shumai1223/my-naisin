'use client';

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';

import type { Subject } from '@/lib/types';
import { clamp, cn, getSubjectWeight } from '@/lib/utils';


export interface SubjectSliderProps {
  subject: Subject;
  prefectureCode: string;
  value: number;
  onChange: (nextValue: number) => void;
  maxGrade?: number;
}

export function SubjectSlider({ subject, prefectureCode, value, onChange, maxGrade = 5 }: SubjectSliderProps) {
  const weight = getSubjectWeight(prefectureCode, subject.category);
  const isPractical = subject.category === 'practical';

  const setValue = React.useCallback(
    (next: number) => {
      onChange(clamp(Math.round(next), 1, maxGrade));
    },
    [onChange, maxGrade]
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* ヘッダー */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-slate-700">{subject.label}</div>
            {weight > 1 && (
              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
                ×{weight}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[11px] text-slate-500">
            {isPractical ? '実技教科' : '5教科'} • 評定 {value}
            {weight > 1 ? `（換算 ${value * weight}点）` : ''}
          </div>
        </div>

        {/* スコア表示と+/-ボタン */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setValue(value - 1)}
            disabled={value <= 1}
            className={cn(
              'grid h-9 w-9 place-items-center rounded-lg border transition-all',
              value <= 1
                ? 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 active:scale-95'
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
            className="h-10 w-14 rounded-lg bg-blue-500 text-center text-xl font-bold text-white shadow-sm outline-none focus:ring-2 focus:ring-blue-300 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            aria-label={`${subject.label}の内申点を入力`}
          />
          
          <button
            type="button"
            onClick={() => setValue(value + 1)}
            disabled={value >= maxGrade}
            className={cn(
              'grid h-9 w-9 place-items-center rounded-lg border transition-all',
              value >= maxGrade
                ? 'border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 active:scale-95'
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
        <div className="mt-3 grid grid-cols-5 gap-1.5 md:hidden">
          {Array.from({ length: maxGrade }, (_, i) => i + 1).map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setValue(i)}
              className={cn(
                'h-9 rounded-lg text-sm font-semibold transition-all',
                i === value
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95'
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
