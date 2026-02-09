'use client';

import Link from 'next/link';
import { Calculator, Target, BookOpen, ChevronRight } from 'lucide-react';

interface BlogRelatedLinksProps {
  relatedPrefectures?: string[];
  showReverseTool?: boolean;
  showGlossary?: boolean;
}

export function BlogRelatedLinks({ 
  relatedPrefectures = [], 
  showReverseTool = true, 
  showGlossary = true 
}: BlogRelatedLinksProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-slate-800">関連ツール・情報</h3>
      
      <div className="space-y-3">
        {/* 関連都道府県 */}
        {relatedPrefectures.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-700">関連都道府県の内申点計算</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {relatedPrefectures.map((pref) => (
                <Link
                  key={pref}
                  href={`/${pref}/naishin`}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Calculator className="h-4 w-4" />
                  {pref}の内申点計算
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 逆算ツール */}
        {showReverseTool && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-700">志望校から逆算</h4>
            <Link
              href="/reverse"
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100"
            >
              <Target className="h-4 w-4" />
              逆算ツールで目標点を計算
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* 用語辞典 */}
        {showGlossary && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-700">用語解説</h4>
            <Link
              href="/glossary"
              className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100"
            >
              <BookOpen className="h-4 w-4" />
              用語辞典で専門用語を確認
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* フル機能版 */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-700">本格的な内申点管理</h4>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100"
          >
            <Calculator className="h-4 w-4" />
            フル機能版で成績推移を管理
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
