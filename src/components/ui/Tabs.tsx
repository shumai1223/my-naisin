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
        'sticky top-2 z-20 flex w-full items-stretch gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur',
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
              'group relative flex flex-1 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl px-4 py-3.5 text-base font-bold transition-all duration-200',
              active
                ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-300/50'
                : 'border border-dashed border-slate-300 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700'
            )}
          >
            {/* 非アクティブタブにアニメーション pulse リング */}
            {!active && (
              <span
                aria-hidden
                className="absolute inset-0 rounded-xl ring-2 ring-indigo-300/60 animate-ping opacity-0 group-hover:opacity-100"
              />
            )}

            <span className="relative flex items-center gap-2">
              {item.icon}
              <span className="text-base leading-none">{item.label}</span>
              {item.badge ? (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-extrabold',
                    active
                      ? 'bg-white/25 text-white'
                      : 'bg-indigo-100 text-indigo-700'
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </span>

            {item.description ? (
              <span
                className={cn(
                  'relative text-[11px] font-medium leading-none',
                  active ? 'text-white/80' : 'text-slate-400 group-hover:text-indigo-500'
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
