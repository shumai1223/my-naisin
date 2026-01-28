'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

export interface ScoreGaugeProps {
  percent: number;
  total: number;
  max: number;
  className?: string;
}

export function ScoreGauge({ percent, total, max, className }: ScoreGaugeProps) {
  const id = React.useId();
  const size = 190;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safe = Math.max(0, Math.min(100, percent));
  const dashOffset = circumference * (1 - safe / 100);

  return (
    <div className={cn('relative grid place-items-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="60%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={stroke}
          fill="transparent"
        />

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${id}-grad)`}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.9, ease: [0.2, 0.85, 0.2, 1] }}
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-3xl font-bold tracking-tight text-slate-800">
            {Math.round(safe)}<span className="text-base font-semibold text-slate-500">%</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {total}/{max}
          </div>
        </div>
      </div>
    </div>
  );
}
