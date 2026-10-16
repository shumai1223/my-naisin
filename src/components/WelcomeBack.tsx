'use client';

import * as React from 'react';
import { X } from '@/components/icons';

const LAST_VISIT_KEY = 'naishin-last-visit';

export function WelcomeBack() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [daysSince, setDaysSince] = React.useState(0);

  React.useEffect(() => {
    try {
      const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
      const now = new Date();
      
      if (lastVisit) {
        const lastDate = new Date(lastVisit);
        const diffTime = Math.abs(now.getTime() - lastDate.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // Show welcome back if visited more than 1 day ago
        if (diffDays >= 1) {
          setDaysSince(diffDays);
          setIsVisible(true);
          // Auto hide after 5 seconds
          const timer = setTimeout(() => setIsVisible(false), 5000);
          return () => clearTimeout(timer);
        }
      }
      
      // Update last visit
      localStorage.setItem(LAST_VISIT_KEY, now.toISOString());
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const getMessage = () => {
    if (daysSince === 1) return '前回のご利用は昨日です';
    return `前回のご利用は${daysSince}日前です`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-4 top-4 z-50 mx-auto w-fit motion-safe:animate-fade-in">
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white py-2 pl-4 pr-2 shadow-overlay">
        <div>
          <div className="text-sm font-bold text-slate-900">{getMessage()}</div>
          <div className="text-sm text-slate-600">前回の成績が復元されています</div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded text-slate-600 transition-colors hover:bg-brand-50 hover:text-slate-900"
          aria-label="閉じる"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
