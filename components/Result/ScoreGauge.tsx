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
  const size = 200;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safe = Math.max(0, Math.min(100, percent));
  const dashOffset = circumference * (1 - safe / 100);

  // Dynamic color based on percentage
  const getGradientColors = () => {
    if (safe >= 90) return { start: '#8b5cf6', mid: '#7c3aed', end: '#6d28d9' }; // Purple for S
    if (safe >= 75) return { start: '#6366f1', mid: '#4f46e5', end: '#4338ca' }; // Indigo for A
    if (safe >= 60) return { start: '#3b82f6', mid: '#2563eb', end: '#1d4ed8' }; // Blue for B
    return { start: '#64748b', mid: '#475569', end: '#334155' }; // Slate for C
  };
  const colors = getGradientColors();

  return (
    <div className={cn('relative grid place-items-center', className)}>
      {/* Outer glow ring */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 blur-xl"
        style={{ 
          background: `radial-gradient(circle, ${colors.start}40 0%, transparent 70%)` 
        }}
      />
      
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="50%" stopColor={colors.mid} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
          <filter id={`${id}-glow`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={stroke}
          fill="transparent"
          className="opacity-60"
        />

        {/* Progress arc with glow */}
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
          filter={`url(#${id}-glow)`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 grid place-items-center">
        <motion.div 
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="relative">
            <span 
              className="text-4xl font-black tracking-tight"
              style={{ color: colors.mid }}
            >
              {Math.round(safe)}
            </span>
            <span className="text-lg font-bold text-slate-400">%</span>
          </div>
          <div className="mt-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {total} / {max}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
