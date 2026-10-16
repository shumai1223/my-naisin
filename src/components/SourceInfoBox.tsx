'use client';

import { ExternalLink, AlertCircle } from '@/components/icons';

interface Source {
  name: string;
  url: string;
}

interface SourceInfoBoxProps {
  sources?: Source[];
  lastVerified?: string;
  prefectureName?: string;
}

export function SourceInfoBox({ sources, lastVerified, prefectureName }: SourceInfoBoxProps) {
  const hasInfo = (sources && sources.length > 0) || lastVerified;
  
  if (!hasInfo) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
      <h4 className="mb-2 text-base font-bold text-slate-900">
        情報の根拠・出典
      </h4>

      {sources && sources.length > 0 && (
        <ul className="mb-2">
          {sources.map((source, i) => (
            <li key={i}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                {source.name}
                <ExternalLink className="h-4 w-4 shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      )}

      {lastVerified && (
        <div className="text-sm text-slate-600">
          <span>最終確認日: {lastVerified}</span>
        </div>
      )}

      <div className="mt-3 flex items-start gap-2 border-t border-slate-200 pt-3 text-sm text-slate-600">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
        <p>
          {prefectureName 
            ? `${prefectureName}の入試制度は年度によって変更される場合があります。`
            : '入試制度は年度によって変更される場合があります。'}
          最新の情報は各教育委員会の公式サイトでご確認ください。
        </p>
      </div>
    </div>
  );
}
