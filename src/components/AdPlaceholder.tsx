'use client';

import * as React from 'react';
import { Megaphone } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface AdPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdPlaceholder({ className, ...props }: AdPlaceholderProps) {
  return (
    <div className="w-full">
      {/* AdSense規約準拠: 広告ラベル */}
      <div className="mb-1 text-center text-[10px] font-medium tracking-wider text-slate-400">
        スポンサーリンク
      </div>
      <div
        className={cn(
          'group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 py-5 transition-shadow hover:shadow-sm',
          className
        )}
        {...props}
      >
        {/* Subtle decorative elements */}
        <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full bg-blue-100/40 blur-2xl" />
        <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-indigo-100/40 blur-2xl" />
        
        <div className="relative flex items-center justify-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 transition-colors group-hover:bg-slate-200">
            <Megaphone className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold text-slate-500">広告スペース</div>
          </div>
        </div>
      </div>
    </div>
  );
}
