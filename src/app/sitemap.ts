import { MetadataRoute } from 'next';
import { PREFECTURES } from '@/lib/prefectures';
import { BLOG_POSTS } from '@/lib/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://my-naishin.com';
  // 2026年4月16日: サイトの「熱気」を伝える大規模アップデート
  const lastModified = new Date('2026-04-16');

  // 1. 静的コアページ (最重要)
  const staticPages = [
    { url: '', priority: 1.0, changeFrequency: 'daily' },
    { url: '/tools', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/reverse', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/prefectures', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/comparison', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/guide', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/glossary', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/blog', priority: 0.8, changeFrequency: 'daily' },
    { url: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/quality', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/contact', priority: 0.5, changeFrequency: 'yearly' },
    { url: '/privacy', priority: 0.5, changeFrequency: 'yearly' },
    { url: '/terms', priority: 0.5, changeFrequency: 'yearly' },
    { url: '/disclaimer', priority: 0.5, changeFrequency: 'yearly' },
  ].map(page => ({
    url: `${baseUrl}${page.url}`,
    lastModified,
    changeFrequency: page.changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: page.priority,
  }));

  // 2. 都道府県別計算ページ（最重要コンテンツ - 直URLを優先）
  const prefectureNaishinPages = PREFECTURES.map(prefecture => ({
    url: `${baseUrl}/${prefecture.code}/naishin`,
    lastModified,
    changeFrequency: 'daily' as const, // クロール頻度を上げる
    priority: 0.9,
  }));

  // 3. 都道府県別逆算ページ
  const prefectureReversePages = PREFECTURES.map(prefecture => ({
    url: `${baseUrl}/${prefecture.code}/reverse`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 4. ブログ個別記事
  const blogPages = BLOG_POSTS.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.lastUpdated || post.date || '2026-04-16'),
    changeFrequency: 'daily' as const, // 更新アピールのため
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...prefectureNaishinPages,
    ...prefectureReversePages,
    ...blogPages,
  ];
}
