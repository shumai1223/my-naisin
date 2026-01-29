'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
      type,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        type={type ?? 'button'}
        disabled={isDisabled}
        whileTap={{ scale: 0.98 }}
        whileHover={isDisabled ? undefined : { y: -1 }}
        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
        className={cn(
          'inline-flex select-none items-center justify-center gap-2 tracking-tight outline-none ring-offset-2 ring-offset-white focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-100',
          sizeClass[size],
          variantClass[variant],
          className
        )}
        {...(props as any)}
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
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
