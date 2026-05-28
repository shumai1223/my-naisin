'use client';

import * as React from 'react';
import Link from 'next/link';
import { Calculator, Target, BookOpen, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export type NavigationMode = 'select' | 'calculate' | 'reverse' | 'learn';

interface HeroNavigationProps {
  onModeChange: (mode: NavigationMode) => void;
  currentMode: NavigationMode;
}

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
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-100">
          <span aria-hidden="true">✍️</span>
          運営者は<strong>2026年度受験生・現役中3</strong>。当事者が作る内申点ツール
        </p>
      </div>

      <div className="space-y-6">
        {/* Main CTA - Single prominent button */}
        <div className="flex flex-col items-center gap-2">
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
          <p className="max-w-lg text-center text-xs text-slate-500">
            例：「通知表の数字をいま入れて、内申点を出したい」→ こちら
          </p>
        </div>

        {/* Quick Prefecture Selection - 1クリック化 */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-center text-sm text-slate-500">
            または、都道府県を選んですぐに計算
          </div>
          
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {[
              { code: 'tokyo', name: '東京' },
              { code: 'kanagawa', name: '神奈川' },
              { code: 'osaka', name: '大阪' },
              { code: 'aichi', name: '愛知' },
              { code: 'saitama', name: '埼玉' },
              { code: 'chiba', name: '千葉' },
            ].map((pref, index) => (
              <motion.div
                key={pref.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
              >
                <Link
                  href={`/${pref.code}/naishin`}
                  className="group inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md hover:bg-blue-50 hover:text-blue-700"
                >
                  <span>{pref.name}</span>
                  <ChevronRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </div>
          
          <Link
            href="/prefectures"
            className="text-xs text-slate-500 hover:text-blue-600"
          >
            全47都道府県から選ぶ →
          </Link>
        </div>

        {/* Secondary navigation - 用途別に具体例つきで提示 */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-center text-sm text-slate-500">
            または、目的別に選ぶ
          </div>

          <div className="grid w-full max-w-3xl gap-3 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Link
                href="/reverse"
                className="group flex h-full flex-col gap-1 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white p-4 text-left shadow-sm transition-all duration-300 hover:border-emerald-300 hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                  <span className="text-base font-bold text-slate-800">志望校から逆算</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-emerald-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-600">目標点から必要な当日点を計算</p>
                <p className="mt-1 text-xs text-emerald-700">
                  例：「志望校の目標点に届くか確かめたい」→ こちら
                </p>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              <Link
                href="/hensachi"
                className="group flex h-full flex-col gap-1 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 via-indigo-50/50 to-white p-4 text-left shadow-sm transition-all duration-300 hover:border-purple-300 hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="text-base font-bold text-slate-800">偏差値を計算</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-purple-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-600">5教科の点数から偏差値を瞬時に算出</p>
                <p className="mt-1 text-xs text-purple-700">
                  例：「模試の点数から偏差値を知りたい」→ こちら
                </p>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Link
                href="/hyotei-heikin"
                className="group flex h-full flex-col gap-1 rounded-xl border border-teal-200 bg-gradient-to-br from-teal-50 via-cyan-50/50 to-white p-4 text-left shadow-sm transition-all duration-300 hover:border-teal-300 hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-teal-600" />
                  <span className="text-base font-bold text-slate-800">評定平均を自動計算</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-teal-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-600">通知表の評定から平均値・素内申を算出</p>
                <p className="mt-1 text-xs text-teal-700">
                  例：「推薦入試の評定平均を確認したい」→ こちら
                </p>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              <Link
                href="/guide"
                className="group flex h-full flex-col gap-1 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50/50 to-white p-4 text-left shadow-sm transition-all duration-300 hover:border-amber-300 hover:shadow-md"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                  <span className="text-base font-bold text-slate-800">制度を理解する</span>
                  <ChevronRight className="ml-auto h-4 w-4 text-amber-500 transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-600">都道府県別の計算方法・コラム</p>
                <p className="mt-1 text-xs text-amber-700">
                  例：「換算内申って何？まず仕組みを知りたい」→ こちら
                </p>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
