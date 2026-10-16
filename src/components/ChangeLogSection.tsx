import * as React from 'react';
import { ExternalLink } from '@/components/icons';

import { getRecentChanges, ChangeLogEntry } from '@/lib/changelog-data';

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
  seo: 'SEO',
} as const;

// 種別・分類・都道府県のタグはすべて同じ見た目（色で区別せず、文字で区別する）。
const TAG_CLASS =
  'inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700';

interface ChangeLogSectionProps {
  limit?: number;
  showTitle?: boolean;
}

export function ChangeLogSection({ limit = 5, showTitle = true }: ChangeLogSectionProps) {
  const changes = React.useMemo(() => getRecentChanges(limit), [limit]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      {showTitle && <h3 className="mb-4 text-[17px] font-bold text-slate-900">更新履歴</h3>}

      <ul className="divide-y divide-slate-200">
        {changes.map((entry, index) => (
          <ChangeLogItem key={`${entry.date}-${index}`} entry={entry} />
        ))}
      </ul>

      <div className="mt-4 border-t border-slate-200 pt-3">
        <p className="text-sm text-slate-600">
          当サイトは公式資料に基づき定期的に情報を更新しています。
          最新情報は各都道府県教育委員会の公式サイトでご確認ください。
        </p>
      </div>
    </div>
  );
}

function ChangeLogItem({ entry }: { entry: ChangeLogEntry }) {
  return (
    <li className="py-3 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm tabular-nums text-slate-600">{entry.date}</span>
        <span className={TAG_CLASS}>{typeLabels[entry.type]}</span>
        <span className={TAG_CLASS}>{categoryLabels[entry.category as keyof typeof categoryLabels]}</span>
        {entry.prefectureCode && <span className={TAG_CLASS}>{entry.prefectureCode}</span>}
      </div>
      <div className="mt-1 text-base font-bold leading-snug text-slate-900">{entry.title}</div>
      <div className="mt-1 text-sm leading-[1.8] text-slate-600">{entry.description}</div>
      {entry.sourceUrl && (
        <a
          href={entry.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1 text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800"
        >
          <ExternalLink className="h-4 w-4" />
          {entry.sourceName ?? '参照元'}
        </a>
      )}
    </li>
  );
}
