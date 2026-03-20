import type { MetadataRoute } from 'next';
import { PREFECTURES } from '@/lib/prefectures';
import { getAllPosts } from '@/lib/blog-data';

const BASE_URL = 'https://my-naishin.com';

// サイト最終更新日（デプロイ時に更新）
const SITE_LAST_UPDATED = '2026-03-20';

export default function sitemap(): MetadataRoute.Sitemap {
  // 高品質な固定ページのみ含める
  // 除外: /glossary, /quality, /pref/ (薄いコンテンツ・重複コンテンツ)
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: SITE_LAST_UPDATED, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/reverse`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/prefectures`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/tools`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/comparison`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/guide`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: SITE_LAST_UPDATED, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: '2026-01-28', changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: '2026-01-28', changeFrequency: 'yearly', priority: 0.3 },
  ];

  // 47都道府県ページ（naishinのみ。/{pref}や/{pref}/reverseはリダイレクトなので含めない）
  const prefecturePages = PREFECTURES.map((pref) => ({
    url: `${BASE_URL}/${pref.code}/naishin`,
    lastModified: pref.lastVerified ?? SITE_LAST_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // ブログ記事
  const posts = getAllPosts();
  const blogPages = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.lastUpdated ?? post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...prefecturePages, ...blogPages];
}
