'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ArrowUp, Minus } from 'lucide-react';

import type { Scores, ScoreMode } from '@/lib/types';
import { SUBJECTS } from '@/lib/constants';
import { Card } from '@/components/ui/Card';

interface SubjectBreakdownProps {
  scores: Scores;
  mode: ScoreMode;
}

export function SubjectBreakdown({ scores, mode }: SubjectBreakdownProps) {
  const subjectData = React.useMemo(() => {
    return SUBJECTS.map(subject => {
      const score = scores[subject.key];
      const multiplier = mode === 'tokyo' && subject.category === 'practical' ? 2 : 1;
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
  }, [scores, mode]);

  const lowSubjects = subjectData.filter(s => s.isLow);
  const highSubjects = subjectData.filter(s => s.isHigh);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 shadow-sm">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-800">教科別分析</div>
            <div className="text-xs text-slate-500">強み・弱みを把握しよう</div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid gap-2">
          {subjectData.map((subject, i) => (
            <motion.div
              key={subject.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group flex items-center gap-3 rounded-lg bg-slate-50 p-2.5 transition-colors hover:bg-slate-100"
            >
              <div className="w-16 shrink-0 text-xs font-medium text-slate-600">{subject.label}</div>
              <div className="flex-1">
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${subject.percent}%` }}
                    transition={{ duration: 0.5, delay: i * 0.03 }}
                    className={`h-full rounded-full ${
                      subject.isHigh ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                      subject.isLow ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
                      'bg-gradient-to-r from-blue-400 to-blue-500'
                    }`}
                  />
                </div>
              </div>
              <div className="flex w-12 items-center justify-end gap-1">
                <span className="text-sm font-bold text-slate-700">{subject.score}</span>
                <span className="text-xs text-slate-400">/5</span>
              </div>
              {mode === 'tokyo' && subject.category === 'practical' && (
                <div className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">×2</div>
              )}
            </motion.div>
          ))}
        </div>

        {(lowSubjects.length > 0 || highSubjects.length > 0) && (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {highSubjects.length > 0 && (
              <div className="rounded-xl bg-emerald-50 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-700">
                  <ArrowUp className="h-4 w-4" />
                  得意教科
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {highSubjects.map(s => (
                    <span key={s.key} className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {lowSubjects.length > 0 && (
              <div className="rounded-xl bg-amber-50 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-700">
                  <Minus className="h-4 w-4" />
                  伸びしろあり！
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {lowSubjects.map(s => (
                    <span key={s.key} className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
