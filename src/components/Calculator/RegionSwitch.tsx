'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

import { MODE_CONFIG } from '@/lib/constants';
import { getPrefectureByCode } from '@/lib/prefectures';
import type { ScoreMode } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface RegionSwitchProps {
  mode: ScoreMode;
  onChange: (mode: ScoreMode) => void;
  prefectureCode?: string;
}

const options: { mode: ScoreMode; icon?: React.ReactNode }[] = [
  { mode: 'normal' },
  { mode: 'tokyo' },
  { mode: 'prefecture', icon: <MapPin className="h-3.5 w-3.5" /> }
];

export function RegionSwitch({ mode, onChange, prefectureCode }: RegionSwitchProps) {
  const getPosition = () => {
    const idx = options.findIndex(o => o.mode === mode);
    return `${(idx / options.length) * 100}%`;
  };

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-1.5 shadow-sm">
      <div className="relative grid grid-cols-3 gap-1">
        <motion.div
          layout
          layoutId="mode-pill"
          className="absolute inset-y-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md"
          style={{ width: `${100 / options.length}%` }}
          animate={{ left: getPosition() }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />

        {options.map(({ mode: opt, icon }) => {
          const active = opt === mode;
          const config = MODE_CONFIG[opt];
          const prefecture = opt === 'prefecture' && prefectureCode ? getPrefectureByCode(prefectureCode) : null;
          
          const label = opt === 'prefecture' 
            ? (prefecture ? prefecture.name : '都道府県別')
            : config.label;
          
          const maxScore = opt === 'prefecture' && prefecture
            ? prefecture.maxScore
            : config.max;

          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={cn(
                'relative z-10 rounded-xl px-3 py-2.5 text-center transition-all',
                active ? 'text-white' : 'text-slate-600 hover:text-slate-800'
              )}
            >
              <div className="flex items-center justify-center gap-1.5">
                {icon}
                <span className="text-sm font-bold">{label}</span>
              </div>
              <div className={cn(
                'mt-0.5 text-[10px]',
                active ? 'text-white/80' : 'text-slate-400'
              )}>
                {maxScore > 0 ? `${maxScore}点満点` : '選択してください'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
