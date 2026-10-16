'use client';

import { cn } from '@/lib/utils';

export interface ScoreGaugeProps {
  percent: number;
  total: number;
  max: number;
  className?: string;
}

// 色はブランド色と緑みの灰だけ（DESIGN-SYSTEM.md）。達成率でも色を変えない。
const ARC_COLOR = '#17543e';
const TRACK_COLOR = '#cddad3';

export function ScoreGauge({ percent, total, max, className }: ScoreGaugeProps) {
  const size = 200;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safe = Math.max(0, Math.min(100, percent));
  const dashOffset = circumference * (1 - safe / 100);

  return (
    <div className={cn('relative grid place-items-center', className)}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={TRACK_COLOR}
          strokeWidth={stroke}
          fill="transparent"
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ARC_COLOR}
          strokeWidth={stroke}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap={safe > 0 ? 'round' : 'butt'}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div>
            <span className="text-4xl font-bold tabular-nums text-brand-700">
              {Math.round(safe)}
            </span>
            <span className="text-lg font-bold text-slate-600">%</span>
          </div>
          <div className="mt-1 text-sm tabular-nums text-slate-600">
            {total} / {max}
          </div>
        </div>
      </div>
    </div>
  );
}
