'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'elevated';
}

export function Card({ variant = 'glass', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border transition-all duration-300',
        variant === 'glass' && 'glass-card border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,255,255,0.8)_inset] hover:shadow-[0_16px_48px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.9)_inset]',
        variant === 'solid' && 'bg-gradient-to-br from-white via-slate-50/50 to-white border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)]',
        variant === 'elevated' && 'bg-white border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.15)]',
        className
      )}
      {...props}
    />
  );
}