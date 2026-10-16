'use client';

import * as React from 'react';

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
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-[17px] font-bold text-slate-900">1点アップの価値</h3>
      <p className="mt-1 text-sm text-slate-600">{prefecture.name}での計算</p>

      <dl className="mt-4 grid divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="py-4 sm:pr-4">
          <dt className="text-sm text-slate-600">5教科</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
            +{coreValue.rawPoints}点
          </dd>
          <dd className="text-sm tabular-nums text-slate-600">
            （{coreValue.percentageGain.toFixed(1)}%アップ）
          </dd>
          {prefecture.coreMultiplier > 1 && (
            <dd className="mt-2">
              <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs tabular-nums text-slate-700">
                {prefecture.coreMultiplier}倍で計算
              </span>
            </dd>
          )}
        </div>

        <div className="py-4 sm:pl-4">
          <dt className="text-sm text-slate-600">実技4教科</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
            +{practicalValue.rawPoints}点
          </dd>
          <dd className="text-sm tabular-nums text-slate-600">
            （{practicalValue.percentageGain.toFixed(1)}%アップ）
          </dd>
          {prefecture.practicalMultiplier > 1 && (
            <dd className="mt-2">
              <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs tabular-nums text-slate-700">
                {prefecture.practicalMultiplier}倍で計算
              </span>
            </dd>
          )}
        </div>
      </dl>

      {bestOpportunity.subjects.length > 0 && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4">
          <div className="text-sm font-bold text-slate-900">
            おすすめの伸ばしどころ
          </div>
          <p className="mt-1 text-sm leading-relaxed text-slate-900">
            {bestOpportunity.type === 'practical' ? (
              <>
                <strong>実技教科</strong>は
                {prefecture.practicalMultiplier}倍で計算されるため、
                1点上げると<strong>
                {practicalValue.percentageGain.toFixed(1)}%</strong>内申点がアップします。
              </>
            ) : (
              <>
                <strong>5教科</strong>のどれかを
                1点上げると<strong>
                {coreValue.percentageGain.toFixed(1)}%</strong>内申点がアップします。
              </>
            )}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {bestOpportunity.subjects.slice(0, 4).map(s => (
              <span
                key={s.key}
                className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs tabular-nums text-slate-700"
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
