import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from '@/components/icons';

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
      <div className="min-h-screen">
        {/* ページの頭: パンくず → h1 → メタ行 → 結論の段落 */}
        <header className="mx-auto max-w-5xl px-4 pb-2 pt-6">
          <nav className="mb-4 flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center hover:text-brand-700 hover:underline">
              ホーム
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <Link href="/blog" className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center hover:text-brand-700 hover:underline">
              コラム
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate text-slate-900">#{tag}</span>
          </nav>

          <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
            #{tag}
          </h1>
          <p className="mt-3 text-sm text-slate-600">タグページ</p>
          <p className="mt-4 text-base leading-[1.8] text-slate-900">
            「{tag}」に関する記事が {posts.length} 件あります。
          </p>
        </header>

        <div className="mx-auto max-w-5xl px-4 py-10">
          {/* 関連タグ */}
          {relatedTags.length > 0 && (
            <div className="mb-10 rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-3 text-sm font-bold text-slate-900">関連タグ</h2>
              <div className="flex flex-wrap gap-2">
                {relatedTags.map((t) => (
                  <Link
                    key={t}
                    href={`/blog/tag/${encodeURIComponent(t)}`}
                    className="inline-flex min-h-[44px] items-center rounded border border-slate-300 bg-white px-3 text-sm text-slate-700 transition-colors duration-150 hover:bg-brand-50 hover:text-brand-800"
                  >
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
                className="group flex flex-col rounded-lg border border-slate-200 bg-white p-5 transition-colors duration-150 hover:border-brand-700"
              >
                <div className="mb-3 flex items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.date).toLocaleDateString('ja-JP')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="line-clamp-2 flex-1 text-base font-bold leading-relaxed text-slate-900 transition-colors duration-150 group-hover:text-brand-700">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                  {post.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags
                    .filter((t) => t !== tag)
                    .slice(0, 3)
                    .map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700"
                      >
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
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded border border-brand-700 bg-white px-5 py-3 font-bold text-brand-700 transition-colors duration-150 hover:bg-brand-50"
            >
              <ChevronLeft className="h-4 w-4" />
              コラム一覧へ戻る
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors duration-150 hover:bg-brand-800"
            >
              内申点を計算する
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
