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
    title: '今すぐ内申点を計算',
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
  },
];

export function HeroNavigation({ onModeChange, currentMode }: HeroNavigationProps) {
  if (currentMode !== 'select') {
    return null;
  }

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-violet-100 px-4 py-2 text-sm font-medium text-indigo-700">
          <Sparkles className="h-4 w-4" />
          何をしたいですか？
        </div>
        <h2 className="mt-3 text-xl font-bold text-slate-800 md:text-2xl">
          目的に合わせて選んでください
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {navigationOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Link
              href="#calculator"
              onClick={() => {
                onModeChange(option.id);
                setTimeout(() => {
                  document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className={`group relative block w-full overflow-hidden rounded-2xl border-2 ${option.borderColor} bg-gradient-to-br ${option.bgGradient} p-5 text-left shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="relative">
                <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${option.gradient} shadow-lg`}>
                  <option.icon className="h-6 w-6 text-white" />
                </div>

                <div className="mb-2">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${option.badgeColor}`}>
                    {option.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 group-hover:text-slate-900">
                  {option.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {option.description}
                </p>

                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-slate-500 group-hover:text-slate-700">
                  <span>始める</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
