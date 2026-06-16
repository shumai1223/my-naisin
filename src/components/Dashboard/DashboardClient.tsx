'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  LineChart,
  Trash2,
  Target,
  CalendarDays,
  GraduationCap,
  Printer,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

import {
  readHistory,
  clearHistory,
  readSavedGoal,
  updateHistoryTerm,
  type SavedGoal,
} from '@/lib/persistence';
import { TERM_OPTIONS, getTermLabel, getTermOrder } from '@/lib/terms';
import { DEFAULT_PREFECTURE_CODE, getPrefectureByCode } from '@/lib/prefectures';
import { calculateTotalScore, calculateMaxScore, calculatePercent } from '@/lib/utils';
import { track } from '@/lib/track';
import type { SavedHistoryEntry } from '@/lib/types';

import { NaishinTimeSeriesChart, type TimeSeriesPoint } from '@/components/Dashboard/NaishinTimeSeriesChart';
import { NextActionButtons } from '@/components/NextActionButtons';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';

type ChartMode = 'date' | 'term';

interface Decorated {
  entry: SavedHistoryEntry;
  code: string;
  total: number;
  max: number;
  percent: number;
  /** 素内申（9教科の評定の合計・最大45）。県の換算を通さない生の合計。 */
  suNaishin: number;
  /** 評定平均（素内申 ÷ 9・1.0〜5.0）。推薦/指定校の基準と比べる指標。 */
  hyotei: number;
}

