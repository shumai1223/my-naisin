import { MetadataRoute } from 'next';

export interface StaticPageEntry {
  url: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
}

/**
 * src/app 配下の静的ページ（page.tsx）の単一登録簿。
 * ページを追加したら必ずここに追記する — sitemap.ts はこの配列から自動生成され、
 * __tests__/sitemap-registry.test.ts がファイルシステムの実ルートとの差分をCIで検知する
 * （/juku-shindan がsitemap漏れで25日間未インデックスだったバグクラスの再発防止）。
 *
 * 動的ルート（[prefecture]・[code]・blog記事・total-score計算機/解説）はここに含めない。
 * それぞれ sitemap.ts 内で registry/データソースから自動生成される。
 * 意図的にサイトマップへ含めない静的ルートは SITEMAP_EXCLUDED_ROUTES に列挙する。
 */
export const STATIC_PAGES: StaticPageEntry[] = [
  { url: '', priority: 1.0, changeFrequency: 'daily' },
  { url: '/reverse', priority: 1.0, changeFrequency: 'weekly' },
  { url: '/plan', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/hensachi', priority: 1.0, changeFrequency: 'weekly' },
  { url: '/hensachi/shindan', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/hensachi/kyoka-betsu', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/hensachi/kyoka-betsu/kokugo', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/hensachi/kyoka-betsu/sugaku', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/hensachi/kyoka-betsu/eigo', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/hensachi/kyoka-betsu/rika', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/hensachi/kyoka-betsu/shakai', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/hensachi/shiboukou', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/hensachi/agekata', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/hensachi/moshi', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/hensachi/moshi/ichiran', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/hensachi/mantenkan', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/hensachi/gyakusan', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/hyotei-heikin', priority: 1.0, changeFrequency: 'weekly' },
  { url: '/hyotei-heikin/suisen-kijun', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/hyotei-heikin/gyakusan', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/total-score', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/total-score/mantenkan', priority: 0.8, changeFrequency: 'weekly' },
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
  { url: '/shinro-hiyou', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/koukou-hiyou', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/koukou-hiyou/kokoroze', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/juku-hiyou', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/juken-ryou', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/koukou-bairitsu', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/katei-kyoshi', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/naishin-age-kata', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/naishin-age-kata/chu1', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/naishin-age-kata/chu2', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/naishin-age-kata/chu3', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/jitsugika', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/shougakukin', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/dashboard', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/ask', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/chousasho', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/chousasho/kakikata', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/chousasho/hyoutei', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/chousasho/reibun', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/sougou-gata-senbatsu', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/suisen-nyuushi', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/shutsugan-junbi', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/hyouka-kijun', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/futoukou', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/futoukou/tsugaku', priority: 0.7, changeFrequency: 'weekly' },
  { url: '/hogosha', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/juku-shindan', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/mendan', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/juken-schedule', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/tarinai-taisaku', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/heigan-yuugu', priority: 0.8, changeFrequency: 'weekly' },
  { url: '/tools', priority: 0.9, changeFrequency: 'weekly' },
  { url: '/embed', priority: 0.6, changeFrequency: 'monthly' },
  { url: '/partner', priority: 0.5, changeFrequency: 'monthly' },
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
];

/**
 * 意図的にサイトマップへ含めない静的ルート（認証必須・noindex運用）。
 * sitemap-registry.test.ts のファイルシステム走査で除外するアローリスト。
 */
export const SITEMAP_EXCLUDED_ROUTES = ['/admin/report', '/admin/worklog'];
