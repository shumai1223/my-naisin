/**
 * 構造化データ（JSON-LD）の契約テスト。
 *
 * 各 StructuredData コンポーネントは「SSRの生HTMLに JSON-LD を素の <script> で吐く」だけの
 * 純関数（フック無し）なので、関数として直接呼び出して `dangerouslySetInnerHTML.__html` を
 * JSON.parse すれば、レンダラ無しで吐かれる構造化データを厳密に検証できる。
 *
 * リッチリザルト（FAQ/HowTo/Breadcrumb/Article…）は収益面の生命線。
 * @context / @type / 必須プロパティの欠落や JSON 破損を CI で恒久的にブロックする。
 */

import * as React from 'react';

import { FAQPageSchema } from '../FAQPageSchema';
import { FAQSchema } from '../FAQSchema';
import { HowToSchema } from '../HowToSchema';
import { WebApplicationSchema } from '../WebApplicationSchema';
import { BreadcrumbSchema } from '../BreadcrumbSchema';
import { ArticleSchema } from '../ArticleSchema';
import { BlogPostingSchema } from '../BlogPostingSchema';
import { DatasetSchema } from '../DatasetSchema';
import { SiteSchema } from '../SiteSchema';
import { WebPageSchema } from '../WebPageSchema';

/** コンポーネントを関数として呼び、吐かれた JSON-LD を取り出して parse する。 */
function extractJsonLd(element: React.ReactElement): unknown {
  const props = element.props as {
    type?: string;
    dangerouslySetInnerHTML?: { __html?: string };
  };
  expect(element.type).toBe('script');
  expect(props.type).toBe('application/ld+json');
  const raw = props.dangerouslySetInnerHTML?.__html;
  expect(typeof raw).toBe('string');
  // JSON が壊れていれば parse が throw してテストが落ちる（= 破損検出）。
  return JSON.parse(raw as string);
}

/** schema.org のノードとして最低限の体裁を満たすか。 */
function expectSchemaNode(node: Record<string, unknown>, type: string) {
  expect(node['@context']).toBe('https://schema.org');
  expect(node['@type']).toBe(type);
}

