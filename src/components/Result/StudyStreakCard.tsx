'use client';

import * as React from 'react';

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
  { days: 3, label: '3日連続' },
  { days: 7, label: '1週間' },
  { days: 14, label: '2週間' },
  { days: 30, label: '1ヶ月' },
  { days: 60, label: '2ヶ月' },
  { days: 100, label: '100日' },
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

  const getStreakMessage = () => {
    if (streak.current >= 3) return `${streak.current}日連続で記録しています。`;
    if (streak.current >= 1) return '今日の分を記録しました。続けることが大切です。';
    return '今日から始めましょう。毎日の積み重ねが大切です。';
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900">学習ストリーク</h3>
          <p className="mt-1 text-sm text-slate-600">毎日の継続が力になる</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-3xl font-bold tabular-nums text-slate-900">{streak.current}</div>
          <div className="text-xs text-slate-600">日連続</div>
        </div>
      </div>

      {/* Message（節目の日は枠線を濃くして一言添える。表示は3秒） */}
      <p
        className={`mt-4 rounded-lg border p-4 text-sm leading-relaxed text-slate-900 ${
          showCelebration ? 'border-brand-700 bg-brand-100' : 'border-slate-200 bg-brand-50'
        }`}
      >
        {showCelebration && <span className="mr-2 font-bold">節目の日数です。</span>}
        {getStreakMessage()}
      </p>

      {/* Stats */}
      <dl className="mt-4 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200">
        <div className="px-3 py-3 text-center">
          <dt className="text-xs text-slate-600">現在の連続</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{streak.current}</dd>
        </div>
        <div className="px-3 py-3 text-center">
          <dt className="text-xs text-slate-600">最長記録</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{streak.longest}</dd>
        </div>
        <div className="px-3 py-3 text-center">
          <dt className="text-xs text-slate-600">累計日数</dt>
          <dd className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{streak.totalDays}</dd>
        </div>
      </dl>

      {/* Progress to next milestone */}
      {nextMilestone && streak.current < nextMilestone.days && (
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="text-slate-600">次の節目</span>
            <span className="font-bold tabular-nums text-slate-900">{nextMilestone.label}まであと{nextMilestone.days - streak.current}日</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-brand-700"
              style={{ width: `${Math.min(progressToNext, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Achieved milestones */}
      {achievedMilestones.length > 0 && (
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-bold text-slate-900">到達した節目</h4>
          <ul className="flex flex-wrap gap-2">
            {achievedMilestones.map((milestone) => (
              <li
                key={milestone.days}
                className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700"
              >
                {milestone.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Week calendar */}
      <div className="mt-4">
        <h4 className="mb-2 text-sm font-bold text-slate-900">今週の記録</h4>
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
                className={`flex aspect-square flex-col items-center justify-center rounded border text-xs ${
                  isToday
                    ? 'border-brand-700 bg-brand-700 font-bold text-white'
                    : isActive
                      ? 'border-brand-700 bg-brand-50 text-brand-800'
                      : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span>{['日', '月', '火', '水', '木', '金', '土'][date.getDay()]}</span>
                <span className="font-bold tabular-nums">{date.getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
