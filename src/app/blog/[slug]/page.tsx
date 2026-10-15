import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ChevronLeft, ChevronRight, BookOpen, Home, FileCheck, ExternalLink, RefreshCw, Tag, Sparkles } from '@/components/icons';

import '../blog.css';
import { getPostBySlug, getAllPosts } from '@/lib/blog-data';
import { BlogRelatedLinks } from '@/components/BlogRelatedLinks';
import { BlogSourceLinks } from '@/components/BlogSourceLinks';
import { BlogPostingSchema } from '@/components/StructuredData/BlogPostingSchema';
import { BreadcrumbSchema } from '@/components/StructuredData/BreadcrumbSchema';
import { FAQPageSchema } from '@/components/StructuredData/FAQPageSchema';
import { PrefectureLinkList } from '@/components/PrefectureLinkList';
import { BlogRelatedArticles } from '@/components/BlogRelatedArticles';
import { BlogStickyTOC } from '@/components/Blog/BlogStickyTOC';
import { BlogShareButtons } from '@/components/Blog/BlogShareButtons';
import { ReadingProgressBar } from '@/components/Blog/ReadingProgressBar';
import { BackToTopButton } from '@/components/Blog/BackToTopButton';
import { ParentLeadCTA } from '@/components/ParentLeadCTA';
import { AdUnit } from '@/components/AdSlot';
import { splitHtmlForInArticleAds } from '@/lib/blog-ad-insert';
import { FutoukouLeadCTA } from '@/components/FutoukouLeadCTA';

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
    return null;
  }

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const articleUrl = `https://my-naishin.com/blog/${post.slug}`;

  return (
    <div className="min-h-screen bg-white">
      <ReadingProgressBar targetSelector="article" />
      <BackToTopButton />
      <BlogPostingSchema
        title={post.title}
        description={post.description}
        url={`https://my-naishin.com/blog/${post.slug}`}
        datePublished={post.date}
        dateModified={post.lastUpdated}
        author="ないしんパンダ"
        tags={post.tags}
      />
      <BreadcrumbSchema
        items={[
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: 'コラム', url: 'https://my-naishin.com/blog' },
          { name: post.title, url: `https://my-naishin.com/blog/${post.slug}` },
        ]}
      />
      {post.faqs && post.faqs.length > 0 && (
        <FAQPageSchema faqItems={post.faqs} />
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 pb-12 pt-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="flex items-center gap-1 transition-colors hover:text-white">
              <Home className="h-3.5 w-3.5" />
              ホーム
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <Link href="/blog" className="flex items-center gap-1 transition-colors hover:text-white">
              コラム
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <span className="truncate text-slate-300">{post.title}</span>
          </nav>

          {/* Category & Tags */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 px-3.5 py-1 text-xs font-bold text-brand-300 ring-1 ring-brand-400/30">
              <Sparkles className="h-3 w-3" />
              {post.category}
            </span>
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10 transition-colors hover:bg-white/15 hover:text-white hover:ring-white/25"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </Link>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-[2.5rem]">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-300/90">
            {post.description}
          </p>

          {/* E-E-A-T: 運営者の当事者性を1行で示す */}
          <Link
            href="/about/editor-profile"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-500/15 px-3.5 py-1.5 text-xs font-bold text-red-200 ring-1 ring-red-400/30 transition-colors hover:bg-red-500/25 hover:text-white"
          >
            <span aria-hidden="true">✍️</span>
            運営者は<strong className="text-red-100">2026年度受験生・現役中3</strong>。当事者目線で執筆
          </Link>

          {/* Meta Info */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5">
            {/* Author */}
            {post.author && (
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-400 text-sm font-bold text-white">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm text-white">{post.author}</div>
                  <div className="text-xs text-slate-400">著者</div>
                </div>
              </div>
            )}
            {post.supervisor && (
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-brand-400" />
                <span className="text-sm text-slate-300">監修: {post.supervisor}</span>
              </div>
            )}
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              {post.lastUpdated && (
                <span className="flex items-center gap-1.5 text-brand-400">
                  <RefreshCw className="h-3.5 w-3.5" />
                  {new Date(post.lastUpdated).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}更新
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}で読める
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="mx-auto max-w-3xl xl:max-w-[78rem] px-4">
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_18rem] xl:gap-10">
          <div className="min-w-0 xl:max-w-3xl xl:mx-auto">
        <article
          className="relative mt-6 rounded-t-lg bg-white pt-10 md:mt-8 md:pt-12"
          itemScope
          itemType="https://schema.org/Article"
        >
          <meta itemProp="headline" content={post.title} />
          <meta itemProp="description" content={post.description} />
          <meta itemProp="datePublished" content={post.date} />
          <meta itemProp="author" content="ないしんパンダ" />
          <meta itemProp="keywords" content={post.tags.join(', ')} />

          {/* 本文。導入文の後・本文の中ほどの <h2 の前に記事内広告(IN_ARTICLE・最大2枠)を挿入（位置は blog-ad-insert.ts）。
              広告は本文を書き換えず、セグメントを連結すると元の本文に戻る。AdUnit は NEXT_PUBLIC_ADSENSE_ENABLED=1 まで null。 */}
          {splitHtmlForInArticleAds(post.content.replace(/__PREFECTURE_LINK_LIST__/g, ''))
            .flatMap((segment, i, arr) => {
              const nodes = [
                <div
                  key={`seg-${i}`}
                  className="blog-content"
                  itemProp={i === 0 ? 'articleBody' : undefined}
                  dangerouslySetInnerHTML={{ __html: segment }}
                />,
              ];
              if (i < arr.length - 1) {
                nodes.push(
                  <AdUnit key={`ad-${i}`} unit="IN_ARTICLE" />
                );
              }
              return nodes;
            })}
          
          {/* 内申点ガイド記事のみ、県別リストを動的挿入 */}
          {post.slug === 'naishin-guide' && (
            <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-6">
              <h3 className="mb-4 text-lg font-bold text-slate-800">
                都道府県別詳細ページ
              </h3>
              <p className="mb-4 text-sm text-slate-600">
                各都道府県の詳細な計算方法と特徴はこちらから確認できます：
              </p>
              <PrefectureLinkList limit={8} />
              <p className="mt-4 text-sm text-slate-600">
                <strong>自分の都道府県が決まってない人向け：</strong>
                まずは<Link href="/prefectures" className="text-brand-600 hover:underline">都道府県一覧</Link>で「満点・倍率・対象学年」を確認しましょう。
              </p>
            </div>
          )}

          {/* FAQ Section */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 flex items-center gap-2 border-l-4 border-brand-500 pl-3 text-xl font-bold text-slate-900">
                よくある質問
              </h2>
              <div className="space-y-3">
                {post.faqs.map((faq, i) => (
                  <div key={i} className="overflow-hidden rounded-lg border border-slate-200">
                    <div className="flex items-start gap-3 bg-slate-50 px-5 py-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-xs font-bold text-white">Q</span>
                      <span className="pt-0.5 font-bold text-slate-900">{faq.question}</span>
                    </div>
                    <div className="flex items-start gap-3 px-5 py-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500 text-xs font-bold text-white">A</span>
                      <span className="pt-0.5 leading-relaxed text-slate-600">{faq.answer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 参考資料・情報源 */}
          {post.sources && post.sources.length > 0 && (
            <div className="mt-12 rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
                <BookOpen className="h-4 w-4 text-brand-500" />
                参考資料・情報源
              </h4>
              <ul className="space-y-2.5">
                {post.sources.map((source, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-brand-600 transition-colors hover:text-brand-800"
                    >
                      {source.name}
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-lg bg-white/60 p-3 text-xs text-slate-500">
                ※ 制度は年度によって変更される場合があります。最新情報は各教育委員会の公式サイトでご確認ください。
              </p>
            </div>
          )}
        </article>

        {/* 不登校クラスタ専用の保護者リード（もしも・クラスジャパン/ティントル）。
            汎用の塾/通信教育CTAより、不登校記事の読者（在宅・内申不問の学びを探す保護者）に文脈一致する。 */}
        {post.tags.includes('不登校') && <FutoukouLeadCTA className="mt-10" />}

        {/* 記事末尾の関連サービスCTA（blog placement＝EV¥84/clickのそら塾へ統一。旧サプリ¥5.4/clickは撤去） */}
        <ParentLeadCTA className="mt-10" placement="blog" />

        {/* Tags + Share */}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200/70 bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4 text-brand-500" />
              <h3 className="text-sm font-bold text-slate-800">関連タグ</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="inline-flex min-h-[44px] items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-700 ring-1 ring-slate-200 transition-colors hover:bg-brand-50 hover:text-brand-600 hover:ring-brand-200"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          <BlogShareButtons title={post.title} url={articleUrl} />
        </div>

        {/* CTA — Premium */}
        <div className="mt-12">
          <div className="relative overflow-hidden rounded-lg bg-brand-600 p-8 text-center text-white md:p-10">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
              <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/20 blur-2xl" />
            </div>
            <div className="relative">
              <h3 className="text-2xl font-bold tracking-tight">あなたの内申点を今すぐ計算</h3>
              <p className="mt-3 text-brand-100">47都道府県対応の無料計算ツールで、志望校合格に必要な点数を確認しましょう</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-brand-700 transition-all"
                >
                  内申点を計算する
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/reverse"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-7 py-3 text-sm font-bold text-white ring-1 ring-white/25 transition-all hover:bg-white/20"
                >
                  志望校から逆算
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <BlogRelatedArticles
            currentSlug={post.slug}
            currentTags={post.tags}
            allPosts={allPosts}
            maxArticles={5}
          />
        </div>

        {/* Related Tools */}
        <div className="mt-8">
          <BlogRelatedLinks 
            relatedPrefectures={post.tags.includes('東京都') ? ['tokyo'] : 
                              post.tags.includes('神奈川') ? ['kanagawa'] :
                              post.tags.includes('大阪') ? ['osaka'] : []}
            showReverseTool={true}
            showGlossary={true}
          />
        </div>

        {/* Root Links */}
        <div className="mt-8">
          <BlogSourceLinks 
            prefectureCode={post.tags.includes('東京都') ? 'tokyo' : 
                           post.tags.includes('神奈川') ? 'kanagawa' :
                           post.tags.includes('大阪') ? 'osaka' : undefined}
            hasEvaluationPoints={post.tags.includes('評価観点') || post.tags.includes('通知表')}
            hasCalculationMethod={post.tags.includes('計算方法') || post.tags.includes('内申点')}
          />
        </div>

        {/* 記事の最下部（前後ナビの前）: 関連コンテンツ型ユニット。ParentLeadCTAより後ろ */}
        <AdUnit unit="PAGE_BOTTOM" />

        {/* Prev / Next Navigation */}
        <nav className="mt-12 grid gap-4 md:grid-cols-2">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="group flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-5 transition-all hover:border-brand-200"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-brand-50">
                <ChevronLeft className="h-5 w-5 text-slate-400 transition-transform group-hover:-translate-x-0.5 group-hover:text-brand-500" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-400">前の記事</div>
                <div className="mt-1 truncate text-sm font-bold text-slate-800 group-hover:text-brand-600">
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
              className="group flex items-center justify-end gap-4 rounded-lg border border-slate-200 bg-white p-5 text-right transition-all hover:border-brand-200"
            >
              <div className="min-w-0">
                <div className="text-xs text-slate-400">次の記事</div>
                <div className="mt-1 truncate text-sm font-bold text-slate-800 group-hover:text-brand-600">
                  {nextPost.title}
                </div>
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-brand-50">
                <ChevronRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
              </div>
            </Link>
          ) : (
            <div />
          )}
        </nav>

        {/* Back to Blog */}
        <div className="mt-8 pb-16 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-2.5 text-sm font-bold text-slate-600 transition-all hover:bg-slate-200"
          >
            <ChevronLeft className="h-4 w-4" />
            コラム一覧に戻る
          </Link>
        </div>
          </div>
          {/* Sticky TOC (desktop only) */}
          <div className="mt-8">
            <BlogStickyTOC rootSelector=".blog-content" />
          </div>
        </div>
      </div>
    </div>
  );
}
