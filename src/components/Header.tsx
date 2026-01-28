'use client';

import { motion } from 'framer-motion';
import { Sparkles, Star, TrendingUp, Shield, Zap, Award, Users, Clock } from 'lucide-react';

import { APP_NAME, APP_NAME_JA } from '@/lib/constants';

import { AdPlaceholder } from '@/components/AdPlaceholder';

export function Header() {
  return (
    <header className="overflow-hidden">
      {/* Hero gradient background with decorative elements */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-blue-600 to-violet-700 px-4 py-10 md:px-6 md:py-12">
        {/* Decorative background patterns */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-blue-300/10 blur-2xl" />
          {/* Animated floating orbs */}
          <motion.div
            animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-[10%] top-[20%] h-3 w-3 rounded-full bg-white/30"
          />
          <motion.div
            animate={{ y: [0, 10, 0], x: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-[15%] top-[60%] h-2 w-2 rounded-full bg-white/20"
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-[30%] top-[70%] h-4 w-4 rounded-full bg-blue-300/20"
          />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-white/30 blur-xl" />
              <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-white/20 shadow-2xl ring-1 ring-white/30 backdrop-blur-md md:h-18 md:w-18">
                <Sparkles className="h-8 w-8 text-white drop-shadow-lg md:h-9 md:w-9" />
              </div>
              {/* Version badge */}
              <div className="absolute -bottom-1 -right-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg ring-2 ring-white/20">
                2026
              </div>
            </motion.div>
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm md:text-3xl"
              >
                {APP_NAME}
                <span className="mx-2 text-white/40">|</span>
                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">{APP_NAME_JA}</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-1.5 text-sm leading-relaxed text-blue-100/90 md:text-base"
              >
                内申点をサクッと計算 • 目標設定 • 分析 • シェア
              </motion.p>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm"
            >
              <Star className="h-4 w-4 fill-yellow-300 text-yellow-300 drop-shadow" />
              中高生応援
            </motion.div>
          </div>
        </div>

        {/* Feature badges */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative mt-6 flex flex-wrap gap-2"
        >
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 ring-1 ring-white/10 backdrop-blur-sm">
            <Zap className="h-3 w-3 text-yellow-300" />
            完全無料
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 ring-1 ring-white/10 backdrop-blur-sm">
            <Shield className="h-3 w-3 text-emerald-300" />
            データ安全
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 ring-1 ring-white/10 backdrop-blur-sm">
            <TrendingUp className="h-3 w-3 text-blue-300" />
            目標達成サポート
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 ring-1 ring-white/10 backdrop-blur-sm">
            <Award className="h-3 w-3 text-amber-300" />
            バッジ獲得
          </div>
          <div className="hidden items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 ring-1 ring-white/10 backdrop-blur-sm sm:flex">
            <Clock className="h-3 w-3 text-rose-300" />
            30秒で診断
          </div>
        </motion.div>

        {/* Floating announcement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="relative mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-2 ring-1 ring-amber-400/30 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
          </span>
          <span className="text-xs font-medium text-white/90">
            🎉 2026年版アップデート！新機能追加
          </span>
        </motion.div>
      </div>

      {/* Header ad */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-4 py-4 md:px-6">
        <AdPlaceholder />
      </div>
    </header>
  );
}
