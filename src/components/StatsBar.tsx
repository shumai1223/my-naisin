'use client';

import { Calculator, Target, BarChart3, Share2 } from '@/components/icons';

const features = [
  {
    icon: Calculator,
    title: 'かんたん入力',
    description: 'スライダーで直感的に',
    bgColor: 'bg-brand-50',
    iconColor: 'text-brand-500'
  },
  {
    icon: Target,
    title: '目標設定',
    description: '志望校レベルに合わせて',
    bgColor: 'bg-brand-50',
    iconColor: 'text-brand-500'
  },
  {
    icon: BarChart3,
    title: '教科分析',
    description: '強み・弱みを把握',
    bgColor: 'bg-slate-50',
    iconColor: 'text-slate-500'
  },
  {
    icon: Share2,
    title: 'シェア機能',
    description: 'SNSで結果を共有',
    bgColor: 'bg-red-50',
    iconColor: 'text-red-500'
  }
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="rounded-lg border border-slate-100 bg-white p-4 transition-shadow"
        >
          <div className={`mb-3 inline-flex rounded-lg ${feature.bgColor} p-2.5`}>
            <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
          </div>
          <div className="text-sm font-bold text-slate-800">{feature.title}</div>
          <div className="mt-0.5 text-xs text-slate-500">{feature.description}</div>
        </div>
      ))}
    </div>
  );
}
