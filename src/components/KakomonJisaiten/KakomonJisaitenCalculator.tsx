'use client';

import * as React from 'react';
import Link from 'next/link';
import { Calculator, ExternalLink, ChevronRightSquare } from 'lucide-react';

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
    <div className="rounded-2xl border-2 border-emerald-200 bg-white shadow-lg overflow-hidden">
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <Calculator className="h-5 w-5 text-emerald-600" />
          都道府県を選ぶ
        </h2>
        <select
          value={prefCode}
          onChange={(e) => onPrefChange(e.target.value)}
          aria-label="都道府県"
          className="mt-2 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
        >
          {PREFECTURES.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {route.type === 'link' && (
        <div className="px-6 py-6 text-center">
          <p className="mb-4 text-sm leading-relaxed text-slate-600">
            {prefName}は、過去問の点数から総合得点をこのページ内で直接計算する機能には対応していません。
            {prefName}専用のページで確認できます。
          </p>
          <Link
            href={route.url}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"
          >
            {route.label}
            <ChevronRightSquare className="h-4 w-4" />
          </Link>
          <div className="mt-4">
            <Link
              href={`/${prefCode}/naishin`}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 underline"
            >
              {prefName}の内申点を計算する
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {route.type === 'calculator' && system && (
        <div className="px-6 py-4">
          <div className="mb-4">
            <div className="mb-2 text-xs font-bold text-slate-600">
              過去問の自己採点（5教科・各{system.academic.perSubjectMax}点満点）
            </div>
            <div className="grid grid-cols-5 gap-2">
              {SUBJECT_LABELS.map((label, i) => (
                <div key={label}>
                  <label className="mb-1 block text-[11px] text-slate-500">{label}</label>
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
                    className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="mt-1 text-right text-xs text-slate-500">
              合計: {academicRaw} / {system.academic.rawMax}点
            </div>
          </div>

          <div className="mb-2">
            <label className="mb-1 block text-xs font-bold text-slate-600">
              内申点（{system.report.rawMax}点満点・{prefName}の方式で計算した値）
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={system.report.rawMax}
                value={naishinRaw}
                onChange={(e) => setNaishinRaw(e.target.value)}
                placeholder="例: 100"
                aria-label="内申点"
                className="w-32 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
              />
              <Link
                href={`/${prefCode}/naishin`}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 underline"
              >
                先に内申点を計算する
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {result && (
            <div className="mt-6 rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5 text-center" role="status" aria-live="polite">
              <div className="text-xs font-bold text-slate-600 mb-1">
                {prefName}の方式（{system.localTerm}）による総合得点
              </div>
              <div className="text-4xl font-black text-emerald-700">
                {result.total} <span className="text-lg font-bold text-slate-500">/ {result.totalMax}</span>
              </div>
              <div className="mt-2 text-xs text-slate-600">
                学力検査換算 {result.academic}点 ＋ 内申換算 {result.report}点
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                これは{prefName}が公表している総合得点の算出方式に基づく数値です。合否ラインは公表されておらず、
                この数値だけで合否を判断することはできません。
              </p>
              <Link
                href={`/${prefCode}/total-score`}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 underline"
              >
                {prefName}の総合得点方式の仕組みを詳しく見る
                <ChevronRightSquare className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
