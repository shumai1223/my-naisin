'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  description?: string;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="結果の表示切り替え"
      className={cn(
        'sticky top-2 z-20 flex w-full items-stretch gap-1 rounded-lg border border-slate-200 bg-white p-1',
        className
      )}
    >
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`tabpanel-${item.id}`}
            id={`tab-${item.id}`}
            onClick={() => onChange(item.id)}
            className={cn(
              'flex min-h-11 flex-1 flex-col items-center justify-center gap-1 rounded px-4 py-3 text-base font-bold transition-colors duration-100',
              active
                ? 'bg-brand-700 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-brand-800'
            )}
          >
            <span className="flex items-center gap-2">
              {item.icon}
              <span className="text-base leading-none">{item.label}</span>
              {item.badge ? (
                <span
                  className={cn(
                    'rounded border px-1.5 py-0.5 text-xs font-bold',
                    active ? 'border-white/60 text-white' : 'border-slate-300 text-slate-700'
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </span>

            {item.description ? (
              <span className={cn('text-xs leading-none', active ? 'text-white/90' : 'text-slate-600')}>
                {item.description}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
