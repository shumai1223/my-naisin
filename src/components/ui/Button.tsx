'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

// framer-motion を外し、tap/hover の微アニメは CSS（active:scale / hover:-translate-y）で再現。
// Button はサイト全域で使われるため、ここから framer-motion を外すと多数ページの初期バンドルから重量依存が消える。
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'relative overflow-hidden bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500 text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:from-indigo-600 hover:via-blue-600 hover:to-violet-600 active:from-indigo-700 active:via-blue-700 active:to-violet-700 before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:to-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity',
  secondary:
    'bg-white/90 backdrop-blur-md text-slate-700 font-semibold border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-white hover:border-slate-300/80 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] active:bg-slate-50',
  ghost: 'bg-transparent text-slate-600 font-medium hover:bg-slate-100/60 border border-transparent hover:border-slate-200/40 backdrop-blur-sm'
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm rounded-2xl',
  md: 'h-12 px-5 text-sm rounded-[20px]',
  lg: 'h-14 px-6 text-base rounded-3xl'
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      type = 'button',
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          'inline-flex select-none items-center justify-center gap-2 tracking-tight outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-100',
          // framer-motion 相当の微アニメ（CSS）：tap で少し縮み、hover で1px浮く（無効時は浮かせない）
          'active:scale-[0.98] enabled:hover:-translate-y-px',
          sizeClass[size],
          variantClass[variant],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
            <span>{children}</span>
          </span>
        ) : (
          <>
            {leftIcon}
            <span>{children}</span>
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
