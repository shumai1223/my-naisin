interface HighSchoolSchemaProps {
  name: string;
  url: string;
  address?: string;
}

/**
 * S3-4（ops/PROPOSALS.md）: 学校ページ用の HighSchool 構造化データ。
 * 実数（学校名・URL・住所）のみを出力し、口コミ・評価は自社に実データが無いため
 * aggregateRating 等は一切含めない（捏造ゼロ・Y-0憲法）。
 */
export function HighSchoolSchema({ name, url, address }: HighSchoolSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HighSchool',
    name,
    url,
    ...(address && { address }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
