'use client';

import * as React from 'react';
import Link from 'next/link';
import { MapPin, Calculator, Share2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThreeStepGuide() {
  const steps = [
    {
      number: 1,
      title: '都道府県を選ぶ',
      description: 'お住まいの地域を選んで正しい計算方法を適用',
      icon: MapPin,
      href: '/prefectures',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      number: 2,
      title: '通知表を入力',
      description: '9教科の成績を入力して内申点を計算',
      icon: Calculator,
      href: '/',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      number: 3,
      title: '結果を保存/シェア/逆算',
      description: '計算結果を保存したり、目標点から逆算したり',
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
      
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={step.href}>
              <div className="group relative h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-slate-300">
                {/* ステップ番号 */}
                <div className="absolute -top-3 -left-3 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-sm font-bold text-white shadow-lg">
                  {step.number}
                </div>
                
                {/* アイコン */}
                <div className={`grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br ${step.color} shadow-lg mb-4`}>
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                
                {/* コンテンツ */}
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {step.description}
                </p>
                
                {/* 矢印 */}
                <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                  <span>今すぐ始める</span>
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
