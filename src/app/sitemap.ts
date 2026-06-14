import { MetadataRoute } from 'next';
import { PREFECTURES } from '@/lib/prefectures';
import { BLOG_POSTS } from '@/lib/blog-data';
import { PREFECTURES_WITH_GUIDE } from '@/lib/prefecture-guides';
import { VERIFIED_TOTAL_SCORE_CODES } from '@/lib/total-score/registry';
import { EXPLAINER_CODES } from '@/lib/total-score/explainers';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://my-naishin.com';
  // ビルド時の日付を採用（再デプロイのたびに更新される）
  const lastModified = new Date();

  // 1. 静的コアページ
  const staticPages = [
    { url: '', priority: 1.0, changeFrequency: 'daily' },
    { url: '/reverse', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/plan', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/hensachi', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/hensachi/kyoka-betsu', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/hensachi/shiboukou', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/hensachi/agekata', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/hensachi/moshi', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/hyotei-heikin', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/hyotei-heikin/suisen-kijun', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/total-score', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/tokyo/total-score', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/kanagawa/s-value', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/osaka/total-score', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/aichi/total-score', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/chiba/total-score', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/saitama/total-score', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/fukuoka/total-score', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/hokkaido/rank', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/hiyou', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/kyouiku-hi', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/koukou-hiyou', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/juku-hiyou', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/shougakukin', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/dashboard', priority: 0.7, changeFrequency: 'monthly' },
    { url: '/ask', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/hogosha', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/mendan', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/juken-schedule', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/tools', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/embed', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/developers', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/prefectures', priority: 0.9, changeFrequency: 'weekly' },
    { url: '/comparison', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/guide', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/glossary', priority: 0.8, changeFrequency: 'weekly' },
    { url: '/blog', priority: 0.9, changeFrequency: 'daily' },
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

  // 3. 都道府県別トップページ（手書きguideのある県のみ）
  const prefectureTopPages = PREFECTURES
    .filter(prefecture => PREFECTURES_WITH_GUIDE.has(prefecture.code))
    .map(prefecture => ({
      url: `${baseUrl}/${prefecture.code}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // 4. ブログ個別記事
  const blogPages = BLOG_POSTS.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.lastUpdated || post.date || lastModified),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 5. 第1層（検証済み）の総合得点 計算機ページ（registry の allowlist から自動生成）
  //    total-score は計算機13県（静的8＋registry5）＋解説34県＝全47県をカバー。
  //    ハブ /total-score（上の staticPages）＋以下の動的URLで全県がサイトマップに載る。
  const totalScorePages = VERIFIED_TOTAL_SCORE_CODES.map(code => ({
    url: `${baseUrl}/${code}/total-score`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }));

  // 6. 第2層の総合得点 解説ページ（explainers から自動生成。県を足すと自動で載る）
  const totalScoreExplainerPages = EXPLAINER_CODES.map(code => ({
    url: `${baseUrl}/${code}/total-score`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...prefectureTopPages,
    ...prefectureNaishinPages,
    ...blogPages,
    ...totalScorePages,
    ...totalScoreExplainerPages,
  ];
}
