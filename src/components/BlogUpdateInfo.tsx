'use client';

import { Calendar, RefreshCw, Info } from 'lucide-react';

interface BlogUpdateInfoProps {
  lastUpdated: string;
  updateContent: string[];
  updateReason?: string;
}

export function BlogUpdateInfo({ lastUpdated, updateContent, updateReason }: BlogUpdateInfoProps) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200">
          <RefreshCw className="h-4 w-4 text-amber-700" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-amber-800">最終更新</h3>
            <span className="text-xs text-amber-600">{lastUpdated}</span>
          </div>
          
          {updateReason && (
            <div className="mt-2 rounded-lg border border-amber-300 bg-amber-100 p-2">
              <p className="text-xs font-medium text-amber-800">
                📝 更新理由：{updateReason}
              </p>
            </div>
          )}
          
          <div className="mt-2">
            <h4 className="mb-1 text-xs font-semibold text-amber-700">更新内容</h4>
            <ul className="space-y-1">
              {updateContent.map((content, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-amber-700">
                  <span className="mt-0.5 text-amber-500">•</span>
                  <span>{content}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mt-3 rounded-lg border border-amber-300 bg-amber-100 p-2">
            <p className="text-xs text-amber-800">
              <Info className="mr-1 inline h-3 w-3" />
              制度は年度によって変更される場合があります。最新情報は各教育委員会の公式サイトでご確認ください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
