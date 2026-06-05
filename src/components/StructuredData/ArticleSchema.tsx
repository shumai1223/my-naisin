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
    author: {
      '@type': 'Organization',
      name: author,
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
