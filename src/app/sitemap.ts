import { MetadataRoute } from 'next';
import { PREFECTURES } from '@/lib/prefectures';
import { BLOG_POSTS } from '@/lib/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://my-naishin.com';
  // 最終更新日を固定の最新日付にするか、各データの更新日を反映させる
  const lastModified = new Date('2026-05-06'); 

  // 1. 静的コアページ
  const staticPages = [
    { url: '', priority: 1.0, changeFrequency: 'always' },
    { url: '/reverse', priority: 1.0, changeFrequency: 'always' },
    { url: '/tools', priority: 0.9, changeFrequency: 'daily' },
    { url: '/prefectures', priority: 0.9, changeFrequency: 'daily' },
    { url: '/comparison', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/guide', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/glossary', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/blog', priority: 0.9, changeFrequency: 'always' },
    { url: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/about/editor-profile', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/quality', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/contact', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { url: '/disclaimer', priority: 0.3, changeFrequency: 'yearly' },
  ].map(page => ({
    url: `${baseUrl}${page.url}`,
    lastModified,
    changeFrequency: page.changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: page.priority,
  }));

  // 2. 都道府県別計算ページ（最重要ツール）
  const prefectureNaishinPages = PREFECTURES.map(prefecture => ({
    url: `${baseUrl}/${prefecture.code}/naishin`,
    lastModified,
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  // 3. 都道府県別トップページ (解説記事)
  const prefectureTopPages = PREFECTURES.map(prefecture => ({
    url: `${baseUrl}/${prefecture.code}`,
    lastModified,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // 4. ブログ個別記事
  const blogPages = BLOG_POSTS.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.lastUpdated || post.date || lastModified),
    changeFrequency: 'weekly' as const, 
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...prefectureTopPages,
    ...prefectureNaishinPages,
    ...blogPages,
  ];
}
