import Script from 'next/script';

interface BlogPostingSchemaProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  tags?: string[];
}

export function BlogPostingSchema({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author,
  tags,
}: BlogPostingSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'My Naishin',
    },
    inLanguage: 'ja',
    ...(tags && tags.length > 0 ? { keywords: tags.join(', ') } : {}),
  };

  return (
    <Script
      id="blogposting-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
