'use client';

import * as React from 'react';
import { AlertCircle } from '@/components/icons';

import { track, funnel } from '@/lib/track';
import { shugakuShienAnnual, highSchoolSupportOver3Years, highSchoolTotal, formatYen, toManYen } from '@/lib/education-cost/engine';
import { SHUGAKU_SHIEN_TIERS } from '@/lib/education-cost/data';
import type { CourseType, IncomeBracket } from '@/lib/education-cost/types';

/**
 * 就学支援金（高校無償化）の支援額・実質負担の「目安」を出す簡易エスティメーター。
 *
 * 制度は年度で見直され、正確な判定は課税標準額で行われるため、ここは“目安”であることを明示する（信頼の堀）。
 * 数値は engine（一次データ）が算出するので捏造は起きない。最終確認は文科省・都道府県のリンクへ誘導。
 */
export function ShugakuShienEstimator() {
  const [course, setCourse] = React.useState<CourseType>('private');
  const [bracket, setBracket] = React.useState<IncomeBracket>('under590');
  const startedRef = React.useRef(false);

  const markStart = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ tool: 'shougakukin', placement: 'hiyou' });
    }
  };

  const annual = shugakuShienAnnual(course, bracket);
  const over3 = highSchoolSupportOver3Years(course, bracket);
  const total = highSchoolTotal(course);
  const tier = SHUGAKU_SHIEN_TIERS.find((t) => t.bracket === bracket)!;

  const onSelect = (next: { course?: CourseType; bracket?: IncomeBracket }) => {
    markStart();
    if (next.course) setCourse(next.course);
    if (next.bracket) setBracket(next.bracket);
    funnel.calcComplete({ tool: 'shougakukin', placement: 'hiyou' }, { course: next.course ?? course, bracket: next.bracket ?? bracket });
    track('result_view', { source: 'shougakukin' });
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <span className="block text-sm font-bold text-slate-900">進学先の高校</span>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(['public', 'private'] as const).map((c) => (
          <button
            key={c}
            onClick={() => onSelect({ course: c })}
            aria-pressed={course === c}
            className={`min-h-[44px] rounded border px-3 py-2 text-sm font-bold transition-colors ${
              course === c ? 'border-brand-700 bg-brand-50 text-brand-800 ring-1 ring-brand-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {c === 'public' ? '公立高校' : '私立高校'}
          </button>
        ))}
      </div>

      <span className="mt-6 block text-sm font-bold text-slate-900">世帯年収の区分（目安）</span>
      <div className="mt-2 grid gap-2">
        {SHUGAKU_SHIEN_TIERS.map((t) => (
          <button
            key={t.bracket}
            onClick={() => onSelect({ bracket: t.bracket })}
            aria-pressed={bracket === t.bracket}
            className={`min-h-[44px] rounded border px-3 py-2 text-left text-sm font-bold transition-colors ${
              bracket === t.bracket ? 'border-brand-700 bg-brand-50 text-brand-800 ring-1 ring-brand-700' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-brand-50 p-5">
        <div className="text-center text-sm font-bold text-slate-900">
          就学支援金の支援額の目安（{course === 'public' ? '公立' : '私立'}高校）
        </div>
        <div className="mt-1 text-center text-4xl font-bold tabular-nums text-brand-700">
          {annual > 0 ? `${formatYen(annual)}/年` : '対象外'}
        </div>
        <div className="mt-1 text-center text-sm text-slate-900">
          {annual > 0 ? `3年間で約 ${toManYen(over3)} の授業料軽減` : '従来は支援の対象外（自治体独自の補助は要確認）'}
        </div>
        <div className="mt-4 border-t border-slate-200 pt-3 text-sm leading-[1.8] text-slate-600">
          {tier.note}
          <br />
          <span>参考：{course === 'public' ? '公立' : '私立'}高校の3年間の学習費総額は約 {toManYen(total)}（授業料以外も含む総額）。支援は授業料部分が対象です。</span>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-[1.8] text-amber-900">
        <p className="flex items-center gap-1.5 font-bold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          注意
        </p>
        <p className="mt-1">
          年収はあくまで目安です。実際は世帯の「市町村民税の課税標準額×6%−調整控除額」で判定され、家族構成や共働きで変わります。
          制度は年度で見直されるため、最新の金額・所得基準は必ず文部科学省・お住まいの都道府県でご確認ください。
        </p>
      </div>
    </div>
  );
}
