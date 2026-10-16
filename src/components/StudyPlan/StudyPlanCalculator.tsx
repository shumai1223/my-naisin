'use client';

import * as React from 'react';
import Link from 'next/link';
import { Loader2, Target, ChevronRight, AlertTriangle } from '@/components/icons';

import { PREFECTURES, getPrefectureByCode, DEFAULT_PREFECTURE_CODE } from '@/lib/prefectures';
import { funnel, track } from '@/lib/track';

interface Milestone {
  week: number;
  targetNaishin: number;
}
interface PlanResponse {
  mode?: string;
  prefectureName: string;
  maxScore: number;
  requiredAverageGrade: number;
  achievable: boolean;
  raisePriority?: string;
  studyPlan?: {
    gap: number;
    weeksRemaining: number;
    perWeekNaishinGain: number;
    milestones: Milestone[];
    note: string;
  };
}

/**
 * 学習計画ジェネレータ（§11）。目標差分を週次マイルストーンへ落とす“溶けないツール”。
 *
 * 計算は公開REST（/api/naishin/{code}?target=&weeks=&current=）を叩く＝堀Bの自社APIをドッグフーディングし、
 * MCP/REST と完全に同じ確定ロジック（line形・厳密）で結果を出す。重いデータをクライアントへ持ち込まない。
 */
export function StudyPlanCalculator() {
  const [code, setCode] = React.useState<string>(DEFAULT_PREFECTURE_CODE || 'tokyo');
  const [current, setCurrent] = React.useState('');
  const [targetVal, setTargetVal] = React.useState('');
  const [weeks, setWeeks] = React.useState('12');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<PlanResponse | null>(null);
  const startedRef = React.useRef(false);

  const pref = getPrefectureByCode(code);
  const maxScore = pref?.maxScore ?? 0;

  function onFirstInput() {
    if (!startedRef.current) {
      startedRef.current = true;
      funnel.toolStart({ tool: 'study-plan', pref: code, placement: 'result' });
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const t = Number(targetVal);
    const c = Number(current);
    const w = Number(weeks);
    if (!Number.isFinite(t) || t <= 0) {
      setError('目標の内申点を入力してください。');
      return;
    }
    if (!Number.isFinite(w) || w <= 0) {
      setError('残り週数を入力してください。');
      return;
    }
    setStatus('loading');
    try {
      const params = new URLSearchParams({ target: String(t), weeks: String(w) });
      if (Number.isFinite(c) && c >= 0) params.set('current', String(c));
      const res = await fetch(`/api/naishin/${code}?${params.toString()}`);
      if (!res.ok) throw new Error('計算に失敗しました。入力を確認してください。');
      const data = (await res.json()) as PlanResponse;
      setResult(data);
      setStatus('idle');
      funnel.calcComplete({ tool: 'study-plan', pref: code, placement: 'result' }, { gap: data.studyPlan?.gap ?? 0 });
      track('result_view', { source: 'gap-target', pref: code });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : '計算に失敗しました。');
    }
  }

  const inputCls =
    'h-11 w-full rounded border border-slate-300 bg-white px-3 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700';

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-900">学習計画ジェネレータ</h2>
        <p className="mt-1 text-sm text-slate-600">目標内申までの差を、週ごとの目標に分解します</p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-bold text-slate-900">都道府県</span>
            <select
              value={code}
              onChange={(e) => {
                onFirstInput();
                setCode(e.target.value);
              }}
              className={inputCls}
            >
              {PREFECTURES.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-bold text-slate-900">
              残り週数（本番・学期末まで）
            </span>
            <input type="number" inputMode="numeric" min={1} max={52} value={weeks} onChange={(e) => { onFirstInput(); setWeeks(e.target.value); }} className={inputCls} placeholder="12" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-bold text-slate-900">
              現在の内申点{maxScore ? `（${maxScore}点満点）` : ''}
            </span>
            <input type="number" inputMode="numeric" value={current} onChange={(e) => { onFirstInput(); setCurrent(e.target.value); }} className={inputCls} placeholder="例：未入力なら0から計算" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-bold text-slate-900">
              目標の内申点{maxScore ? `（〜${maxScore}）` : ''}
            </span>
            <input type="number" inputMode="numeric" value={targetVal} onChange={(e) => { onFirstInput(); setTargetVal(e.target.value); }} className={inputCls} placeholder="例：志望校の目安内申" />
          </label>
        </div>

        <p className="mt-4 text-sm leading-[1.8] text-slate-600">
          現在の内申点が分からない場合は{' '}
          <Link href={`/${code}/naishin`} className="text-brand-700 underline underline-offset-2 hover:text-brand-800">
            {pref?.name ?? ''}の内申点計算
          </Link>
          {' '}で先に算出できます。
        </p>

        <div className="mt-5">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
            計画を作成する
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-800">
            {error}
          </p>
        )}
      </form>

      {result && result.studyPlan && (
        <div className="mt-6 border-t border-slate-200 pt-6" role="status" aria-live="polite">
          {!result.achievable && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-[1.8] text-amber-900">
              <AlertTriangle className="mt-1 h-4 w-4 shrink-0" />
              <p>
                <span className="mr-2 font-bold">注意</span>
                目標が満点を超えています。満点（{result.maxScore}点）以内で目標を設定してください。
              </p>
            </div>
          )}
          <dl className="grid grid-cols-1 divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <Stat label="目標までの差" value={`${result.studyPlan.gap}点`} accent="text-slate-900" />
            <Stat label="週あたり必要な改善" value={`約${result.studyPlan.perWeekNaishinGain}点/週`} accent="text-brand-700" />
            <Stat label="必要な評定平均" value={`${result.requiredAverageGrade}`} accent="text-slate-900" />
          </dl>

          {result.raisePriority && (
            <p className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-4 text-sm leading-[1.8] text-slate-900">
              <span className="mr-2 font-bold">ポイント</span>
              {result.raisePriority}
            </p>
          )}

          <h3 className="mb-3 mt-8 text-[17px] font-bold text-slate-900">週次マイルストーン</h3>
          <ol className="space-y-2">
            {result.studyPlan.milestones.map((m) => {
              const ratio = result.maxScore > 0 ? Math.min(100, Math.round((m.targetNaishin / result.maxScore) * 100)) : 0;
              return (
                <li key={m.week} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-sm font-bold tabular-nums text-slate-600">第{m.week}週</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-full rounded-full bg-brand-700" style={{ width: `${ratio}%` }} />
                  </div>
                  <span className="w-16 shrink-0 text-right text-sm font-bold tabular-nums text-slate-900">{m.targetNaishin}点</span>
                </li>
              );
            })}
          </ol>

          <p className="mt-4 text-sm leading-[1.8] text-slate-600">{result.studyPlan.note}</p>

          <Link
            href={`/reverse?pref=${code}`}
            className="mt-4 inline-flex min-h-[44px] items-center gap-1 text-base text-brand-700 underline underline-offset-2 hover:text-brand-800"
          >
            志望校から必要な当日点も逆算する
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-3 sm:block sm:px-4 sm:py-4 sm:first:pl-0 sm:last:pr-0">
      <dt className="text-xs text-slate-600">{label}</dt>
      <dd className={`text-2xl font-bold tabular-nums sm:mt-1 ${accent}`}>{value}</dd>
    </div>
  );
}
