import { MetadataRoute } from 'next';
import { PREFECTURES } from '@/lib/prefectures';
import { BLOG_POSTS } from '@/lib/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://my-naishin.com';

  const staticPages = [
    { url: '/', priority: 1.0, changeFrequency: 'daily' },
    { url: '/tools', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/reverse', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/prefectures', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/comparison', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/glossary', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/privacy', priority: 0.5, changeFrequency: 'yearly' },
    { url: '/contact', priority: 0.5, changeFrequency: 'yearly' },
    { url: '/blog', priority: 0.8, changeFrequency: 'daily' },
    { url: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/terms', priority: 0.5, changeFrequency: 'yearly' },
    { url: '/disclaimer', priority: 0.5, changeFrequency: 'yearly' },
    { url: '/guide', priority: 0.8, changeFrequency: 'monthly' },
    { url: '/quality', priority: 0.6, changeFrequency: 'monthly' },
  ].map(page => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date('2024-05-01'), // 固定日付にしてクローラの混乱を防ぐ
    changeFrequency: page.changeFrequency as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: page.priority,
  }));

  const prefecturePages = PREFECTURES.map(prefecture => ({
    url: `${baseUrl}/${prefecture.code}/naishin`,
    lastModified: new Date('2024-05-01'), // 固定日付にしてクローラの混乱を防ぐ
    changeFrequency: 'weekly' as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: 0.8,
  }));

  const blogPages = BLOG_POSTS.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.lastUpdated || post.date),
    changeFrequency: 'weekly' as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: 0.7,
  }));

  // 都道府県別の逆算ページなども追加（もし存在すれば）
  const prefectureReversePages = PREFECTURES.map(prefecture => ({
    url: `${baseUrl}/${prefecture.code}/reverse`,
    lastModified: new Date('2024-05-01'), // 固定日付にしてクローラの混乱を防ぐ
    changeFrequency: 'monthly' as MetadataRoute.Sitemap[0]['changeFrequency'],
    priority: 0.6,
  }));

  return [...staticPages, ...prefecturePages, ...prefectureReversePages, ...blogPages];
}
