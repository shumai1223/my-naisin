'use client';

import * as React from 'react';
import Link from 'next/link';
import { MapPin, Calculator, Share2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThreeStepGuide() {
  const steps = [
    {
      number: 1,
      title: '通知表を入力',
      description: '9教科の成績を入力して内申点を計算',
      icon: Calculator,
      href: '/',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      number: 2,
      title: '都道府県を選ぶ',
      description: 'お住まいの地域を選んで正しい計算方法を適用',
      icon: MapPin,
      href: '/prefectures',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      number: 3,
      title: '逆算で目標を設定',
      description: '志望校の合格点から必要な内申点を計算',
      icon: Share2,
      href: '/reverse',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">3ステップで内申点を計算</h2>
        <p className="text-slate-600">説明は下にあるので、まずは試してみましょう</p>
      </div>
      
      {/* メインの計算ツール（大きい） */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
          className="md:transform md:scale-105"
        >
          <Link href={steps[0].href}>
            <div className={`group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:border-emerald-300 ring-2 ring-emerald-500 ring-opacity-50 bg-gradient-to-br from-emerald-50 to-teal-50`}>
              {/* ステップ番号 */}
              <div className="absolute -top-3 -left-3 grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-bold text-white shadow-lg">
                {steps[0].number}
              </div>
              
              {/* アイコン */}
              <div className="grid h-16 w-16 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg mb-6 scale-110">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              
              {/* コンテンツ */}
              <h3 className="text-2xl font-bold mb-3 text-emerald-700 group-hover:text-emerald-800 transition-colors">
                {steps[0].title}
              </h3>
              <p className="text-base text-emerald-600 mb-6 font-medium">
                {steps[0].description}
              </p>
              
              {/* 矢印 */}
              <div className="flex items-center font-bold text-emerald-600 group-hover:text-emerald-700 text-lg transition-colors">
                <span>👇 今すぐ計算する</span>
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
      
      {/* 残り2つ（小さく並べる） */}
      <div className="grid gap-6 md:grid-cols-2">
        {steps.slice(1).map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
          >
            <Link href={step.href}>
              <div className={`group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-slate-300 ${
                step.number === 2 ? 'ring-2 ring-blue-500 ring-opacity-50 bg-gradient-to-br from-blue-50 to-indigo-50' : 
                step.number === 3 ? 'ring-2 ring-purple-500 ring-opacity-50 bg-gradient-to-br from-purple-50 to-pink-50' : ''
              }`}>
                {/* ステップ番号 */}
                <div className={`absolute -top-3 -left-3 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-lg ${
                  step.number === 2 ? 'from-blue-500 to-indigo-600' : 
                  step.number === 3 ? 'from-purple-500 to-pink-600' : 'from-slate-700 to-slate-900'
                }`}>
                  {step.number}
                </div>
                
                {/* アイコン */}
                <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br shadow-lg mb-4 ${
                  step.number === 2 ? 'from-blue-500 to-indigo-600' : 
                  step.number === 3 ? 'from-purple-500 to-pink-600' : step.color
                }`}>
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                
                {/* コンテンツ */}
                <h3 className={`font-bold mb-2 group-hover:text-blue-600 transition-colors ${
                  step.number === 2 ? 'text-lg text-blue-700' : 
                  step.number === 3 ? 'text-lg text-purple-700' : 'text-base text-slate-800'
                }`}>
                  {step.title}
                </h3>
                <p className={`mb-4 ${
                  step.number === 2 ? 'text-sm text-blue-600 font-medium' : 
                  step.number === 3 ? 'text-sm text-purple-600 font-medium' : 'text-sm text-slate-600'
                }`}>
                  {step.description}
                </p>
                
                {/* 矢印 */}
                <div className={`flex items-center font-medium transition-colors ${
                  step.number === 2 ? 'text-blue-600 group-hover:text-blue-700 text-sm' : 
                  step.number === 3 ? 'text-purple-600 group-hover:text-purple-700 text-sm' : 'text-sm text-blue-600 group-hover:text-blue-700'
                }`}>
                  <span>{step.number === 2 ? '📍 都道府県を選択' : step.number === 3 ? '🎯 志望校逆算で目標設定' : '今すぐ始める'}</span>
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {/* 補足説明 */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
          <span>💡</span>
          <span>各ステップの詳細な使い方は下で説明しています</span>
        </div>
      </div>
    </div>
  );
}
