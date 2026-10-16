'use client';

import { Info } from '@/components/icons';

interface BlogUpdateInfoProps {
  lastUpdated: string;
  updateContent: string[];
  updateReason?: string;
}

export function BlogUpdateInfo({ lastUpdated, updateContent, updateReason }: BlogUpdateInfoProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-base font-bold text-slate-900">最終更新</h3>
        <span className="text-sm tabular-nums text-slate-600">{lastUpdated}</span>
      </div>

      {updateReason && (
        <p className="mt-2 text-sm leading-relaxed text-slate-900">
          <span className="font-bold">更新理由：</span>
          {updateReason}
        </p>
      )}

      <div className="mt-3">
        <h4 className="text-sm font-bold text-slate-900">更新内容</h4>
        <ul className="mt-1 space-y-1">
          {updateContent.map((content, index) => (
            <li key={index} className="flex items-start gap-2 text-sm leading-relaxed text-slate-900">
              <span className="text-slate-600" aria-hidden="true">•</span>
              <span>{content}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 flex items-start gap-2 border-t border-slate-200 pt-3 text-sm leading-relaxed text-slate-900">
        <Info className="mt-[3px] h-4 w-4 shrink-0" />
        制度は年度によって変更される場合があります。最新情報は各教育委員会の公式サイトでご確認ください。
      </p>
    </div>
  );
}
