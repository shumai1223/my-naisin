import Link from 'next/link';
import { BookOpen, Calendar, Clock, ChevronRight, Sparkles, Tag, TrendingUp, ArrowRight, BookMarked, Target, GraduationCap, MapPin, Edit3 } from 'lucide-react';

import { getAllPosts } from '@/lib/blog-data';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

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

  const categoryIcons: Record<string, React.ReactNode> = {
    'guide': <BookMarked className="h-6 w-6 text-blue-600" />,
    '基礎知識': <BookOpen className="h-6 w-6 text-indigo-600" />,
    '対策・実践': <Target className="h-6 w-6 text-emerald-600" />,
    '進路・受験': <GraduationCap className="h-6 w-6 text-violet-600" />,
    '都道府県別': <MapPin className="h-6 w-6 text-rose-600" />,
    '教科別': <Edit3 className="h-6 w-6 text-amber-600" />,
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
            内申点の基礎知識から、主要5教科・実技4教科の具体的な成績アップ術まで。<br className="hidden sm:inline" />
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
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mt-12 mb-20">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              注目の記事
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {featuredPosts.map((post, i) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group relative overflow-hidden rounded-2xl bg-white border border-gray-200/60 p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-100 ${i === 0 ? 'md:col-span-2 md:row-span-2 flex flex-col justify-between' : 'flex flex-col'}`}
                >
                  <div>
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      <span className="inline-block rounded-md bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200/50">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.date).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <h3 className={`font-bold text-gray-900 transition-colors group-hover:text-blue-600 ${i === 0 ? 'text-2xl sm:text-3xl leading-tight' : 'text-lg leading-snug'}`}>
                      {post.title}
                    </h3>
                    <p className={`mt-3 text-gray-500 leading-relaxed ${i === 0 ? 'text-base sm:text-lg line-clamp-3' : 'text-sm line-clamp-2'}`}>
                      {post.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-600 opacity-0 transform translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    記事を読む
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Category Sections */}
        <div className="space-y-24 pb-24">
          {Object.entries(postsByCategory).map(([category, categoryPosts]) => (
            <section key={category} className="scroll-mt-24">
              <div className="mb-8 flex items-center gap-4 border-b border-gray-100 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 ring-1 ring-gray-100 shadow-sm">
                  {categoryIcons[category] || <BookOpen className="h-6 w-6 text-gray-400" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    {category}
                  </h2>
                  <p className="text-sm font-medium text-gray-500 mt-1">{categoryPosts.length}件の記事</p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {categoryPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col rounded-2xl bg-white border border-gray-200/60 p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-100 hover:-translate-y-0.5"
                  >
                    <div className="mb-4 flex items-center gap-3 text-xs font-medium text-gray-400">
                      <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.date).toLocaleDateString('ja-JP')}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="flex-1 text-base font-bold leading-relaxed text-gray-900 transition-colors group-hover:text-blue-600 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="rounded-3xl bg-white p-8 sm:p-12 text-center shadow-sm ring-1 ring-gray-100 mb-24 max-w-4xl mx-auto">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 mb-6">
            <Target className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">志望校との距離を正確に測る</h3>
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
