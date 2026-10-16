'use client';

import * as React from 'react';

import type { Scores } from '@/lib/types';
import { SUBJECTS } from '@/lib/constants';
import { getSubjectWeight } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

interface SubjectBreakdownProps {
  scores: Scores;
  prefectureCode: string;
}

export function SubjectBreakdown({ scores, prefectureCode }: SubjectBreakdownProps) {
  const subjectData = React.useMemo(() => {
    return SUBJECTS.map(subject => {
      const score = scores[subject.key];
      const multiplier = getSubjectWeight(prefectureCode, subject.category);
      const weighted = score * multiplier;
      const maxWeighted = 5 * multiplier;
      const percent = (weighted / maxWeighted) * 100;
      
      return {
        ...subject,
        score,
        weighted,
        maxWeighted,
        percent,
        isLow: score <= 2,
        isHigh: score >= 4
      };
    });
  }, [scores, prefectureCode]);

  const lowSubjects = subjectData.filter(s => s.isLow);
  const highSubjects = subjectData.filter(s => s.isHigh);

  return (
    <Card className="p-5">
      <h3 className="text-[17px] font-bold text-slate-900">教科別分析</h3>
      <p className="mt-1 text-sm text-slate-600">強み・弱みを確認できます</p>

      <ul className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
        {subjectData.map((subject) => (
          <li
            key={subject.key}
            className="grid grid-cols-[3rem_1fr_2.5rem_3rem] items-center gap-3 py-2"
          >
            <span className="text-sm text-slate-900">{subject.label}</span>
            {/* バーは width をインラインで指定する（framer-motion非依存）。値は右の数字でも示す */}
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${subject.isLow ? 'bg-amber-600' : 'bg-brand-600'}`}
                style={{ width: `${subject.percent}%` }}
              />
            </div>
            <div className="flex items-baseline justify-end gap-0.5 tabular-nums">
              <span className="text-sm font-bold text-slate-900">{subject.score}</span>
              <span className="text-xs text-slate-600">/5</span>
            </div>
            {getSubjectWeight(prefectureCode, subject.category) > 1 && (
              <span className="inline-flex items-center justify-self-end rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs tabular-nums text-slate-700">
                ×{getSubjectWeight(prefectureCode, subject.category)}
              </span>
            )}
          </li>
        ))}
      </ul>

      {(lowSubjects.length > 0 || highSubjects.length > 0) && (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {highSubjects.length > 0 && (
            <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
              <h4 className="text-sm font-bold text-slate-900">得意教科</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {highSubjects.map(s => (
                  <span key={s.key} className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          )}
          {lowSubjects.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h4 className="text-sm font-bold text-amber-900">伸びしろのある教科</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {lowSubjects.map(s => (
                  <span key={s.key} className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
