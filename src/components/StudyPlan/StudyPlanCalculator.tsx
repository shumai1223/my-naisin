'use client';

import * as React from 'react';
import Link from 'next/link';
import { CalendarClock, Loader2, Target, TrendingUp, ChevronRight, AlertTriangle } from 'lucide-react';

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
    'h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200';

  return (
    <div className="rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 via-violet-50 to-white p-6 shadow-lg">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg">
          <CalendarClock className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">学習計画ジェネレータ</h2>
          <p className="text-sm text-slate-500">目標内申までの差を、週ごとの目標に分解します</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="rounded-xl bg-white/70 p-4 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-500">都道府県</span>
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
            <span className="mb-1 block text-xs font-bold text-slate-500">
              残り週数（本番・学期末まで）
            </span>
            <input type="number" inputMode="numeric" min={1} max={52} value={weeks} onChange={(e) => { onFirstInput(); setWeeks(e.target.value); }} className={inputCls} placeholder="12" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-500">
              現在の内申点{maxScore ? `（${maxScore}点満点）` : ''}
            </span>
            <input type="number" inputMode="numeric" value={current} onChange={(e) => { onFirstInput(); setCurrent(e.target.value); }} className={inputCls} placeholder="例：未入力なら0から計算" />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-500">
              目標の内申点{maxScore ? `（〜${maxScore}）` : ''}
            </span>
            <input type="number" inputMode="numeric" value={targetVal} onChange={(e) => { onFirstInput(); setTargetVal(e.target.value); }} className={inputCls} placeholder="例：志望校の目安内申" />
          </label>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          現在の内申点が分からない場合は{' '}
          <Link href={`/${code}/naishin`} className="font-semibold text-indigo-600 underline">
            {pref?.name ?? ''}の内申点計算
          </Link>
          {' '}で先に算出できます。
        </p>

        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3 text-base font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : <Target className="h-5 w-5" />}
            計画を作成する
          </button>
        </div>
        {error && <p className="mt-3 text-center text-sm font-semibold text-rose-600">{error}</p>}
      </form>

      {result && result.studyPlan && (
        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm" role="status" aria-live="polite">
          {!result.achievable && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              目標が満点を超えています。満点（{result.maxScore}点）以内で目標を設定してください。
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="目標までの差" value={`${result.studyPlan.gap}点`} accent="text-rose-600" />
            <Stat label="週あたり必要な改善" value={`約${result.studyPlan.perWeekNaishinGain}点/週`} accent="text-indigo-600" />
            <Stat label="必要な評定平均" value={`${result.requiredAverageGrade}`} accent="text-emerald-600" />
          </div>

          {result.raisePriority && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-sm text-slate-700">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
              {result.raisePriority}
            </div>
          )}

          <h3 className="mb-3 mt-6 text-sm font-bold text-slate-700">週次マイルストーン</h3>
          <ol className="space-y-1.5">
            {result.studyPlan.milestones.map((m) => {
              const ratio = result.maxScore > 0 ? Math.min(100, Math.round((m.targetNaishin / result.maxScore) * 100)) : 0;
              return (
                <li key={m.week} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-xs font-bold text-slate-500">第{m.week}週</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-500" style={{ width: `${ratio}%` }} />
                  </div>
                  <span className="w-16 shrink-0 text-right text-xs font-bold text-slate-700">{m.targetNaishin}点</span>
                </li>
              );
            })}
          </ol>

          <p className="mt-4 text-xs leading-relaxed text-slate-500">{result.studyPlan.note}</p>

          <Link
            href={`/reverse?pref=${code}`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700"
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
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center">
      <div className="text-xs font-bold text-slate-500">{label}</div>
      <div className={`mt-1 text-2xl font-black ${accent}`}>{value}</div>
    </div>
  );
}
