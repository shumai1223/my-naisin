import Link from 'next/link';
import { BookOpen, Calendar, Clock, ChevronRight, Sparkles } from 'lucide-react';

import { getAllPosts } from '@/lib/blog-data';

export const metadata = {
  title: '内申点コラム | My Naishin - 高校受験ガイド',
  description: '内申点の計算方法、成績の上げ方、都道府県別の違いなど、高校受験に役立つ情報を発信しています。',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
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
        </div>

        {/* Featured Post */}
        {posts.length > 0 && (
          <Link
            href={`/blog/${posts[0].slug}`}
            className="group mb-8 block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg"
          >
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="relative">
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                  <Sparkles className="h-3 w-3" />
                  注目記事
                </div>
                <h2 className="text-xl font-bold text-white md:text-2xl">
                  {posts[0].title}
                </h2>
                <p className="mt-2 text-sm text-blue-100">
                  {posts[0].description}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(posts[0].date).toLocaleDateString('ja-JP')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {posts[0].readTime}
                </span>
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors group-hover:text-blue-700">
                記事を読む
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        )}

        {/* Post List */}
        <div className="space-y-4">
          {posts.slice(1).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {post.category}
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-blue-600">
                    {post.title}
                  </h2>
                  <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">
                    {post.description}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(post.date).toLocaleDateString('ja-JP')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-blue-500" />
              </div>
            </Link>
          ))}
        </div>

        {/* Back to Calculator */}
        <div className="mt-12 text-center">
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
