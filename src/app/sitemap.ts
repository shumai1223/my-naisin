import type { MetadataRoute } from 'next';
import { PREFECTURES } from '@/lib/prefectures';
import { getAllPosts } from '@/lib/blog-data';

const BASE_URL = 'https://my-naishin.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // 固定ページ
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/reverse`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/prefectures`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/comparison`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/glossary`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/quality`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // 47都道府県ページ
  const prefecturePages = PREFECTURES.map((pref) => ({
    url: `${BASE_URL}/${pref.code}/naishin`,
    lastModified: pref.lastVerified ?? now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // 都道府県リバース計算ページ
  const prefectureReversePages = PREFECTURES.map((pref) => ({
    url: `${BASE_URL}/${pref.code}/reverse`,
    lastModified: pref.lastVerified ?? now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 都道府県詳細ページ（削除 - 404エラーのため）
  // const prefectureDetailPages = PREFECTURES.map((pref) => ({
  //   url: `${BASE_URL}/${pref.code}`,
  //   lastModified: pref.lastVerified ?? now,
  //   changeFrequency: 'monthly' as const,
  //   priority: 0.7,
  // }));

  // ブログ記事
  const posts = getAllPosts();
  const blogPages = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.lastUpdated ?? post.date,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...prefecturePages, ...prefectureReversePages, ...blogPages];
}
