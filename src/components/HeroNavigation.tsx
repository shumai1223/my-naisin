'use client';

import * as React from 'react';
import Link from 'next/link';
import { Calculator, Target, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export type NavigationMode = 'select' | 'calculate' | 'reverse' | 'learn';

interface HeroNavigationProps {
  onModeChange: (mode: NavigationMode) => void;
  currentMode: NavigationMode;
}

const navigationOptions = [
  {
    id: 'calculate' as const,
    icon: Calculator,
    title: '内申点を計算する',
    description: '都道府県を選んで成績を入力するだけ',
    gradient: 'from-blue-500 via-indigo-500 to-violet-600',
    bgGradient: 'from-blue-50 via-indigo-50 to-violet-50',
    borderColor: 'border-blue-200',
    badge: '30秒で完了',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'reverse' as const,
    icon: Target,
    title: '志望校から逆算',
    description: '目標点から必要な当日点を計算',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    bgGradient: 'from-emerald-50 via-teal-50 to-cyan-50',
    borderColor: 'border-emerald-200',
    badge: '目標設定',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    href: '/reverse',
    isSecondary: true,
  },
  {
    id: 'learn' as const,
    icon: BookOpen,
    title: '制度を理解する',
    description: '都道府県別の計算方法・コラム',
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    bgGradient: 'from-amber-50 via-orange-50 to-rose-50',
    borderColor: 'border-amber-200',
    badge: '47都道府県対応',
    badgeColor: 'bg-amber-100 text-amber-700',
    href: '/prefectures',
    isSecondary: true,
  },
];

export function HeroNavigation({ onModeChange, currentMode }: HeroNavigationProps) {
  if (currentMode !== 'select') {
    return null;
  }

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800 md:text-3xl lg:text-4xl">
          内申点を計算する（47都道府県対応）
        </h1>
        <p className="mt-3 text-slate-600 md:text-lg">
          通知表の数字を入れるだけ。計算根拠と公式資料も一緒に確認できます。
        </p>
      </div>

      <div className="space-y-6">
        {/* Main CTA - Single prominent button */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg"
          >
            <button
              onClick={() => {
                onModeChange('calculate');
                setTimeout(() => {
                  document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-8 py-4 text-center font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] md:py-5 md:text-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="relative flex items-center justify-center gap-3">
                <Calculator className="h-5 w-5 md:h-6 md:w-6" />
                <span>内申点を計算する</span>
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1 md:h-6 md:w-6" />
              </div>
            </button>
          </motion.div>
        </div>

        {/* Secondary navigation - smaller links */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-center text-sm text-slate-500">
            または、目的別に選ぶ
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Link
                href="/reverse"
                className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:bg-slate-50"
              >
                <Target className="h-4 w-4" />
                <span>志望校から逆算</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Link
                href="/blog/naishin-guide"
                className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md hover:bg-slate-50"
              >
                <BookOpen className="h-4 w-4" />
                <span>制度を理解する</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
