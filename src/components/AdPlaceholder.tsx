'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export type AdPlaceholderProps = React.HTMLAttributes<HTMLDivElement>;

export function AdPlaceholder({ className, ...props }: AdPlaceholderProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-4',
        className
      )}
      {...props}
    />
  );
}
