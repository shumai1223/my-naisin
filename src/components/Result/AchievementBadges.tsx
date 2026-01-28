'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Crown, 
  Flame,
  BookOpen,
  Calculator,
  Palette,
  Music,
  Dumbbell,
  Lock,
  Globe,
  Beaker,
  PenTool,
  Heart,
  Sparkles,
  Award,
  Medal,
  GraduationCap,
  Brain,
  Rocket,
  Shield,
  Gem,
  Coffee,
  Sun,
  Moon
} from 'lucide-react';

import type { Scores, ResultData } from '@/lib/types';

interface AchievementBadgesProps {
  scores: Scores;
  result: ResultData;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  condition: (scores: Scores, result: ResultData) => boolean;
}

const BADGES: Badge[] = [
  // Legendary badges
  {
    id: 'perfect',
    name: '完全無欠',
    description: '全教科オール5を達成',
    icon: Crown,
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    rarity: 'legendary',
    condition: (scores) => {
      const values = Object.values(scores);
      return values.length > 0 && values.every(s => s === 5);
    },
  },
  {
    id: 'god_tier',
    name: '神の領域',
    description: '達成率100%',
    icon: Gem,
    gradient: 'from-fuchsia-500 via-purple-500 to-indigo-500',
    rarity: 'legendary',
    condition: (_, result) => Math.floor(result?.percent || 0) === 100,
  },
  
  // Epic badges
  {
    id: 'high_achiever',
    name: 'ハイアチーバー',
    description: '達成率90%以上',
    icon: Trophy,
    gradient: 'from-blue-500 to-indigo-600',
    rarity: 'epic',
    condition: (_, result) => Math.floor(result?.percent || 0) >= 90,
  },
  {
    id: 's_rank',
    name: 'Sランカー',
    description: 'Sランクを獲得',
    icon: Award,
    gradient: 'from-amber-500 to-orange-600',
    rarity: 'epic',
    condition: (_, result) => result?.rank?.code === 'S',
  },
  {
    id: 'main_master',
    name: '5教科の覇者',
    description: '国数英理社で全て4以上',
    icon: GraduationCap,
    gradient: 'from-violet-500 to-purple-600',
    rarity: 'epic',
    condition: (scores) => {
      return scores.japanese >= 4 && scores.math >= 4 && scores.english >= 4 && 
             scores.science >= 4 && scores.social >= 4;
    },
  },
  {
    id: 'skill_master',
    name: '実技の達人',
    description: '実技4教科で全て4以上',
    icon: Palette,
    gradient: 'from-pink-500 to-rose-600',
    rarity: 'epic',
    condition: (scores) => {
      return scores.music >= 4 && scores.art >= 4 && 
             scores.pe >= 4 && scores.tech >= 4;
    },
  },

  // Rare badges
  {
    id: 'balanced',
    name: 'バランサー',
    description: '全教科3以上',
    icon: Target,
    gradient: 'from-emerald-500 to-teal-600',
    rarity: 'rare',
    condition: (scores) => {
      const values = Object.values(scores);
      return values.length > 0 && values.every(s => s >= 3);
    },
  },
  {
    id: 'a_rank',
    name: 'Aランカー',
    description: 'Aランク以上を獲得',
    icon: Star,
    gradient: 'from-blue-400 to-cyan-500',
    rarity: 'rare',
    condition: (_, result) => result?.rank?.code === 'S' || result?.rank?.code === 'A',
  },
  {
    id: 'over_80',
    name: '優等生',
    description: '達成率80%以上',
    icon: Medal,
    gradient: 'from-sky-500 to-blue-600',
    rarity: 'rare',
    condition: (_, result) => Math.floor(result?.percent || 0) >= 80,
  },
  {
    id: 'triple_5',
    name: 'トリプル5',
    description: '3教科以上で5を獲得',
    icon: Sparkles,
    gradient: 'from-yellow-400 to-amber-500',
    rarity: 'rare',
    condition: (scores) => {
      const fiveCount = Object.values(scores).filter(s => s === 5).length;
      return fiveCount >= 3;
    },
  },

  // Uncommon badges
  {
    id: 'math_genius',
    name: '数学の天才',
    description: '数学で5を獲得',
    icon: Calculator,
    gradient: 'from-cyan-500 to-blue-600',
    rarity: 'uncommon',
    condition: (scores) => scores.math === 5,
  },
  {
    id: 'language_master',
    name: '言語マスター',
    description: '国語と英語で両方4以上',
    icon: BookOpen,
    gradient: 'from-indigo-500 to-violet-600',
    rarity: 'uncommon',
    condition: (scores) => scores.japanese >= 4 && scores.english >= 4,
  },
  {
    id: 'scientist',
    name: 'サイエンティスト',
    description: '理科で5を獲得',
    icon: Beaker,
    gradient: 'from-green-500 to-emerald-600',
    rarity: 'uncommon',
    condition: (scores) => scores.science === 5,
  },
  {
    id: 'historian',
    name: '歴史博士',
    description: '社会で5を獲得',
    icon: Globe,
    gradient: 'from-amber-600 to-yellow-600',
    rarity: 'uncommon',
    condition: (scores) => scores.social === 5,
  },
  {
    id: 'wordsmith',
    name: '文豪',
    description: '国語で5を獲得',
    icon: PenTool,
    gradient: 'from-slate-600 to-slate-700',
    rarity: 'uncommon',
    condition: (scores) => scores.japanese === 5,
  },
  {
    id: 'english_pro',
    name: '英語の達人',
    description: '英語で5を獲得',
    icon: Globe,
    gradient: 'from-red-500 to-rose-600',
    rarity: 'uncommon',
    condition: (scores) => scores.english === 5,
  },
  {
    id: 'artist',
    name: 'アーティスト',
    description: '美術で5を獲得',
    icon: Palette,
    gradient: 'from-pink-500 to-fuchsia-600',
    rarity: 'uncommon',
    condition: (scores) => scores.art === 5,
  },
  {
    id: 'musician',
    name: 'ミュージシャン',
    description: '音楽で5を獲得',
    icon: Music,
    gradient: 'from-purple-500 to-violet-600',
    rarity: 'uncommon',
    condition: (scores) => scores.music === 5,
  },
  {
    id: 'athlete',
    name: 'アスリート',
    description: '保健体育で5を獲得',
    icon: Dumbbell,
    gradient: 'from-orange-500 to-red-600',
    rarity: 'uncommon',
    condition: (scores) => scores.pe === 5,
  },
  {
    id: 'engineer',
    name: 'エンジニア',
    description: '技術家庭で5を獲得',
    icon: Coffee,
    gradient: 'from-gray-600 to-slate-700',
    rarity: 'uncommon',
    condition: (scores) => scores.tech === 5,
  },

  // Common badges
  {
    id: 'over_50',
    name: '半分超え',
    description: '達成率50%以上',
    icon: Sun,
    gradient: 'from-yellow-500 to-orange-500',
    rarity: 'common',
    condition: (_, result) => Math.floor(result?.percent || 0) >= 50,
  },
  {
    id: 'no_fail',
    name: '赤点なし',
    description: '全教科2以上',
    icon: Shield,
    gradient: 'from-green-500 to-emerald-600',
    rarity: 'common',
    condition: (scores) => {
      const values = Object.values(scores);
      return values.length > 0 && values.every(s => s >= 2);
    },
  },
  {
    id: 'first_5',
    name: '初めての5',
    description: '1教科以上で5を獲得',
    icon: Flame,
    gradient: 'from-orange-400 to-red-500',
    rarity: 'common',
    condition: (scores) => Object.values(scores).some(s => s === 5),
  },
  {
    id: 'improving',
    name: '成長中',
    description: '平均3以上',
    icon: Rocket,
    gradient: 'from-teal-500 to-cyan-600',
    rarity: 'common',
    condition: (scores) => {
      const values = Object.values(scores);
      if (values.length === 0) return false;
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      return avg >= 3;
    },
  },
  {
    id: 'starter',
    name: 'はじめの一歩',
    description: '計算を実行',
    icon: Zap,
    gradient: 'from-slate-400 to-slate-500',
    rarity: 'common',
    condition: () => true,
  },
];

