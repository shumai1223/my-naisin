'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, TrendingUp, Award, Flame, Star, Zap, Trophy, Rocket } from 'lucide-react';

import type { ResultData } from '@/lib/types';

interface MotivationCardProps {
  result: ResultData;
}

const MOTIVATION_MESSAGES: Record<string, {
  title: string;
  message: string;
  subMessage: string;
  tips: string[];
  icon: React.ElementType;
  gradient: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
}> = {
  S: {
    title: '🏆 素晴らしい！最高ランク達成！',
    message: 'あなたは頂点に立っています。この成績を維持し続けましょう！',
    subMessage: '難関校への道が開けています',
    tips: [
      '応用問題にどんどん挑戦',
      '後輩に教えることで理解を深める',
      '志望校の過去問を解いてみよう',
      '模試の復習は「原因→対策」まで書き出す',
      '記述問題で論理展開を意識して差をつける',
    ],
    icon: Trophy,
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    bgGradient: 'from-amber-50 via-yellow-50 to-orange-50',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
  },
  A: {
    title: '⭐ 優秀！あと一歩でトップ！',
    message: 'Sランクまであと少し。苦手を克服すれば必ず届きます！',
    subMessage: '得意科目をさらに磨き上げよう',
    tips: [
      '苦手科目を1つ選んで集中対策',
      '得意科目は満点を目指す',
      '計画的な学習スケジュールを',
      '週末に「弱点ノート」を1ページ埋める',
      '提出物は期限より2日前に仕上げる',
    ],
    icon: Star,
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    bgGradient: 'from-blue-50 via-indigo-50 to-violet-50',
    borderColor: 'border-blue-300',
    textColor: 'text-blue-700',
  },
  B: {
    title: '📈 良い調子！伸びしろたっぷり！',
    message: '基礎力はバッチリ。ここからグンと伸びるチャンスです！',
    subMessage: '毎日コツコツが成功の鍵',
    tips: [
      '毎日30分の復習を習慣に',
      '間違えた問題を記録しよう',
      '友達と教え合うのも効果的',
      'テスト2週間前からワークを2周',
      '授業のポイントを1行でまとめる癖をつける',
    ],
    icon: TrendingUp,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    bgGradient: 'from-emerald-50 via-teal-50 to-cyan-50',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-700',
  },
  C: {
    title: '🔥 ここから逆転のスタート！',
    message: '今日この瞬間から変われます。一歩ずつ確実に進もう！',
    subMessage: '1教科ずつ着実にレベルアップ',
    tips: [
      'まずは1教科を重点的に',
      '基礎問題を繰り返し解く',
      '分からないことはすぐ質問',
      '授業ノートを毎週見直して穴を発見',
      '1日10分でも継続して習慣化する',
    ],
    icon: Flame,
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    bgGradient: 'from-orange-50 via-red-50 to-pink-50',
    borderColor: 'border-orange-300',
    textColor: 'text-orange-700',
  },
  D: {
    title: '🚀 諦めない心が最強の武器！',
    message: '可能性は無限大。今日から新しい自分になろう！',
    subMessage: '小さな成功体験を積み重ねよう',
    tips: [
      '教科書の基本に立ち返る',
      '1日10分から始めてみよう',
      '「できた！」を増やしていこう',
      '提出物を期限内に出すことを最優先',
      '朝の5分だけ復習してリズムを作る',
    ],
    icon: Rocket,
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    bgGradient: 'from-rose-50 via-pink-50 to-fuchsia-50',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-700',
  },
};

export function MotivationCard({ result }: MotivationCardProps) {
  // Safely get the rank code, defaulting to 'C' if undefined
  const rankCode = result?.rank?.code || 'C';
  const config = MOTIVATION_MESSAGES[rankCode] || MOTIVATION_MESSAGES.C;
  const Icon = config.icon;

  // Safely calculate percent (truncate decimals)
  const displayPercent = Math.floor(result?.percent || 0);

  // Random tip from the tips array
  const [tipIndex, setTipIndex] = React.useState(0);
  React.useEffect(() => {
    setTipIndex(Math.floor(Math.random() * config.tips.length));
  }, [config.tips.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`relative overflow-hidden rounded-2xl border-2 ${config.borderColor} bg-gradient-to-br ${config.bgGradient} p-5 shadow-lg`}
    >
      {/* Decorative elements */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/40 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-white/30 blur-3xl" />
      <div className="absolute right-4 top-4 text-6xl opacity-10">
        {rankCode}
      </div>

      <div className="relative">
        {/* Header */}
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.3, stiffness: 200 }}
            className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${config.gradient} shadow-xl`}
          >
            <Icon className="h-8 w-8 text-white drop-shadow-md" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.h3
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-lg font-bold ${config.textColor}`}
            >
              {config.title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-1 text-sm text-slate-600 leading-relaxed"
            >
              {config.message}
            </motion.p>
          </div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-5 grid grid-cols-2 gap-2"
        >
          <div className="rounded-xl bg-white/70 p-3 text-center shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-center gap-1 text-[10px] font-medium text-slate-500">
              <Award className="h-3 w-3" />
              ランク
            </div>
            <div className={`mt-1 text-2xl font-black bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
              {rankCode}
            </div>
          </div>
          <div className="rounded-xl bg-white/70 p-3 text-center shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-center gap-1 text-[10px] font-medium text-slate-500">
              <Target className="h-3 w-3" />
              達成率
            </div>
            <div className="mt-1 text-2xl font-black text-slate-700">
              {displayPercent}<span className="text-sm">%</span>
            </div>
          </div>
        </motion.div>

        {/* Tip card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 rounded-xl bg-white/60 p-4 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-start gap-3">
            <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${config.gradient}`}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">今日のアドバイス</div>
              <p className={`mt-1 text-sm font-medium ${config.textColor}`}>{config.tips[tipIndex]}</p>
            </div>
          </div>
        </motion.div>

        {/* Sub message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-3 text-center"
        >
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/50 px-4 py-1.5 text-xs font-medium ${config.textColor}`}>
            <TrendingUp className="h-3 w-3" />
            {config.subMessage}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
