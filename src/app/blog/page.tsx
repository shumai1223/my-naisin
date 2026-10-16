import Link from 'next/link';
import { ArrowRight, ChevronRight } from '@/components/icons';

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
      <div className="min-h-screen">
        {/* ページの頭: パンくず → h1 → メタ行 → 結論の段落 */}
        <header className="mx-auto max-w-5xl px-4 pb-2 pt-6">
          <nav className="mb-4 flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] min-w-[44px] items-center hover:text-brand-700 hover:underline">
              ホーム
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="text-slate-900">内申点コラム</span>
          </nav>
          <h1 className="text-2xl font-bold leading-snug text-slate-900 md:text-[28px]">
            内申点対策コラム
          </h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-600">
            <span>2026年度入試対応</span>
            <span className="tabular-nums">
              全 {posts.length} 記事
            </span>
            <span>定期更新</span>
          </p>
          <p className="mt-4 max-w-2xl text-base leading-[1.8] text-slate-900">
            内申点の基礎知識から、主要5教科・実技4教科の具体的な成績アップ術まで。
            <br className="hidden sm:inline" />
            2026年（令和8年）4月15日現在の最新入試データに基づき解説。
          </p>
        </header>

        <div className="mx-auto max-w-5xl px-4">
          <BlogListClient posts={listItems} />

          {/* Bottom CTA */}
          <section className="mx-auto mb-14 max-w-4xl rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              志望校との距離を測る
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-[1.8] text-slate-900">
              47都道府県の最新入試データに対応。あなたの内申点と当日点の目安をシミュレーションできます。
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors duration-150 hover:bg-brand-800"
              >
                内申点を計算する
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/reverse"
                className="inline-flex min-h-[44px] items-center justify-center rounded border border-brand-700 bg-white px-5 py-3 font-bold text-brand-700 transition-colors duration-150 hover:bg-brand-50"
              >
                目標から逆算する
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
