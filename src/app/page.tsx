import type { Metadata } from 'next';
import Link from 'next/link';
import { PREFECTURES, REGIONS, getPrefecturesByRegion } from '@/lib/prefectures';
import { getAllPosts } from '@/lib/blog-data';
import HomeClient from './HomeClient';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';
import { Calculator, BookOpen, MapPin, Sparkles, ShieldCheck, ChevronRight, Calendar, Clock, ArrowRight, Zap, TrendingUp, Target } from 'lucide-react';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default function Page() {
  const latestPosts = getAllPosts().slice(0, 5);
  const sidebarPosts = latestPosts.slice(0, 3);

  return (
    <>
      <HomeClient />

      {/* Latest Articles — homepage funnel */}
      <section className="mx-auto max-w-5xl px-4 pt-12">
        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-gray-100">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 ring-1 ring-rose-100">
                <Zap className="h-3 w-3" />
                新着記事
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                最新の受験コラム
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                内申点アップ・志望校選び・実技対策など、最新の入試情報を発信中。
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              すべての記事
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post, i) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md ${
                  i === 0 ? 'lg:col-span-1' : ''
                }`}
              >
                <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-slate-400">
                  <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5">
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString('ja-JP')}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="flex-1 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600 line-clamp-3">
                  {post.title}
                </h3>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 transition-all group-hover:opacity-100">
                  記事を読む <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>

          {/* PR ストリップ：コラム読了後のフック */}
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/60 px-5 py-4 text-center">
            <div className="text-xs text-slate-700">
              <AffiliateAd id="zkai-text-middle" hideLabel />（PR）の通信教育で内申＋偏差値を伸ばす。まずは
              <AffiliateAd id="zkai-text-request" hideLabel />（PR）で詳細を確認。
            </div>
          </div>
        </div>
      </section>

      {/* SEO Optimized Content Section */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calculator className="text-blue-600" />
                2026年度（令和8年度）入試対応の内申点計算
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                <p>
                  My Naishinは、現役の中学生とその保護者のために開発された、<strong>全国47都道府県の最新計算方式に完全対応</strong>した内申点計算サイトです。
                  高校受験において、内申点（調査書点）は当日の学力検査と同様に、あるいはそれ以上に合否を分ける重要な要素です。
                </p>
                <p>
                  自分の地域のルールを正確に把握していなければ、効率的な受験戦略を立てることはできません。当サイトでは、各都道府県教育委員会が発表した最新の選抜基準に基づき、正確な計算機能と詳細な解説を提供しています。
                </p>
              </div>
            </div>

            {/* 5教科 偏差値計算サイトへの内部リンク強化（SEO: 偏差値計算サイト 5教科 / 中学生） */}
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-blue-50/60 p-6 md:p-7">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-100">
                <TrendingUp className="h-3 w-3" />
                内申点と合わせて使う
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                5教科の偏差値計算サイトも無料で利用可能（中学生・高校生対応）
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-700">
                内申点と並んで合否を左右するのが <strong>5教科の偏差値</strong>。My Naishinの
                <Link href="/hensachi" className="font-bold text-indigo-700 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-800">
                  偏差値計算サイト【5教科対応】
                </Link>
                では、点数・平均点・標準偏差から自分の偏差値を瞬時に算出。平均点しか分からない場合の簡易モードや、教科別の偏差値も同時に計算できます。志望校との距離をひと目で確認できるので、内申点とセットでの戦略立案に最適です。
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/hensachi"
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
                >
                  <Target className="h-3.5 w-3.5" />
                  5教科の偏差値を計算する
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/hyotei-heikin"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-bold text-indigo-700 ring-1 ring-indigo-200 transition-all hover:bg-indigo-50"
                >
                  評定平均を計算する
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="text-emerald-600" />
                都道府県別の入試対策・計算ツール
              </h3>
              <div className="grid gap-6">
                {REGIONS.map(region => (
                  <div key={region} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
                    <h4 className="font-bold text-slate-800 mb-4 border-b border-slate-200 pb-2">{region}</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {getPrefecturesByRegion(region).map(pref => (
                        <Link
                          key={pref.code}
                          href={`/${pref.code}`}
                          className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-blue-50 hover:text-blue-700 hover:ring-blue-300"
                        >
                          {pref.name}
                          <ChevronRight className="h-3 w-3 opacity-30" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 47都道府県リンク直下：志望校選びの次の一手 */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid items-center gap-4 md:grid-cols-[1fr_auto]">
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      地域の制度を把握したら、学力対策を進める
                    </div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      スタディサプリ中学講座なら全教科のプロ講師の映像授業を月額料金で受けられます。
                    </p>
                  </div>
                  <div className="flex justify-center md:justify-end">
                    <AffiliateAd id="sapuri-banner-300" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles />
                内申点を1点でも上げるための3つの鉄則
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold">1</div>
                  <p><strong>実技教科（副教科）を捨てない：</strong> 多くの県で実技教科は1.5倍〜2倍の配点になります。主要5教科で「5」を取るより、実技で「3」を「4」に上げる方が遥かに効率的です。</p>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold">2</div>
                  <p><strong>「主体的な態度」を軽視しない：</strong> 2021年度の学習指導要領改訂以降、テストの点数以上に授業への参加姿勢や振り返りシートの記述が評価に直結します。</p>
                </li>
                <li className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold">3</div>
                  <p><strong>志望校の「計算比率」を知る：</strong> 内申と当日点の比率が3:7の学校と7:3の学校では、対策が全く異なります。自分の持ち点に合わせた学校選びが逆転合格の鍵です。</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar/Right Column */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
              <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="text-amber-600" />
                情報の正確性について
              </h3>
              <p className="text-sm text-amber-800 leading-relaxed mb-4">
                当サイトの情報は、全国47都道府県の教育委員会が発表した2026年度（令和8年度）入学者選抜の最新実施要綱を元に作成されています。
              </p>
              <div className="mt-4 pt-4 border-t border-amber-200">
                <Link href="/quality" className="text-sm font-bold text-amber-900 hover:underline flex items-center gap-1">
                  情報の信頼性への取り組み <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* サイドバーPR：個別指導の選択肢 */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6">
              <h3 className="font-bold text-emerald-900 mb-3 text-sm">
                自宅で個別指導を受けるなら
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed mb-4">
                ネット松陰塾は自宅でマンツーマンの個別指導を受けられる自立学習スタイル。内申点の底上げに。
              </p>
              <div className="flex justify-start">
                <AffiliateAd id="shoin-banner" centered={false} />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="text-blue-500" />
                最新の受験コラム
              </h3>
              <div className="space-y-4">
                {sidebarPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                    <p className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(post.lastUpdated ?? post.date).toLocaleDateString('ja-JP')}更新
                    </p>
                  </Link>
                ))}
              </div>
              <Link href="/blog" className="mt-6 block text-center text-sm font-bold text-blue-600 hover:text-blue-700">
                記事一覧を見る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
