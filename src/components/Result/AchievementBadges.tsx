'use client';

import { Lock } from '@/components/icons';

import type { Scores, ResultData } from '@/lib/types';

interface AchievementBadgesProps {
  scores: Scores;
  result: ResultData;
}

interface Badge {
  id: string;
  /** 達成条件の説明（画面にはこの文だけを表示する） */
  description: string;
  /** 条件の厳しさの目安（数字が大きいほど厳しい）。他の利用者との比較ではない */
  level: 1 | 2 | 3 | 4 | 5;
  condition: (scores: Scores, result: ResultData) => boolean;
}

const LEVELS = [5, 4, 3, 2, 1] as const;

const BADGES: Badge[] = [
  // 難易度5
  {
    id: 'perfect',
    description: '全教科オール5を達成',
    level: 5,
    condition: (scores) => {
      const values = Object.values(scores);
      return values.length > 0 && values.every(s => s === 5);
    },
  },
  {
    id: 'god_tier',
    description: '達成率100%',
    level: 5,
    condition: (_, result) => Math.floor(result?.percent || 0) === 100,
  },

  // 難易度4
  {
    id: 'high_achiever',
    description: '達成率90%以上',
    level: 4,
    condition: (_, result) => Math.floor(result?.percent || 0) >= 90,
  },
  {
    id: 's_rank',
    description: 'Sランクを獲得',
    level: 4,
    condition: (_, result) => result?.rank?.code === 'S',
  },
  {
    id: 'main_master',
    description: '国数英理社で全て4以上',
    level: 4,
    condition: (scores) => {
      return scores.japanese >= 4 && scores.math >= 4 && scores.english >= 4 &&
             scores.science >= 4 && scores.social >= 4;
    },
  },
  {
    id: 'skill_master',
    description: '実技4教科で全て4以上',
    level: 4,
    condition: (scores) => {
      return scores.music >= 4 && scores.art >= 4 &&
             scores.pe >= 4 && scores.tech >= 4;
    },
  },

  // 難易度3
  {
    id: 'balanced',
    description: '全教科3以上',
    level: 3,
    condition: (scores) => {
      const values = Object.values(scores);
      return values.length > 0 && values.every(s => s >= 3);
    },
  },
  {
    id: 'a_rank',
    description: 'Aランク以上を獲得',
    level: 3,
    condition: (_, result) => result?.rank?.code === 'S' || result?.rank?.code === 'A',
  },
  {
    id: 'over_80',
    description: '達成率80%以上',
    level: 3,
    condition: (_, result) => Math.floor(result?.percent || 0) >= 80,
  },
  {
    id: 'triple_5',
    description: '3教科以上で5を獲得',
    level: 3,
    condition: (scores) => {
      const fiveCount = Object.values(scores).filter(s => s === 5).length;
      return fiveCount >= 3;
    },
  },

  // 難易度2
  {
    id: 'math_genius',
    description: '数学で5を獲得',
    level: 2,
    condition: (scores) => scores.math === 5,
  },
  {
    id: 'language_master',
    description: '国語と英語で両方4以上',
    level: 2,
    condition: (scores) => scores.japanese >= 4 && scores.english >= 4,
  },
  {
    id: 'scientist',
    description: '理科で5を獲得',
    level: 2,
    condition: (scores) => scores.science === 5,
  },
  {
    id: 'historian',
    description: '社会で5を獲得',
    level: 2,
    condition: (scores) => scores.social === 5,
  },
  {
    id: 'wordsmith',
    description: '国語で5を獲得',
    level: 2,
    condition: (scores) => scores.japanese === 5,
  },
  {
    id: 'english_pro',
    description: '英語で5を獲得',
    level: 2,
    condition: (scores) => scores.english === 5,
  },
  {
    id: 'artist',
    description: '美術で5を獲得',
    level: 2,
    condition: (scores) => scores.art === 5,
  },
  {
    id: 'musician',
    description: '音楽で5を獲得',
    level: 2,
    condition: (scores) => scores.music === 5,
  },
  {
    id: 'athlete',
    description: '保健体育で5を獲得',
    level: 2,
    condition: (scores) => scores.pe === 5,
  },
  {
    id: 'engineer',
    description: '技術家庭で5を獲得',
    level: 2,
    condition: (scores) => scores.tech === 5,
  },

  // 難易度1
  {
    id: 'over_50',
    description: '達成率50%以上',
    level: 1,
    condition: (_, result) => Math.floor(result?.percent || 0) >= 50,
  },
  {
    id: 'no_fail',
    description: '全教科2以上',
    level: 1,
    condition: (scores) => {
      const values = Object.values(scores);
      return values.length > 0 && values.every(s => s >= 2);
    },
  },
  {
    id: 'first_5',
    description: '1教科以上で5を獲得',
    level: 1,
    condition: (scores) => Object.values(scores).some(s => s === 5),
  },
  {
    id: 'improving',
    description: '平均3以上',
    level: 1,
    condition: (scores) => {
      const values = Object.values(scores);
      if (values.length === 0) return false;
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      return avg >= 3;
    },
  },
  {
    id: 'starter',
    description: '計算を実行',
    level: 1,
    condition: () => true,
  },
];

