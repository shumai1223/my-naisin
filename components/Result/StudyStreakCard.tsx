'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, Trophy, Star, Zap, Target, Award } from 'lucide-react';

const STREAK_KEY = 'my-naishin:streak';
const LAST_VISIT_KEY = 'my-naishin:last-visit';

interface StreakData {
  current: number;
  longest: number;
  totalDays: number;
  lastDate: string;
}

function getStreakData(): StreakData {
  if (typeof window === 'undefined') {
    return { current: 0, longest: 0, totalDays: 0, lastDate: '' };
  }
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return { current: 0, longest: 0, totalDays: 0, lastDate: '' };
    return JSON.parse(raw);
  } catch {
    return { current: 0, longest: 0, totalDays: 0, lastDate: '' };
  }
}

function updateStreak(): StreakData {
  if (typeof window === 'undefined') {
    return { current: 0, longest: 0, totalDays: 0, lastDate: '' };
  }
  
  const today = new Date().toISOString().split('T')[0];
  const data = getStreakData();
  
  if (data.lastDate === today) {
    return data;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  let newCurrent = 1;
  if (data.lastDate === yesterdayStr) {
    newCurrent = data.current + 1;
  }
  
  const newData: StreakData = {
    current: newCurrent,
    longest: Math.max(data.longest, newCurrent),
    totalDays: data.totalDays + 1,
    lastDate: today,
  };
  
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(newData));
  } catch {
    // ignore
  }
  
  return newData;
}

const MILESTONES = [
  { days: 3, icon: Zap, label: '3日連続', color: 'text-yellow-500', bg: 'bg-yellow-50' },
  { days: 7, icon: Star, label: '1週間', color: 'text-orange-500', bg: 'bg-orange-50' },
  { days: 14, icon: Target, label: '2週間', color: 'text-rose-500', bg: 'bg-rose-50' },
  { days: 30, icon: Trophy, label: '1ヶ月', color: 'text-purple-500', bg: 'bg-purple-50' },
  { days: 60, icon: Award, label: '2ヶ月', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { days: 100, icon: Flame, label: '100日', color: 'text-red-500', bg: 'bg-red-50' },
];

export function StudyStreakCard() {
  const [streak, setStreak] = React.useState<StreakData>({ current: 0, longest: 0, totalDays: 0, lastDate: '' });
  const [showCelebration, setShowCelebration] = React.useState(false);

  React.useEffect(() => {
    const oldStreak = getStreakData();
    const newStreak = updateStreak();
    setStreak(newStreak);
    
    // Check if we hit a milestone
    const hitMilestone = MILESTONES.find(m => 
      newStreak.current === m.days && oldStreak.current < m.days
    );
    if (hitMilestone) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, []);

  const nextMilestone = MILESTONES.find(m => m.days > streak.current) || MILESTONES[MILESTONES.length - 1];
  const progressToNext = nextMilestone ? (streak.current / nextMilestone.days) * 100 : 100;
  const achievedMilestones = MILESTONES.filter(m => streak.current >= m.days);

  const getStreakEmoji = () => {
    if (streak.current >= 100) return '🏆';
    if (streak.current >= 30) return '🔥';
    if (streak.current >= 14) return '⭐';
    if (streak.current >= 7) return '✨';
    if (streak.current >= 3) return '💪';
    return '🌱';
  };

  const getStreakMessage = () => {
    if (streak.current >= 100) return '伝説の勉強家！継続は力なり！';
    if (streak.current >= 60) return '素晴らしい！あなたは本物の努力家です！';
    if (streak.current >= 30) return '1ヶ月達成！この調子で頑張ろう！';
    if (streak.current >= 14) return '2週間突破！習慣が身についてきた！';
    if (streak.current >= 7) return '1週間達成！良いリズムができてきた！';
    if (streak.current >= 3) return '3日連続！この調子で続けよう！';
    if (streak.current >= 1) return '今日も頑張ってるね！続けることが大切！';
    return '今日から始めよう！毎日の積み重ねが大切！';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 p-5 text-white relative overflow-hidden">
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10"
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <div className="text-lg font-bold">マイルストーン達成！</div>
            </div>
          </motion.div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">{getStreakEmoji()} 学習ストリーク</h3>
              <p className="text-sm text-white/80">毎日の継続が力になる！</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black">{streak.current}</div>
            <div className="text-xs text-white/80">日連続</div>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Motivation message */}
        <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4 mb-4 border border-amber-200">
          <p className="text-sm font-medium text-amber-800 text-center">
            {getStreakMessage()}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <div className="text-2xl font-bold text-orange-500">{streak.current}</div>
            <div className="text-[10px] font-medium text-slate-500">現在の連続</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <div className="text-2xl font-bold text-amber-500">{streak.longest}</div>
            <div className="text-[10px] font-medium text-slate-500">最長記録</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">{streak.totalDays}</div>
            <div className="text-[10px] font-medium text-slate-500">累計日数</div>
          </div>
        </div>

        {/* Progress to next milestone */}
        {nextMilestone && streak.current < nextMilestone.days && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">次のマイルストーン</span>
              <span className="font-bold text-amber-600">{nextMilestone.label}まであと{nextMilestone.days - streak.current}日</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressToNext, 100)}%` }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"
              />
            </div>
          </div>
        )}

        {/* Achieved milestones */}
        {achievedMilestones.length > 0 && (
          <div>
            <div className="text-xs font-bold text-slate-600 mb-2">🏅 達成したマイルストーン</div>
            <div className="flex flex-wrap gap-2">
              {achievedMilestones.map((milestone) => {
                const Icon = milestone.icon;
                return (
                  <div
                    key={milestone.days}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${milestone.bg} border border-slate-200`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${milestone.color}`} />
                    <span className="text-xs font-medium text-slate-700">{milestone.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Week calendar */}
        <div className="mt-4">
          <div className="text-xs font-bold text-slate-600 mb-2">📅 今週の記録</div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const dateStr = date.toISOString().split('T')[0];
              const isToday = i === 6;
              const isActive = dateStr <= streak.lastDate && 
                (streak.current > (6 - i) || dateStr === streak.lastDate);
              
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] ${
                    isToday 
                      ? 'bg-gradient-to-br from-orange-400 to-amber-400 text-white font-bold'
                      : isActive
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  <span>{['日', '月', '火', '水', '木', '金', '土'][date.getDay()]}</span>
                  <span className="font-bold">{date.getDate()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
