'use client';

import * as React from 'react';
import { Check, Plus, Trash2, Edit3, Save } from '@/components/icons';

const GOALS_KEY = 'my-naishin:personal-goals';

interface PersonalGoal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

function getGoals(): PersonalGoal[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GOALS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveGoals(goals: PersonalGoal[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  } catch {
    // ignore
  }
}

const SUGGESTED_GOALS = [
  '今週の小テストで満点を取る',
  '毎日15分は英単語を覚える',
  '数学のワークを1日2ページ進める',
  '授業中に1回は発言する',
  '提出物を期限前に終わらせる',
  '苦手な科目を1つ克服する',
  '次の定期テストで10点上げる',
  '1週間毎日勉強を続ける',
];

export function PersonalGoalCard() {
  const [goals, setGoals] = React.useState<PersonalGoal[]>([]);
  const [newGoal, setNewGoal] = React.useState('');
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState('');

  React.useEffect(() => {
    setGoals(getGoals());
  }, []);

  const addGoal = (text: string) => {
    if (!text.trim()) return;
    const goal: PersonalGoal = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [goal, ...goals];
    setGoals(updated);
    saveGoals(updated);
    setNewGoal('');
    setIsAdding(false);
  };

  const toggleGoal = (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        return {
          ...g,
          completed: !g.completed,
          completedAt: !g.completed ? new Date().toISOString() : undefined,
        };
      }
      return g;
    });
    setGoals(updated);
    saveGoals(updated);
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    saveGoals(updated);
  };

  const startEdit = (goal: PersonalGoal) => {
    setEditingId(goal.id);
    setEditText(goal.text);
  };

  const saveEdit = (id: string) => {
    if (!editText.trim()) return;
    const updated = goals.map(g => {
      if (g.id === id) {
        return { ...g, text: editText.trim() };
      }
      return g;
    });
    setGoals(updated);
    saveGoals(updated);
    setEditingId(null);
    setEditText('');
  };

  const completedCount = goals.filter(g => g.completed).length;
  const totalCount = goals.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900">マイ目標</h3>
          <p className="mt-1 text-sm text-slate-600">自分だけの目標を設定しよう</p>
        </div>
        {totalCount > 0 && (
          <div className="shrink-0 text-right">
            <div className="text-2xl font-bold tabular-nums text-slate-900">{completionRate}%</div>
            <div className="text-xs tabular-nums text-slate-600">{completedCount}/{totalCount} 達成</div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-brand-700"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      )}

      {/* Goals list */}
      {goals.length > 0 && (
        <ul className="mt-4 max-h-64 divide-y divide-slate-200 overflow-y-auto border-y border-slate-200">
          {goals.map((goal) => (
            <li key={goal.id} className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => toggleGoal(goal.id)}
                aria-label={`「${goal.text}」を達成済みにする`}
                aria-pressed={goal.completed}
                className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center"
              >
                <span
                  className={`grid h-6 w-6 place-items-center rounded border-2 ${
                    goal.completed
                      ? 'border-brand-700 bg-brand-700 text-white'
                      : 'border-slate-400 bg-white'
                  }`}
                >
                  {goal.completed && <Check className="h-4 w-4" />}
                </span>
              </button>

              {editingId === goal.id ? (
                <div className="flex min-w-0 flex-1 items-center gap-1 py-1">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    aria-label="目標を編集"
                    className="min-h-11 min-w-0 flex-1 rounded border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => saveEdit(goal.id)}
                    aria-label="編集内容を保存"
                    className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded text-brand-700 hover:bg-brand-50"
                  >
                    <Save className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <>
                  <span className={`min-w-0 flex-1 py-3 text-sm ${goal.completed ? 'text-slate-600 line-through' : 'text-slate-900'}`}>
                    {goal.text}
                  </span>
                  <div className="flex shrink-0 items-center">
                    <button
                      type="button"
                      onClick={() => startEdit(goal)}
                      aria-label={`「${goal.text}」を編集する`}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteGoal(goal.id)}
                      aria-label={`「${goal.text}」を削除する`}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-slate-600 hover:bg-red-50 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Add goal */}
      {isAdding ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addGoal(newGoal)}
            aria-label="新しい目標を入力"
            placeholder="目標を入力..."
            className="min-h-11 min-w-[12rem] flex-1 rounded border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-brand-700"
            autoFocus
          />
          <button
            type="button"
            onClick={() => addGoal(newGoal)}
            className="inline-flex min-h-11 items-center justify-center rounded bg-brand-700 px-5 py-3 text-base font-bold text-white hover:bg-brand-800"
          >
            追加
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="inline-flex min-h-11 items-center justify-center rounded px-3 text-base text-brand-700 underline underline-offset-2 hover:text-brand-800"
          >
            キャンセル
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded border border-brand-700 bg-white px-5 py-3 text-base font-bold text-brand-700 hover:bg-brand-50"
        >
          <Plus className="h-4 w-4" />
          新しい目標を追加
        </button>
      )}

      {/* Suggested goals */}
      {goals.length < 3 && (
        <div className="mt-5">
          <h4 className="mb-2 text-sm font-bold text-slate-900">おすすめ目標</h4>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_GOALS.slice(0, 4).map((suggestion, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addGoal(suggestion)}
                className="inline-flex min-h-11 items-center rounded border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-900 hover:bg-brand-50"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress note */}
      {completedCount > 0 && (
        <p className="mt-4 text-sm text-slate-600">
          {completedCount}個の目標を達成しています
        </p>
      )}
    </div>
  );
}
