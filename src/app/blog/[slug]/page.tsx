import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, ChevronLeft, ChevronRight, ExternalLink } from '@/components/icons';

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

      {/* Article Body */}
      <div className="mx-auto max-w-3xl xl:max-w-[78rem] px-4">
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_18rem] xl:gap-10">
          <div className="min-w-0 xl:max-w-3xl xl:mx-auto">
        {/* 記事の頭: パンくず → h1 → メタ行 → 結論の段落（ヒーロー帯は作らない） */}
        <header className="pb-8 pt-6">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center hover:text-brand-700 hover:underline">
              ホーム
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <Link href="/blog" className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center hover:text-brand-700 hover:underline">
              コラム
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate text-slate-900">{post.title}</span>
          </nav>

          {/* Title */}
          {/* 本文の h2（blog.css: 1.55rem）より一段大きくして、見出しの階層を保つ */}
          <h1 className="text-[1.75rem] font-bold leading-snug text-slate-900 md:text-[2rem]">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
              {post.category}
            </span>
            {post.author && (
              <span className="flex items-baseline gap-1.5">
                <span className="text-xs">著者</span>
                <span className="text-slate-900">{post.author}</span>
              </span>
            )}
            {post.supervisor && (
              <span>監修: {post.supervisor}</span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(post.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            {post.lastUpdated && (
              <span className="font-bold text-slate-900">
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

          {/* 結論の段落 */}
          <p className="mt-5 text-base leading-[1.8] text-slate-900">
            {post.description}
          </p>

          {/* E-E-A-T: 運営者の当事者性を1行で示す */}
          <Link
            href="/about/editor-profile"
            className="mt-1 inline-block py-3 text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800"
          >
            運営者は<strong>2026年度受験生・現役中3</strong>。当事者目線で執筆
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="inline-flex min-h-[44px] items-center rounded border border-slate-300 bg-white px-3 text-sm text-slate-700 transition-colors duration-150 hover:bg-brand-50 hover:text-brand-800"
              >
                {tag}
              </Link>
            ))}
          </div>
        </header>

        <article
          className="relative"
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
            <div className="mt-10">
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                都道府県別詳細ページ
              </h3>
              <p className="mb-4 text-base leading-[1.8] text-slate-900">
                各都道府県の詳細な計算方法と特徴はこちらから確認できます：
              </p>
              <PrefectureLinkList limit={8} />
              <p className="mt-4 text-base leading-[1.8] text-slate-900">
                <strong>自分の都道府県が決まってない人向け：</strong>
                まずは<Link href="/prefectures" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">都道府県一覧</Link>で「満点・倍率・対象学年」を確認しましょう。
              </p>
            </div>
          )}

          {/* FAQ Section */}
          {post.faqs && post.faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 border-b border-slate-900 pb-3 text-2xl font-bold leading-snug text-slate-900">
                よくある質問
              </h2>
              <div className="space-y-3">
                {post.faqs.map((faq, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 bg-white">
                    <div className="flex items-start gap-3 border-b border-slate-200 px-5 py-4">
                      <span className="w-5 shrink-0 font-bold text-brand-700">Q</span>
                      <span className="font-bold text-slate-900">{faq.question}</span>
                    </div>
                    <div className="flex items-start gap-3 px-5 py-4">
                      <span className="w-5 shrink-0 font-bold text-slate-600">A</span>
                      <span className="leading-[1.8] text-slate-900">{faq.answer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 参考資料・情報源 */}
          {post.sources && post.sources.length > 0 && (
            <div className="mt-12 rounded-lg border border-slate-200 bg-brand-50 p-5">
              <h3 className="mb-3 text-sm font-bold text-slate-900">
                参考資料・情報源
              </h3>
              <ul className="list-disc space-y-1 pl-5 marker:text-slate-500">
                {post.sources.map((source, i) => (
                  <li key={i}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center gap-1.5 text-sm text-brand-700 underline underline-offset-2 transition-colors duration-150 hover:text-brand-800"
                    >
                      {source.name}
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-4 border-t border-slate-200 pt-3 text-sm text-slate-600">
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
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-bold text-slate-900">関連タグ</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  className="inline-flex min-h-[44px] items-center rounded border border-slate-300 bg-white px-3 text-sm text-slate-700 transition-colors duration-150 hover:bg-brand-50 hover:text-brand-800"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          <BlogShareButtons title={post.title} url={articleUrl} />
        </div>

        {/* CTA */}
        <div className="mt-10">
          <div className="rounded-lg border border-slate-200 bg-white p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-900">あなたの内申点を計算</h3>
            <p className="mt-3 text-base leading-[1.8] text-slate-900">47都道府県対応の無料計算ツールで、志望校合格に必要な点数を確認しましょう</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors duration-150 hover:bg-brand-800"
              >
                内申点を計算する
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/reverse"
                className="inline-flex min-h-[44px] items-center justify-center rounded border border-brand-700 bg-white px-5 py-3 font-bold text-brand-700 transition-colors duration-150 hover:bg-brand-50"
              >
                志望校から逆算
              </Link>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-10">
          <BlogRelatedArticles
            currentSlug={post.slug}
            currentTags={post.tags}
            allPosts={allPosts}
            maxArticles={5}
          />
        </div>

        {/* Related Tools */}
        <div className="mt-10">
          <BlogRelatedLinks
            relatedPrefectures={post.tags.includes('東京都') ? ['tokyo'] : 
                              post.tags.includes('神奈川') ? ['kanagawa'] :
                              post.tags.includes('大阪') ? ['osaka'] : []}
            showReverseTool={true}
            showGlossary={true}
          />
        </div>

        {/* Root Links */}
        <div className="mt-10">
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
        <nav className="mt-10 grid gap-4 md:grid-cols-2">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="group flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-5 transition-colors duration-150 hover:border-brand-700"
            >
              <ChevronLeft className="h-5 w-5 shrink-0 text-slate-600" />
              <div className="min-w-0">
                <div className="text-xs text-slate-600">前の記事</div>
                <div className="mt-1 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-brand-700">
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
              className="group flex items-center justify-end gap-3 rounded-lg border border-slate-200 bg-white p-5 text-right transition-colors duration-150 hover:border-brand-700"
            >
              <div className="min-w-0">
                <div className="text-xs text-slate-600">次の記事</div>
                <div className="mt-1 line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-brand-700">
                  {nextPost.title}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-600" />
            </Link>
          ) : (
            <div />
          )}
        </nav>

        {/* Back to Blog */}
        <div className="mt-10 pb-16 text-center">
          <Link
            href="/blog"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded border border-brand-700 bg-white px-5 py-3 font-bold text-brand-700 transition-colors duration-150 hover:bg-brand-50"
          >
            <ChevronLeft className="h-4 w-4" />
            コラム一覧に戻る
          </Link>
        </div>
          </div>
          {/* Sticky TOC (desktop only) */}
          <div className="xl:mt-8">
            <BlogStickyTOC rootSelector=".blog-content" />
          </div>
        </div>
      </div>
    </div>
  );
}
