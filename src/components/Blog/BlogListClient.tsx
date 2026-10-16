'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Search,
  X,
  BookMarked,
  Target,
  GraduationCap,
  MapPin,
  Edit3,
} from '@/components/icons';

export interface BlogListItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
}

interface BlogListClientProps {
  posts: BlogListItem[];
  initialTag?: string;
}

const PAGE_SIZE = 12;

// カテゴリ見出しの横に置く単色アイコン（箱には入れない・色は見出し側で1色）
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  guide: <BookMarked className="h-5 w-5" />,
  基礎知識: <BookOpen className="h-5 w-5" />,
  '対策・実践': <Target className="h-5 w-5" />,
  '進路・受験': <GraduationCap className="h-5 w-5" />,
  都道府県別: <MapPin className="h-5 w-5" />,
  教科別: <Edit3 className="h-5 w-5" />,
};

function normalize(text: string): string {
  return text.toLowerCase().normalize('NFKC');
}

function matchesQuery(post: BlogListItem, query: string): boolean {
  if (!query) return true;
  const q = normalize(query);
  return (
    normalize(post.title).includes(q) ||
    normalize(post.description).includes(q) ||
    normalize(post.category).includes(q) ||
    post.tags.some((t) => normalize(t).includes(q))
  );
}

export function BlogListClient({ posts, initialTag }: BlogListClientProps) {
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(initialTag ?? null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showAllTags, setShowAllTags] = useState(false);

  // Reset pagination when filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, activeTag]);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const tag of post.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const isFiltering = query.trim().length > 0 || activeTag !== null;

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (activeTag && !post.tags.includes(activeTag)) return false;
      if (!matchesQuery(post, query.trim())) return false;
      return true;
    });
  }, [posts, query, activeTag]);

  const featuredPosts = posts.slice(0, 3);
  const visiblePosts = filteredPosts.slice(0, visibleCount);

  // Category groups (used when not filtering)
  const postsByCategory = useMemo(() => {
    return posts.reduce(
      (acc, post) => {
        const category = post.category || 'その他';
        if (!acc[category]) acc[category] = [];
        acc[category].push(post);
        return acc;
      },
      {} as Record<string, BlogListItem[]>,
    );
  }, [posts]);

  const popularTags = showAllTags ? tagCounts : tagCounts.slice(0, 14);

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="mt-10 mb-10 rounded-lg border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="mb-4 text-base font-bold text-slate-900">記事を探す</h2>

        {/* Search input */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="キーワード・タイトル・タグで検索"
            aria-label="記事を検索"
            className={`w-full text-ellipsis rounded border border-slate-300 bg-white py-3 pl-10 text-base text-slate-900 placeholder:text-slate-500 [&::-webkit-search-cancel-button]:hidden ${
              query ? 'pr-12' : 'pr-3'
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="検索をクリア"
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-600 transition-colors duration-150 hover:text-slate-900"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Tag filter */}
        {tagCounts.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm text-slate-600">記事数の多いタグ</span>
              {activeTag && (
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className="ml-auto inline-flex min-h-[44px] items-center gap-1 text-sm text-brand-700 underline underline-offset-2 hover:text-brand-800"
                >
                  <X className="h-3.5 w-3.5" />
                  タグ解除
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(([tag, count]) => {
                const isActive = tag === activeTag;
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveTag(isActive ? null : tag)}
                    className={`inline-flex min-h-[44px] items-center gap-1.5 rounded border px-3 text-sm transition-colors duration-150 ${
                      isActive
                        ? 'border-brand-700 bg-brand-700 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-brand-50 hover:text-brand-800'
                    }`}
                  >
                    {tag}
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        isActive ? 'text-brand-100' : 'text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
              {!showAllTags && tagCounts.length > 14 && (
                <button
                  type="button"
                  onClick={() => setShowAllTags(true)}
                  className="inline-flex min-h-[44px] items-center gap-1 rounded border border-brand-700 bg-white px-3 text-sm font-bold text-brand-700 transition-colors duration-150 hover:bg-brand-50"
                >
                  すべて表示（+{tagCounts.length - 14}）
                </button>
              )}
              {showAllTags && (
                <button
                  type="button"
                  onClick={() => setShowAllTags(false)}
                  className="inline-flex min-h-[44px] items-center gap-1 rounded border border-slate-300 bg-white px-3 text-sm text-slate-700 transition-colors duration-150 hover:bg-slate-50"
                >
                  折りたたむ
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filtered Results */}
      {isFiltering ? (
        <div className="pb-14">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">
              検索結果
              <span className="ml-2 text-sm font-normal tabular-nums text-slate-600">
                {filteredPosts.length}件
              </span>
            </h2>
            {activeTag && (
              <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                {activeTag}
              </span>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center sm:p-12">
              <p className="text-base font-bold text-slate-900">
                該当する記事が見つかりませんでした
              </p>
              <p className="mt-2 text-sm text-slate-600">
                キーワードやタグを変えてもう一度お試しください。
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setActiveTag(null);
                }}
                className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded bg-brand-700 px-5 py-3 text-base font-bold text-white transition-colors duration-150 hover:bg-brand-800"
              >
                すべての記事を見る
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visiblePosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>

              {visibleCount < filteredPosts.length && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded border border-brand-700 bg-white px-5 py-3 font-bold text-brand-700 transition-colors duration-150 hover:bg-brand-50"
                  >
                    もっと見る
                    <span className="text-xs font-normal tabular-nums text-slate-600">
                      （残り {filteredPosts.length - visibleCount}件）
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <>
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="mb-14">
              <h2 className="mb-6 text-xl font-bold text-slate-900">
                新着の記事
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {featuredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col rounded-lg border border-slate-200 bg-white p-5 transition-colors duration-150 hover:border-brand-700"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.date).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <h3 className="text-[17px] font-bold leading-snug text-slate-900 transition-colors duration-150 group-hover:text-brand-700">
                      {post.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-[1.8] text-slate-600">
                      {post.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-brand-700">
                      記事を読む
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Category Sections */}
          <div className="space-y-14 pb-14">
            {Object.entries(postsByCategory).map(([category, categoryPosts]) => (
              <CategorySection
                key={category}
                category={category}
                posts={categoryPosts}
                icon={CATEGORY_ICONS[category] || <BookOpen className="h-5 w-5" />}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PostCard({ post }: { post: BlogListItem }) {
  return (
    <Link
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
        {post.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}

function CategorySection({
  category,
  posts,
  icon,
}: {
  category: string;
  posts: BlogListItem[];
  icon: React.ReactNode;
}) {
  const INITIAL = 6;
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? posts : posts.slice(0, INITIAL);

  return (
    <section className="scroll-mt-24">
      <div className="mb-6 flex items-center gap-3 border-b border-slate-900 pb-3">
        <span className="text-slate-600">{icon}</span>
        <h2 className="text-xl font-bold text-slate-900">{category}</h2>
        <p className="text-sm tabular-nums text-slate-600">{posts.length}件の記事</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      {posts.length > INITIAL && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded border border-brand-700 bg-white px-5 py-3 font-bold text-brand-700 transition-colors duration-150 hover:bg-brand-50"
          >
            {expanded
              ? '折りたたむ'
              : `もっと見る（残り ${posts.length - INITIAL}件）`}
          </button>
        </div>
      )}
    </section>
  );
}
