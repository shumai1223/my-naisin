import { Metadata } from 'next';
import Link from 'next/link';
import { Calculator, BookOpen, ChevronRight, Home, AlertTriangle, TrendingUp, Award } from 'lucide-react';

import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { WebApplicationSchema } from '@/components/StructuredData/WebApplicationSchema';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { HensachiCalculator } from '@/components/Hensachi/HensachiCalculator';

export const metadata: Metadata = {
  title: '偏差値計算サイト【5教科対応】中学生・高校生の偏差値を瞬時に算出 | My Naishin',
  description: '中学生・高校生向けの無料偏差値計算ツール。5教科の点数と平均点・標準偏差から、自分の偏差値を一瞬で計算。平均点しかわからない場合の簡易モードや、各教科の偏差値も同時に算出。志望校との距離も確認できます。',
  alternates: {
    canonical: 'https://my-naishin.com/hensachi',
  },
};

export default function HensachiPage() {
  return (
    <>
      <WebApplicationSchema
        name="偏差値計算サイト | My Naishin"
        description="5教科の点数から偏差値を瞬時に計算。中学生・高校生向け無料ツール。"
        url="https://my-naishin.com/hensachi"
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '偏差値計算', url: 'https://my-naishin.com/hensachi' },
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">偏差値計算</span>
          </nav>

          {/* Header */}
          <header className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xl">
              <TrendingUp className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              偏差値計算サイト【5教科対応】
            </h1>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              中学生・高校生向けの無料偏差値計算ツール。<br />
              点数・平均点・標準偏差から、あなたの偏差値を瞬時に算出します。
            </p>
          </header>

          {/* What is 偏差値 */}
          <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <BookOpen className="h-5 w-5 text-blue-500" />
              偏差値とは？
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              偏差値とは、ある集団の中で自分がどの位置にいるかを数値化したものです。平均点を「50」とし、上位ほど数字が大きくなります。
              一般的に、<strong className="text-slate-800">偏差値60は上位16%、偏差値70は上位2%</strong>に相当します。
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center">
                <div className="text-2xl font-black text-blue-700">70+</div>
                <div className="text-xs text-blue-600">上位2%</div>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
                <div className="text-2xl font-black text-emerald-700">60+</div>
                <div className="text-xs text-emerald-600">上位16%</div>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
                <div className="text-2xl font-black text-amber-700">50</div>
                <div className="text-xs text-amber-600">平均</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                <div className="text-2xl font-black text-slate-700">40-</div>
                <div className="text-xs text-slate-600">下位16%</div>
              </div>
            </div>
          </section>

          {/* Calculator */}
          <HensachiCalculator />

          {/* Formula */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Calculator className="h-5 w-5 text-purple-500" />
              偏差値の計算式
            </h2>
            <div className="rounded-xl bg-slate-900 p-4 text-center text-slate-100">
              <div className="font-mono text-sm md:text-base">
                偏差値 = 50 + 10 × (自分の点数 − 平均点) ÷ 標準偏差
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              標準偏差（σ）が分からない場合、模試では一般的に15前後、定期テストでは15〜20が目安です。
              当ツールではこの目安値を初期値として使用しています。より正確な偏差値が必要な場合は、模試の成績表に記載されている標準偏差を入力してください。
            </p>
          </section>

          {/* 偏差値と高校 */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
              <Award className="h-5 w-5 text-amber-500" />
              偏差値と高校レベルの目安
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between rounded-lg bg-red-50 px-4 py-2 border border-red-100">
                <span className="font-bold text-red-800">偏差値 70以上</span>
                <span className="text-red-700">最難関校（開成・筑駒・灘 / 日比谷・西・横浜翠嵐など）</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-orange-50 px-4 py-2 border border-orange-100">
                <span className="font-bold text-orange-800">偏差値 65〜69</span>
                <span className="text-orange-700">難関校（戸山・青山・湘南・北野・天王寺など）</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-amber-50 px-4 py-2 border border-amber-100">
                <span className="font-bold text-amber-800">偏差値 60〜64</span>
                <span className="text-amber-700">上位校（新宿・小山台・厚木・三国丘など）</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-2 border border-emerald-100">
                <span className="font-bold text-emerald-800">偏差値 55〜59</span>
                <span className="text-emerald-700">中堅上位校（駒場・町田・大和・春日丘など）</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-2 border border-blue-100">
                <span className="font-bold text-blue-800">偏差値 50〜54</span>
                <span className="text-blue-700">中堅校（平均的な公立高校）</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 border border-slate-100">
                <span className="font-bold text-slate-800">偏差値 45〜49</span>
                <span className="text-slate-700">中堅下位校</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-2 border border-slate-100">
                <span className="font-bold text-slate-700">偏差値 40〜44</span>
                <span className="text-slate-600">入りやすい高校（オール3〜3.5レベル）</span>
              </div>
            </div>
          </section>

          {/* アフィリエイト */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-6 text-center shadow-sm">
            <div className="text-sm font-bold text-slate-700 mb-1">
              偏差値を上げる学習教材
            </div>
            <div className="text-xs text-slate-500 mb-4 leading-relaxed">
              定期テスト対策で偏差値を底上げするなら<AffiliateAd id="zkai-text-middle" hideLabel />（PR）が定番
            </div>
            <div className="hidden md:block">
              <AffiliateAd id="zkai-banner" />
            </div>
            <div className="md:hidden">
              <AffiliateAd id="sapuri-banner-300" />
            </div>
            <div className="mt-3 text-xs">
              無料の<AffiliateAd id="zkai-text-request" className="mx-1" hideLabel />（PR）で詳細を確認
            </div>
          </section>

          {/* 注意点 */}
          <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <h3 className="text-sm font-bold text-amber-900">計算結果について</h3>
                <ul className="mt-2 space-y-1 text-xs text-amber-800">
                  <li>• 偏差値は受験する集団によって変動します。同じ点数でも、模試の種類や母集団によって偏差値は異なります。</li>
                  <li>• 標準偏差は概算値（15）を初期値としています。正確な値は模試の成績表でご確認ください。</li>
                  <li>• 偏差値は学習目標の目安として活用し、最終的な志望校判定は模試の判定結果や学校の先生にご相談ください。</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 関連リンク */}
          <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-4 text-lg font-bold text-slate-800">関連ツール・コンテンツ</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link href="/" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">内申点を計算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/reverse" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">志望校から逆算する</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/prefectures" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">都道府県別の入試制度</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link href="/blog/all-3-high-school-options" className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                <span className="text-sm font-medium text-slate-700">オール3の偏差値は？</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
