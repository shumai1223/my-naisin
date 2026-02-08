'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

interface ErrorReportLinkProps {
  prefectureCode: string;
  prefectureName: string;
  lastVerified?: string;
  sourceUrl?: string;
}

export function ErrorReportLink({ 
  prefectureCode, 
  prefectureName, 
  lastVerified, 
  sourceUrl 
}: ErrorReportLinkProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-slate-600" />
          <span className="text-sm text-slate-700">このページの誤りを報告する</span>
        </div>
        <Link
          href={`/contact?type=bug&pref=${prefectureCode}`}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          報告フォームへ
        </Link>
      </div>
      
      <div className="mt-2 text-xs text-slate-500">
        {lastVerified && (
          <div>最終確認日: {lastVerified}</div>
        )}
        {sourceUrl && (
          <div>根拠資料: {prefectureName}教育委員会公式資料</div>
        )}
      </div>
    </div>
  );
}
