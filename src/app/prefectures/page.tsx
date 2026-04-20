import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Calculator, 
  ChevronRight, 
  Home,
  MapPin,
  Sparkles,
  ArrowRight,
  Search,
  BookOpen,
  Target
} from 'lucide-react';

import { PREFECTURES, REGIONS } from '@/lib/prefectures';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

export const metadata = {
  title: '都道府県別の内申点計算ツール一覧【2026年最新】全国47都道府県対応',
  description: '全国47都道府県の高校入試に対応した内申点計算ツールの一覧ページ。お住まいの地域を選択するだけで、最新（令和8年度）の入試制度に基づいた正確な内申点を一瞬で算出できます。',
  alternates: {
    canonical: 'https://my-naishin.com/prefectures',
  },
};

export default function PrefecturesPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '都道府県一覧', url: 'https://my-naishin.com/prefectures' }
        ]}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <Home className="h-4 w-4" />
              ホーム
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-700">都道府県一覧</span>
          </nav>

          {/* Header */}
          <header className="mb-12 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl mb-6">
              <MapPin className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              都道府県別の内申点・高校入試対策
            </h1>
            <p className="mt-4 text-slate-600 max-w-2xl mx-auto leading-relaxed">
              各都道府県の最新（令和8年度）入試制度を網羅。内申点の計算ツールから、合格に必要な当日点のシミュレーション、地域別の攻略ガイドまで、すべての情報を一箇所に集約しました。
            </p>
          </header>

          {/* Region Quick Links */}
          <div className="mb-12 flex flex-wrap justify-center gap-2">
            {REGIONS.map(region => (
              <a 
                key={region}
                href={`#region-${region}`}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 shadow-sm hover:border-blue-300 hover:text-blue-600 transition-all"
              >
                {region}
              </a>
            ))}
          </div>

          {/* Grid of Regions */}
          <div className="space-y-12">
            {REGIONS.map(region => {
              const prefsInRegion = PREFECTURES.filter(p => p.region === region);
              return (
                <section key={region} id={`region-${region}`} className="scroll-mt-20">
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl font-bold text-slate-800 border-l-4 border-blue-500 pl-3">
                      {region}
                    </h2>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {prefsInRegion.length} 都道府県
                    </span>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {prefsInRegion.map(pref => (
                      <div
                        key={pref.code}
                        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-slate-800">
                            {pref.name}
                          </h3>
                          <MapPin className="h-4 w-4 text-slate-300" />
                        </div>
                        
                        <div className="space-y-2 mb-6">
                          <Link 
                            href={`/${pref.code}/naishin`}
                            className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 transition-all hover:bg-blue-600 hover:text-white"
                          >
                            <span className="flex items-center gap-2">
                              <Calculator className="h-4 w-4" />
                              内申点計算
                            </span>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                          <Link 
                            href={`/${pref.code}`}
                            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-slate-800 hover:text-white"
                          >
                            <span className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              攻略ガイド
                            </span>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                        
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <span>満点: {pref.maxScore}点</span>
                          <span>実技: {pref.practicalMultiplier > 1 ? `${pref.practicalMultiplier}倍` : '等倍'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          {/* Bottom Info */}
          <div className="mt-20 rounded-3xl bg-slate-900 p-8 text-white shadow-2xl md:p-12">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 mb-6">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  内申点アップの秘訣を公開中
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  計算した後は、どうやって点数を上げるかが重要です。各教科別の対策法や、副教科で「5」を取るための具体的なアクションプランをコラムでまとめています。
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition-all hover:bg-blue-700 hover:scale-105"
                >
                  受験攻略コラムを読む
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid gap-4">
                <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                    最新年度（2026年）完全対応
                  </h3>
                  <p className="text-sm text-slate-400">毎年の入試制度変更を反映。令和8年度入試に向けた正確なシミュレーションが可能です。</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-5 border border-white/10">
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    公式資料に基づく算出
                  </h3>
                  <p className="text-sm text-slate-400">各都道府県教育委員会の「入学者選抜実施要綱」を根拠に、1教科ずつの重みを忠実に再現しています。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
