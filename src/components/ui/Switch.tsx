'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'type'> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, disabled, className, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e);
          if (e.defaultPrevented || disabled) return;
          onCheckedChange?.(!checked);
        }}
        className={cn(
          'relative inline-flex h-6 w-11 select-none items-center rounded-full border border-slate-200 bg-slate-100 p-0.5 outline-none ring-offset-2 ring-offset-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-60',
          checked ? 'border-blue-500 bg-blue-500' : 'border-slate-200 bg-slate-100',
          className
        )}
        {...props}
      >
        {/* framer-motion を外し、つまみの移動は CSS transform（translate-x）で再現 */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-150 ease-out',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    );
  }
);

Switch.displayName = 'Switch';
