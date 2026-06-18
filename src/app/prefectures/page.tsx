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
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';

export const metadata = {
  title: '内申点 計算サイト 47都道府県一覧｜都道府県別の高校入試・実技倍率を確認【2026年度・無料】 | My Naishin',
  description: '全国47都道府県の高校入試に対応した内申点 計算サイトの一覧。お住まいの地域を選ぶだけで、最新（令和8年度）の入試制度・満点・実技倍率に基づいた内申点を無料で正確に算出できます。総合得点・合否の仕組みの早見表へもここから。',
  alternates: {
    canonical: 'https://my-naishin.com/prefectures',
  },
};

const REGION_DESCRIPTIONS: Record<string, string> = {
  関東: '東京・神奈川・千葉・埼玉では換算内申が中心。東京は実技4教科を2倍に加重、神奈川はA値・S値が独特。茨城・栃木・群馬は素内申に近い扱い。',
  近畿: '大阪は3年間の評定をすべて使う独特の制度で内申比率も高い。兵庫は5教科と実技の傾斜が控えめ、京都・奈良・滋賀・和歌山は推薦制度が手厚いのが特徴。',
  '九州・沖縄': '福岡は3年間の評定を均等配分、熊本・鹿児島は実技を重視。長崎・佐賀・大分・宮崎・沖縄は推薦入試と一般入試で内申の扱いが大きく異なる。',
  '中部': '愛知は内申と当日点の比率が学校ごとに細かく設定される。静岡・新潟・長野は実技教科の倍率に注意。',
  '北海道・東北': '北海道は学習点300点満点という独特の制度。東北各県は3年間累計の評定を使うことが多く、副教科の扱いに差がある。',
  '中国・四国': '広島・岡山・愛媛は推薦と一般で内申基準が大きく異なる。山口・徳島・香川・高知は素内申に近い扱い。',
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
          <div className="mb-8 flex flex-wrap justify-center gap-2">
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

          {/* 総合得点ハブへの導線 */}
          <Link
            href="/total-score"
            className="mb-12 flex items-center justify-between gap-4 rounded-2xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-violet-50 p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-700 text-white shadow">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold text-slate-800">都道府県別 総合得点・合否の仕組み（全47県）</div>
                <p className="mt-0.5 text-sm text-slate-600">
                  内申点＋当日点の合算方法・合否の決まり方を全県分まとめました。計算できる県は自動計算ツール付き。
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-blue-400" />
          </Link>

          {/* Grid of Regions */}
          <div className="space-y-12">
            {REGIONS.map(region => {
              const prefsInRegion = PREFECTURES.filter(p => p.region === region);
              const regionDescription = REGION_DESCRIPTIONS[region];
              return (
                <section key={region} id={`region-${region}`} className="scroll-mt-20">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-xl font-bold text-slate-800 border-l-4 border-blue-500 pl-3">
                      {region}
                    </h2>
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {prefsInRegion.length} 都道府県
                    </span>
                  </div>
                  {regionDescription && (
                    <p className="mb-6 text-sm leading-relaxed text-slate-600">
                      {regionDescription}
                    </p>
                  )}
                  
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

          {/* 広告セクション */}
          <div className="mt-16 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm text-center">
            <div className="text-base font-bold text-slate-800 mb-1">
              47都道府県すべてに対応する通信教育
            </div>
            <div className="text-xs text-slate-500 mb-5 leading-relaxed max-w-xl mx-auto">
              地域差のない高品質な学習教材で、内申点アップと志望校合格を両立。<AffiliateAd id="zkai-text-middle" hideLabel />（PR）は全国の中学生に支持されています。
            </div>
            <div className="hidden md:block">
              <AffiliateAd id="zkai-banner" />
            </div>
            <div className="md:hidden">
              <AffiliateAd id="sapuri-banner-300" />
            </div>
            <div className="mt-4 text-xs">
              <AffiliateAd id="zkai-text-request" className="mx-1" hideLabel />（PR）で詳細を確認
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-12 rounded-3xl bg-slate-900 p-8 text-white shadow-2xl md:p-12">
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
