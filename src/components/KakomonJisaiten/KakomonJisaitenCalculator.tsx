'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronRightSquare } from '@/components/icons';

import { track, funnel } from '@/lib/track';
import { PREFECTURES } from '@/lib/prefectures';
import { getTotalScoreSystem } from '@/lib/total-score/registry';
import { computeTotalScore } from '@/lib/total-score/engine';
import { getKakomonJisaitenRoute } from '@/lib/kakomon-jisaiten-routing';

const SUBJECT_LABELS = ['国語', '数学', '英語', '理科', '社会'] as const;

export function KakomonJisaitenCalculator() {
  const [prefCode, setPrefCode] = React.useState<string>('hyogo');
  const [subjectScores, setSubjectScores] = React.useState<string[]>(['', '', '', '', '']);
  const [naishinRaw, setNaishinRaw] = React.useState<string>('');
  const startedRef = React.useRef(false);
  const viewedRef = React.useRef(false);

  const route = getKakomonJisaitenRoute(prefCode);
  const prefName = PREFECTURES.find((p) => p.code === prefCode)?.name ?? prefCode;
  const system = route.type === 'calculator' ? getTotalScoreSystem(prefCode) : undefined;

  const onPrefChange = (code: string) => {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ tool: 'kakomon-jisaiten', placement: 'kakomon-jisaiten' });
    }
    setPrefCode(code);
    setSubjectScores(['', '', '', '', '']);
    setNaishinRaw('');
    viewedRef.current = false;
  };

  const academicRaw = subjectScores.reduce((sum, v) => sum + (Number(v) || 0), 0);
  const naishinRawNum = Number(naishinRaw) || 0;
  const filledSubjectCount = subjectScores.filter((v) => v.trim() !== '').length;
  const canCompute = system && filledSubjectCount === 5 && naishinRaw.trim() !== '';

  const result = canCompute && system ? computeTotalScore(system, { academicRaw, reportRaw: naishinRawNum }) : null;

  React.useEffect(() => {
    if (result && !viewedRef.current) {
      viewedRef.current = true;
      funnel.calcComplete({ tool: 'kakomon-jisaiten', placement: 'kakomon-jisaiten' }, { prefecture: prefCode, total: result.total });
      track('result_view', { source: 'kakomon-jisaiten' });
    }
  }, [result, prefCode]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-xl font-bold text-slate-900">都道府県を選ぶ</h2>
        <select
          value={prefCode}
          onChange={(e) => onPrefChange(e.target.value)}
          aria-label="都道府県"
          className="mt-3 min-h-[44px] w-full max-w-xs rounded border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
        >
          {PREFECTURES.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {route.type === 'link' && (
        <div className="px-5 py-5">
          <p className="mb-4 text-base leading-[1.8] text-slate-900">
            {prefName}は、過去問の点数から総合得点をこのページ内で直接計算する機能には対応していません。
            {prefName}専用のページで確認できます。
          </p>
          <Link
            href={route.url}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded bg-brand-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-800"
          >
            {route.label}
            <ChevronRightSquare className="h-4 w-4" />
          </Link>
          <div className="mt-2">
            <Link
              href={`/${prefCode}/naishin`}
              className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
            >
              {prefName}の内申点を計算する
              <ChevronRightSquare className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {route.type === 'calculator' && system && (
        <div className="px-5 py-5">
          <div className="mb-4">
            <div className="mb-2 text-sm font-bold text-slate-900">
              過去問の自己採点（5教科・各{system.academic.perSubjectMax}点満点）
            </div>
            <div className="grid grid-cols-5 gap-2">
              {SUBJECT_LABELS.map((label, i) => (
                <div key={label}>
                  <label className="mb-1 block text-sm text-slate-600">{label}</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={system.academic.perSubjectMax}
                    value={subjectScores[i]}
                    onChange={(e) => {
                      const next = [...subjectScores];
                      next[i] = e.target.value;
                      setSubjectScores(next);
                    }}
                    aria-label={`${label}の得点`}
                    className="min-h-[44px] w-full rounded border border-slate-300 bg-white px-2 py-2 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-brand-700"
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 text-right text-sm tabular-nums text-slate-600">
              合計: {academicRaw} / {system.academic.rawMax}点
            </div>
          </div>

          <div className="mb-2">
            <label className="mb-1 block text-sm font-bold text-slate-900">
              内申点（{system.report.rawMax}点満点・{prefName}の方式で計算した値）
            </label>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={system.report.rawMax}
                value={naishinRaw}
                onChange={(e) => setNaishinRaw(e.target.value)}
                placeholder="例: 100"
                aria-label="内申点"
                className="min-h-[44px] w-32 rounded border border-slate-300 bg-white px-3 py-2 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-brand-700"
              />
              <Link
                href={`/${prefCode}/naishin`}
                className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                先に内申点を計算する
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {result && (
            <div className="mt-6 rounded-lg border border-slate-200 bg-brand-50 p-5" role="status" aria-live="polite">
              <div className="mb-1 text-sm font-bold text-slate-900">
                {prefName}の方式（{system.localTerm}）による総合得点
              </div>
              <div className="text-3xl font-bold tabular-nums text-brand-700">
                {result.total} <span className="text-lg font-bold text-slate-600">/ {result.totalMax}</span>
              </div>
              <div className="mt-2 text-sm tabular-nums text-slate-900">
                学力検査換算 {result.academic}点 ＋ 内申換算 {result.report}点
              </div>
              <p className="mt-3 text-sm leading-[1.7] text-slate-600">
                これは{prefName}が公表している総合得点の算出方式に基づく数値です。合否ラインは公表されておらず、
                この数値だけで合否を判断することはできません。
              </p>
              <Link
                href={`/${prefCode}/total-score`}
                className="mt-1 inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                {prefName}の総合得点方式の仕組みを詳しく見る
                <ChevronRightSquare className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
