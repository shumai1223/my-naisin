interface WebPageSchemaProps {
  title: string;
  description: string;
  url: string;
  lastModified?: string;
  breadcrumb?: {
    name: string;
    url: string;
  }[];
}

export function WebPageSchema({ 
  title, 
  description, 
  url, 
  lastModified,
  breadcrumb 
}: WebPageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url,
    ...(lastModified && { "dateModified": lastModified }),
    ...(breadcrumb && {
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumb.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "item": item.url
        }))
      }
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
