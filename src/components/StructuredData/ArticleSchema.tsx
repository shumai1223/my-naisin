import Script from 'next/script';

interface ArticleSchemaProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  author: string;
  imageUrl?: string;
  url?: string;
  breadcrumb?: {
    name: string;
    url: string;
  }[];
}

export function ArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  author,
  imageUrl,
  url,
  breadcrumb,
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
    ...(url && { url: url }),
    ...(imageUrl && { image: imageUrl }),
    ...(breadcrumb && {
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumb.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
