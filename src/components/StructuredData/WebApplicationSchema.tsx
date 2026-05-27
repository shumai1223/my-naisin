interface WebApplicationSchemaProps {
  name: string;
  description: string;
  url: string;
  featureList?: string[];
}

export function WebApplicationSchema({ name, description, url, featureList }: WebApplicationSchemaProps) {
  // Google ガイドラインに準拠：fake な aggregateRating は付与しない。
  // 代わりに「authorプロフィール」「featureList」「applicationSubCategory」など、
  // E-E-A-T を構造化データで補強する正当な手段に絞っている。
  const defaultFeatures = [
    '全国47都道府県の最新入試方式に対応',
    '9教科の評定から内申点を自動計算',
    '志望校の合格ラインから逆算',
    '計算結果の保存・履歴管理',
    '評定平均・偏差値・1020点総合得点も同時に算出',
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'EducationalApplication',
    applicationSubCategory: 'CalculatorApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Modern browsers (Chrome, Safari, Firefox, Edge).',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
      availability: 'https://schema.org/InStock',
    },
    featureList: featureList ?? defaultFeatures,
    inLanguage: 'ja',
    author: {
      '@type': 'Organization',
      name: 'My Naishin',
      url: 'https://my-naishin.com',
      logo: 'https://my-naishin.com/favicon.svg',
    },
    publisher: {
      '@type': 'Organization',
      name: 'My Naishin',
      url: 'https://my-naishin.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://my-naishin.com/favicon.svg',
      },
    },
    isAccessibleForFree: true,
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
