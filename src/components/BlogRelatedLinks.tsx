'use client';

import Link from 'next/link';
import { Calculator, Target, BookOpen, ChevronRight, MapPin } from 'lucide-react';
import { PREFECTURES, REGIONS } from '@/lib/prefectures';

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
      <h3 className="mb-6 text-lg font-bold text-slate-800">関連ツール・全47都道府県の内申点計算</h3>
      
      <div className="space-y-6">
        {/* 関連都道府県 */}
        {relatedPrefectures.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-slate-700">この記事に関連する都道府県</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {relatedPrefectures.map((prefCode) => {
                const pref = PREFECTURES.find(p => p.code === prefCode);
                return (
                  <Link
                    key={prefCode}
                    href={`/${prefCode}/naishin`}
                    className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-100"
                  >
                    <Calculator className="h-4 w-4" />
                    {pref?.name || prefCode}の内申点計算
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 全都道府県リンク (SEO内部リンク強化) */}
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <MapPin className="h-4 w-4 text-blue-500" />
            都道府県別 内申点計算ツール一覧
          </h4>
          <div className="space-y-4">
            {REGIONS.map((region) => (
              <div key={region} className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">{region}</div>
                <div className="flex flex-wrap gap-2">
                  {PREFECTURES.filter(p => p.region === region).map((p) => (
                    <Link
                      key={p.code}
                      href={`/${p.code}/naishin`}
                      className="rounded-md border border-slate-100 bg-slate-50/50 px-2.5 py-1 text-xs font-medium text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-slate-100">
          {/* 逆算ツール */}
          {showReverseTool && (
            <Link
              href="/reverse"
              className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                <Target className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-medium text-emerald-600/80 leading-none mb-1">GOAL TARGET</div>
                志望校から目標点を逆算
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}

          {/* 用語辞典 */}
          {showGlossary && (
            <Link
              href="/glossary"
              className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700 transition-colors hover:border-amber-300 hover:bg-amber-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-amber-600 shadow-sm">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-medium text-amber-600/80 leading-none mb-1">GLOSSARY</div>
                受験用語をチェック
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
