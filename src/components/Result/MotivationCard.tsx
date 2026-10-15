'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, TrendingUp, Award, Flame, Star, Zap, Trophy, Rocket } from '@/components/icons';

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
    gradient: 'bg-amber-400',
    bgGradient: 'bg-amber-50',
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
    gradient: 'bg-brand-500',
    bgGradient: 'bg-brand-50',
    borderColor: 'border-brand-300',
    textColor: 'text-brand-700',
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
    gradient: 'bg-brand-500',
    bgGradient: 'bg-brand-50',
    borderColor: 'border-brand-300',
    textColor: 'text-brand-700',
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
    gradient: 'bg-amber-500',
    bgGradient: 'bg-amber-50',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
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
    gradient: 'bg-red-500',
    bgGradient: 'bg-red-50',
    borderColor: 'border-red-300',
    textColor: 'text-red-700',
  },
};

export function MotivationCard({ result }: MotivationCardProps) {
  // Safely get the rank code, defaulting to 'C' if undefined
  const rankCode = result?.rank?.code || 'C';
  const config = MOTIVATION_MESSAGES[rankCode] || MOTIVATION_MESSAGES.C;
  const Icon = config.icon;

  // Safely calculate percent (truncate decimals)
  const displayPercent = Math.floor(result?.percent || 0);

  // Cycling tips
  const [tipIndex, setTipIndex] = React.useState(0);
  const [showAllTips, setShowAllTips] = React.useState(false);
  
  React.useEffect(() => {
    setTipIndex(Math.floor(Math.random() * config.tips.length));
  }, [config.tips.length]);

  // Auto-cycle tips every 5 seconds
  React.useEffect(() => {
    if (showAllTips) return;
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % config.tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [config.tips.length, showAllTips]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`relative overflow-hidden rounded-lg border-2 ${config.borderColor} ${config.bgGradient} p-5`}
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
            className={`grid h-16 w-16 shrink-0 place-items-center rounded-lg ${config.gradient} `}
          >
            <Icon className="h-8 w-8 text-white" />
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
          <div className="rounded-lg bg-white p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
              <Award className="h-3 w-3" />
              ランク
            </div>
            <div className={`mt-1 text-2xl font-bold ${config.gradient} bg-clip-text text-transparent`}>
              {rankCode}
            </div>
          </div>
          <div className="rounded-lg bg-white p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
              <Target className="h-3 w-3" />
              達成率
            </div>
            <div className="mt-1 text-2xl font-bold text-slate-700">
              {displayPercent}<span className="text-sm">%</span>
            </div>
          </div>
        </motion.div>

        {/* Tip card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-4 rounded-lg bg-white p-4"
        >
          <div className="flex items-start gap-3">
            <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${config.gradient}`}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-400">今日のアドバイス</div>
                <button
                  onClick={() => setShowAllTips(!showAllTips)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  {showAllTips ? '閉じる' : 'すべて見る'}
                </button>
              </div>
              {showAllTips ? (
                <ul className="mt-2 space-y-2">
                  {config.tips.map((tip, i) => (
                    <li key={i} className={`text-xs ${config.textColor} flex items-start gap-2`}>
                      <span className={`shrink-0 grid h-4 w-4 place-items-center rounded-full text-xs font-bold text-white ${config.gradient}`}>
                        {i + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              ) : (
                <motion.p
                  key={tipIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-1 text-sm ${config.textColor}`}
                >
                  {config.tips[tipIndex]}
                </motion.p>
              )}
            </div>
          </div>
          {!showAllTips && (
            <div className="flex justify-center gap-1 mt-3">
              {config.tips.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTipIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === tipIndex ? ` ${config.gradient}` : 'bg-slate-300'}`}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Sub message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-3 text-center"
        >
          <span className={`inline-flex items-center gap-1.5 rounded-full bg-white/50 px-4 py-1.5 text-xs ${config.textColor}`}>
            <TrendingUp className="h-3 w-3" />
            {config.subMessage}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
