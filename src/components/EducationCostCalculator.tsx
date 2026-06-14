'use client';

import * as React from 'react';
import { Wallet, ArrowRight, RotateCcw, GraduationCap, School, BookOpen } from 'lucide-react';

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
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      {/* 学年 */}
      <span className="block text-sm font-bold text-slate-800">お子さまの現在の学年</span>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {([1, 2, 3] as const).map((g) => (
          <button
            key={g}
            onClick={() => { markStart(); setGrade(g); }}
            className={`rounded-xl border px-2 py-2.5 text-sm font-bold transition-all ${
              grade === g ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200'
            }`}
          >
            {GRADE_LABEL[g]}
          </button>
        ))}
      </div>

      {/* 進学先（高校） */}
      <span className="mt-5 block text-sm font-bold text-slate-800">進学先の高校</span>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(['public', 'private'] as const).map((c) => (
          <button
            key={c}
            onClick={() => { markStart(); setHighCourse(c); }}
            className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${
              highCourse === c ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200'
            }`}
          >
            {c === 'public' ? '公立高校' : '私立高校'}
          </button>
        ))}
      </div>

      {/* 塾 */}
      <span className="mt-5 block text-sm font-bold text-slate-800">塾・家庭教師（中3まで）</span>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {JUKU_OPTIONS.map((o) => (
          <button
            key={o.id}
            onClick={() => { markStart(); setJukuType(o.id); }}
            className={`rounded-xl border px-2 py-2.5 text-sm font-bold transition-all ${
              jukuType === o.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {/* 中学（公立/私立）— 既定は公立。私立中の少数派向けに切替 */}
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <span>在学中の中学：</span>
        {(['public', 'private'] as const).map((c) => (
          <button
            key={c}
            onClick={() => { markStart(); setJuniorCourse(c); }}
            className={`rounded-full border px-3 py-1 font-semibold transition-all ${
              juniorCourse === c ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200'
            }`}
          >
            {c === 'public' ? '公立中学' : '私立中学'}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        ※ 学習費総額は文部科学省「子供の学習費調査（令和3年度）」、塾代は一般的な相場の目安です。地域・学校・受講数で変動します。
      </p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button onClick={onCalc} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-700 active:scale-95">
          高校卒業までの教育費を計算する
          <ArrowRight className="h-5 w-5" />
        </button>
        <button onClick={reset} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
          <RotateCcw className="h-4 w-4" />リセット
        </button>
      </div>

      {show && (
        <div id="edu-result" className="mt-8 scroll-mt-20" role="status" aria-live="polite">
          <div className="rounded-2xl border-2 border-indigo-300 bg-gradient-to-br from-indigo-50 to-violet-50 p-5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-indigo-800">
              <Wallet className="h-4 w-4" />
              {GRADE_LABEL[grade]}から高校卒業までの教育費の目安
            </div>
            <div className="mt-1 text-4xl font-black tracking-tight text-indigo-700 md:text-5xl">{formatYen(result.total)}</div>
            <div className="mt-1 text-xs text-indigo-700">（{toManYen(result.total)}／{highCourse === 'public' ? '公立' : '私立'}高校コース）</div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Breakdown icon={<School className="h-4 w-4" />} label={`中学の残り（${result.juniorRemainingYears}年）`} value={formatYen(result.juniorRemaining)} />
            <Breakdown icon={<GraduationCap className="h-4 w-4" />} label="高校3年間" value={formatYen(result.highSchool)} />
            <Breakdown icon={<BookOpen className="h-4 w-4" />} label="塾・家庭教師" value={formatYen(result.juku)} />
          </div>

          <p className="mt-3 text-xs text-slate-500">
            ※ 学習費総額には授業料・教材費・通学費・給食費・学校外活動費が含まれます。大学進学を予定する場合は、別途まとまった費用がかかります（下記の目安を参照）。
            就学支援金で授業料の負担は軽くできます。早めに「我が家でいくら必要か」を把握すると、進路の選択肢を狭めずに済みます。
          </p>
        </div>
      )}
    </div>
  );
}

function Breakdown({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <span className="text-indigo-500">{icon}</span>
        {label}
      </div>
      <div className="mt-1 text-xl font-black tracking-tight text-slate-900">{value}</div>
    </div>
  );
}