export function AchievementBadges({ scores, result }: AchievementBadgesProps) {
  const earnedBadges = BADGES.filter(badge => badge.condition(scores, result));
  const lockedBadges = BADGES.filter(badge => !badge.condition(scores, result));

  // 難易度ごとにまとめる（条件が厳しいものから）
  const earnedByLevel = LEVELS
    .map((level) => ({ level, badges: earnedBadges.filter((b) => b.level === level) }))
    .filter((group) => group.badges.length > 0);

  // Calculate completion percentage
  const completionPercent = Math.floor((earnedBadges.length / BADGES.length) * 100);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-[17px] font-bold text-slate-900">獲得バッジ</h3>
          <p className="mt-1 text-sm tabular-nums text-slate-600">
            {earnedBadges.length}/{BADGES.length} 獲得 ({completionPercent}%)
          </p>
        </div>
        {/* Progress bar */}
        <div className="hidden sm:block w-24">
          <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              style={{ width: `${completionPercent}%` }}
              className="h-full rounded-full bg-brand-700"
            />
          </div>
        </div>
      </div>

      {/* Earned badges grouped by level */}
      <div className="mt-4 space-y-4">
        {earnedBadges.length > 0 ? (
          earnedByLevel.map(({ level, badges }) => (
            <div key={level}>
              <div className="mb-2 text-sm font-bold tabular-nums text-slate-700">
                難易度{level}（{badges.length}個）
              </div>
              <ul className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <li
                    key={badge.id}
                    className="inline-flex items-center rounded border border-slate-200 bg-white px-2.5 py-1 text-sm text-slate-900"
                  >
                    {badge.description}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-slate-200 bg-brand-50 p-4 text-sm text-slate-900">
            まだバッジを獲得していません
          </div>
        )}
      </div>

      {/* Locked Badges (collapsed by default, show count) */}
      {lockedBadges.length > 0 && (
        <details className="mt-4">
          <summary className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
            <Lock className="h-4 w-4" />
            未獲得のバッジを見る ({lockedBadges.length}個)
          </summary>
          <ul className="mt-2 divide-y divide-slate-200 border-y border-slate-200">
            {lockedBadges.slice(0, 12).map((badge) => (
              <li key={badge.id} className="flex items-baseline justify-between gap-4 py-2 text-sm">
                <span className="text-slate-900">{badge.description}</span>
                <span className="shrink-0 text-xs tabular-nums text-slate-600">難易度{badge.level}</span>
              </li>
            ))}
          </ul>
          {lockedBadges.length > 12 && (
            <p className="mt-2 text-sm tabular-nums text-slate-600">ほか{lockedBadges.length - 12}個</p>
          )}
        </details>
      )}

      {/* Next badge hint */}
      {lockedBadges.length > 0 && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-brand-50 p-3 text-sm text-slate-900">
          <span className="font-bold">次のバッジ:</span> {lockedBadges[0].description}
        </div>
      )}
    </div>
  );
}
