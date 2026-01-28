'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Megaphone, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface SidebarAdProps extends HTMLMotionProps<'div'> {
  variant?: 'vertical' | 'square';
}

export function SidebarAd({ className, variant = 'vertical', ...props }: SidebarAdProps) {
  return (
    <div className="w-full">
      {/* AdSense規約準拠: 広告ラベル */}
      <div className="mb-1 text-center text-[10px] font-medium tracking-wider text-slate-400">
        スポンサーリンク
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          'group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50',
          variant === 'vertical' ? 'min-h-[380px]' : 'aspect-square',
          className
        )}
        {...props}
      >
      {/* Rich decorative background */}
      <div className="absolute inset-0">
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/50" />
        
        {/* Floating orbs */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 opacity-60 blur-2xl transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-gradient-to-br from-violet-100 to-blue-100 opacity-50 blur-2xl transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 opacity-40 blur-xl" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        
        {/* Corner accent */}
        <div className="absolute right-0 top-0 h-20 w-20 bg-gradient-to-bl from-blue-500/5 to-transparent" />
      </div>

      <div className="relative flex h-full flex-col items-center justify-center gap-4 px-5 py-8">
        {/* Icon with glow */}
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl transition-all duration-300 group-hover:bg-blue-400/30" />
          <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg ring-1 ring-slate-200/50 transition-all duration-300 group-hover:from-blue-50 group-hover:to-indigo-100 group-hover:ring-blue-200/50">
            <Megaphone className="h-6 w-6 text-slate-400 transition-colors group-hover:text-blue-500" />
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-slate-600">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            広告スペース
          </div>
          <div className="mt-1.5 text-xs text-slate-400">ここに広告が表示されます</div>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
          <div className="h-1 w-8 rounded-full bg-slate-200 transition-colors group-hover:bg-blue-200" />
          <div className="h-1 w-2 rounded-full bg-slate-200 transition-colors group-hover:bg-blue-300" />
          <div className="h-1 w-1 rounded-full bg-slate-200 transition-colors group-hover:bg-blue-400" />
        </div>
      </div>
      </motion.div>
    </div>
  );
}
