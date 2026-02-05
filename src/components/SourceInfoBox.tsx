'use client';

import { ExternalLink, Calendar, Shield, AlertCircle } from 'lucide-react';

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
    <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Shield className="h-5 w-5 text-emerald-600" />
        <h4 className="font-bold text-slate-800">
          情報の根拠・出典
        </h4>
      </div>

      {sources && sources.length > 0 && (
        <ul className="mb-3 space-y-2">
          {sources.map((source, i) => (
            <li key={i}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-emerald-700 hover:text-emerald-900 hover:underline"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {source.name}
              </a>
            </li>
          ))}
        </ul>
      )}

      {lastVerified && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Calendar className="h-4 w-4" />
          <span>最終確認日: {lastVerified}</span>
        </div>
      )}

      <div className="mt-3 flex items-start gap-2 rounded-lg bg-white/60 p-3 text-xs text-slate-500">
        <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-500" />
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
