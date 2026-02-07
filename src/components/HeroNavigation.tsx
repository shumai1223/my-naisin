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
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-100 to-violet-100 px-4 py-2 text-sm font-medium text-indigo-700">
          <Sparkles className="h-4 w-4" />
          何をしたいですか？
        </div>
        <h2 className="mt-3 text-xl font-bold text-slate-800 md:text-2xl">
          目的に合わせて選んでください
        </h2>
      </div>

      <div className="space-y-6">
        {/* Main CTA - Calculate Naishin Point */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <Link
              href="#calculator"
              onClick={(e) => {
                e.preventDefault();
                onModeChange('calculate');
                setTimeout(() => {
                  document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
              }}
              className="group relative block w-full overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 p-6 text-center shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className="relative">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 shadow-lg">
                  <Calculator className="h-8 w-8 text-white" />
                </div>

                <div className="mb-3">
                  <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-700">
                    30秒で完了
                  </span>
                </div>

                <h3 className="mb-2 text-2xl font-bold text-slate-800 group-hover:text-slate-900">
                  内申点を計算する
                </h3>
                <p className="text-slate-600">
                  都道府県を選んで成績を入力するだけ
                </p>

                <div className="mt-6 flex items-center justify-center gap-2 text-lg font-medium text-blue-600 group-hover:text-blue-700">
                  <span>今すぐ計算する</span>
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Secondary Options */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-center text-sm text-slate-500">
            または、目的別に選ぶ
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 w-full max-w-2xl">
            {navigationOptions.filter(option => option.isSecondary).map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.3 }}
              >
                <Link
                  href={option.href ?? '#calculator'}
                  onClick={(e) => {
                    if (!option.href) {
                      e.preventDefault();
                    }
                    onModeChange(option.id);
                    if (!option.href) {
                      setTimeout(() => {
                        document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 50);
                    }
                  }}
                  className={`group relative block w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${option.gradient} shadow-md`}>
                      <option.icon className="h-5 w-5 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="mb-1">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${option.badgeColor}`}>
                          {option.badge}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-slate-900">
                        {option.title}
                      </h4>
                      <p className="text-xs text-slate-600">
                        {option.description}
                      </p>
                    </div>
                    
                    <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
