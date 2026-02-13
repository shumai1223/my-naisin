'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, MapPin, ArrowLeft, ArrowRight, FileText, ExternalLink } from 'lucide-react';

import { PREFECTURES } from '@/lib/prefectures';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

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

export default function GuidePage() {
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            トップに戻る
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              制度を理解する
            </h1>
            <p className="text-lg text-slate-600">
              都道府県別の計算方法・コラム
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          {/* Popular Articles */}
          <Card className="overflow-hidden">
            <div className="border-b border-slate-100/80 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/80 px-5 py-5 md:px-6">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 shadow-lg shadow-blue-300/40">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold tracking-tight text-slate-800">人気の記事</div>
                  <div className="text-sm text-slate-500">まずはこちらから</div>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <div className="space-y-4">
                {POPULAR_ARTICLES.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="group block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                            {article.category}
                          </span>
                        </div>
                        <h3 className="text-base font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Card>

          {/* Region-based Guide */}
          <Card className="overflow-hidden">
            <div className="border-b border-slate-100/80 bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-rose-50/80 px-5 py-5 md:px-6">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 shadow-lg shadow-amber-300/40">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold tracking-tight text-slate-800">都道府県から探す</div>
                  <div className="text-sm text-slate-500">地域別の計算方法</div>
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <div className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-800">
                  <MapPin className="h-5 w-5 text-amber-500" />
                  地域を選択
                </h3>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map((region) => (
                    <button
                      key={region.name}
                      onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        selectedRegion === region.name
                          ? 'bg-amber-500 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {region.name}
                    </button>
                  ))}
                </div>
              </div>

              {selectedRegion && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-700">
                    {selectedRegion}の都道府県
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {REGIONS.find(r => r.name === selectedRegion)?.codes.map((code) => {
                      const prefecture = PREFECTURES.find(p => p.code === code);
                      if (!prefecture) return null;
                      
                      return (
                        <Link
                          key={code}
                          href={`/${code}/naishin`}
                          className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-amber-300 hover:shadow-md"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-slate-800 group-hover:text-amber-600">
                                {prefecture.name}
                              </div>
                              <div className="text-sm text-slate-500">
                                {prefecture.maxScore}点満点
                              </div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-slate-400" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
                <h3 className="mb-2 text-base font-bold text-emerald-800">📌 ポイント</h3>
                <ul className="space-y-2 text-sm text-emerald-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                    内申点の計算方法は都道府県によって大きく異なります
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                    実技4教科の配点が高い地域が多いです
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                    最新の入試情報は各都道府県教育委員会で確認しましょう
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
