import { MetadataRoute } from 'next';
import { PREFECTURES } from '@/lib/prefectures';
import { BLOG_POSTS } from '@/lib/blog-data';
import { PREFECTURES_WITH_GUIDE } from '@/lib/prefecture-guides';
import { VERIFIED_TOTAL_SCORE_CODES } from '@/lib/total-score/registry';
import { EXPLAINER_CODES } from '@/lib/total-score/explainers';
import { STATIC_PAGES } from '@/lib/page-registry';
import { SHINDAN_PURPOSE_CONTENTS } from '@/lib/shindan-purpose-content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://my-naishin.com';
  // ビルド時の日付を採用（再デプロイのたびに更新される）
  const lastModified = new Date();

  // 1. 静的コアページ（登録簿 src/lib/page-registry.ts から生成。追加は登録簿を編集する）
  const staticPages = STATIC_PAGES.map(page => ({
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

  // 3.5 都道府県別 印刷対応の計算方法まとめ（P-1・全47県。/pref/{code}はgenerateStaticParamsのみで
  //     sitemap登録が漏れていたため追加。先生・進路指導向けのA4印刷資料）
  const prefectureHandoutPages = PREFECTURES.map(prefecture => ({
    url: `${baseUrl}/pref/${prefecture.code}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
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

  // 7. 目的別偏差値診断ページ（S-2②・/hensachi/shindan/mokuteki/[purpose]。中間の一覧ページを
  //    持たない3階層の動的ルートのためSTATIC_PAGES登録簿だけではsitemapに載らず、専用生成が必要）。
  const shindanPurposePages = SHINDAN_PURPOSE_CONTENTS.map(p => ({
    url: `${baseUrl}/hensachi/shindan/mokuteki/${p.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...prefectureTopPages,
    ...prefectureNaishinPages,
    ...prefectureHandoutPages,
    ...blogPages,
    ...totalScorePages,
    ...totalScoreExplainerPages,
    ...shindanPurposePages,
  ];
}
