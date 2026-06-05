interface FAQItem {
  question: string;
  answer: string;
}

interface FAQPageSchemaProps {
  faqItems: FAQItem[];
}

export function FAQPageSchema({ faqItems }: FAQPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  // JSON-LD は next/script ではなくプレーンな <script> で出力する。
  // next/script(既定 afterInteractive) は JS でクライアント注入されるため SSR の生HTMLに含まれず、
  // JSを実行しないAIクローラー/監査ツールから FAQPage が見えなくなる（GEO上の致命傷）。
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
