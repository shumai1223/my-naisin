'use client';

import { CSSProperties, useId } from 'react';

export interface LoaderProps {
  variant?: 'fullscreen' | 'inline' | 'spinner';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

const SIZE_MAP: Record<NonNullable<LoaderProps['size']>, number> = {
  sm: 16,
  md: 32,
  lg: 48,
};

function CoreSpinner({ px }: { px: number }) {
  const reactId = useId();
  const gid = `naishin-loader-grad-${reactId.replace(/:/g, '')}`;
  const stroke = Math.max(2, Math.round(px * 0.1));
  const r = (px - stroke) / 2;
  const c = px / 2;
  const circumference = 2 * Math.PI * r;
  const arc = circumference * 0.35;
  const gap = circumference - arc;

  return (
    <span
      className="naishin-spinner"
      style={{ width: px, height: px } as CSSProperties}
    >
      <svg
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="55%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        <circle
          className="naishin-spinner__track"
          cx={c}
          cy={c}
          r={r}
          stroke="#c7d2fe"
          strokeOpacity={0.55}
          strokeWidth={stroke}
          style={{ transformOrigin: 'center' }}
        />

        <circle
          className="naishin-spinner__arc"
          cx={c}
          cy={c}
          r={r}
          stroke={`url(#${gid})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${gap}`}
          style={{ transformOrigin: 'center' }}
        />
      </svg>
    </span>
  );
}

export default function Loader({
  variant = 'spinner',
  size = 'md',
  message,
  className = '',
}: LoaderProps) {
  if (variant === 'spinner') {
    return (
      <span
        role="status"
        aria-label={message ?? '読み込み中'}
        aria-live="polite"
        className={`inline-flex items-center justify-center ${className}`}
      >
        <CoreSpinner px={SIZE_MAP[size]} />
        {message ? (
          <span className="ml-2 text-sm font-medium text-slate-500">
            {message}
          </span>
        ) : null}
        {!message ? <span className="sr-only">読み込み中</span> : null}
      </span>
    );
  }

  if (variant === 'inline') {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={message ?? '読み込み中'}
        className={`flex h-full w-full flex-col items-center justify-center gap-4 py-10 ${className}`}
      >
        <CoreSpinner px={40} />
        {message ? (
          <p className="animate-pulse-subtle text-center text-sm font-medium text-slate-500">
            {message}
          </p>
        ) : (
          <span className="sr-only">読み込み中</span>
        )}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="assertive"
      aria-label={message ?? '読み込み中'}
      className={`mesh-gradient fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm ${className}`}
    >
      <div className="naishin-loader-card glass-card mx-4 flex w-full max-w-xs flex-col items-center gap-6 rounded-2xl px-8 py-10 shadow-2xl">
        <div className="relative flex items-center justify-center">
          <span
            className="glow-pulse absolute inset-0 -m-3 rounded-full border border-indigo-200/60"
            aria-hidden="true"
          />
          <CoreSpinner px={56} />
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <p className="gradient-text text-lg font-bold tracking-tight">
            My-naishin
          </p>
          {message ? (
            <p className="animate-pulse-subtle text-center text-sm font-medium text-slate-500">
              {message}
            </p>
          ) : (
            <span className="sr-only">読み込み中</span>
          )}
        </div>

        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="naishin-dot naishin-dot--1 h-1.5 w-1.5 rounded-full" />
          <span className="naishin-dot naishin-dot--2 h-1.5 w-1.5 rounded-full" />
          <span className="naishin-dot naishin-dot--3 h-1.5 w-1.5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
