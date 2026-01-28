import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ChevronLeft, ChevronRight, BookOpen, Home } from 'lucide-react';

import { getPostBySlug, getAllPosts } from '@/lib/blog-data';

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
      title: '記事が見つかりません | My naisin',
    };
  }

  return {
    title: `${post.title} | My naisin`,
    description: post.description,
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
          <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              読了時間 {post.readTime}
            </span>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-h4:text-base prose-p:leading-relaxed prose-li:leading-relaxed prose-strong:text-slate-800 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline">
          <div
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/^## /gm, '<h2>')
                .replace(/^### /gm, '<h3>')
                .replace(/^#### /gm, '<h4>')
                .replace(/^##### /gm, '<h5>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/<h2>/g, '</p><h2>')
                .replace(/<h3>/g, '</p><h3>')
                .replace(/<h4>/g, '</p><h4>')
                .replace(/<h5>/g, '</p><h5>')
                .replace(/<\/h2>\n/g, '</h2><p>')
                .replace(/<\/h3>\n/g, '</h3><p>')
                .replace(/<\/h4>\n/g, '</h4><p>')
                .replace(/<\/h5>\n/g, '</h5><p>')
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                .replace(/^\- /gm, '<li>')
                .replace(/<li>(.+)/gm, '<li>$1</li>')
                .replace(/\n<li>/g, '<ul><li>')
                .replace(/<\/li>\n(?!<li>)/g, '</li></ul>')
                .replace(/\|(.+)\|/g, (match) => {
                  const cells = match.split('|').filter(Boolean);
                  return `<tr>${cells.map(cell => `<td class="border border-slate-200 px-3 py-2">${cell.trim()}</td>`).join('')}</tr>`;
                })
            }}
          />
        </article>

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center text-white shadow-lg">
          <h3 className="text-lg font-bold">あなたの内申点を計算してみよう！</h3>
          <p className="mt-2 text-sm text-blue-100">
            My naisinなら、9教科の成績を入力するだけで内申点がすぐわかります
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-md transition-all hover:shadow-lg"
          >
            内申点を計算する
            <ChevronRight className="h-4 w-4" />
          </Link>
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
