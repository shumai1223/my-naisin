'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ChevronRight, ExternalLink, FileText, MapPin } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PREFECTURES } from '@/lib/prefectures';

const LEARN_REGIONS = [
  { name: '北海道・東北', codes: ['hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima'] },
  { name: '関東', codes: ['ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa'] },
  { name: '中部', codes: ['niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano', 'gifu', 'shizuoka', 'aichi'] },
  { name: '近畿', codes: ['mie', 'shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama'] },
  { name: '中国・四国', codes: ['tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi', 'tokushima', 'kagawa', 'ehime', 'kochi'] },
  { name: '九州・沖縄', codes: ['fukuoka', 'saga', 'nagasaki', 'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'okinawa'] },
];

const LEARN_POPULAR_ARTICLES = [
  {
    slug: 'naishin-guide',
    title: '内申点の基本から都道府県別対策まで完全ガイド',
    category: '基本を理解して対策を立てよう',
  },
  {
    slug: 'tokyo-kansan-naishin-guide',
    title: '【東京都】換算内申の計算方法と都立高校入試の完全ガイド',
    category: '東京都特有の計算方法を解説',
  },
  {
    slug: 'kansan-naishin-vs-su-naishin',
    title: '【図解】換算内申と素内申の違いとは？',
    category: '違いを理解して活用しよう',
  },
];

interface HomeLearnSectionProps {
  onBack: () => void;
}

export function HomeLearnSection({ onBack }: HomeLearnSectionProps) {
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="border-b border-slate-100/80 bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-rose-50/80 px-5 py-5 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 shadow-lg shadow-amber-300/40">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold tracking-tight text-slate-800">制度を理解する</div>
                <div className="text-sm text-slate-500">都道府県別の計算方法・コラム</div>
              </div>
            </div>
            <Button variant="ghost" onClick={onBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
              戻る
            </Button>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-800">
              <MapPin className="h-5 w-5 text-amber-500" />
              都道府県から探す
            </h3>
            <div className="flex flex-wrap gap-2">
              {LEARN_REGIONS.map((region) => (
                <button
                  key={region.name}
                  onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    selectedRegion === region.name
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>

            {selectedRegion && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {LEARN_REGIONS.find((r) => r.name === selectedRegion)?.codes.map((code) => {
                    const pref = PREFECTURES.find((p) => p.code === code);
                    if (!pref) return null;
                    return (
                      <Link
                        key={code}
                        href={`/${code}/naishin`}
                        className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-amber-50 hover:shadow-md"
                      >
                        <span>{pref.name}</span>
                        <ChevronRight className="h-3 w-3 text-slate-400" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mb-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
            <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-800">
              <FileText className="h-5 w-5 text-blue-500" />
              新着コラム
            </h3>
            <div className="space-y-2">
              <Link
                href="/blog/naishin-guide"
                className="group flex items-center justify-between rounded-lg bg-white p-3 shadow-sm transition-all hover:bg-blue-50 hover:shadow-md"
              >
                <div>
                  <span className="mb-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    基礎知識
                  </span>
                  <div className="text-sm font-medium text-slate-700 group-hover:text-blue-700">【完全保存版】内申点の計算方法を徹底解説</div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
              </Link>
              <Link
                href="/blog/kansan-naishin-vs-su-naishin"
                className="group flex items-center justify-between rounded-lg bg-white p-3 shadow-sm transition-all hover:bg-blue-50 hover:shadow-md"
              >
                <div>
                  <span className="mb-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    基礎知識
                  </span>
                  <div className="text-sm font-medium text-slate-700 group-hover:text-blue-700">【図解】換算内申と素内申の違いとは？</div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
              </Link>
              <Link
                href="/blog/tokyo-kansan-naishin-guide"
                className="group flex items-center justify-between rounded-lg bg-white p-3 shadow-sm transition-all hover:bg-blue-50 hover:shadow-md"
              >
                <div>
                  <span className="mb-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                    都道府県別
                  </span>
                  <div className="text-sm font-medium text-slate-700 group-hover:text-blue-700">【東京都】換算内申の計算方法と都立高校入試</div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
              </Link>
            </div>
          </div>

          <div className="mb-6 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
            <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-800">
              <FileText className="h-5 w-5 text-blue-500" />
              人気のコラム
            </h3>
            <div className="space-y-2">
              {LEARN_POPULAR_ARTICLES.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group flex items-center justify-between rounded-lg bg-white p-3 shadow-sm transition-all hover:bg-blue-50 hover:shadow-md"
                >
                  <div>
                    <span className="mb-1 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                      {article.category}
                    </span>
                    <div className="text-sm font-medium text-slate-700 group-hover:text-blue-700">{article.title}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
                </Link>
              ))}
            </div>
            <Link
              href="/blog"
              className="mt-3 flex items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              すべてのコラムを見る
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
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
  );
}
