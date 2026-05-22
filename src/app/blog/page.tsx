import Link from 'next/link';
import { BookOpen, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

import { getAllPosts } from '@/lib/blog-data';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { BlogListClient, type BlogListItem } from '@/components/Blog/BlogListClient';
import { AffiliateAd } from '@/components/Affiliate/AffiliateAd';

export const metadata = {
  title: '高校受験・内申点対策コラム【2026年最新】成績アップの秘訣を公開',
  description:
    '【2026年度入試対応】内申点の計算方法、成績の上げ方、都道府県別の違い、実技教科対策など、現役中学生と保護者が知るべき高校受験の最前線情報を発信中。全記事プロ監修・最新データに基づいています。',
  openGraph: {
    title: '高校受験・内申点対策コラム【2026年最新】',
    description:
      '内申点の計算方法、成績の上げ方、都道府県別の違いなど、高校受験に役立つ最新情報を発信。',
    type: 'website' as const,
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: '高校受験・内申点対策コラム【2026年最新】',
    description:
      '内申点の計算方法、成績の上げ方、都道府県別の違いなど、高校受験に役立つ情報を発信。',
  },
  alternates: {
    canonical: 'https://my-naishin.com/blog',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  // Strip heavy `content` field — only ship metadata to the client
  const listItems: BlogListItem[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.date,
    category: p.category,
    readTime: p.readTime,
    tags: p.tags,
  }));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '内申点コラム', url: 'https://my-naishin.com/blog' },
        ]}
      />
      <div className="min-h-screen bg-[#fafafa]">
        {/* Hero */}
        <div className="relative overflow-hidden bg-white border-b border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-4 py-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 ring-1 ring-blue-100/50 shadow-sm">
              <BookOpen className="h-4 w-4" />
              2026年度入試対応
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              内申点対策コラム
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">
              内申点の基礎知識から、主要5教科・実技4教科の具体的な成績アップ術まで。
              <br className="hidden sm:inline" />
              2026年（令和8年）4月15日現在の最新入試データに基づき解説。
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 font-medium">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full shadow-sm ring-1 ring-gray-100">
                <BookOpen className="h-4 w-4 text-blue-500" />
                全 {posts.length} 記事
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full shadow-sm ring-1 ring-gray-100">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                定期更新
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4">
          <BlogListClient posts={listItems} />

          {/* 広告セクション */}
          <div className="mb-12 rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm text-center">
            <div className="text-base font-bold text-slate-800 mb-1">
              記事と一緒に活用したい学習教材
            </div>
            <div className="text-xs text-slate-500 mb-5 leading-relaxed max-w-xl mx-auto">
              内申点アップの基本は毎日の積み重ね。<AffiliateAd id="sapuri-text" hideLabel />（月額2,178円・無料体験あり）と
              <AffiliateAd id="zkai-text-middle" className="ml-1" hideLabel />（PR）が中学生に最も使われている定番教材です。
            </div>
            <div className="hidden md:block">
              <AffiliateAd id="zkai-banner" />
            </div>
            <div className="md:hidden">
              <AffiliateAd id="sapuri-banner-300" />
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="rounded-3xl bg-white p-8 sm:p-12 text-center shadow-sm ring-1 ring-gray-100 mb-24 max-w-4xl mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-6">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              志望校との距離を正確に測る
            </h3>
            <p className="text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
              47都道府県の最新入試データに対応。あなたの内申点と当日点の目安を瞬時にシミュレーションできます。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-95"
              >
                内申点を計算する
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/reverse"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gray-50 px-8 py-4 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 transition-all duration-200 hover:bg-gray-100 active:scale-95"
              >
                目標から逆算する
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
