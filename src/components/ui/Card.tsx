'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

// デザインシステム「やさしい学習帳」: カードは白い面＋1pxの罫線。影・浮き上がり・ぼかしは使わない。
// variant は既存の呼び出し側との互換のために残す（見た目の差は罫線の濃さだけ）。
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'elevated' | 'premium';
}

export function Card({ variant = 'glass', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'relative rounded-lg border bg-white',
        variant === 'glass' || variant === 'solid' ? 'border-slate-200' : 'border-slate-300',
        className
      )}
      {...props}
    />
  );
}
