'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface AdPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdPlaceholder({ className, ...props }: AdPlaceholderProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-8',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="text-xs text-slate-400">広告準備中</div>
        </div>
      </div>
    </div>
  );
}
