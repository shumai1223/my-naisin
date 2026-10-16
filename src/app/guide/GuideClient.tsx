'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from '@/components/icons';

import { PREFECTURES } from '@/lib/prefectures';
import { Card } from '@/components/ui/Card';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

const REGIONS = [
  { name: '北海道・東北', codes: ['hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima'] },
  { name: '関東', codes: ['ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa'] },
  { name: '中部', codes: ['niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano', 'gifu', 'shizuoka', 'aichi'] },
  { name: '近畿', codes: ['mie', 'shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama'] },
  { name: '中国・四国', codes: ['tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi', 'tokushima', 'kagawa', 'ehime', 'kochi'] },
  { name: '九州・沖縄', codes: ['fukuoka', 'saga', 'nagasaki', 'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'okinawa'] },
];

const POPULAR_ARTICLES = [
  {
    slug: 'naishinten-calculation-by-prefecture',
    title: '【完全保存版】内申点の計算方法を都道府県別に徹底解説！',
    category: '内申点の基礎',
  },
  {
    slug: 'tokyo-kansan-naishin-guide',
    title: '【東京都】換算内申の計算方法と都立高校入試の完全ガイド',
    category: '都道府県別対策',
  },
  {
    slug: 'kansan-naishin-vs-su-naishin',
    title: '【図解】換算内申と素内申の違いとは？',
    category: '内申点の基礎',
  },
];

export default function GuideClient() {
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null);

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '制度を理解する', url: 'https://my-naishin.com/guide' }
        ]}
      />
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Header */}
          <Link
            href="/"
            className="mb-2 inline-flex min-h-[44px] items-center gap-2 text-brand-700 underline underline-offset-2 hover:text-brand-800"
          >
            <ArrowLeft className="h-4 w-4" />
            トップに戻る
          </Link>

          <header className="mb-8">
            <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
              制度を理解する
            </h1>
            <p className="mt-4 text-base leading-[1.8] text-slate-900">
              都道府県別の計算方法・コラム
            </p>
          </header>

          <div className="space-y-10">
            {/* Popular Articles */}
            <Card className="p-5 md:p-6">
              <h2 className="text-xl font-bold text-slate-900">人気の記事</h2>
              <p className="mt-1 text-sm text-slate-600">まずはこちらから</p>

              <ul className="mt-3 border-y border-slate-200">
                {POPULAR_ARTICLES.map((article) => (
                  <li key={article.slug} className="border-b border-slate-200 last:border-b-0">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="flex items-start justify-between gap-3 py-3 text-brand-700 hover:text-brand-800"
                    >
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                            {article.category}
                          </span>
                        </div>
                        <h3 className="text-[17px] font-bold underline underline-offset-2">
                          {article.title}
                        </h3>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Region-based Guide */}
            <Card className="p-5 md:p-6">
              <h2 className="text-xl font-bold text-slate-900">都道府県から探す</h2>
              <p className="mt-1 text-sm text-slate-600">地域別の計算方法</p>

              <div className="mb-6 mt-4">
                <h3 className="mb-3 text-[17px] font-bold text-slate-900">
                  地域を選択
                </h3>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((region) => (
                    <button
                      key={region.name}
                      type="button"
                      aria-pressed={selectedRegion === region.name}
                      onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
                      className={`inline-flex min-h-[44px] items-center rounded border px-4 py-2 text-sm font-bold ${
                        selectedRegion === region.name
                          ? 'border-brand-700 bg-brand-700 text-white'
                          : 'border-slate-300 bg-white text-slate-900 hover:bg-brand-50'
                      }`}
                    >
                      {region.name}
                    </button>
                  ))}
                </div>
              </div>

              {selectedRegion && (
                <div className="mb-6">
                  <h3 className="mb-2 text-[17px] font-bold text-slate-900">
                    {selectedRegion}の都道府県
                  </h3>
                  <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                    {REGIONS.find(r => r.name === selectedRegion)?.codes.map((code) => {
                      const prefecture = PREFECTURES.find(p => p.code === code);
                      if (!prefecture) return null;

                      return (
                        <li key={code}>
                          <Link
                            href={`/${code}/naishin`}
                            className="flex min-h-[44px] items-center justify-between gap-3 border-b border-slate-200 py-2 text-brand-700 hover:text-brand-800"
                          >
                            <div>
                              <div className="font-bold underline underline-offset-2">
                                {prefecture.name}
                              </div>
                              <div className="text-sm text-slate-600">
                                {prefecture.maxScore}点満点
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 shrink-0" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
                <h3 className="mb-2 text-base font-bold text-slate-900">ポイント</h3>
                <ul className="list-disc space-y-2 pl-5 text-base leading-[1.8] text-slate-900">
                  <li>内申点の計算方法は都道府県によって大きく異なります</li>
                  <li>内申点の対象学年も都道府県で異なり、中1〜中3の3年間が対象の県が約7割（34県）で多数派、中3のみが対象の県が11県、中2・中3が対象の県が2県です</li>
                  <li>実技4教科の配点が高い地域が多いです</li>
                  <li>最新の入試情報は各都道府県教育委員会で確認しましょう</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
