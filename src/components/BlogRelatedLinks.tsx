'use client';

import Link from 'next/link';
import { Calculator, Target, BookOpen, ChevronRight, TrendingUp, Wallet, HeartHandshake } from '@/components/icons';
import { PREFECTURES, REGIONS } from '@/lib/prefectures';

interface BlogRelatedLinksProps {
  relatedPrefectures?: string[];
  showReverseTool?: boolean;
  showGlossary?: boolean;
}

// 関連ツールの行。すべて同じ見た目（白＋罫線・色は1色）。
const TOOL_LINK_CLASS =
  'flex min-h-[44px] items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900 transition-colors duration-150 hover:border-brand-700 hover:bg-brand-50';

export function BlogRelatedLinks({
  relatedPrefectures = [],
  showReverseTool = true,
  showGlossary = true
}: BlogRelatedLinksProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="mb-6 text-xl font-bold text-slate-900">関連ツール・全47都道府県の内申点計算</h3>

      <div className="space-y-6">
        {/* 関連都道府県 */}
        {relatedPrefectures.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-bold text-slate-900">この記事に関連する都道府県</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {relatedPrefectures.map((prefCode) => {
                const pref = PREFECTURES.find(p => p.code === prefCode);
                return (
                  <Link
                    key={prefCode}
                    href={`/${prefCode}/naishin`}
                    className="flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 bg-brand-50 px-4 py-2 text-sm font-bold text-brand-800 transition-colors duration-150 hover:border-brand-700"
                  >
                    <Calculator className="h-4 w-4 shrink-0" />
                    {pref?.name || prefCode}の内申点計算
                    <ChevronRight className="ml-auto h-4 w-4 shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 全都道府県リンク (SEO内部リンク強化) */}
        <div>
          <h4 className="mb-3 text-sm font-bold text-slate-900">都道府県別 内申点計算ツール一覧</h4>
          <div className="space-y-4">
            {REGIONS.map((region) => (
              <div key={region} className="space-y-1.5">
                <div className="text-sm font-bold text-slate-600">{region}</div>
                <div className="flex flex-wrap gap-2">
                  {PREFECTURES.filter(p => p.region === region).map((p) => (
                    <Link
                      key={p.code}
                      href={`/${p.code}/naishin`}
                      className="inline-flex min-h-[44px] items-center rounded border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-colors duration-150 hover:border-brand-700 hover:text-brand-800"
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2">
          {/* 偏差値計算ツール */}
          <Link href="/hensachi" className={TOOL_LINK_CLASS}>
            <TrendingUp className="h-4 w-4 shrink-0 text-brand-700" />
            <span className="flex-1">偏差値計算サイト（5教科）</span>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </Link>

          {/* 評定平均ツール */}
          <Link href="/hyotei-heikin" className={TOOL_LINK_CLASS}>
            <Calculator className="h-4 w-4 shrink-0 text-brand-700" />
            <span className="flex-1">評定平均を自動計算</span>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </Link>

          {/* 逆算ツール */}
          {showReverseTool && (
            <Link href="/reverse" className={TOOL_LINK_CLASS}>
              <Target className="h-4 w-4 shrink-0 text-brand-700" />
              <span className="flex-1">志望校から目標点を逆算</span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Link>
          )}

          {/* 用語辞典 */}
          {showGlossary && (
            <Link href="/glossary" className={TOOL_LINK_CLASS}>
              <BookOpen className="h-4 w-4 shrink-0 text-brand-700" />
              <span className="flex-1">受験用語をチェック</span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </Link>
          )}

          {/* 教育費まとめ（S4-2・保護者向け高CPA面） */}
          <Link href="/hiyou" className={TOOL_LINK_CLASS}>
            <Wallet className="h-4 w-4 shrink-0 text-brand-700" />
            <span className="flex-1">高校受験・進学にかかるお金まとめ</span>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </Link>

          {/* 保護者の方へ（S4-1・GSC表示0だが内部リンク経由の実アフィリクリックの37%を生む面） */}
          <Link href="/hogosha" className={TOOL_LINK_CLASS}>
            <HeartHandshake className="h-4 w-4 shrink-0 text-brand-700" />
            <span className="flex-1">保護者の方へ（無料ガイド）</span>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
