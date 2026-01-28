'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface SidebarAdProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'vertical' | 'square';
}

export function SidebarAd({ className, variant = 'vertical', ...props }: SidebarAdProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed border-slate-200 bg-slate-50/50',
        variant === 'vertical' ? 'min-h-[300px]' : 'aspect-square',
        className
      )}
      {...props}
    >
      <div className="flex h-full items-center justify-center p-4">
        <div className="text-center">
          <div className="text-xs text-slate-400">広告準備中</div>
        </div>
      </div>
    </div>
  );
}
