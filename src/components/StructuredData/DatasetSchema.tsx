interface DatasetSchemaProps {
  name: string;
  description: string;
  url: string;
  /** 例：['偏差値', '上位パーセンタイル', '300人中の順位'] */
  variableMeasured?: string[];
  /** ISO日付。データの検証・更新日。 */
  dateModified?: string;
  /** 出典（一次情報や算出根拠）。 */
  citation?: string;
  /** キーワード（AI/検索の主題理解を助ける）。 */
  keywords?: string[];
  /** 機械可読の配布形態（DataDownload）。AI/検索がJSON APIを発見する導線。 */
  distribution?: ReadonlyArray<{
    '@type': 'DataDownload';
    encodingFormat: string;
    contentUrl: string;
    name?: string;
  }>;
}

/**
 * GEO（生成AIに引用される）対策の Dataset 構造化データ。
 * 偏差値→上位%対応表など「一次的な参照データ」をAIが引用しやすい形でマークアップする。
 * 数値表そのものは本文HTMLに存在させ、この schema はそのメタ情報を補強する役割。
 */
export function DatasetSchema({
  name,
  description,
  url,
  variableMeasured,
  dateModified,
  citation,
  keywords,
  distribution,
}: DatasetSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url,
    inLanguage: 'ja',
    isAccessibleForFree: true,
    license: 'https://my-naishin.com/terms',
    ...(keywords ? { keywords } : {}),
    ...(dateModified ? { dateModified } : {}),
    ...(distribution ? { distribution } : {}),
    ...(variableMeasured
      ? {
          variableMeasured: variableMeasured.map((v) => ({
            '@type': 'PropertyValue',
            name: v,
          })),
        }
      : {}),
    ...(citation ? { citation } : {}),
    creator: {
      '@type': 'Organization',
      name: 'My Naishin',
      url: 'https://my-naishin.com',
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