function decorate(entry: SavedHistoryEntry): Decorated {
  const code = entry.prefectureCode ?? DEFAULT_PREFECTURE_CODE;
  const total = calculateTotalScore(entry.scores, code);
  const max = calculateMaxScore(code);
  const suNaishin = (Object.values(entry.scores) as number[]).reduce(
    (a, b) => a + (Number.isFinite(b) ? b : 0),
    0
  );
  return {
    entry,
    code,
    total,
    max,
    percent: Math.round(calculatePercent(total, max)),
    suNaishin,
    hyotei: suNaishin / 9,
  };
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function DashboardClient() {
  const [history, setHistory] = React.useState<SavedHistoryEntry[]>([]);
  const [goal, setGoal] = React.useState<SavedGoal | null>(null);
  const [mode, setMode] = React.useState<ChartMode>('date');
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setHistory(readHistory());
    setGoal(readSavedGoal());
    setLoaded(true);
    track('dashboard_view');
  }, []);

  const decorated = React.useMemo(() => history.map(decorate), [history]);

  // 県が単一なら内申点（実数）で、混在なら達成率(%)で時系列化する。
  const uniformCode = React.useMemo(() => {
    if (decorated.length === 0) return null;
    const first = decorated[0].code;
    return decorated.every((d) => d.code === first) ? first : null;
  }, [decorated]);

  const isRaw = uniformCode != null;
  const yMax = isRaw ? (decorated[0]?.max ?? 100) : 100;
  const yLabel = isRaw ? `内申点（満点${yMax}）` : '達成率（%）';
  const plotValue = React.useCallback((d: Decorated) => (isRaw ? d.total : d.percent), [isRaw]);

  // 目標ライン（保存した目標を、グラフのy軸単位に合わせて換算）
  const target = React.useMemo(() => {
    if (!goal) return undefined;
    if (isRaw) {
      if (goal.prefectureCode !== uniformCode) return undefined;
      return { value: goal.target, label: `目標 ${goal.target}点` };
    }
    const goalMax = calculateMaxScore(goal.prefectureCode);
    if (goalMax <= 0) return undefined;
    const pct = Math.round((goal.target / goalMax) * 100);
    return { value: pct, label: `目標 ${pct}%` };
  }, [goal, isRaw, uniformCode]);

  // 日付順の系列（古い→新しい）
  const datePoints: TimeSeriesPoint[] = React.useMemo(() => {
    return [...decorated]
      .sort((a, b) => Date.parse(a.entry.savedAt) - Date.parse(b.entry.savedAt))
      .map((d) => {
        const termLabel = getTermLabel(d.entry.term);
        return {
          label: formatShortDate(d.entry.savedAt),
          value: plotValue(d),
          caption: `${d.total}点/${d.max}（${d.percent}%）${termLabel ? ` ・${termLabel}` : ''}`,
        };
      });
  }, [decorated, plotValue]);

  // 学期順の系列（学期タグ付きエントリのみ。同一学期は最新を採用）
  const termPoints: TimeSeriesPoint[] = React.useMemo(() => {
    const byTerm = new Map<string, Decorated>();
    for (const d of decorated) {
      const t = d.entry.term;
      if (!t) continue;
      const prev = byTerm.get(t);
      if (!prev || Date.parse(d.entry.savedAt) > Date.parse(prev.entry.savedAt)) {
        byTerm.set(t, d);
      }
    }
    return [...byTerm.values()]
      .sort((a, b) => getTermOrder(a.entry.term) - getTermOrder(b.entry.term))
      .map((d) => {
        const opt = TERM_OPTIONS.find((o) => o.value === d.entry.term);
        return {
          label: opt?.shortLabel ?? '—',
          value: plotValue(d),
          caption: `${opt?.label ?? ''}：${d.total}点/${d.max}（${d.percent}%）`,
        };
      });
  }, [decorated, plotValue]);

  // 評定平均（5段階）の系列。素内申/9なので県をまたいでも比較可能（換算前の生の指標）。
  const dateHyoteiPoints: TimeSeriesPoint[] = React.useMemo(() => {
    return [...decorated]
      .sort((a, b) => Date.parse(a.entry.savedAt) - Date.parse(b.entry.savedAt))
      .map((d) => ({
        label: formatShortDate(d.entry.savedAt),
        value: Math.round(d.hyotei * 100) / 100,
        caption: `評定平均 ${d.hyotei.toFixed(1)}（素内申 ${d.suNaishin}/45）`,
      }));
  }, [decorated]);

  const termHyoteiPoints: TimeSeriesPoint[] = React.useMemo(() => {
    const byTerm = new Map<string, Decorated>();
    for (const d of decorated) {
      const t = d.entry.term;
      if (!t) continue;
      const prev = byTerm.get(t);
      if (!prev || Date.parse(d.entry.savedAt) > Date.parse(prev.entry.savedAt)) byTerm.set(t, d);
    }
    return [...byTerm.values()]
      .sort((a, b) => getTermOrder(a.entry.term) - getTermOrder(b.entry.term))
      .map((d) => {
        const opt = TERM_OPTIONS.find((o) => o.value === d.entry.term);
        return {
          label: opt?.shortLabel ?? '—',
          value: Math.round(d.hyotei * 100) / 100,
          caption: `${opt?.label ?? ''}：評定平均 ${d.hyotei.toFixed(1)}（素内申 ${d.suNaishin}/45）`,
        };
      });
  }, [decorated]);

  const taggedCount = React.useMemo(() => decorated.filter((d) => d.entry.term).length, [decorated]);
  const activePoints = mode === 'term' ? termPoints : datePoints;
  const activeHyoteiPoints = mode === 'term' ? termHyoteiPoints : dateHyoteiPoints;
  const canChart = activePoints.length >= 2;
  const canHyoteiChart = activeHyoteiPoints.length >= 2;

  // 前回比（最新の伸び）。日付の新しい2件の差を出して「続けると伸びが見える」習慣化フックにする。
  const delta = React.useMemo(() => {
    const byDate = [...decorated].sort((a, b) => Date.parse(b.entry.savedAt) - Date.parse(a.entry.savedAt));
    if (byDate.length < 2) return null;
    const [cur, prev] = byDate;
    return {
      total: cur.total - prev.total,
      hyotei: Math.round((cur.hyotei - prev.hyotei) * 10) / 10,
      sameMax: cur.max === prev.max,
    };
  }, [decorated]);

  const handleTermChange = (id: string, term: string) => {
    updateHistoryTerm(id, term);
    setHistory(readHistory());
  };

  const handleClear = () => {
    if (confirm('保存した計算履歴をすべて削除しますか？この操作は取り消せません。')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handlePrint = () => {
    track('dashboard_print');
    window.print();
  };

  // 最新エントリ（次の一手・保護者リードの文脈）
  const latest = decorated[0];

  if (!loaded) {
    return <div className="h-40 animate-pulse rounded-2xl bg-slate-100" aria-hidden />;
  }

  // ── 空状態 ───────────────────────────────
  if (decorated.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow">
          <LineChart className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">まだ記録がありません</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          内申点を計算して保存すると、ここに中1→中3の成績の伸びがグラフで残ります。
          学期ごとに記録すれば、三者面談の資料にもそのまま使えます。
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-blue-700"
        >
          内申点を計算して記録する
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 目標カード（保存した目標＝再訪の燃料） */}
      {goal && (
        <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white shadow">
              <Target className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-emerald-700">保存中の目標</div>
              <div className="mt-0.5 text-lg font-bold text-slate-900">
                {goal.targetLabel ?? `${goal.prefectureName ?? getPrefectureByCode(goal.prefectureCode)?.name ?? ''}の目標`}
                <span className="ml-1 text-emerald-700">{goal.target}点</span>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                {goal.gap > 0 ? (
                  <>
                    現在 {goal.score}点 ・ 目標まで{' '}
                    <span className="font-bold text-emerald-700">あと{goal.gap}点</span>
                  </>
                ) : (
                  <span className="font-bold text-emerald-700">目標達成ライン到達 🎉</span>
                )}
              </p>
            </div>
            <Link
              href={`/reverse?pref=${goal.prefectureCode}`}
              className="hidden shrink-0 items-center gap-1 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 sm:inline-flex"
            >
              逆算する <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </section>
      )}

      {/* 推移グラフ */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            {isRaw ? '内申点' : '達成率'}の推移
          </h2>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-bold print:hidden">
            <button
              type="button"
              onClick={() => setMode('date')}
              className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition-colors ${mode === 'date' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              <CalendarDays className="h-3.5 w-3.5" /> 日付順
            </button>
            <button
              type="button"
              onClick={() => setMode('term')}
              className={`flex items-center gap-1 rounded-md px-3 py-1.5 transition-colors ${mode === 'term' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
              <GraduationCap className="h-3.5 w-3.5" /> 学期順
            </button>
          </div>
        </div>

        {delta && (
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-500">前回比</span>
            {delta.sameMax && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bold ${
                  delta.total > 0
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                    : delta.total < 0
                      ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                      : 'bg-slate-100 text-slate-500'
                }`}
              >
                内申点 {delta.total > 0 ? `+${delta.total}` : delta.total}点
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bold ${
                delta.hyotei > 0
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                  : delta.hyotei < 0
                    ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200'
                    : 'bg-slate-100 text-slate-500'
              }`}
            >
              評定平均 {delta.hyotei > 0 ? `+${delta.hyotei.toFixed(1)}` : delta.hyotei.toFixed(1)}
            </span>
          </div>
        )}

        {canChart ? (
          <NaishinTimeSeriesChart
            points={activePoints}
            yMax={yMax}
            yLabel={yLabel}
            targetValue={target?.value}
            targetLabel={target?.label}
          />
        ) : (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            {mode === 'term'
              ? '学期ラベルを2件以上つけると、中1→中3の伸びを学期順で表示します。下の履歴から学期を選んでください。'
              : '記録が2件以上になると推移グラフが表示されます。'}
          </p>
        )}

        {!isRaw && (
          <p className="mt-3 text-xs text-slate-400">
            ※ 複数の都道府県の記録が混在しているため、満点の異なる県でも比較できるよう達成率（%）で表示しています。
          </p>
        )}
      </section>

      {/* 評定平均の推移（推薦・指定校の出願基準と比べる指標。素内申/9なので県をまたいでも比較可） */}
      {canHyoteiChart && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-800">
            <GraduationCap className="h-5 w-5 text-emerald-500" />
            評定平均の推移
          </h2>
          <NaishinTimeSeriesChart points={activeHyoteiPoints} yMax={5} yLabel="評定平均（5段階）" />
          <p className="mt-3 text-xs text-slate-400">
            ※ 評定平均＝9教科の素内申合計 ÷ 9。推薦・私立併願優遇・指定校推薦の出願基準と比べる目安です。
            <Link href="/hyotei-heikin/suisen-kijun" className="ml-1 font-bold text-emerald-600 hover:underline">
              推薦に必要な評定基準を見る →
            </Link>
          </p>
        </section>
      )}

      {/* 履歴 + 学期タグ付け */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-800">
            <Sparkles className="h-5 w-5 text-amber-500" />
            記録一覧（{decorated.length}件）
          </h2>
          <span className="text-xs text-slate-400 print:hidden">学期を選ぶと推移に反映</span>
        </div>

        <div className="space-y-2">
          {decorated.map((d) => {
            const pref = getPrefectureByCode(d.code);
            const date = new Date(d.entry.savedAt);
            return (
              <div
                key={d.entry.id}
                className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <div className="flex items-center gap-2">
                  <div className="text-lg font-bold text-slate-800">
                    {d.total}
                    <span className="text-sm text-slate-400">/{d.max}</span>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    {d.percent}%
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {pref?.name ?? d.code} ・ {date.toLocaleDateString('ja-JP')}
                </div>
                <select
                  value={d.entry.term ?? ''}
                  onChange={(e) => handleTermChange(d.entry.id, e.target.value)}
                  aria-label="学年・学期を選ぶ"
                  className="ml-auto rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 print:hidden"
                >
                  <option value="">学期なし</option>
                  {TERM_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {d.entry.term && (
                  <span className="hidden rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 print:inline">
                    {getTermLabel(d.entry.term)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Printer className="h-4 w-4" />
            三者面談用に印刷／PDF保存
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
            記録をすべて削除
          </button>
        </div>
        {taggedCount > 0 && (
          <p className="mt-3 text-xs text-slate-400">学期タグ付き：{taggedCount}件</p>
        )}
      </section>

      {/* 次の一手 + 保護者リード（最新の記録を文脈に） */}
      {latest && (
        <div className="space-y-6 print:hidden">
          <NextActionButtons
            prefectureCode={latest.code}
            scores={latest.entry.scores}
            totalScore={latest.total}
            maxScore={latest.max}
          />
          <ParentLeadCTA prefectureCode={latest.code} placement="dashboard" />
        </div>
      )}
    </div>
  );
}
