'use client';

import * as React from 'react';
import { RotateCcw } from '@/components/icons';

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

interface HyoteiHeikinCalculatorProps {
  /** 評定平均が変わるたびに呼ばれる（親が結果連動の換金導線を出すため）。 */
  onResult?: (value: number | null) => void;
  /** 結果ボックス内（評定平均の直下＝最高エンゲージ位置）に差し込むCTA。 */
  resultFooter?: React.ReactNode;
}

export function HyoteiHeikinCalculator({ onResult, resultFooter }: HyoteiHeikinCalculatorProps = {}) {
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

  // 評定平均を親へ通知（結果連動の換金導線）。onResult は安定参照前提（useStateのsetter）。
  React.useEffect(() => {
    onResult?.(average);
  }, [average, onResult]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">通知表の評定を入力</h2>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 hover:bg-brand-50"
          >
            <RotateCcw className="h-4 w-4" />
            リセット
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-600">9教科の評定をクリックして選択してください</p>
      </div>

      <div className="px-5 py-4 md:px-6">
        <div className="mb-2 text-sm font-bold text-slate-900">主要5教科</div>
        <div className="mb-4 space-y-2">
          {SUBJECTS.filter((s) => s.group === 'main').map((subject) => (
            <SubjectRow
              key={subject.key}
              label={subject.label}
              value={ratings[subject.key]}
              onSelect={(v) => setRating(subject.key, v)}
            />
          ))}
        </div>

        <div className="mb-2 text-sm font-bold text-slate-900">実技4教科</div>
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
        <div className="border-t border-slate-200 bg-brand-50 px-5 py-6 md:px-6" role="status" aria-live="polite">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="text-center">
              <div className="mb-1 text-sm text-slate-600">評定平均</div>
              <div className="text-5xl font-bold tabular-nums text-brand-700">
                {average.toFixed(1)}
              </div>
              <div className="mt-1 text-sm text-slate-600">/ 5.0</div>
            </div>
            <div className="text-center">
              <div className="mb-1 text-sm text-slate-600">
                内申点（素内申）{allFilled ? '' : '※途中'}
              </div>
              <div className="text-5xl font-bold tabular-nums text-brand-700">
                {total}
              </div>
              <div className="mt-1 text-sm text-slate-600">
                / {allFilled ? '45' : `${filledRatings.length * 5}（${filledRatings.length}教科）`}
              </div>
            </div>
          </div>
          {!allFilled && (
            <div className="mt-4 text-center text-sm text-slate-600">
              {SUBJECTS.length - filledRatings.length}教科の入力が残っています
            </div>
          )}
          {resultFooter}
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
    <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 sm:flex-row sm:items-center sm:gap-3">
      <div className="shrink-0 text-base font-bold text-slate-900 sm:w-24">{label}</div>
      <div className="flex flex-1 justify-between gap-1 sm:justify-end">
        {RATING_OPTIONS.map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onSelect(rating)}
            aria-pressed={value === rating}
            className={`h-11 w-11 rounded border text-base font-bold tabular-nums transition-colors ${
              value === rating
                ? 'border-brand-700 bg-brand-700 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-brand-50'
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
