'use client';

import * as React from 'react';

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
    <section className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
      <h2 className="mb-4 text-xl font-bold text-slate-900">面談で見せる現在の数値</h2>
      <dl className="grid divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="p-4">
          <dt className="text-xs text-slate-600">内申点</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
            {goal ? `${goal.score}点` : '＿＿＿点'}
          </dd>
        </div>
        <div className="p-4">
          <dt className="text-xs text-slate-600">
            志望校の目標{goal?.targetLabel ? `（${goal.targetLabel}）` : ''}
          </dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
            {goal ? `${goal.target}点` : '＿＿＿点'}
          </dd>
        </div>
        <div className="p-4">
          <dt className="text-xs text-slate-600">目標との差</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
            {goal ? (goal.gap > 0 ? `あと${goal.gap}点` : `${Math.abs(goal.gap)}点 達成`) : '＿＿＿点'}
          </dd>
        </div>
      </dl>
      <dl className="border-b border-slate-200">
        <div className="p-4">
          <dt className="text-xs text-slate-600">偏差値（模試の結果があれば記入）</dt>
          <dd className="mt-1 text-lg font-bold text-slate-600">＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿</dd>
        </div>
      </dl>
      {!goal && (
        <p className="mt-4 text-sm leading-[1.7] text-slate-600 print:hidden">
          内申点計算サイトで目標を保存すると、ここに自動で数値が表示されます。今は空欄のまま印刷して、手書きでも使えます。
        </p>
      )}
    </section>
  );
}
