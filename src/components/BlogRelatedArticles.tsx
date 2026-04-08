import { BlogPost } from '@/lib/blog/types';
import { BLOG_POSTS } from '@/lib/blog/index';
import Link from 'next/link';
import { BookOpen, ChevronRight, Sparkles } from 'lucide-react';

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
  
  const relatedPosts = allPosts.filter(post => {
    // Exclude current
    if (currentSlug && post.slug === currentSlug) return false;

    // Use prefecture filter
    if (prefectureCode) {
      return post.title.includes(prefectureCode) || post.content.includes(prefectureCode);
    }
    
    // Use tag filter
    if (currentTags && currentTags.length > 0) {
      return post.tags.some(tag => currentTags.includes(tag));
    }
    
    return true;
  }).slice(0, prefectureCode ? limit : maxArticles);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/30 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <Sparkles className="h-5 w-5 text-blue-500" />
          あわせて読みたい攻略記事
        </h2>
        <Link href="/blog" className="text-sm font-medium text-blue-600 hover:underline flex items-center">
          記事一覧へ <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                {post.category}
              </span>
              <span className="text-[10px] text-slate-400">{post.date}</span>
            </div>
            <h3 className="line-clamp-2 flex-1 text-sm font-bold text-slate-800 group-hover:text-blue-600">
              {post.title}
            </h3>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-500">
              <BookOpen className="h-3 w-3" />
              記事を読む
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
