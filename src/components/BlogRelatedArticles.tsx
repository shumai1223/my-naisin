'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight, Clock } from 'lucide-react';
import { BlogPost } from '@/lib/blog-data';

interface BlogRelatedArticlesProps {
  currentSlug: string;
  currentTags: string[];
  allPosts: BlogPost[];
  maxArticles?: number;
}

export function BlogRelatedArticles({
  currentSlug,
  currentTags,
  allPosts,
  maxArticles = 5,
}: BlogRelatedArticlesProps) {
  const relatedPosts = allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => {
      const sharedTags = p.tags.filter((t) => currentTags.includes(t));
      return { post: p, score: sharedTags.length };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxArticles);

  if (relatedPosts.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
        <BookOpen className="h-5 w-5 text-blue-600" />
        関連記事
      </h3>
      <div className="space-y-3">
        {relatedPosts.map(({ post }) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-blue-200 hover:bg-blue-50"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3" />
                  {post.readTime}
                </span>
              </div>
              <p className="text-sm font-medium leading-snug text-slate-700 group-hover:text-blue-700">
                {post.title}
              </p>
            </div>
            <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500" />
          </Link>
        ))}
      </div>
    </div>
  );
}
