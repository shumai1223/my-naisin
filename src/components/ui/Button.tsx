'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

// デザインシステム「やさしい学習帳」: 平らな面・深緑1色。浮き上がり・縮み・光は使わない。
// Button はサイト全域で使われる（framer-motion には依存しない）。
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-brand-700 text-white font-bold border border-brand-700 hover:bg-brand-800 hover:border-brand-800 active:bg-brand-900',
  secondary: 'bg-white text-brand-700 font-bold border border-brand-700 hover:bg-brand-50 active:bg-brand-100',
  ghost: 'bg-transparent text-slate-700 border border-transparent hover:bg-slate-100 active:bg-slate-200',
};

// 押す面は44px以上（sm も 44px）
const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-11 px-4 text-sm rounded',
  md: 'h-12 px-5 text-base rounded',
  lg: 'h-14 px-6 text-base rounded',
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
          'inline-flex select-none items-center justify-center gap-2 outline-none transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-60',
          sizeClass[size],
          variantClass[variant],
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span
              className={cn(
                'h-4 w-4 animate-spin rounded-full border-2',
                variant === 'primary' ? 'border-white/40 border-t-white' : 'border-slate-300 border-t-slate-700'
              )}
            />
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
