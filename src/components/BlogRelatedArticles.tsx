import { BlogPost } from '@/lib/blog/types';
import { BLOG_POSTS } from '@/lib/blog/index';
import { getPrefectureByCode } from '@/lib/prefectures';
import Link from 'next/link';
import { BookOpen, ChevronRight } from '@/components/icons';

interface BlogRelatedArticlesProps {
  currentSlug?: string;
  currentTags?: string[];
  allPosts?: BlogPost[];
  maxArticles?: number;
  prefectureCode?: string;
  limit?: number;
}

export function BlogRelatedArticles({
  currentSlug,
  currentTags,
  allPosts = BLOG_POSTS,
  maxArticles = 3,
  prefectureCode,
  limit = 3
}: BlogRelatedArticlesProps) {

  const prefecture = prefectureCode ? getPrefectureByCode(prefectureCode) : null;
  const prefName = prefecture?.name || '';

  const relatedPosts = allPosts.filter(post => {
    // Exclude current
    if (currentSlug && post.slug === currentSlug) return false;

    // Use prefecture filter
    if (prefName) {
      const isPrefMatch = post.title.includes(prefName) || post.tags.includes(prefName);
      if (isPrefMatch) return true;
    }

    // Use tag filter
    if (currentTags && currentTags.length > 0) {
      return post.tags.some(tag => currentTags.includes(tag));
    }

    return false;
  });

  // 重要記事（全県共通で役立つもの）
  const staplePosts = allPosts.filter(p =>
    p.slug === 'how-to-raise-naishinten' ||
    p.slug === 'naishin-guide' ||
    p.slug === 'naishinten-high-school-exam-system' ||
    p.slug === 'practical-subjects-naishin-strategy'
  );

  // 表示する記事の構築（県別記事 + 不足分を重要記事で埋める）
  const displayPosts = [...relatedPosts];
  staplePosts.forEach(post => {
    if (displayPosts.length < limit && !displayPosts.find(p => p.slug === post.slug) && post.slug !== currentSlug) {
      displayPosts.push(post);
    }
  });

  if (displayPosts.length === 0) return null;

  const finalPosts = displayPosts.slice(0, limit);

  return (
    <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4">
        <h2 className="text-xl font-bold text-slate-900">
          {prefName ? `${prefName}入試に役立つ攻略記事` : 'あわせて読みたい攻略記事'}
        </h2>
        <Link href="/blog" className="inline-flex min-h-[44px] items-center gap-1 text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800">
          記事一覧へ <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {finalPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-lg border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                {post.category}
              </span>
              <span className="text-xs tabular-nums text-slate-600">{post.date}</span>
            </div>
            <h3 className="line-clamp-2 flex-1 text-base font-bold leading-snug text-slate-900 group-hover:text-brand-700">
              {post.title}
            </h3>
            <div className="mt-3 flex items-center gap-1 text-sm text-brand-700">
              <BookOpen className="h-4 w-4" />
              記事を読む
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
