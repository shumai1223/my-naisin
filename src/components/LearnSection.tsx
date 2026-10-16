'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from '@/components/icons';

import { PREFECTURES } from '@/lib/prefectures';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface LearnSectionProps {
  onBack: () => void;
}

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
    slug: 'naishin-47-prefectures-comparison',
    title: '【独自データ】47都道府県の内申点を全部比較してわかった5つの事実',
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

export function LearnSection({ onBack }: LearnSectionProps) {
  const [selectedRegion, setSelectedRegion] = React.useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4 md:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">制度を理解する</h2>
              <div className="text-sm text-slate-600">都道府県別の計算方法・コラム</div>
            </div>
            <Button variant="ghost" onClick={onBack} leftIcon={<ArrowLeft className="h-4 w-4" />}>
              戻る
            </Button>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="mb-8">
            <h3 className="mb-3 text-[17px] font-bold text-slate-900">
              都道府県から探す
            </h3>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((region) => (
                <button
                  key={region.name}
                  aria-pressed={selectedRegion === region.name}
                  onClick={() => setSelectedRegion(selectedRegion === region.name ? null : region.name)}
                  className={`min-h-[44px] rounded border px-4 py-2 text-sm transition-colors ${
                    selectedRegion === region.name
                      ? 'border-brand-700 bg-brand-700 font-bold text-white'
                      : 'border-slate-300 bg-white text-slate-900 hover:bg-brand-50'
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>

            {selectedRegion && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {REGIONS.find((r) => r.name === selectedRegion)?.codes.map((code) => {
                  const pref = PREFECTURES.find((p) => p.code === code);
                  if (!pref) return null;
                  return (
                    <Link
                      key={code}
                      href={`/${code}/naishin`}
                      className="flex min-h-[44px] items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors hover:bg-brand-50"
                    >
                      <span>{pref.name}</span>
                      <ArrowRight className="h-4 w-4 text-slate-600" />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="mb-3 text-[17px] font-bold text-slate-900">
              人気のコラム
            </h3>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {POPULAR_ARTICLES.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group flex min-h-[44px] items-center justify-between gap-3 py-3 transition-colors hover:bg-brand-50"
                >
                  <div>
                    <span className="mb-1 inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                      {article.category}
                    </span>
                    <div className="text-base text-slate-900 group-hover:text-brand-700">
                      {article.title}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-600" />
                </Link>
              ))}
            </div>
            <Link
              href="/blog"
              className="mt-2 flex min-h-[44px] items-center justify-center gap-1 text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800"
            >
              すべてのコラムを見る
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-lg border border-slate-200 bg-brand-50 p-4">
            <h3 className="mb-2 text-base font-bold text-slate-900">ポイント</h3>
            <ul className="space-y-2 text-base leading-[1.8] text-slate-900">
              <li className="flex items-start gap-2">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700" aria-hidden="true" />
                内申点の計算方法は都道府県によって大きく異なります
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700" aria-hidden="true" />
                実技4教科の配点が高い地域が多いです
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-700" aria-hidden="true" />
                最新の入試情報は各都道府県教育委員会で確認しましょう
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
