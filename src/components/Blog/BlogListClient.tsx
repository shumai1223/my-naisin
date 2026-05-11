'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Clock,
  Tag,
  Sparkles,
  ArrowRight,
  Search,
  X,
  BookMarked,
  Target,
  GraduationCap,
  MapPin,
  Edit3,
  Filter,
} from 'lucide-react';

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

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  guide: <BookMarked className="h-6 w-6 text-blue-600" />,
  基礎知識: <BookOpen className="h-6 w-6 text-indigo-600" />,
  '対策・実践': <Target className="h-6 w-6 text-emerald-600" />,
  '進路・受験': <GraduationCap className="h-6 w-6 text-violet-600" />,
  都道府県別: <MapPin className="h-6 w-6 text-rose-600" />,
  教科別: <Edit3 className="h-6 w-6 text-amber-600" />,
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
      <div className="mt-10 mb-10 rounded-2xl bg-white border border-gray-200/60 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-gray-500" />
          <h2 className="text-sm font-bold text-gray-700">記事を探す</h2>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="キーワード・タイトル・タグで検索"
            aria-label="記事を検索"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-11 pr-10 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="検索をクリア"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Tag pills */}
        {tagCounts.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-3.5 w-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-500">人気のタグ</span>
              {activeTag && (
                <button
                  type="button"
                  onClick={() => setActiveTag(null)}
                  className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  <X className="h-3 w-3" />
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
                    onClick={() => setActiveTag(isActive ? null : tag)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:ring-blue-200'
                    }`}
                  >
                    {tag}
                    <span
                      className={`text-[10px] font-bold ${
                        isActive ? 'text-blue-100' : 'text-gray-400'
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
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-blue-600 ring-1 ring-blue-200 hover:bg-blue-50"
                >
                  すべて表示（+{tagCounts.length - 14}）
                </button>
              )}
              {showAllTags && (
                <button
                  type="button"
                  onClick={() => setShowAllTags(false)}
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-500 ring-1 ring-gray-200 hover:bg-gray-50"
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
        <div className="pb-24">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              検索結果
              <span className="ml-2 text-sm font-medium text-gray-500">
                {filteredPosts.length}件
              </span>
            </h2>
            {activeTag && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 ring-1 ring-blue-100">
                <Tag className="h-3 w-3" />
                {activeTag}
              </span>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <Search className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-4 text-base font-medium text-gray-700">
                該当する記事が見つかりませんでした
              </p>
              <p className="mt-2 text-sm text-gray-500">
                キーワードやタグを変えてもう一度お試しください。
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setActiveTag(null);
                }}
                className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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
                    className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-xl"
                  >
                    もっと見る
                    <span className="text-xs font-medium text-gray-400">
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
            <div className="mb-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                注目の記事
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {featuredPosts.map((post, i) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className={`group relative overflow-hidden rounded-2xl bg-white border border-gray-200/60 p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-blue-100 ${
                      i === 0
                        ? 'md:col-span-2 md:row-span-2 flex flex-col justify-between'
                        : 'flex flex-col'
                    }`}
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
                      <h3
                        className={`font-bold text-gray-900 transition-colors group-hover:text-blue-600 ${
                          i === 0
                            ? 'text-2xl sm:text-3xl leading-tight'
                            : 'text-lg leading-snug'
                        }`}
                      >
                        {post.title}
                      </h3>
                      <p
                        className={`mt-3 text-gray-500 leading-relaxed ${
                          i === 0
                            ? 'text-base sm:text-lg line-clamp-3'
                            : 'text-sm line-clamp-2'
                        }`}
                      >
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
              <CategorySection
                key={category}
                category={category}
                posts={categoryPosts}
                icon={CATEGORY_ICONS[category] || <BookOpen className="h-6 w-6 text-gray-400" />}
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
      <div className="mb-8 flex items-center gap-4 border-b border-gray-100 pb-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 ring-1 ring-gray-100 shadow-sm">
          {icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">{category}</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">{posts.length}件の記事</p>
        </div>
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
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-200 transition-all hover:bg-gray-50 hover:ring-blue-200 hover:text-blue-600"
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