const RARITY_CONFIG = {
  legendary: { label: '伝説', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'ring-amber-400' },
  epic: { label: '史詩', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'ring-purple-400' },
  rare: { label: 'レア', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'ring-blue-400' },
  uncommon: { label: '希少', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'ring-emerald-400' },
  common: { label: '通常', color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'ring-slate-400' },
};

export function AchievementBadges({ scores, result }: AchievementBadgesProps) {
  const earnedBadges = BADGES.filter(badge => badge.condition(scores, result));
  const lockedBadges = BADGES.filter(badge => !badge.condition(scores, result));

  // Group earned badges by rarity
  const groupedEarned = {
    legendary: earnedBadges.filter(b => b.rarity === 'legendary'),
    epic: earnedBadges.filter(b => b.rarity === 'epic'),
    rare: earnedBadges.filter(b => b.rarity === 'rare'),
    uncommon: earnedBadges.filter(b => b.rarity === 'uncommon'),
    common: earnedBadges.filter(b => b.rarity === 'common'),
  };

  // Calculate completion percentage
  const completionPercent = Math.floor((earnedBadges.length / BADGES.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-200">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">🏆 獲得バッジ</h3>
            <p className="text-xs text-slate-500">
              {earnedBadges.length}/{BADGES.length} 獲得 ({completionPercent}%)
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="hidden sm:block w-24">
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Rarity legend */}
      <div className="mt-4 flex flex-wrap gap-2">
        {Object.entries(RARITY_CONFIG).map(([key, config]) => (
          <div key={key} className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${config.bg} ${config.color}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {config.label}
          </div>
        ))}
      </div>

      {/* Earned Badges by Rarity */}
      <div className="mt-4 space-y-4">
        {earnedBadges.length > 0 ? (
          <>
            {/* Show badges grouped by rarity */}
            {(['legendary', 'epic', 'rare', 'uncommon', 'common'] as const).map((rarity) => {
              const badges = groupedEarned[rarity];
              if (badges.length === 0) return null;
              const config = RARITY_CONFIG[rarity];
              
              return (
                <div key={rarity}>
                  <div className={`mb-2 flex items-center gap-1.5 text-xs font-bold ${config.color}`}>
                    <span className={`h-2 w-2 rounded-full bg-current`} />
                    {config.label}級 ({badges.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {badges.map((badge, index) => {
                      const Icon = badge.icon;
                      return (
                        <motion.div
                          key={badge.id}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ 
                            type: 'spring', 
                            delay: 0.05 * index,
                            stiffness: 200
                          }}
                          className="group relative"
                        >
                          <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${badge.gradient} shadow-md ring-2 ${config.border} transition-transform hover:scale-110`}>
                            <Icon className="h-6 w-6 text-white drop-shadow" />
                          </div>
                          {/* Tooltip */}
                          <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{badge.name}</span>
                              <span className={`rounded px-1.5 py-0.5 text-[10px] ${config.bg} ${config.color}`}>{config.label}</span>
                            </div>
                            <div className="text-slate-300">{badge.description}</div>
                            <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
            まだバッジを獲得していません
          </div>
        )}
      </div>

      {/* Locked Badges (collapsed by default, show count) */}
      {lockedBadges.length > 0 && (
        <details className="mt-4 group">
          <summary className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-600">
            <Lock className="h-3 w-3" />
            未獲得のバッジを見る ({lockedBadges.length}個)
          </summary>
          <div className="mt-3 flex flex-wrap gap-2">
            {lockedBadges.slice(0, 12).map((badge) => {
              const Icon = badge.icon;
              const config = RARITY_CONFIG[badge.rarity];
              return (
                <div key={badge.id} className="group/badge relative">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 opacity-50">
                    <Icon className="h-5 w-5 text-slate-300" />
                  </div>
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover/badge:opacity-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{badge.name}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] ${config.bg} ${config.color}`}>{config.label}</span>
                    </div>
                    <div className="text-slate-300">{badge.description}</div>
                    <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                  </div>
                </div>
              );
            })}
            {lockedBadges.length > 12 && (
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100 text-xs font-medium text-slate-400">
                +{lockedBadges.length - 12}
              </div>
            )}
          </div>
        </details>
      )}

      {/* Next badge hint */}
      {lockedBadges.length > 0 && (
        <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-3 border border-amber-200">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-700">
              次のバッジ: {lockedBadges[0].name} - {lockedBadges[0].description}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
