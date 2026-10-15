import Link from 'next/link';
import { BookOpen, Sparkles, TrendingUp, ArrowRight } from '@/components/icons';

import { getAllPosts } from '@/lib/blog-data';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { BlogListClient, type BlogListItem } from '@/components/Blog/BlogListClient';

export const metadata = {
  title: '高校受験・内申点対策コラム【2026年最新】成績アップの秘訣を公開 | My Naishin',
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
        <div className="relative overflow-hidden bg-white border-b border-slate-100">
          <div className="absolute inset-0 bg-slate-50 pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-4 py-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-sm text-brand-600 ring-1 ring-brand-100/50">
              <BookOpen className="h-4 w-4" />
              2026年度入試対応
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              内申点対策コラム
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              内申点の基礎知識から、主要5教科・実技4教科の具体的な成績アップ術まで。
              <br className="hidden sm:inline" />
              2026年（令和8年）4月15日現在の最新入試データに基づき解説。
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full ring-1 ring-slate-100">
                <BookOpen className="h-4 w-4 text-brand-500" />
                全 {posts.length} 記事
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full ring-1 ring-slate-100">
                <TrendingUp className="h-4 w-4 text-brand-500" />
                定期更新
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4">
          <BlogListClient posts={listItems} />

          {/* Bottom CTA */}
          <div className="rounded-lg bg-white p-8 sm:p-12 text-center ring-1 ring-slate-100 mb-24 max-w-4xl mx-auto">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 mb-6">
              <Sparkles className="h-8 w-8 text-brand-600" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              志望校との距離を正確に測る
            </h3>
            <p className="text-slate-500 mb-8 max-w-2xl mx-auto leading-relaxed">
              47都道府県の最新入試データに対応。あなたの内申点と当日点の目安を瞬時にシミュレーションできます。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-brand-600 px-8 py-4 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-700 active:scale-95"
              >
                内申点を計算する
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/reverse"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-slate-50 px-8 py-4 text-sm font-bold text-slate-700 ring-1 ring-inset ring-slate-200 transition-all duration-200 hover:bg-slate-100 active:scale-95"
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
