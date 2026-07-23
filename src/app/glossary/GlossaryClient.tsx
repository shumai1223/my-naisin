'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight, Home, Search } from 'lucide-react';
import * as React from 'react';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { HUB_ALL } from '@/lib/total-score/hub';
import { GLOSSARY_TERMS } from '@/lib/glossary-terms';

/** 都道府県別の呼び方対応表用（O-3: 用語×県方式の差異辞典）。HUB_ALL（検証済み・total-score registry/explainers由来）を五十音順に並べ替えるのみ＝新規データなし。 */
const PREFECTURE_TERMS_SORTED = [...HUB_ALL].sort((a, b) => a.name.localeCompare(b.name, 'ja'));

export default function GlossaryClient() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredTerms = React.useMemo(() => {
    if (!searchQuery) return GLOSSARY_TERMS;
    const q = searchQuery.toLowerCase();
    return GLOSSARY_TERMS.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.reading.includes(q) ||
        t.description.includes(searchQuery)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '用語辞典', url: 'https://my-naishin.com/glossary' },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
            <Home className="h-4 w-4" />
            ホーム
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-700">用語辞典</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
                内申点 用語辞典
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                内申点・高校入試に関する用語をわかりやすく解説
              </p>
            </div>
          </div>
        </header>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            aria-label="用語を検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="用語を検索..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm shadow-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        {/* 目次 */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-slate-700">用語一覧（{filteredTerms.length}件）</h2>
          <div className="flex flex-wrap gap-2">
            {filteredTerms.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              >
                {t.term.split('（')[0]}
              </a>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div className="space-y-6">
          {filteredTerms.map((t) => (
            <article
              key={t.id}
              id={t.id}
              className="scroll-mt-20 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-slate-800">{t.term}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{t.description}</p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                  <div className="text-xs font-bold text-blue-700">例</div>
                  <p className="mt-1 text-xs leading-relaxed text-blue-600">{t.example}</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <div className="text-xs font-bold text-amber-700">注意点</div>
                  <p className="mt-1 text-xs leading-relaxed text-amber-600">{t.note}</p>
                </div>
              </div>

              {t.relatedPrefectures && (
                <div className="mt-3 rounded-xl bg-slate-50 p-3">
                  <div className="text-xs font-bold text-slate-500">県差</div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{t.relatedPrefectures}</p>
                </div>
              )}

              {t.links && t.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {t.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                    >
                      {link.label}
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href={`/glossary/${t.id}`}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline"
              >
                「{t.term.split('（')[0]}」の個別ページを見る（FAQ・詳細あり）
                <ChevronRight className="h-3 w-3" />
              </Link>
            </article>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <div className="text-4xl">🔍</div>
            <div className="mt-4 text-lg font-medium text-slate-600">
              該当する用語が見つかりません
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-sm text-blue-600 hover:underline"
            >
              検索をリセット
            </button>
          </div>
        )}

        {/* 都道府県別の呼び方対応表（O-3: 用語×県方式の差異辞典） */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-bold text-slate-800">都道府県別の呼び方対応表</h2>
          <p className="mb-4 text-sm leading-relaxed text-slate-500">
            「換算内申」「S値」「K値」など、内申点・総合得点にまつわる呼び方や計算方式は都道府県ごとに異なります。お住まいの都道府県の呼び方をここで確認できます。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                  <th scope="col" className="py-2 pr-3 font-bold">都道府県</th>
                  <th scope="col" className="py-2 font-bold">呼び方・方式</th>
                </tr>
              </thead>
              <tbody>
                {PREFECTURE_TERMS_SORTED.map((e) => (
                  <tr key={e.code} className="border-b border-slate-100 last:border-0">
                    <td className="py-1.5 pr-3">
                      <Link href={e.href} className="font-bold text-amber-700 hover:underline">
                        {e.name}
                      </Link>
                    </td>
                    <td className="py-1.5 text-slate-600">{e.term}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* アフィリエイト広告 */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
          <div className="text-sm font-bold text-slate-700 mb-1">
            用語を理解したら、実践へ
          </div>
          <div className="text-xs text-slate-500 mb-4 leading-relaxed">
            内申点アップに直結する学習なら<AffiliateAd id="zkai-text-middle" hideLabel />（PR）。テキスト＋添削で得点力を底上げ。
          </div>
          <div className="hidden md:block">
            <AffiliateAd id="zkai-banner" />
          </div>
          <div className="md:hidden">
            <AffiliateAd id="sapuri-banner-300" />
          </div>
        </section>

        {/* 関連リンク */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-800">関連コンテンツ</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/"
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-sm font-medium text-slate-700">内申点を計算する</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link
              href="/hensachi"
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-sm font-medium text-slate-700">偏差値を計算する</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link
              href="/hyotei-heikin"
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-sm font-medium text-slate-700">評定平均を自動計算する</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link
              href="/reverse"
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-sm font-medium text-slate-700">志望校から逆算する</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link
              href="/prefectures"
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-sm font-medium text-slate-700">都道府県別の計算方法を見る</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
            <Link
              href="/blog/kansan-naishin-vs-su-naishin"
              className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-sm font-medium text-slate-700">換算内申と素内申の違いを解説</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          </div>
        </section>

        {/* SEO用テキスト */}
        <p className="mt-6 text-xs leading-relaxed text-slate-400">
          内申点に関する用語辞典です。素内申・換算内申・調査書点・K値・S値・A値・観点別評価・傾斜配点・特色検査・ESAT-Jなど、
          高校入試で使われる重要用語を、具体例・注意点・都道府県ごとの違いとともに解説しています。
        </p>
      </div>
    </div>
  );
}
