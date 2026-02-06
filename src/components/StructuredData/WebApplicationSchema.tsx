import Script from 'next/script';

interface WebApplicationSchemaProps {
  name: string;
  description: string;
  url: string;
}

export function WebApplicationSchema({ name, description, url }: WebApplicationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY',
    },
    inLanguage: 'ja',
  };

  return (
    <Script
      id="webapp-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
