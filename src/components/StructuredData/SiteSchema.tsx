import Script from 'next/script';

/**
 * サイト全体のエンティティを宣言する Organization + WebSite の JSON-LD。
 * ルートレイアウトで一度だけ描画し、全ページに適用する。
 *
 * 目的：
 *  - ブランド検索（「My Naishin」）でのナレッジパネル／サイトリンク獲得
 *  - 個別ページの WebApplication / Article schema から publisher として参照される
 *    "My Naishin" という Organization 実体を明示し、E-E-A-T を補強する
 *
 * 方針：架空の評価（aggregateRating 等）は付与しない。実在する情報のみ記載する。
 */
export function SiteSchema() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://my-naishin.com/#organization',
    name: 'My Naishin',
    alternateName: '内申点 計算サイト My Naishin',
    url: 'https://my-naishin.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://my-naishin.com/favicon.svg',
    },
    description:
      '全国47都道府県の最新方式に対応した、中学生・保護者向けの無料内申点計算サイト。内申点・評定平均・偏差値・志望校からの逆算をブラウザだけで算出できます。',
    foundingDate: '2025',
    founder: {
      '@type': 'Person',
      name: 'しゅうまい',
      url: 'https://my-naishin.com/about/editor-profile',
    },
    knowsAbout: [
      '高校受験',
      '内申点',
      '調査書点',
      '評定平均',
      '偏差値',
      '都道府県別 入試制度',
    ],
    sameAs: ['https://github.com/shumai1223'],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://my-naishin.com/#website',
    name: 'My Naishin',
    alternateName: '内申点 計算サイト',
    url: 'https://my-naishin.com',
    inLanguage: 'ja',
    publisher: {
      '@id': 'https://my-naishin.com/#organization',
    },
  };

  return (
    <Script
      id="site-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([organization, website]),
      }}
    />
  );
}
