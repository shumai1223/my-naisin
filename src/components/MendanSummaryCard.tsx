'use client';

import * as React from 'react';
import { ClipboardCheck } from 'lucide-react';

import { readSavedGoal, type SavedGoal } from '@/lib/persistence';

/**
 * 面談で見せる1枚の「現在の数値」サマリー。保存済みの内申点目標（SavedGoal）があれば
 * それを表示し、無ければ手書き用の空欄を出す（印刷しても必ず使える形にする）。
 * 偏差値はこのアプリでは永続保存していないため、捏造せず手書き欄のみ用意する。
 */
export function MendanSummaryCard() {
  const [goal, setGoal] = React.useState<SavedGoal | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setGoal(readSavedGoal());
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return (
    <section className="mb-10 rounded-2xl border-2 border-blue-200 bg-white p-6 shadow-sm print:border print:shadow-none">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
        <ClipboardCheck className="h-5 w-5 text-blue-600 print:hidden" />
        面談で見せる現在の数値
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="text-xs font-bold text-slate-500">内申点</div>
          <div className="mt-1 text-2xl font-black text-slate-900">
            {goal ? `${goal.score}点` : '＿＿＿点'}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="text-xs font-bold text-slate-500">
            志望校の目標{goal?.targetLabel ? `（${goal.targetLabel}）` : ''}
          </div>
          <div className="mt-1 text-2xl font-black text-slate-900">
            {goal ? `${goal.target}点` : '＿＿＿点'}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="text-xs font-bold text-slate-500">目標との差</div>
          <div className="mt-1 text-2xl font-black text-slate-900">
            {goal ? (goal.gap > 0 ? `あと${goal.gap}点` : `${Math.abs(goal.gap)}点 達成`) : '＿＿＿点'}
          </div>
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-4">
        <div className="text-xs font-bold text-slate-500">偏差値（模試の結果があれば記入）</div>
        <div className="mt-1 text-lg font-bold text-slate-400">＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿</div>
      </div>
      {!goal && (
        <p className="mt-4 text-xs leading-relaxed text-slate-500 print:hidden">
          内申点計算サイトで目標を保存すると、ここに自動で数値が表示されます。今は空欄のまま印刷して、手書きでも使えます。
        </p>
      )}
    </section>
  );
}
