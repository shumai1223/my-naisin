'use client';

import { motion } from 'framer-motion';

import { MODE_CONFIG } from '@/lib/constants';
import type { ScoreMode } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface RegionSwitchProps {
  mode: ScoreMode;
  onChange: (mode: ScoreMode) => void;
}

const options: ScoreMode[] = ['normal', 'tokyo'];

export function RegionSwitch({ mode, onChange }: RegionSwitchProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="relative grid grid-cols-2 gap-1">
        <motion.div
          layout
          layoutId="mode-pill"
          className={cn(
            'absolute inset-y-0 w-1/2 rounded-lg bg-blue-500',
            mode === 'normal' ? 'left-0' : 'left-1/2'
          )}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />

        {options.map((opt) => {
          const active = opt === mode;
          const config = MODE_CONFIG[opt];
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={cn(
                'relative z-10 rounded-lg px-3 py-3 text-left transition',
                active ? 'text-white' : 'text-slate-600 hover:text-slate-800'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold">{config.label}</div>
                <div
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[11px] font-medium',
                    active
                      ? 'bg-white text-blue-600'
                      : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {config.max}点
                </div>
              </div>
              <div className={cn('mt-1 text-[11px] leading-relaxed', active ? 'text-white/80' : 'text-slate-500')}>{config.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
