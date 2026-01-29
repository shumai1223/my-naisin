'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'elevated' | 'premium';
}

export function Card({ variant = 'glass', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative rounded-3xl border transition-all duration-300',
        variant === 'glass' && 'glass-card border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,255,255,0.8)_inset] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.9)_inset] hover:-translate-y-0.5',
        variant === 'solid' && 'bg-gradient-to-br from-white via-slate-50/30 to-white border-slate-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-0.5',
        variant === 'elevated' && 'bg-white border-slate-100/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_80px_-15px_rgba(0,0,0,0.16)] hover:-translate-y-1',
        variant === 'premium' && 'bg-gradient-to-br from-white via-slate-50/20 to-white/95 border-slate-200/40 shadow-[0_25px_70px_-20px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.6)_inset] hover:shadow-[0_35px_90px_-20px_rgba(0,0,0,0.2)] hover:-translate-y-1 backdrop-blur-xl',
        className
      )}
      {...props}
    />
  );
}