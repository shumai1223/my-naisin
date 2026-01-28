'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight, Sparkles, TrendingUp, Target, GraduationCap } from 'lucide-react';

const FEATURED_ARTICLES = [
  {
    slug: 'naishinten-calculation-by-prefecture',
    title: '内申点の計算方法を都道府県別に徹底解説',
    description: '東京都65点、神奈川県135点など地域で違う！',
    icon: Target,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
  },
  {
    slug: 'improve-grades-from-all-3',
    title: 'オール3から内申点を上げる方法15選',
    description: '現役教師が教える具体的な改善テクニック',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
  },
];

export function BlogSection() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-blue-50 to-violet-50 p-5 md:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">内申点コラム</h2>
            <p className="text-xs text-slate-500">受験に役立つ情報を発信中！</p>
          </div>
        </div>
        <Link
          href="/blog"
          className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-indigo-600 shadow-sm transition-all hover:shadow-md"
        >
          すべて見る
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Featured Articles */}
      <div className="grid gap-3 sm:grid-cols-2">
        {FEATURED_ARTICLES.map((article) => {
          const Icon = article.icon;
          return (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group relative overflow-hidden rounded-xl border border-white/50 bg-white p-4 shadow-sm transition-all hover:shadow-lg hover:border-indigo-200"
            >
              <div className="flex items-start gap-3">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${article.color} shadow-md`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                    {article.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-end">
                <span className="flex items-center gap-1 text-xs font-medium text-indigo-500 group-hover:text-indigo-600">
                  記事を読む
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* CTA Banner */}
      <Link
        href="/blog"
        className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white shadow-lg transition-all hover:shadow-xl group"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/20">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-bold">もっと詳しく知りたい？</div>
            <div className="text-xs text-indigo-100">内申点アップのコツ、副教科対策など多数掲載！</div>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      </Link>
    </section>
  );
}
