'use client';

import * as React from 'react';
import { Sparkles, X, TrendingUp } from '@/components/icons';

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
    if (daysSince === 1) return 'おかえり！昨日ぶりだね';
    if (daysSince <= 3) return `おかえり！${daysSince}日ぶりだね`;
    if (daysSince <= 7) return 'おかえり！また来てくれて嬉しい！';
    return 'おかえり！久しぶり！';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 animate-fade-in">
          <div className="flex items-center gap-3 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-brand-800">{getMessage()}</div>
              <div className="flex items-center gap-1 text-xs text-brand-600">
                <TrendingUp className="h-3 w-3" />
                前回の成績が復元されています
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="ml-2 grid h-6 w-6 place-items-center rounded-lg text-brand-400 transition-colors hover:bg-brand-100 hover:text-brand-600"
              aria-label="閉じる"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
    </div>
  );
}
