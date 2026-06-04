import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  Clock,
  Tag as TagIcon,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Home,
  Sparkles,
} from 'lucide-react';

import { getAllPosts } from '@/lib/blog-data';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: PageProps) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const posts = getAllPosts().filter((p) => p.tags.includes(tag));

  const title = `「${tag}」に関する受験コラム一覧（${posts.length}件）| My Naishin`;
  const description = `「${tag}」に関連する内申点・高校受験コラムを${posts.length}件掲載。最新の入試情報に基づき、現役中学生と保護者に役立つ実践的な情報を発信中。`;
  const url = `https://my-naishin.com/blog/tag/${rawTag}`;

  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: 'My Naishin - 内申点計算ツール',
      locale: 'ja_JP',
      type: 'website' as const,
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const allPosts = getAllPosts();
  const posts = allPosts.filter((p) => p.tags.includes(tag));

  if (posts.length === 0) {
    notFound();
  }

  // 関連タグ：このタグの記事に頻出するほかのタグ
  const relatedTagCounts = new Map<string, number>();
  posts.forEach((p) =>
    p.tags.forEach((t) => {
      if (t === tag) return;
      relatedTagCounts.set(t, (relatedTagCounts.get(t) ?? 0) + 1);
    }),
  );
  const relatedTags = Array.from(relatedTagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([t]) => t);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: 'コラム', url: 'https://my-naishin.com/blog' },
          {
            name: `#${tag}`,
            url: `https://my-naishin.com/blog/tag/${rawTag}`,
          },
        ]}
      />
      <div className="min-h-screen bg-[#fafafa]">
        {/* Hero */}
        <div className="relative overflow-hidden bg-white border-b border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-4 py-12">
            <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="flex items-center gap-1 transition-colors hover:text-blue-600">
                <Home className="h-3.5 w-3.5" />
                ホーム
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
              <Link href="/blog" className="transition-colors hover:text-blue-600">
                コラム
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
              <span className="truncate text-gray-700">#{tag}</span>
            </nav>

            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 ring-1 ring-blue-100">
              <TagIcon className="h-3 w-3" />
              タグページ
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              #{tag}
            </h1>
            <p className="mt-3 text-base text-gray-500">
              「{tag}」に関する記事が {posts.length} 件あります。
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-12">
          {/* 関連タグ */}
          {relatedTags.length > 0 && (
            <div className="mb-10 rounded-2xl border border-gray-200/60 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-bold text-gray-800">関連タグ</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {relatedTags.map((t) => (
                  <Link
                    key={t}
                    href={`/blog/tag/${encodeURIComponent(t)}`}
                    className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 ring-1 ring-gray-200 transition-colors hover:bg-blue-50 hover:text-blue-600 hover:ring-blue-200"
                  >
                    <TagIcon className="h-3 w-3" />
                    {t}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 記事リスト */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
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
                  {post.tags
                    .filter((t) => t !== tag)
                    .slice(0, 3)
                    .map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-md bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500"
                      >
                        <TagIcon className="h-3 w-3" />
                        {t}
                      </span>
                    ))}
                </div>
              </Link>
            ))}
          </div>

          {/* Back */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
            >
              <ChevronLeft className="h-4 w-4" />
              コラム一覧へ戻る
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700"
            >
              <BookOpen className="h-4 w-4" />
              内申点を計算する
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
