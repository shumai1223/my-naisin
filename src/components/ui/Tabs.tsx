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
        'sticky top-2 z-20 mx-auto flex w-full max-w-xl items-stretch gap-1 rounded-2xl border border-slate-200 bg-white/95 p-1 shadow-md backdrop-blur',
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
              'group relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200',
              active
                ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-300/40'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <span className="flex items-center gap-1.5">
              {item.icon}
              <span>{item.label}</span>
              {item.badge ? (
                <span
                  className={cn(
                    'ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                    active ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </span>
            {item.description ? (
              <span
                className={cn(
                  'hidden text-[10px] font-medium sm:block',
                  active ? 'text-white/80' : 'text-slate-400'
                )}
              >
                {item.description}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
