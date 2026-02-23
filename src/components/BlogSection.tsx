'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight, TrendingUp, Target, GraduationCap, Calculator, Clock, Star, Zap } from 'lucide-react';

const FEATURED_ARTICLES = [
  {
    slug: 'naishin-guide',
    title: '内申点の基本から都道府県別対策まで完全ガイド',
    description: '計算方法の基本を理解して、自分の地域に合った対策を立てよう',
    icon: Calculator,
    color: 'from-blue-500 to-indigo-600',
    tag: '人気',
    tagColor: 'bg-amber-400 text-amber-900',
    readTime: '15分',
  },
  {
    slug: 'improve-grades-from-all-3',
    title: '【実践】オール3から内申点を上げる方法15選',
    description: 'テスト対策から提出物、授業態度まで具体的なテクニックを詳しく解説',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-600',
    tag: 'おすすめ',
    tagColor: 'bg-emerald-400 text-emerald-900',
    readTime: '18分',
  },
  {
    slug: 'tokyo-naishin-calculation-guide',
    title: '東京都の内申点計算を完全攻略｜素内申・換算内申・調査書点',
    description: '東京都の内申点は「5教科＋実技４教科×2」で65点満点。換算内申と調査書点の計算手順を具体例つきで解説。',
    icon: Target,
    color: 'from-violet-500 to-purple-600',
    tag: '東京都',
    tagColor: 'bg-violet-400 text-violet-900',
    readTime: '13分',
  },
  {
    slug: 'practical-subjects-naishin-strategy',
    title: '実技４教科で内申点を伸ばすコツ｜体育・美術・音楽・技術家庭の攻略法',
    description: '実技教科は才能より「取り組み方」で評価が変わる。体育・美術・音楽・技術家庭の評価ポイントと対策を整理。',
    icon: Star,
    color: 'from-rose-500 to-pink-600',
    tag: '必見',
    tagColor: 'bg-rose-400 text-rose-900',
    readTime: '14分',
  },
];

export function BlogSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-blue-50/80 to-violet-50/60 p-6 md:p-8">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-200/30 to-violet-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-br from-blue-200/30 to-cyan-200/30 blur-2xl" />

      {/* Header */}
      <div className="relative mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-violet-600 shadow-xl shadow-indigo-300/40">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-amber-400 text-xs font-bold text-amber-900 shadow-lg">
              <Zap className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">📚 内申点コラム</h2>
            <p className="mt-0.5 text-sm text-slate-500">高校受験に役立つ情報をわかりやすく解説！</p>
          </div>
        </div>
        <Link
          href="/blog"
          className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-md transition-all hover:shadow-lg hover:bg-indigo-50"
        >
          すべての記事を見る
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Featured Articles Grid */}
      <div className="relative grid gap-4 sm:grid-cols-2">
        {FEATURED_ARTICLES.map((article) => {
          const Icon = article.icon;
          return (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1"
            >
              {/* Tag */}
              <div className="absolute right-3 top-3">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${article.tagColor}`}>
                  {article.tag}
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${article.color} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 flex-1 pr-12">
                  <h3 className="text-sm font-bold leading-snug text-slate-800 line-clamp-2 transition-colors group-hover:text-indigo-600">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">
                    {article.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  <span>読了 {article.readTime}</span>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-indigo-500 transition-colors group-hover:text-indigo-600">
                  記事を読む
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA Banner */}
      <Link
        href="/blog"
        className="group relative mt-6 flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 p-5 text-white shadow-xl transition-all hover:shadow-2xl"
      >
        <div className="absolute inset-0 bg-white/5" />
        <div className="relative flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 backdrop-blur-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="text-base font-bold">もっと詳しく知りたい？</div>
            <div className="mt-0.5 text-sm text-indigo-100">内申点アップのコツ、副教科対策、都道府県別の計算方法など多数掲載！</div>
          </div>
        </div>
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-all group-hover:bg-white/30">
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </section>
  );
}
