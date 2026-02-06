"use client";

import * as React from 'react';
import Link from 'next/link';
import nextDynamic from 'next/dynamic';
import { Home, ChevronRight, Target, HelpCircle, AlertTriangle, CheckCircle } from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const ReverseCalculator = nextDynamic(
  () => import('@/components/Calculator/ReverseCalculator').then((mod) => mod.ReverseCalculator),
  { ssr: false }
);

export default function ReversePage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
            <Header />

            <main className="px-4 pb-10 md:px-6">
              {/* Breadcrumb */}
              <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
                <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
                  <Home className="h-4 w-4" />
                  ホーム
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-slate-700">志望校から逆算</span>
              </nav>

              {/* SSR説明セクション */}
              <section className="mb-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">内申点シミュレーター｜志望校から逆算</h1>
                    <p className="mt-1 text-sm text-slate-500">2026年度入試対応（令和8年度入学者選抜）</p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-600">
                  「この高校に受かるには、当日の試験で何点取ればいい？」——そんな疑問に答える逆算ツールです。
                  現在の内申点と志望校の配点比率を入力するだけで、合格に必要な当日点の目安がわかります。
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-blue-800">
                      <CheckCircle className="h-4 w-4" />
                      何を入力するの？
                    </h3>
                    <ul className="mt-2 space-y-1 text-xs text-blue-700">
                      <li>• 都道府県を選択</li>
                      <li>• 現在の内申点を入力</li>
                      <li>• 志望校の内申:学力の配点比率を設定</li>
                      <li>• 当日点の満点を設定（例：500点）</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                      <HelpCircle className="h-4 w-4" />
                      何がわかるの？
                    </h3>
                    <ul className="mt-2 space-y-1 text-xs text-emerald-700">
                      <li>• 合格に必要な当日点の目安</li>
                      <li>• 必要得点率（何%取ればよいか）</li>
                      <li>• 内申点のカバー率</li>
                      <li>• 東京都1020点満点・神奈川S値にも対応</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                    <div>
                      <h3 className="text-sm font-bold text-amber-800">結果の見方と注意点</h3>
                      <ul className="mt-1 space-y-1 text-xs text-amber-700">
                        <li>• 配点比率は高校・学科・入試方式ごとに異なります。志望校の募集要項で必ず確認してください。</li>
                        <li>• 計算結果はあくまで目安です。実際の合否は面接・調査書・特色検査なども影響します。</li>
                        <li>• 最新の入試情報は各都道府県教育委員会の公式サイトでご確認ください。</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <ReverseCalculator 
                onBack={() => window.location.href = '/'} 
              />

              {/* 関連リンク */}
              <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
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
                    href="/prefectures"
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm font-medium text-slate-700">都道府県別の計算方法を見る</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/glossary"
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm font-medium text-slate-700">用語辞典（内申点の基礎知識）</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                  <Link
                    href="/blog/naishinten-calculation-by-prefecture"
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <span className="text-sm font-medium text-slate-700">都道府県別の計算方法を比較</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </div>
              </section>
            </main>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
}
