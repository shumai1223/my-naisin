'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight, TrendingUp, Target, GraduationCap, Calculator, Clock, Star, Zap, Lightbulb, AlertTriangle, School, FileText, ArrowRight } from '@/components/icons';

const FEATURED_ARTICLES = [
  {
    slug: 'what-is-naishinten',
    title: '内申点とは？仕組み・計算方法・評価基準をわかりやすく解説',
    description: '内申点の基本をゼロから理解。成績表の見方から5段階評価の仕組みまで。',
    icon: BookOpen,
    color: 'bg-brand-500',
    tag: '基本',
    tagColor: 'bg-brand-100 text-brand-700',
    readTime: '12分',
  },
  {
    slug: 'naishinten-average-score',
    title: '内申点の平均は何点？「オール3＝平均」は間違い！',
    description: '全国平均3.3の真実。学年別・教科別のデータで自分の位置を知ろう。',
    icon: Target,
    color: 'bg-amber-500',
    tag: '注目',
    tagColor: 'bg-amber-100 text-amber-700',
    readTime: '10分',
  },
  {
    slug: 'how-to-raise-naishinten',
    title: '内申点の上げ方7選｜今日からできる具体的な方法',
    description: 'テスト・提出物・授業態度…確実に点を伸ばす実践テクニック集。',
    icon: TrendingUp,
    color: 'bg-brand-500',
    tag: '人気記事',
    tagColor: 'bg-brand-100 text-brand-700',
    readTime: '15分',
  },
  {
    slug: 'all-3-high-school-options-2026-update',
    title: 'オール3で行ける高校は？偏差値・進路の目安【2026年度入試対応】',
    description: 'オール3は偏差値40〜50が目安。逆転合格の戦略も紹介。',
    icon: School,
    color: 'bg-slate-500',
    tag: '受験生必見',
    tagColor: 'bg-slate-100 text-slate-700',
    readTime: '13分',
  },
  {
    slug: 'naishinten-not-enough-strategies',
    title: '内申点が足りない！志望校を諦めない5つの戦略',
    description: '内申不足でも逆転可能。当日点・私立併願・推薦活用の全パターン。',
    icon: AlertTriangle,
    color: 'bg-red-500',
    tag: '緊急対策',
    tagColor: 'bg-red-100 text-red-700',
    readTime: '14分',
  },
  {
    slug: 'naishin-guide',
    title: '内申点の基本から都道府県別対策まで完全ガイド',
    description: '計算方法の基本を理解して、自分の地域に合った対策を立てよう',
    icon: Calculator,
    color: 'bg-brand-500',
    tag: '総合ガイド',
    tagColor: 'bg-brand-100 text-brand-700',
    readTime: '15分',
  },
];

export function BlogSection() {
  const mainArticle = FEATURED_ARTICLES[0];
  const MainIcon = mainArticle.icon;
  const sideArticles = FEATURED_ARTICLES.slice(1, 6);

  return (
    <section className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-6 md:p-8">
      {/* Header */}
      <div className="relative mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-600 ring-1 ring-brand-100">
            <Zap className="h-3 w-3" />
            NEW 記事追加
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">内申点コラム</h2>
          <p className="mt-1 text-sm text-slate-500">基礎知識から実践テクニックまで、全80記事以上</p>
        </div>
        <Link
          href="/blog"
          className="flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-all"
        >
          すべての記事
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Main Feature + Side Articles */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Main Article — Large Card */}
        <Link
          href={`/blog/${mainArticle.slug}`}
          className="group relative overflow-hidden rounded-lg border border-slate-100 bg-brand-600 p-6 text-white transition-all lg:col-span-2 lg:row-span-2 lg:p-8"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          </div>
          <div className="relative">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${mainArticle.tagColor}`}>
              {mainArticle.tag}
            </span>
            <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-lg bg-white">
              <MainIcon className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-xl font-bold leading-snug lg:text-2xl">
              {mainArticle.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-brand-100">
              {mainArticle.description}
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-brand-200">
                <Clock className="h-3.5 w-3.5" />
                {mainArticle.readTime}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                読む <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </Link>

        {/* Side Articles — Compact Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
          {sideArticles.map((article) => {
            const Icon = article.icon;
            return (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col rounded-lg border border-slate-100 bg-white p-4 transition-all hover:border-brand-200"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${article.tagColor}`}>
                    {article.tag}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </div>
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${article.color} shadow`}>
                  <Icon className="h-4.5 w-4.5 text-white" />
                </div>
                <h3 className="flex-1 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-brand-600 line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-500 line-clamp-2">
                  {article.description}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-bold text-brand-600 opacity-0 transition-all group-hover:opacity-100">
                  読む <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA Banner */}
      <Link
        href="/blog"
        className="group relative mt-6 flex items-center justify-between overflow-hidden rounded-lg bg-slate-900 p-5 text-white transition-all"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/3 h-full w-1/3 bg-brand-400 blur-2xl" />
        </div>
        <div className="relative flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-white ring-1 ring-white/10">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="text-base font-bold">もっと詳しく知りたい？</div>
            <div className="mt-0.5 text-sm text-slate-400">内申点アップのコツ、不登校対策、入試方式別の仕組みなど多数掲載</div>
          </div>
        </div>
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 transition-all group-hover:bg-white/20">
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    </section>
  );
}
