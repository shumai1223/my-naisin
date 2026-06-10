'use client';

import * as React from 'react';
import { Calculator, RotateCcw } from 'lucide-react';

import { track, funnel } from '@/lib/track';

const SUBJECTS = [
  { key: 'kokugo', label: '国語', group: 'main' as const },
  { key: 'sugaku', label: '数学', group: 'main' as const },
  { key: 'eigo', label: '英語', group: 'main' as const },
  { key: 'rika', label: '理科', group: 'main' as const },
  { key: 'shakai', label: '社会', group: 'main' as const },
  { key: 'ongaku', label: '音楽', group: 'practical' as const },
  { key: 'bijutsu', label: '美術', group: 'practical' as const },
  { key: 'taiku', label: '保健体育', group: 'practical' as const },
  { key: 'gijutsu', label: '技術・家庭', group: 'practical' as const },
] as const;

type SubjectKey = (typeof SUBJECTS)[number]['key'];

const RATING_OPTIONS = [1, 2, 3, 4, 5];

export function HyoteiHeikinCalculator() {
  const [ratings, setRatings] = React.useState<Record<SubjectKey, number | null>>(() =>
    SUBJECTS.reduce((acc, s) => {
      acc[s.key] = null;
      return acc;
    }, {} as Record<SubjectKey, number | null>)
  );
  const viewedRef = React.useRef(false);
  const startedRef = React.useRef(false);

  const setRating = (key: SubjectKey, value: number) => {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ tool: 'hyotei-heikin', placement: 'hyotei-heikin' });
    }
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setRatings(
      SUBJECTS.reduce((acc, s) => {
        acc[s.key] = null;
        return acc;
      }, {} as Record<SubjectKey, number | null>)
    );
  };

  const filledRatings = SUBJECTS.map((s) => ratings[s.key]).filter((v): v is number => v !== null);
  const total = filledRatings.reduce((sum, v) => sum + v, 0);
  const average = filledRatings.length > 0 ? total / filledRatings.length : null;
  const allFilled = filledRatings.length === SUBJECTS.length;

  // 換金ファネルの分母：評定平均が初めて算出された時点で1回だけ calc_complete / result_view を計測
  React.useEffect(() => {
    if (average !== null && !viewedRef.current) {
      viewedRef.current = true;
      funnel.calcComplete({ tool: 'hyotei-heikin', placement: 'hyotei-heikin' }, { average: Number(average.toFixed(1)) });
      track('result_view', { source: 'hyotei' });
    }
  }, [average]);

  return (
    <div className="rounded-2xl border-2 border-emerald-200 bg-white shadow-lg overflow-hidden">
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
            <Calculator className="h-5 w-5 text-emerald-600" />
            通知表の評定を入力
          </h2>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            リセット
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-600">9教科の評定をクリックして選択してください</p>
      </div>

      <div className="px-6 py-4">
        <div className="mb-2 text-xs font-bold text-slate-500 uppercase">主要5教科</div>
        <div className="space-y-2 mb-4">
          {SUBJECTS.filter((s) => s.group === 'main').map((subject) => (
            <SubjectRow
              key={subject.key}
              label={subject.label}
              value={ratings[subject.key]}
              onSelect={(v) => setRating(subject.key, v)}
            />
          ))}
        </div>

        <div className="mb-2 text-xs font-bold text-slate-500 uppercase">実技4教科</div>
        <div className="space-y-2">
          {SUBJECTS.filter((s) => s.group === 'practical').map((subject) => (
            <SubjectRow
              key={subject.key}
              label={subject.label}
              value={ratings[subject.key]}
              onSelect={(v) => setRating(subject.key, v)}
            />
          ))}
        </div>
      </div>

      {/* 結果表示 */}
      {average !== null && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-6 border-t-2 border-emerald-200" role="status" aria-live="polite">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="text-center">
              <div className="text-xs font-bold text-slate-600 mb-1">評定平均</div>
              <div className="text-5xl font-black text-emerald-700">
                {average.toFixed(1)}
              </div>
              <div className="text-xs text-slate-500 mt-1">/ 5.0</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-slate-600 mb-1">
                内申点（素内申）{allFilled ? '' : '※途中'}
              </div>
              <div className="text-5xl font-black text-teal-700">
                {total}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                / {allFilled ? '45' : `${filledRatings.length * 5}（${filledRatings.length}教科）`}
              </div>
            </div>
          </div>
          {!allFilled && (
            <div className="mt-4 text-center text-xs text-slate-500">
              {SUBJECTS.length - filledRatings.length}教科の入力が残っています
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface SubjectRowProps {
  label: string;
  value: number | null;
  onSelect: (rating: number) => void;
}

function SubjectRow({ label, value, onSelect }: SubjectRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <div className="w-20 text-sm font-bold text-slate-700 shrink-0">{label}</div>
      <div className="flex flex-1 gap-1 justify-end">
        {RATING_OPTIONS.map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onSelect(rating)}
            className={`h-9 w-9 rounded-lg text-sm font-bold transition-all ${
              value === rating
                ? 'bg-emerald-600 text-white shadow-md scale-110'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-emerald-50 hover:ring-emerald-200'
            }`}
            aria-label={`${label}を${rating}に設定`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
}