/** URL らしさ（絶対 https URL）を確認。 */
function expectHttpsUrl(value: unknown) {
  expect(typeof value).toBe('string');
  expect(value as string).toMatch(/^https:\/\//);
}

describe('FAQPageSchema / FAQSchema', () => {
  const faqs = [
    { question: '内申点とは？', answer: '通知表の評定を点数化したものです。' },
    { question: '計算は無料？', answer: 'はい、すべて無料で利用できます。' },
  ];

  test.each([
    ['FAQPageSchema', FAQPageSchema({ faqItems: faqs })],
    ['FAQSchema', FAQSchema({ faqs })],
  ])('%s は妥当な FAQPage を吐く', (_label, el) => {
    const json = extractJsonLd(el as React.ReactElement) as Record<string, unknown>;
    expectSchemaNode(json, 'FAQPage');
    const mainEntity = json.mainEntity as Array<Record<string, unknown>>;
    expect(mainEntity).toHaveLength(faqs.length);
    mainEntity.forEach((q, i) => {
      expect(q['@type']).toBe('Question');
      expect(q.name).toBe(faqs[i].question);
      const answer = q.acceptedAnswer as Record<string, unknown>;
      expect(answer['@type']).toBe('Answer');
      expect(answer.text).toBe(faqs[i].answer);
    });
  });

  test('空配列でも壊れず mainEntity が空配列', () => {
    const json = extractJsonLd(FAQPageSchema({ faqItems: [] })) as Record<string, unknown>;
    expect(json.mainEntity).toEqual([]);
  });
});

describe('HowToSchema', () => {
  const el = HowToSchema({
    name: '内申点を計算する方法',
    description: '評定から内申点を出す手順。',
    steps: [
      { name: '評定を入力', text: '9教科の評定を入力します。' },
      { name: '結果を見る', text: '内申点が算出されます。', url: 'https://my-naishin.com/' },
    ],
  });

  test('HowTo の必須プロパティと step の position が連番', () => {
    const json = extractJsonLd(el) as Record<string, unknown>;
    expectSchemaNode(json, 'HowTo');
    expect(json.name).toBeTruthy();
    expect(json.description).toBeTruthy();
    expect(json.totalTime).toMatch(/^PT/); // ISO8601 duration
    const steps = json.step as Array<Record<string, unknown>>;
    expect(steps).toHaveLength(2);
    steps.forEach((s, i) => {
      expect(s['@type']).toBe('HowToStep');
      expect(s.position).toBe(i + 1);
      expect(s.name).toBeTruthy();
      expect(s.text).toBeTruthy();
    });
    // url を渡したステップのみ url を持つ
    expect(steps[0].url).toBeUndefined();
    expect(steps[1].url).toBe('https://my-naishin.com/');
  });
});

describe('WebApplicationSchema', () => {
  test('無料アプリ・著者/発行者の体裁が揃う', () => {
    const json = extractJsonLd(
      WebApplicationSchema({
        name: '内申点計算',
        description: '内申点を計算します。',
        url: 'https://my-naishin.com/',
      }),
    ) as Record<string, unknown>;
    expectSchemaNode(json, 'WebApplication');
    expect(json.applicationCategory).toBe('EducationalApplication');
    expect(json.isAccessibleForFree).toBe(true);
    const offers = json.offers as Record<string, unknown>;
    expect(offers.price).toBe('0');
    expect(offers.priceCurrency).toBe('JPY');
    // 規定の featureList が入る
    expect(Array.isArray(json.featureList)).toBe(true);
    expect((json.featureList as string[]).length).toBeGreaterThan(0);
    // Google ガイドライン：架空の aggregateRating を付けない
    expect(json.aggregateRating).toBeUndefined();
  });

  test('featureList を渡すと上書きされる', () => {
    const json = extractJsonLd(
      WebApplicationSchema({
        name: 'x',
        description: 'y',
        url: 'https://my-naishin.com/',
        featureList: ['機能A', '機能B'],
      }),
    ) as Record<string, unknown>;
    expect(json.featureList).toEqual(['機能A', '機能B']);
  });
});

describe('BreadcrumbSchema', () => {
  test('itemListElement が 1 始まりの連番で item が URL', () => {
    const items = [
      { name: 'ホーム', url: 'https://my-naishin.com/' },
      { name: '東京都', url: 'https://my-naishin.com/tokyo' },
    ];
    const json = extractJsonLd(BreadcrumbSchema({ items })) as Record<string, unknown>;
    expectSchemaNode(json, 'BreadcrumbList');
    const list = json.itemListElement as Array<Record<string, unknown>>;
    expect(list).toHaveLength(2);
    list.forEach((li, i) => {
      expect(li['@type']).toBe('ListItem');
      expect(li.position).toBe(i + 1);
      expect(li.name).toBe(items[i].name);
      expect(li.item).toBe(items[i].url);
    });
  });
});

describe('ArticleSchema', () => {
  test('Article の必須日付/著者/発行者が揃い、image は任意', () => {
    const base = {
      title: 'タイトル',
      description: '説明',
      datePublished: '2026-01-01',
      dateModified: '2026-06-01',
      author: 'My Naishin',
    };
    const without = extractJsonLd(ArticleSchema(base)) as Record<string, unknown>;
    expectSchemaNode(without, 'Article');
    expect(without.headline).toBe('タイトル');
    expect(without.datePublished).toBe('2026-01-01');
    expect(without.dateModified).toBe('2026-06-01');
    expect((without.author as Record<string, unknown>).name).toBe('My Naishin');
    expect(without.image).toBeUndefined();

    const withImg = extractJsonLd(
      ArticleSchema({ ...base, imageUrl: 'https://my-naishin.com/og.png' }),
    ) as Record<string, unknown>;
    expectHttpsUrl((withImg.image as Record<string, unknown>).url);
  });
});

describe('BlogPostingSchema', () => {
  test('著者 Person が editor-profile と同一 @id を共有し、規定OG画像が入る', () => {
    const json = extractJsonLd(
      BlogPostingSchema({
        title: '記事',
        description: '説明',
        url: 'https://my-naishin.com/blog/x',
        datePublished: '2026-01-01',
        author: 'しゅうまい',
        tags: ['内申点', '高校受験'],
      }),
    ) as Record<string, unknown>;
    expectSchemaNode(json, 'BlogPosting');
    const author = json.author as Record<string, unknown>;
    expect(author['@type']).toBe('Person');
    // editor-profile / SiteSchema.founder と統合させるための同一 @id
    expect(author['@id']).toBe('https://my-naishin.com/#person-shumai');
    // dateModified 未指定なら datePublished にフォールバック
    expect(json.dateModified).toBe('2026-01-01');
    expect(json.keywords).toBe('内申点, 高校受験');
    expectHttpsUrl((json.image as Record<string, unknown>).url);
  });
});

describe('DatasetSchema', () => {
  test('GEO向け Dataset：creator/publisher と任意フィールドの出し分け', () => {
    const json = extractJsonLd(
      DatasetSchema({
        name: '偏差値→上位%対応表',
        description: '偏差値と上位パーセンタイルの対応データ。',
        url: 'https://my-naishin.com/hensachi',
        variableMeasured: ['偏差値', '上位パーセンタイル'],
        dateModified: '2026-06-01',
        keywords: ['偏差値', '内申点'],
        distribution: [
          {
            '@type': 'DataDownload',
            encodingFormat: 'application/json',
            contentUrl: 'https://my-naishin.com/api/naishin',
          },
        ],
      }),
    ) as Record<string, unknown>;
    expectSchemaNode(json, 'Dataset');
    expect(json.isAccessibleForFree).toBe(true);
    const vm = json.variableMeasured as Array<Record<string, unknown>>;
    expect(vm).toHaveLength(2);
    expect(vm[0]['@type']).toBe('PropertyValue');
    const dist = json.distribution as Array<Record<string, unknown>>;
    expect(dist[0]['@type']).toBe('DataDownload');
    expectHttpsUrl(dist[0].contentUrl);
    expect((json.creator as Record<string, unknown>).name).toBe('My Naishin');
  });

  test('任意フィールド未指定なら省略される', () => {
    const json = extractJsonLd(
      DatasetSchema({ name: 'x', description: 'y', url: 'https://my-naishin.com/' }),
    ) as Record<string, unknown>;
    expect(json.variableMeasured).toBeUndefined();
    expect(json.distribution).toBeUndefined();
    expect(json.citation).toBeUndefined();
  });
});

describe('SiteSchema', () => {
  test('Organization + WebSite を配列で吐き、@id でエンティティを結ぶ', () => {
    const json = extractJsonLd(SiteSchema()) as Array<Record<string, unknown>>;
    expect(Array.isArray(json)).toBe(true);
    expect(json).toHaveLength(2);
    const [org, site] = json;
    expectSchemaNode(org, 'Organization');
    expect(org['@id']).toBe('https://my-naishin.com/#organization');
    // founder は BlogPosting の著者と同一 @id（エンティティ統合）
    expect((org.founder as Record<string, unknown>)['@id']).toBe('https://my-naishin.com/#person-shumai');
    expectSchemaNode(site, 'WebSite');
    // WebSite.publisher が Organization を @id 参照
    expect((site.publisher as Record<string, unknown>)['@id']).toBe('https://my-naishin.com/#organization');
  });
});

describe('WebPageSchema', () => {
  test('breadcrumb を渡すと BreadcrumbList が入れ子になる', () => {
    const json = extractJsonLd(
      WebPageSchema({
        title: 'ページ',
        description: '説明',
        url: 'https://my-naishin.com/x',
        lastModified: '2026-06-01',
        breadcrumb: [
          { name: 'ホーム', url: 'https://my-naishin.com/' },
          { name: 'X', url: 'https://my-naishin.com/x' },
        ],
      }),
    ) as Record<string, unknown>;
    expectSchemaNode(json, 'WebPage');
    expect(json.dateModified).toBe('2026-06-01');
    const bc = json.breadcrumb as Record<string, unknown>;
    expect(bc['@type']).toBe('BreadcrumbList');
    expect((bc.itemListElement as unknown[]).length).toBe(2);
  });

  test('breadcrumb 未指定なら breadcrumb キー無し', () => {
    const json = extractJsonLd(
      WebPageSchema({ title: 'x', description: 'y', url: 'https://my-naishin.com/x' }),
    ) as Record<string, unknown>;
    expect(json.breadcrumb).toBeUndefined();
    expect(json.dateModified).toBeUndefined();
  });
});
