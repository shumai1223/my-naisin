"use client";

import * as React from 'react';
import Link from 'next/link';
import nextDynamic from 'next/dynamic';
import { Home, ChevronRight, Target, HelpCircle, AlertTriangle, CheckCircle } from 'lucide-react';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

const ReverseCalculator = nextDynamic(
  () => import('@/components/Calculator/ReverseCalculator').then((mod) => mod.ReverseCalculator),
  { ssr: false }
);

export default function ReversePage() {
  return (
    <div className="min-h-screen">
      <WebApplicationSchema
        name="志望校から逆算｜内申点シミュレーター | My Naishin"
        description="志望校に合格するには当日何点必要？内申点と配点比率から必要な学力検査点を逆算。東京都1020点・神奈川S値にも対応。"
        url="https://my-naishin.com/reverse"
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '志望校から逆算', url: 'https://my-naishin.com/reverse' },
        ]}
      />
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

              {/* ツールの使い方説明 */}
              <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-800">🛠️ 逆算ツールの使い方</h2>
                <div className="space-y-4">
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h3 className="mb-3 text-sm font-bold text-blue-800">ステップ1：都道府県を選択</h3>
                    <p className="text-sm text-blue-700">あなたの受験する都道府県を選択します。東京都・神奈川県・大阪府など主要な都道府県に対応しています。</p>
                  </div>
                  
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <h3 className="mb-3 text-sm font-bold text-green-800">ステップ2：現在の内申点を入力</h3>
                    <p className="text-sm text-green-700">現在の内申点を入力します。東京都の場合は「換算内申（65点満点）」、神奈川県の場合は「評定合計（135点満点）」を入力してください。</p>
                  </div>
                  
                  <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                    <h3 className="mb-3 text-sm font-bold text-purple-800">ステップ3：配点比率を設定</h3>
                    <p className="text-sm text-purple-700">志望校の内申点と学力検査の配点比率を設定します。よくある比率のプリセットボタンもあるので、参考にしてください。</p>
                  </div>
                  
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <h3 className="mb-3 text-sm font-bold text-amber-800">ステップ4：目標点を設定して計算</h3>
                    <p className="text-sm text-amber-700">志望校の合格ラインや目標点を入力し、「計算する」ボタンをクリック。必要な当日点がすぐにわかります。</p>
                  </div>
                </div>
              </section>

              {/* サンプル計算結果（SSR表示） */}
              <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-800">計算例：東京都立高校を目指す場合</h2>
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h3 className="mb-3 text-sm font-bold text-slate-700">入力例</h3>
                    <div className="grid gap-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>都道府県：</span>
                        <span className="font-medium">東京都</span>
                      </div>
                      <div className="flex justify-between">
                        <span>換算内申：</span>
                        <span className="font-medium">50点 / 65点</span>
                      </div>
                      <div className="flex justify-between">
                        <span>調査書点：</span>
                        <span className="font-medium">231点 / 300点</span>
                      </div>
                      <div className="flex justify-between">
                        <span>配点比率：</span>
                        <span className="font-medium">調査書点:学力検査 = 300:700</span>
                      </div>
                      <div className="flex justify-between">
                        <span>当日点満点：</span>
                        <span className="font-medium">700点</span>
                      </div>
                      <div className="flex justify-between">
                        <span>目標合計点：</span>
                        <span className="font-medium">931点（ESAT-J込み）</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                    <h3 className="mb-3 text-sm font-bold text-emerald-700">計算結果</h3>
                    <div className="space-y-2 text-sm text-emerald-600">
                      <div className="flex justify-between">
                        <span>必要な学力検査点：</span>
                        <span className="font-bold text-emerald-800">600点 / 700点</span>
                      </div>
                      <div className="flex justify-between">
                        <span>必要得点率：</span>
                        <span className="font-bold text-emerald-800">約86%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>5教科平均：</span>
                        <span className="font-bold text-emerald-800">約120点 / 140点</span>
                      </div>
                    </div>
                    <div className="mt-3 rounded-lg border border-emerald-300 bg-emerald-100 p-3">
                      <p className="text-xs text-emerald-700">
                        <strong>計算式：</strong> (720点 - 300点×0.3) ÷ 0.7 = 600点
                      </p>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h3 className="mb-2 text-sm font-bold text-blue-700">解説</h3>
                    <p className="text-xs text-blue-600">
                      東京都立高校の場合、内申点300点は評価の高いレベルです。
                      当日の学力検査で86%程度の得点率を確保できれば、合格の可能性が高いと判断できます。
                      各教科140点満点に対し、120点前後の得点が目標となります。
                    </p>
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
