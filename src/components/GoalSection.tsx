'use client';

import * as React from 'react';
import { Check } from '@/components/icons';

import { Card } from '@/components/ui/Card';

const GOAL_PRESETS = [
  { score: 35, label: '公立中堅校', desc: '基礎をしっかり固めましょう' },
  { score: 40, label: '公立上位校', desc: '得意教科を伸ばしましょう' },
  { score: 43, label: '公立難関校', desc: 'オール4以上を目指しましょう' },
  { score: 45, label: '最難関校', desc: 'オール5を目指しましょう' }
];

interface GoalSectionProps {
  currentScore: number;
  maxScore: number;
}

export function GoalSection({ currentScore, maxScore }: GoalSectionProps) {
  const [selectedGoal, setSelectedGoal] = React.useState<number | null>(null);

  const adjustedGoals = React.useMemo(() => {
    // 45点満点を基準として、maxScoreに応じて目標点数を調整
    const baseMax = 45;
    if (maxScore !== baseMax) {
      return GOAL_PRESETS.map(g => ({
        ...g,
        score: Math.round(g.score * (maxScore / baseMax))
      }));
    }
    return GOAL_PRESETS;
  }, [maxScore]);

  const gap = selectedGoal !== null ? adjustedGoals[selectedGoal].score - currentScore : null;
  const gapIsNumber = gap !== null && gap > 0;

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="text-base font-bold text-slate-900">目標を設定する</div>
        <div className="text-sm text-slate-600">志望校のレベルを選んでください</div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {adjustedGoals.map((goal, i) => (
            <button
              key={goal.label}
              type="button"
              aria-pressed={selectedGoal === i}
              onClick={() => setSelectedGoal(i)}
              className={`relative rounded-lg border p-4 text-left transition-colors ${
                selectedGoal === i
                  ? 'border-brand-700 bg-brand-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-lg font-bold tabular-nums text-slate-900">{goal.score}<span className="text-sm text-slate-600">点</span></div>
              <div className="mt-1 text-sm font-bold text-slate-900">{goal.label}</div>
              <div className="mt-0.5 text-xs text-slate-600">{goal.desc}</div>
              {selectedGoal === i && (
                <Check className="absolute right-2 top-2 h-4 w-4 text-brand-700" />
              )}
            </button>
          ))}
        </div>

        {selectedGoal !== null && (
          <dl className="mt-5 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200">
            <div className="px-2 py-3 md:px-4">
              <dt className="text-xs text-slate-600">現在の内申点</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                {currentScore}
                <span className="text-base text-slate-600">/{maxScore}</span>
              </dd>
            </div>
            <div className="px-2 py-3 md:px-4">
              <dt className="text-xs text-slate-600">目標</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">
                {adjustedGoals[selectedGoal].score}
                <span className="text-base text-slate-600">点</span>
              </dd>
            </div>
            <div className="px-2 py-3 md:px-4">
              <dt className="text-xs text-slate-600">あと</dt>
              <dd className={`mt-1 font-bold tabular-nums text-slate-900 ${gapIsNumber ? 'text-2xl' : 'text-lg'}`}>
                {gap !== null && gap > 0 ? `+${gap}` : gap === 0 ? '達成' : '達成済み'}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </Card>
  );
}
