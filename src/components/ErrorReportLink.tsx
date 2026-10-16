'use client';

import Link from 'next/link';
import { AlertTriangle } from '@/components/icons';

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
    <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-x-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-slate-600" />
          <span className="text-sm font-bold text-slate-900">このページの誤りを報告する</span>
        </div>
        <Link
          href={`/contact?type=bug&pref=${prefectureCode}`}
          className="inline-flex min-h-[44px] items-center text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800"
        >
          報告フォームへ
        </Link>
      </div>

      <div className="mt-1 text-sm text-slate-600">
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
