'use client';

import * as React from 'react';
import { History, Plus, RefreshCw, Wrench, Trash2, ExternalLink } from 'lucide-react';

import { getRecentChanges, ChangeLogEntry } from '@/lib/changelog-data';

const typeIcons = {
  add: Plus,
  update: RefreshCw,
  fix: Wrench,
  remove: Trash2,
};

const typeColors = {
  add: 'bg-emerald-100 text-emerald-700',
  update: 'bg-blue-100 text-blue-700',
  fix: 'bg-amber-100 text-amber-700',
  remove: 'bg-red-100 text-red-700',
};

const typeLabels = {
  add: '追加',
  update: '更新',
  fix: '修正',
  remove: '削除',
};

const categoryLabels = {
  calculation: '計算',
  data: 'データ',
  feature: '機能',
  ui: 'UI',
  content: 'コンテンツ',
};

interface ChangeLogSectionProps {
  limit?: number;
  showTitle?: boolean;
}

export function ChangeLogSection({ limit = 5, showTitle = true }: ChangeLogSectionProps) {
  const changes = React.useMemo(() => getRecentChanges(limit), [limit]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {showTitle && (
        <div className="mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-slate-500" />
          <h3 className="text-base font-bold text-slate-800">更新履歴</h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            E-E-A-T対応
          </span>
        </div>
      )}

      <div className="space-y-3">
        {changes.map((entry, index) => (
          <ChangeLogItem key={`${entry.date}-${index}`} entry={entry} />
        ))}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="text-xs text-slate-500">
          当サイトは公式資料に基づき定期的に情報を更新しています。
          最新情報は各都道府県教育委員会の公式サイトでご確認ください。
        </p>
      </div>
    </div>
  );
}

function ChangeLogItem({ entry }: { entry: ChangeLogEntry }) {
  const Icon = typeIcons[entry.type];

  return (
    <div className="flex gap-3">
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${typeColors[entry.type]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">{entry.date}</span>
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${typeColors[entry.type]}`}>
            {typeLabels[entry.type]}
          </span>
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
            {categoryLabels[entry.category]}
          </span>
          {entry.prefectureCode && (
            <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">
              {entry.prefectureCode}
            </span>
          )}
        </div>
        <div className="mt-1 text-sm font-medium text-slate-700">{entry.title}</div>
        <div className="mt-0.5 text-xs text-slate-500">{entry.description}</div>
        {entry.sourceUrl && (
          <a
            href={entry.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            {entry.sourceName ?? '参照元'}
          </a>
        )}
      </div>
    </div>
  );
}
