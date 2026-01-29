'use client';

import * as React from 'react';
import { Minus, Plus } from 'lucide-react';

import type { ScoreMode, Subject } from '@/lib/types';
import { clamp, cn, getSubjectWeight } from '@/lib/utils';


export interface SubjectSliderProps {
  subject: Subject;
  mode: ScoreMode;
  value: number;
  onChange: (nextValue: number) => void;
  maxGrade?: number;
}

export function SubjectSlider({ subject, mode, value, onChange, maxGrade = 5 }: SubjectSliderProps) {
  const weight = getSubjectWeight(mode, subject.category);

  const setValue = React.useCallback(
    (next: number) => {
      onChange(clamp(Math.round(next), 1, maxGrade));
    },
    [onChange, maxGrade]
  );

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold text-slate-700">{subject.label}</div>
            {weight > 1 ? (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                ×{weight}
              </span>
            ) : null}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">1〜{maxGrade}で評価</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setValue(value - 1)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 active:bg-slate-100"
            aria-label={`${subject.label}を1下げる`}
          >
            <Minus className="h-4 w-4" />
          </button>
          <div className="grid h-9 w-10 place-items-center rounded-lg bg-slate-100 text-lg font-bold text-slate-800">
            {value}
          </div>
          <button
            type="button"
            onClick={() => setValue(value + 1)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 active:bg-slate-100"
            aria-label={`${subject.label}を1上げる`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <input
          className={cn('naishin-range', 'cursor-pointer')}
          type="range"
          min={1}
          max={maxGrade}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          aria-label={`${subject.label}の内申点`}
        />
      </div>

      {maxGrade <= 5 && (
        <div className="mt-3 grid grid-cols-5 gap-1 md:hidden">
          {Array.from({ length: maxGrade }, (_, i) => i + 1).map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setValue(i)}
              className={cn(
                'h-8 rounded-lg text-sm font-semibold transition',
                i === value
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
