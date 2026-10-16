'use client';

import * as React from 'react';
import { ArrowRight, RotateCcw } from '@/components/icons';

import { track, funnel } from '@/lib/track';
import { simulateEducationCost, formatYen, toManYen } from '@/lib/education-cost/engine';
import { JUKU_RATES } from '@/lib/education-cost/data';
import type { CourseType, JukuType } from '@/lib/education-cost/types';

/**
 * 教育費総額シミュレーター（保護者＝検索者＝決裁者の最大関心＝お金）。
 *
 * 現在の中学の学年・進学先（公立/私立）・通塾形態から、高校卒業までの教育費総額を内訳つきで概算する。
 * 数値は文科省「子供の学習費調査」の一次データ（engine が計算）で、捏造ゼロ＝信頼の堀。
 * 計算後の保護者リード（無料体験/資料請求/FP相談）への送客は呼び出し側ページ（placement='hiyou'）に委ねる。
 */

const GRADE_LABEL: Record<1 | 2 | 3, string> = { 1: '中1', 2: '中2', 3: '中3' };

const JUKU_OPTIONS: { id: JukuType; label: string }[] = [
  { id: 'none', label: '通わない' },
  { id: 'shudan', label: JUKU_RATES.shudan.label },
  { id: 'kobetsu', label: JUKU_RATES.kobetsu.label },
  { id: 'katei', label: JUKU_RATES.katei.label },
];

/** 選択肢ボタンの見た目。選択中は「濃い枠線・薄い緑の面・太字」で、色だけに頼らず区別する。 */
const chipClass = (selected: boolean) =>
  `inline-flex min-h-[44px] items-center justify-center rounded border px-3 py-2 text-sm leading-snug transition-colors ${
    selected ? 'border-brand-700 bg-brand-50 font-bold text-brand-800' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
  }`;

export function EducationCostCalculator() {
  const [grade, setGrade] = React.useState<1 | 2 | 3>(1);
  const [highCourse, setHighCourse] = React.useState<CourseType>('public');
  const [juniorCourse, setJuniorCourse] = React.useState<CourseType>('public');
  const [jukuType, setJukuType] = React.useState<JukuType>('kobetsu');
  const [show, setShow] = React.useState(false);
  const startedRef = React.useRef(false);

  const markStart = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ tool: 'kyouiku-hi', placement: 'hiyou' });
    }
  };

  const result = simulateEducationCost({ currentGrade: grade, juniorCourse, highCourse, jukuType });

  const onCalc = () => {
    setShow(true);
    funnel.calcComplete({ tool: 'kyouiku-hi', placement: 'hiyou' }, { total: result.total, high_course: highCourse, juku_type: jukuType });
    track('result_view', { source: 'kyouiku-hi' });
    requestAnimationFrame(() => document.getElementById('edu-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const reset = () => {
    markStart();
    setGrade(1);
    setHighCourse('public');
    setJuniorCourse('public');
    setJukuType('kobetsu');
    setShow(false);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      {/* 学年 */}
      <span className="block text-sm font-bold text-slate-900">お子さまの現在の学年</span>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {([1, 2, 3] as const).map((g) => (
          <button
            key={g}
            aria-pressed={grade === g}
            onClick={() => { markStart(); setGrade(g); }}
            className={chipClass(grade === g)}
          >
            {GRADE_LABEL[g]}
          </button>
        ))}
      </div>

      {/* 進学先（高校） */}
      <span className="mt-5 block text-sm font-bold text-slate-900">進学先の高校</span>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(['public', 'private'] as const).map((c) => (
          <button
            key={c}
            aria-pressed={highCourse === c}
            onClick={() => { markStart(); setHighCourse(c); }}
            className={chipClass(highCourse === c)}
          >
            {c === 'public' ? '公立高校' : '私立高校'}
          </button>
        ))}
      </div>

      {/* 塾 */}
      <span className="mt-5 block text-sm font-bold text-slate-900">塾・家庭教師（中3まで）</span>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {JUKU_OPTIONS.map((o) => (
          <button
            key={o.id}
            aria-pressed={jukuType === o.id}
            onClick={() => { markStart(); setJukuType(o.id); }}
            className={chipClass(jukuType === o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* 中学（公立/私立）— 既定は公立。私立中の少数派向けに切替 */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-900">
        <span>在学中の中学：</span>
        {(['public', 'private'] as const).map((c) => (
          <button
            key={c}
            aria-pressed={juniorCourse === c}
            onClick={() => { markStart(); setJuniorCourse(c); }}
            className={`${chipClass(juniorCourse === c)} sm:px-4`}
          >
            {c === 'public' ? '公立中学' : '私立中学'}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm leading-[1.8] text-slate-600">
        ※ 学習費総額は文部科学省「子供の学習費調査（令和5年度・令和8年1月16日訂正版）」、塾代は一般的な相場の目安です。地域・学校・受講数で変動します。
      </p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button onClick={onCalc} className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800">
          高校卒業までの教育費を計算する
          <ArrowRight className="h-5 w-5" />
        </button>
        <button onClick={reset} className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded border border-brand-700 bg-white px-5 py-3 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50">
          <RotateCcw className="h-4 w-4" />リセット
        </button>
      </div>

      {show && (
        <div id="edu-result" className="mt-8 scroll-mt-20" role="status" aria-live="polite">
          <div className="rounded-lg border border-slate-200 bg-brand-50 p-5">
            <div className="text-sm font-bold text-brand-800">{GRADE_LABEL[grade]}から高校卒業までの教育費の目安</div>
            <div className="mt-1 text-3xl font-bold tabular-nums text-brand-800 md:text-4xl">{formatYen(result.total)}</div>
            <div className="mt-1 text-sm text-slate-700">（{toManYen(result.total)}／{highCourse === 'public' ? '公立' : '私立'}高校コース）</div>
          </div>

          <dl className="mt-3 grid divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <Breakdown label={`中学の残り（${result.juniorRemainingYears}年）`} value={formatYen(result.juniorRemaining)} />
            <Breakdown label="高校3年間" value={formatYen(result.highSchool)} />
            <Breakdown label="塾・家庭教師" value={formatYen(result.juku)} />
          </dl>

          <p className="mt-3 text-sm leading-[1.8] text-slate-600">
            ※ 学習費総額には授業料・教材費・通学費・給食費・学校外活動費が含まれます。大学進学を予定する場合は、別途まとまった費用がかかります（下記の目安を参照）。
            就学支援金で授業料の負担は軽くできます。早めに「我が家でいくら必要か」を把握すると、進路の選択肢を狭めずに済みます。
          </p>
        </div>
      )}
    </div>
  );
}

function Breakdown({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-3 sm:px-4 sm:first:pl-0">
      <dt className="text-xs text-slate-600">{label}</dt>
      <dd className="mt-1 text-xl font-bold tabular-nums text-slate-900 md:text-2xl">{value}</dd>
    </div>
  );
}
