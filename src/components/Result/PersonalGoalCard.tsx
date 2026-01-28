'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Target, Check, Plus, Trash2, Edit3, Save, Star, Flame } from 'lucide-react';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">🎯 マイ目標</h3>
              <p className="text-sm text-white/80">自分だけの目標を設定しよう</p>
            </div>
          </div>
          {totalCount > 0 && (
            <div className="text-right">
              <div className="text-2xl font-black">{completionRate}%</div>
              <div className="text-xs text-white/80">{completedCount}/{totalCount} 達成</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        {/* Progress bar */}
        {totalCount > 0 && (
          <div className="mb-4">
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Goals list */}
        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
          {goals.map((goal) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 rounded-xl p-3 border transition-all ${
                goal.completed
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <button
                onClick={() => toggleGoal(goal.id)}
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-all ${
                  goal.completed
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-slate-300 hover:border-emerald-400'
                }`}
              >
                {goal.completed && <Check className="h-3.5 w-3.5" />}
              </button>
              
              {editingId === goal.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 text-sm bg-white border border-slate-300 rounded-lg px-2 py-1 outline-none focus:border-rose-400"
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(goal.id)}
                    className="p-1 text-emerald-500 hover:bg-emerald-50 rounded"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <span className={`flex-1 text-sm ${goal.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {goal.text}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(goal)}
                      className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Add goal */}
        {isAdding ? (
          <div className="flex items-center gap-2 mb-4">
            <input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addGoal(newGoal)}
              placeholder="目標を入力..."
              className="flex-1 text-sm border border-slate-300 rounded-xl px-3 py-2 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              autoFocus
            />
            <button
              onClick={() => addGoal(newGoal)}
              className="px-4 py-2 bg-rose-500 text-white text-sm font-bold rounded-xl hover:bg-rose-600 transition-colors"
            >
              追加
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-2 text-slate-500 text-sm rounded-xl hover:bg-slate-100"
            >
              キャンセル
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-rose-300 hover:text-rose-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">新しい目標を追加</span>
          </button>
        )}

        {/* Suggested goals */}
        {goals.length < 3 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-600">おすすめ目標</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_GOALS.slice(0, 4).map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => addGoal(suggestion)}
                  className="text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Motivation */}
        {completedCount > 0 && (
          <div className="mt-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 p-3 border border-rose-200">
            <div className="flex items-center gap-2 justify-center">
              <Flame className="h-4 w-4 text-rose-500" />
              <p className="text-xs text-rose-700 text-center font-medium">
                {completedCount}個の目標達成おめでとう！この調子で頑張ろう！
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
