interface BlogPostingSchemaProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  tags?: string[];
  imageUrl?: string;
}

export function BlogPostingSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author,
  tags,
  imageUrl = 'https://my-naishin.com/og-image.png',
}: BlogPostingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    // 著者は Person（現役中学生エンジニアしゅうまい）で機械可読化。E-E-A-T最大の差別化点。
    // @id を editor-profile / SiteSchema の founder と共有し、Googleに同一エンティティとして統合させる。
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
        url: 'https://my-naishin.com/favicon.svg',
      },
    },
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    inLanguage: 'ja',
    ...(tags && tags.length > 0 ? { keywords: tags.join(', ') } : {}),
  };

  // SSRの生HTMLに含めるためプレーンな <script>（next/scriptはJS注入でAIクローラーに不可視）。
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
