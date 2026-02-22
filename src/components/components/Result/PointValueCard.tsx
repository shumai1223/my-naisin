'use client';

import * as React from 'react';
import { TrendingUp, Sparkles, Star } from 'lucide-react';

import { getPrefectureByCode } from '@/lib/prefectures';
import { calculatePointValue } from '@/lib/prefecture-helpers';
import { SUBJECTS } from '@/lib/constants';
import type { Scores } from '@/lib/types';

interface PointValueCardProps {
  scores: Scores;
  prefectureCode: string;
}

export function PointValueCard({ scores, prefectureCode }: PointValueCardProps) {
  const prefecture = getPrefectureByCode(prefectureCode);
  
  if (!prefecture) return null;

  const coreValue = calculatePointValue(prefectureCode, true);
  const practicalValue = calculatePointValue(prefectureCode, false);

  const coreSubjects = SUBJECTS.filter(s => s.category === 'core');
  const practicalSubjects = SUBJECTS.filter(s => s.category === 'practical');

  const improvableCore = coreSubjects.filter(s => scores[s.key] < 5);
  const improvablePractical = practicalSubjects.filter(s => scores[s.key] < 5);

  const bestOpportunity = practicalValue.percentageGain > coreValue.percentageGain
    ? { type: 'practical', subjects: improvablePractical, value: practicalValue }
    : { type: 'core', subjects: improvableCore, value: coreValue };

  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">1点アップの価値</h3>
          <p className="text-xs text-slate-500">{prefecture.name}での計算</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-blue-200 bg-white p-4">
          <div className="mb-2 text-xs font-medium text-blue-600">5教科</div>
          <div className="text-2xl font-bold text-blue-700">
            +{coreValue.rawPoints}点
          </div>
          <div className="text-xs text-slate-500">
            （{coreValue.percentageGain.toFixed(1)}%アップ）
          </div>
          {prefecture.coreMultiplier > 1 && (
            <div className="mt-2 rounded bg-blue-50 px-2 py-1 text-xs text-blue-600">
              {prefecture.coreMultiplier}倍で計算
            </div>
          )}
        </div>

        <div className="rounded-xl border border-purple-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-1 text-xs font-medium text-purple-600">
            実技4教科
            {practicalValue.percentageGain > coreValue.percentageGain && (
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            )}
          </div>
          <div className="text-2xl font-bold text-purple-700">
            +{practicalValue.rawPoints}点
          </div>
          <div className="text-xs text-slate-500">
            （{practicalValue.percentageGain.toFixed(1)}%アップ）
          </div>
          {prefecture.practicalMultiplier > 1 && (
            <div className="mt-2 rounded bg-purple-50 px-2 py-1 text-xs text-purple-600">
              {prefecture.practicalMultiplier}倍で計算
            </div>
          )}
        </div>
      </div>

      {bestOpportunity.subjects.length > 0 && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-emerald-700">
            <Sparkles className="h-4 w-4" />
            おすすめの伸ばしどころ
          </div>
          <p className="text-sm text-slate-600">
            {bestOpportunity.type === 'practical' ? (
              <>
                <strong className="text-purple-700">実技教科</strong>は
                {prefecture.practicalMultiplier}倍で計算されるため、
                1点上げると<strong className="text-emerald-700">
                {practicalValue.percentageGain.toFixed(1)}%</strong>も内申点がアップします！
              </>
            ) : (
              <>
                <strong className="text-blue-700">5教科</strong>のどれかを
                1点上げると<strong className="text-emerald-700">
                {coreValue.percentageGain.toFixed(1)}%</strong>内申点がアップします。
              </>
            )}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {bestOpportunity.subjects.slice(0, 4).map(s => (
              <span
                key={s.key}
                className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600 shadow-sm"
              >
                {s.label}: {scores[s.key]} → {scores[s.key] + 1}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
