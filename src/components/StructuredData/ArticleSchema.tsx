interface ArticleSchemaProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: string;
  imageUrl?: string;
}

export function ArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  author,
  imageUrl,
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    datePublished: datePublished,
    dateModified: dateModified,
    // 著者は Person（現役中学生エンジニアしゅうまい）で機械可読化。BlogPostingSchemaと同じ
    // @id を共有しGoogle/AIに同一エンティティとして統合させる（E-E-A-T最大の差別化点）。
    // 従来はOrganizationとして出力しており、被リンク獲得の要である/naishin-kakusa・/naishin-map・
    // /report/2026等の主力ページがブログ記事より弱いauthorship signalしか持てていなかった
    // 不整合を2026-07-23(X-13)で是正。
    author: {
      '@type': 'Person',
      '@id': 'https://my-naishin.com/#person-shumai',
      name: author,
      url: 'https://my-naishin.com/about/editor-profile',
      jobTitle: '現役中学生エンジニア（2026年度受験生）',
      sameAs: ['https://github.com/shumai1223'],
    },
    publisher: {
      '@type': 'Organization',
      name: 'My Naishin',
      logo: {
        '@type': 'ImageObject',
        url: 'https://my-naishin.com/logo.png',
      },
    },
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
      },
    }),
  };

  // SSRの生HTMLに含めるためプレーンな <script>（next/scriptはJS注入でAIクローラーに不可視）。
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
