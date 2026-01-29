'use client';

import * as React from 'react';
import { Minus, Plus, TrendingUp, Star } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const isMaxScore = value === maxGrade;
  const scorePercent = ((value - 1) / (maxGrade - 1)) * 100;

  const setValue = React.useCallback(
    (next: number) => {
      onChange(clamp(Math.round(next), 1, maxGrade));
    },
    [onChange, maxGrade]
  );

  // 評価に応じた色とラベル
  const scoreStyle = React.useMemo(() => {
    if (value === 5) return { color: 'text-emerald-600', bg: 'bg-emerald-500', label: '最高！', gradient: 'from-emerald-400 to-green-500' };
    if (value === 4) return { color: 'text-blue-600', bg: 'bg-blue-500', label: '良い！', gradient: 'from-blue-400 to-indigo-500' };
    if (value === 3) return { color: 'text-slate-600', bg: 'bg-slate-400', label: '普通', gradient: 'from-slate-400 to-slate-500' };
    if (value === 2) return { color: 'text-amber-600', bg: 'bg-amber-500', label: 'もう少し', gradient: 'from-amber-400 to-orange-500' };
    return { color: 'text-red-500', bg: 'bg-red-500', label: 'がんばれ', gradient: 'from-red-400 to-rose-500' };
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border-2 bg-white p-4 shadow-sm transition-all hover:shadow-lg',
        isMaxScore ? 'border-emerald-300 bg-gradient-to-br from-emerald-50/50 to-green-50/50' : 'border-slate-200/80',
        isPractical && weight > 1 && 'ring-2 ring-blue-100'
      )}
    >
      {/* 背景の装飾 */}
      {isMaxScore && (
        <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-200/30 blur-2xl" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {/* 教科アイコン */}
            <div className={cn(
              'grid h-8 w-8 place-items-center rounded-lg',
              isPractical ? 'bg-gradient-to-br from-violet-500 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            )}>
              {isPractical ? (
                <Star className="h-4 w-4 text-white" />
              ) : (
                <TrendingUp className="h-4 w-4 text-white" />
              )}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{subject.label}</div>
              <div className="flex items-center gap-1.5">
                {weight > 1 && (
                  <span className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    ×{weight}倍
                  </span>
                )}
                <span className="text-[10px] text-slate-400">
                  {isPractical ? '実技教科' : '5教科'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* スコア表示 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setValue(value - 1)}
            disabled={value <= 1}
            className={cn(
              'grid h-10 w-10 place-items-center rounded-xl border-2 transition-all',
              value <= 1
                ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 active:scale-95'
            )}
            aria-label={`${subject.label}を1下げる`}
          >
            <Minus className="h-5 w-5" />
          </button>
          
          <motion.div
            key={value}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className={cn(
              'relative grid h-12 w-14 place-items-center rounded-xl text-2xl font-black text-white shadow-lg',
              `bg-gradient-to-br ${scoreStyle.gradient}`
            )}
          >
            {value}
            {isMaxScore && (
              <div className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-amber-400 shadow-md">
                <Star className="h-3 w-3 text-amber-900" />
              </div>
            )}
          </motion.div>
          
          <button
            type="button"
            onClick={() => setValue(value + 1)}
            disabled={value >= maxGrade}
            className={cn(
              'grid h-10 w-10 place-items-center rounded-xl border-2 transition-all',
              value >= maxGrade
                ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 active:scale-95'
            )}
            aria-label={`${subject.label}を1上げる`}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* プログレスバーとスライダー */}
      <div className="mt-4">
        <div className="relative">
          {/* プログレスバー背景 */}
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className={cn('h-full rounded-full', `bg-gradient-to-r ${scoreStyle.gradient}`)}
              initial={{ width: 0 }}
              animate={{ width: `${scorePercent}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
          
          {/* スライダー */}
          <input
            className={cn('naishin-range', 'absolute inset-0 cursor-pointer opacity-0')}
            type="range"
            min={1}
            max={maxGrade}
            step={1}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            aria-label={`${subject.label}の内申点`}
          />
        </div>
        
        {/* スコアラベル */}
        <div className="mt-2 flex items-center justify-between">
          <span className={cn('text-xs font-semibold', scoreStyle.color)}>
            {scoreStyle.label}
          </span>
          <span className="text-[10px] text-slate-400">
            換算: {value * weight}点
          </span>
        </div>
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
                'h-10 rounded-xl text-sm font-bold transition-all',
                i === value
                  ? `bg-gradient-to-br ${scoreStyle.gradient} text-white shadow-md`
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95'
              )}
            >
              {i}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
