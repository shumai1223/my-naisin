'use client';

import * as React from 'react';
import { Target, ChevronRight, Award, TrendingUp, BookOpen } from '@/components/icons';

import { Card } from '@/components/ui/Card';

const GOAL_PRESETS = [
  { score: 35, label: '公立中堅校', desc: '基礎をしっかり固めよう', color: 'border-brand-200 bg-brand-50', icon: BookOpen, iconColor: 'text-brand-500' },
  { score: 40, label: '公立上位校', desc: '得意教科を伸ばそう', color: 'border-brand-200 bg-brand-50', icon: TrendingUp, iconColor: 'text-brand-500' },
  { score: 43, label: '公立難関校', desc: 'オール4以上を目指して', color: 'border-brand-200 bg-brand-50', icon: Target, iconColor: 'text-brand-500' },
  { score: 45, label: '最難関校', desc: 'オール5で完璧を', color: 'border-slate-200 bg-slate-50', icon: Award, iconColor: 'text-slate-500' }
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

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 bg-brand-50 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500">
            <Target className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-800">目標を設定しよう</div>
            <div className="text-xs text-slate-500">志望校レベルを選んでね</div>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {adjustedGoals.map((goal, i) => (
            <button
              key={goal.label}
              type="button"
              onClick={() => setSelectedGoal(i)}
              className={`group relative rounded-lg border-2 p-4 text-left transition-all ${
                selectedGoal === i
                  ? `${goal.color} ring-2 ring-offset-1 ring-brand-300`
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className={`mb-2 grid h-9 w-9 place-items-center rounded-lg ${selectedGoal === i ? 'bg-white/80' : 'bg-slate-100'} transition-colors`}>
                <goal.icon className={`h-4 w-4 ${goal.iconColor}`} />
              </div>
              <div className="text-lg font-bold text-slate-800">{goal.score}<span className="text-sm text-slate-400">点</span></div>
              <div className="mt-1 text-xs font-bold text-slate-700">{goal.label}</div>
              <div className="mt-0.5 text-xs text-slate-500">{goal.desc}</div>
              {selectedGoal === i && (
                <div className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-white">
                  <ChevronRight className="h-3 w-3" />
                </div>
              )}
            </button>
          ))}
        </div>

        {selectedGoal !== null && (
          <div className="mt-5 rounded-lg bg-brand-500 p-4 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-white/80">現在の内申点</div>
                <div className="text-2xl font-bold">{currentScore}<span className="text-base text-white/70">/{maxScore}</span></div>
              </div>
              <div className="text-3xl font-bold text-white/40">→</div>
              <div>
                <div className="text-sm text-white/80">目標</div>
                <div className="text-2xl font-bold">{adjustedGoals[selectedGoal].score}<span className="text-base text-white/70">点</span></div>
              </div>
              <div className="rounded-lg bg-white/20 px-4 py-2">
                <div className="text-xs text-white/80">あと</div>
                <div className="text-xl font-bold">
                  {gap !== null && gap > 0 ? `+${gap}` : gap === 0 ? '達成！' : '達成済み'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
