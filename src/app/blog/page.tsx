import Link from 'next/link';
import { BookOpen, Calendar, Clock, ChevronRight, Sparkles } from 'lucide-react';

import { getAllPosts } from '@/lib/blog-data';

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

  // カテゴリでグループ化
  const postsByCategory = posts.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            <BookOpen className="h-4 w-4" />
            内申点コラム
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            高校受験ガイド
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            内申点の計算方法から成績アップのコツまで、<br className="hidden sm:inline" />
            高校受験に役立つ情報をお届けします
          </p>
          <div className="mt-6 text-sm text-slate-500">
            全 {posts.length} 記事
          </div>
        </div>

        {/* 全記事一覧 */}
        <div className="space-y-12">
          {Object.entries(postsByCategory).map(([category, categoryPosts]) => (
            <section key={category}>
              <h2 className="mb-6 text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">
                {category}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {categoryPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                            {post.category}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(post.date).toLocaleDateString('ja-JP')}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock className="h-3.5 w-3.5" />
                            {post.readTime}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-blue-600 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                          {post.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-500 mt-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Back to Calculator */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:shadow-blue-300"
          >
            内申点を計算する
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
