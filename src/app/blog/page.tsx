import Link from 'next/link';
import { BookOpen, Calendar, Clock, ChevronRight, Sparkles, Tag, TrendingUp, ArrowRight } from 'lucide-react';

import { getAllPosts } from '@/lib/blog-data';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

export const metadata = {
  title: '内申点コラム（高校受験ガイド）| My Naishin',
  description:
    '内申点の計算方法、成績の上げ方、都道府県別の違い、推薦入試と一般入試の比較など、高校受験に役立つ情報を発信。中学生・保護者向け。',
  openGraph: {
    title: '内申点コラム（高校受験ガイド）| My Naishin',
    description:
      '内申点の計算方法、成績の上げ方、都道府県別の違いなど、高校受験に役立つ情報を発信。',
    type: 'website' as const,
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: '内申点コラム（高校受験ガイド）| My Naishin',
    description:
      '内申点の計算方法、成績の上げ方、都道府県別の違いなど、高校受験に役立つ情報を発信。',
  },
  alternates: {
    canonical: 'https://my-naishin.com/blog',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  const categoryIcons: Record<string, string> = {
    'guide': '📘',
    '基礎知識': '📚',
    '対策・実践': '🎯',
    '進路・受験': '🏫',
    '都道府県別': '🗾',
    '教科別': '📝',
  };

  // 最新3記事をピックアップ
  const featuredPosts = posts.slice(0, 3);

  // カテゴリー別にグループ化
  const postsByCategory = posts.reduce((acc, post) => {
    const category = post.category || 'その他';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: '内申点コラム', url: 'https://my-naishin.com/blog' }
        ]}
      />
      <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/4 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-12 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-300 ring-1 ring-blue-400/20">
            <BookOpen className="h-4 w-4" />
            内申点コラム
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            高校受験ガイド
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-300/90">
            内申点の基礎から成績アップの実践テクニックまで。<br className="hidden sm:inline" />
            中学生と保護者のための完全ガイド。
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              全 {posts.length} 記事
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4" />
              毎月更新
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mt-8 mb-16 md:mt-10">
            <div className="grid gap-4 md:grid-cols-3">
              {featuredPosts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl ${i === 0 ? 'md:col-span-2 md:row-span-2 md:p-8' : ''}`}
                >
                  {i === 0 && (
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                      <Sparkles className="h-3 w-3" />
                      おすすめ
                    </div>
                  )}
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 ring-1 ring-blue-100">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(post.date).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <h3 className={`font-bold text-gray-900 transition-colors group-hover:text-blue-600 ${i === 0 ? 'text-xl md:text-2xl' : 'text-base line-clamp-2'}`}>
                    {post.title}
                  </h3>
                  <p className={`mt-2 text-gray-500 ${i === 0 ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}`}>
                    {post.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                    記事を読む
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Category Sections */}
        <div className="space-y-16 pb-16">
          {Object.entries(postsByCategory).map(([category, categoryPosts]) => (
            <section key={category}>
              <div className="mb-8 flex items-center gap-3">
                <span className="text-2xl">{categoryIcons[category] || '📄'}</span>
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    {category}
                  </h2>
                  <p className="text-sm text-gray-500">{categoryPosts.length}件の記事</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categoryPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.date).toLocaleDateString('ja-JP')}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="flex-1 text-base font-bold leading-snug text-gray-900 transition-colors group-hover:text-blue-600 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-0.5 rounded-full bg-gray-50 px-2 py-0.5 text-[11px] text-gray-500 ring-1 ring-gray-100"
                        >
                          <Tag className="h-2.5 w-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-blue-600 opacity-0 transition-all group-hover:opacity-100">
                      読む
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="border-t border-gray-100 pb-16 pt-12 text-center">
          <h3 className="text-2xl font-extrabold text-gray-900">内申点を今すぐ計算</h3>
          <p className="mt-2 text-gray-500">47都道府県対応の無料計算ツール</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              内申点を計算する
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/reverse"
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-7 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
            >
              志望校から逆算
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
