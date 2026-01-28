'use client';

import { motion } from 'framer-motion';
import { Calculator, Target, BarChart3, Share2 } from 'lucide-react';

const features = [
  {
    icon: Calculator,
    title: 'かんたん入力',
    description: 'スライダーで直感的に',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500'
  },
  {
    icon: Target,
    title: '目標設定',
    description: '志望校レベルに合わせて',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-500'
  },
  {
    icon: BarChart3,
    title: '教科分析',
    description: '強み・弱みを把握',
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-50',
    iconColor: 'text-violet-500'
  },
  {
    icon: Share2,
    title: 'シェア機能',
    description: 'SNSで結果を共有',
    color: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-500'
  }
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {features.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.04)] backdrop-blur-sm transition-all hover:border-slate-200/80 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
        >
          {/* Background accent */}
          <div className={`absolute -right-4 -top-4 h-16 w-16 rounded-full ${feature.bgColor} opacity-50 blur-2xl transition-transform group-hover:scale-150`} />
          
          <div className="relative">
            <div className={`mb-3 inline-flex rounded-xl ${feature.bgColor} p-2.5 transition-transform group-hover:scale-110`}>
              <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
            </div>
            <div className="text-sm font-bold text-slate-800">{feature.title}</div>
            <div className="mt-0.5 text-[11px] text-slate-500">{feature.description}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
