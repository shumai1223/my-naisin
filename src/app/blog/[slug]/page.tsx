import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ChevronLeft, ChevronRight, BookOpen, Home, User, FileCheck, ExternalLink, RefreshCw } from 'lucide-react';

import { getPostBySlug, getAllPosts } from '@/lib/blog-data';
import { BlogCTA } from '@/components/BlogCTA';
import { BlogPostingSchema } from '@/components/StructuredData/BlogPostingSchema';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: '記事が見つかりません | My Naishin',
    };
  }

  const url = `https://my-naishin.com/blog/${post.slug}`;
  const imageUrl = 'https://my-naishin.com/og-image.png';

  return {
    title: `${post.title} | My Naishin`,
    description: post.description,
    keywords: post.tags.join(', '),
    authors: [{ name: 'My Naishin' }],
    openGraph: {
      title: post.title,
      description: post.description,
      url: url,
      siteName: 'My Naishin - 内申点計算ツール',
      locale: 'ja_JP',
      type: 'article',
      publishedTime: post.date,
      authors: ['My Naishin'],
      tags: post.tags,
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: post.title,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <BlogPostingSchema
        title={post.title}
        description={post.description}
        url={`https://my-naishin.com/blog/${post.slug}`}
        datePublished={post.date}
        dateModified={post.lastUpdated}
        author={post.author ?? 'My Naishin'}
        tags={post.tags}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: 'コラム', url: 'https://my-naishin.com/blog' },
          { name: post.title, url: `https://my-naishin.com/blog/${post.slug}` },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
            <Home className="h-4 w-4" />
            ホーム
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/blog" className="flex items-center gap-1 hover:text-blue-600">
            <BookOpen className="h-4 w-4" />
            コラム
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="truncate text-slate-700">{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {post.category}
          </div>
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 md:text-3xl">
            {post.title}
          </h1>
          <p className="mt-3 text-base text-slate-600">
            {post.description}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {post.lastUpdated && (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="h-4 w-4" />
                更新: {new Date(post.lastUpdated).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              読了時間 {post.readTime}
            </span>
          </div>

          {/* 著者・監修者情報 */}
          {(post.author || post.supervisor) && (
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              {post.author && (
                <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                  <User className="h-3.5 w-3.5" />
                  執筆: {post.author}
                </span>
              )}
              {post.supervisor && (
                <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
                  <FileCheck className="h-3.5 w-3.5" />
                  監修: {post.supervisor}
                </span>
              )}
            </div>
          )}
        </header>

        {/* Article Content */}
        <article 
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
          itemScope
          itemType="https://schema.org/Article"
        >
          <meta itemProp="headline" content={post.title} />
          <meta itemProp="description" content={post.description} />
          <meta itemProp="datePublished" content={post.date} />
          <meta itemProp="author" content="My Naishin" />
          <meta itemProp="keywords" content={post.tags.join(', ')} />
          
          <div
            className="blog-content"
            itemProp="articleBody"
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/## /g, '<h2>')
                .replace(/### /g, '<h3>')
                .replace(/#### /g, '<h4>')
                .replace(/---/g, '<hr>')
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/<!-- AD_PLACEHOLDER -->/g, '')
            }}
          />

          {/* 参考資料・情報源 */}
          {post.sources && post.sources.length > 0 && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                <BookOpen className="h-4 w-4" />
                参考資料・情報源
              </h4>
              <ul className="space-y-2">
                {post.sources.map((source, i) => (
                  <li key={i}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {source.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                ※ 制度は年度によって変更される場合があります。最新情報は各教育委員会の公式サイトでご確認ください。
              </p>
            </div>
          )}
        </article>

        {/* CTA */}
        <div className="mt-10">
          <BlogCTA />
        </div>

        {/* Navigation */}
        <nav className="mt-10 grid gap-4 md:grid-cols-2">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md"
            >
              <ChevronLeft className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:-translate-x-1 group-hover:text-blue-500" />
              <div className="min-w-0">
                <div className="text-xs text-slate-400">前の記事</div>
                <div className="truncate text-sm font-medium text-slate-700 group-hover:text-blue-600">
                  {prevPost.title}
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group flex items-center justify-end gap-3 rounded-xl border border-slate-200 bg-white p-4 text-right transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="min-w-0">
                <div className="text-xs text-slate-400">次の記事</div>
                <div className="truncate text-sm font-medium text-slate-700 group-hover:text-blue-600">
                  {nextPost.title}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
            </Link>
          ) : (
            <div />
          )}
        </nav>

        {/* Back to Blog */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
          >
            <ChevronLeft className="h-4 w-4" />
            コラム一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
