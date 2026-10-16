'use client';

import Link from 'next/link';
import { AlertTriangle, ChevronRight, Home, Search } from '@/components/icons';
import * as React from 'react';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
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
    <div className="min-h-screen bg-slate-50">
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '用語辞典', url: 'https://my-naishin.com/glossary' },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-2 flex flex-wrap items-center gap-x-2 text-sm text-slate-600">
          <Link href="/" className="inline-flex min-h-[44px] items-center gap-1 hover:text-brand-700 hover:underline">
            <Home className="h-4 w-4" />
            ホーム
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">用語辞典</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
            内申点 用語辞典
          </h1>
          <p className="mt-4 text-base leading-[1.8] text-slate-900">
            内申点・高校入試に関する用語をわかりやすく解説
          </p>
        </header>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-600" />
          <input
            type="text"
            aria-label="用語を検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="用語を検索..."
            className="h-12 w-full rounded border border-slate-300 bg-white pl-10 pr-4 text-base text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-brand-700"
          />
        </div>

        {/* 目次 */}
        <div className="mb-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-3 text-xl font-bold text-slate-900">用語一覧（{filteredTerms.length}件）</h2>
          <div className="flex flex-wrap gap-2">
            {filteredTerms.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="inline-flex min-h-[44px] items-center rounded border border-slate-300 bg-white px-3 text-sm text-brand-700 hover:bg-brand-50"
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
              className="scroll-mt-20 rounded-lg border border-slate-200 bg-white p-5 md:p-6"
            >
              <h2 className="text-xl font-bold text-slate-900">{t.term}</h2>
              <p className="mt-3 text-base leading-[1.8] text-slate-900">{t.description}</p>

              <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                <div className="py-3">
                  <dt className="text-sm font-bold text-slate-900">例</dt>
                  <dd className="mt-1 text-base leading-[1.8] text-slate-900">{t.example}</dd>
                </div>
                <div className="py-3">
                  <dt className="flex items-center gap-1.5 text-sm font-bold text-amber-900">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    注意点
                  </dt>
                  <dd className="mt-1 text-base leading-[1.8] text-slate-900">{t.note}</dd>
                </div>
                {t.relatedPrefectures && (
                  <div className="py-3">
                    <dt className="text-sm font-bold text-slate-900">県差</dt>
                    <dd className="mt-1 text-base leading-[1.8] text-slate-900">{t.relatedPrefectures}</dd>
                  </div>
                )}
              </dl>

              {t.links && t.links.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-x-5">
                  {t.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-[44px] items-center gap-1 text-brand-700 underline underline-offset-2 hover:text-brand-800"
                      >
                        {link.label}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                href={`/glossary/${t.id}`}
                className="inline-flex min-h-[44px] items-center gap-1 text-sm font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
              >
                「{t.term.split('（')[0]}」の個別ページを見る（FAQ・詳細あり）
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </article>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <div className="text-lg text-slate-900">
              該当する用語が見つかりません
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 inline-flex min-h-[44px] items-center text-brand-700 underline underline-offset-2 hover:text-brand-800"
            >
              検索をリセット
            </button>
          </div>
        )}

        {/* 都道府県別の呼び方対応表（O-3: 用語×県方式の差異辞典） */}
        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-2 text-xl font-bold text-slate-900">都道府県別の呼び方対応表</h2>
          <p className="mb-4 text-base leading-[1.8] text-slate-900">
            「換算内申」「S値」「K値」など、内申点・総合得点にまつわる呼び方や計算方式は都道府県ごとに異なります。お住まいの都道府県の呼び方をここで確認できます。
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="border-b border-slate-900 text-left text-xs text-slate-600">
                  <th scope="col" className="py-2 pr-3 font-bold">都道府県</th>
                  <th scope="col" className="py-2 font-bold">呼び方・方式</th>
                </tr>
              </thead>
              <tbody>
                {PREFECTURE_TERMS_SORTED.map((e) => (
                  <tr key={e.code} className="border-b border-slate-200">
                    <td className="pr-3">
                      <Link
                        href={e.href}
                        className="inline-flex min-h-[44px] items-center font-bold text-brand-700 underline underline-offset-2 hover:text-brand-800"
                      >
                        {e.name}
                      </Link>
                    </td>
                    <td className="py-2 text-slate-900">{e.term}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 関連リンク */}
        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 md:p-6">
          <h2 className="mb-2 text-xl font-bold text-slate-900">関連コンテンツ</h2>
          <ul className="grid gap-x-8 sm:grid-cols-2">
            <li>
              <Link
                href="/"
                className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800"
              >
                <span className="underline underline-offset-2">内申点を計算する</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
            <li>
              <Link
                href="/hensachi"
                className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800"
              >
                <span className="underline underline-offset-2">偏差値を計算する</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
            <li>
              <Link
                href="/hyotei-heikin"
                className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800"
              >
                <span className="underline underline-offset-2">評定平均を自動計算する</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
            <li>
              <Link
                href="/reverse"
                className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800"
              >
                <span className="underline underline-offset-2">志望校から逆算する</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
            <li>
              <Link
                href="/prefectures"
                className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800"
              >
                <span className="underline underline-offset-2">都道府県別の計算方法を見る</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
            <li>
              <Link
                href="/blog/kansan-naishin-vs-su-naishin"
                className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800"
              >
                <span className="underline underline-offset-2">換算内申と素内申の違いを解説</span>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Link>
            </li>
          </ul>
        </section>

        {/* SEO用テキスト */}
        <p className="mt-6 text-sm leading-[1.8] text-slate-600">
          内申点に関する用語辞典です。素内申・換算内申・調査書点・K値・S値・A値・観点別評価・傾斜配点・特色検査・ESAT-Jなど、
          高校入試で使われる重要用語を、具体例・注意点・都道府県ごとの違いとともに解説しています。
        </p>
      </div>
    </div>
  );
}
