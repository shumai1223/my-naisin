'use client';

import { Calculator, Target, BarChart3, Share2 } from 'lucide-react';

const features = [
  {
    icon: Calculator,
    title: 'かんたん入力',
    description: 'スライダーで直感的に',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500'
  },
  {
    icon: Target,
    title: '目標設定',
    description: '志望校レベルに合わせて',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-500'
  },
  {
    icon: BarChart3,
    title: '教科分析',
    description: '強み・弱みを把握',
    bgColor: 'bg-violet-50',
    iconColor: 'text-violet-500'
  },
  {
    icon: Share2,
    title: 'シェア機能',
    description: 'SNSで結果を共有',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-500'
  }
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className={`mb-3 inline-flex rounded-xl ${feature.bgColor} p-2.5`}>
            <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
          </div>
          <div className="text-sm font-bold text-slate-800">{feature.title}</div>
          <div className="mt-0.5 text-[11px] text-slate-500">{feature.description}</div>
        </div>
      ))}
    </div>
  );
}
