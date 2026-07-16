/**
 * @jest-environment node
 *
 * リッチリザルト全面監査（TIER L-2）第二弾: FAQPageSchema網羅チェック。
 *
 * 全page.tsxがFAQPageSchemaを持つ、または理由付きの例外リストに登録されているかを
 * 機械的に検知する（rich-results-breadcrumb.test.tsと同じパターン。詳細はそちらのコメント参照）。
 *
 * 2026-07-08の監査時点で、例外扱いの21面のうち実際に既存のFAQ的コンテンツ（Q&A形式の文章）を
 * 持つ面は0件だった（grep確認済み）。つまり現状は「FAQPageSchemaの実装漏れ」ではなく
 * 「そもそもFAQ形式のコンテンツが無い」状態＝schemaだけ足しても中身が伴わない。
 * 新規FAQ本文の執筆は本テストの範囲外（機械監査でやってよいのは検知のみ・
 * 捏造/薄いコンテンツ生成を避けるため）。CANDIDATE_FOR_FAQ_CONTENT に列挙した面は
 * 「Q&Aセクションを追加する価値がありそうな面」の目印であり、次にコンテンツを書く時の
 * 優先候補リストとして残す。
 */
import path from 'path';
import { walkPageFiles, routeFromFile, effectiveContent, countJsxUsages } from '@/lib/rich-results-audit';

/**
 * FAQPageSchemaが無くても正当と判断済みの例外。
 * 追加する場合は「なぜ不要か」をコメントで残すこと（審査なしの抜け道にしない）。
 */
const FAQ_EXEMPT_ROUTES: Record<string, string> = {
  '/about': '運営者情報ページ（Q&A形式のコンテンツなし）',
  '/about/editor-profile': '運営者プロフィールページ（Q&A形式のコンテンツなし）',
  '/admin/juku-reviews': 'noindex・トークン認証必須の内部ツール（リッチリザルト対象外・R-1第3弾）',
  '/admin/report': 'noindex・トークン認証必須の内部ツール（リッチリザルト対象外）',
  '/admin/worklog': 'noindex・トークン認証必須の内部ツール（リッチリザルト対象外）',
  '/blog': '記事一覧ページ（個別記事はblog/[slug]側でFAQPageSchema対応済み）',
  '/blog/tag/[tag]': 'タグ別記事一覧ページ（一覧のみでQ&A形式のコンテンツなし）',
  '/comparison': '都道府県比較表ページ（表形式でQ&A形式のコンテンツなし）',
  '/contact': '問い合わせページ（リッチリザルト価値が低い定型ページ）',
  '/developers': 'API仕様ページ（Q&A形式のコンテンツなし。CANDIDATE_FOR_FAQ_CONTENT参照）',
  '/disclaimer': '免責事項（リッチリザルト価値が低い定型ページ）',
  '/embed': '埋め込みウィジェット選択ページ（Q&A形式のコンテンツなし）',
  '/glossary': '用語辞典（定義の一覧でありQ&A形式ではない）',
  '/guide': '内申点完全ガイド（Q&A形式のセクションなし。CANDIDATE_FOR_FAQ_CONTENT参照）',
  '/naishin-oru': 'オール3/4/5内申点ハブページ（下位ページへの導線のみ・Q&Aは/naishin-oru/[grade]側で対応済み）',
  '/partner': '塾/パートナー向けLP（Q&A形式のコンテンツなし。CANDIDATE_FOR_FAQ_CONTENT参照）',
  '/pref/[code]': '県別注意点ページ（箇条書きでQ&A形式ではない）',
  '/prefectures': '都道府県一覧ハブ（一覧のみでQ&A形式のコンテンツなし）',
  '/press': 'プレスキットページ（Q&A形式のコンテンツなし）',
  '/privacy': 'プライバシーポリシー（リッチリザルト価値が低い定型ページ）',
  '/quality': '品質・E-E-A-T説明ページ（Q&A形式のコンテンツなし）',
  '/terms': '利用規約（リッチリザルト価値が低い定型ページ）',
  '/[prefecture]': '県別内申点ガイドページ（Q&A形式のセクションなし。CANDIDATE_FOR_FAQ_CONTENT参照）',
  '/[prefecture]/reverse': 'permanentRedirectのみのリダイレクトページ（実コンテンツ無し）',
};

/** 将来Q&Aセクションを書く価値がありそうな面（次の面化/コンテンツ拡充の優先候補）。 */
const CANDIDATE_FOR_FAQ_CONTENT = ['/developers', '/guide', '/partner', '/[prefecture]'];

describe('FAQPageSchema網羅チェック（L-2）', () => {
  const appDir = path.join(__dirname, '..');
  const pageFiles = walkPageFiles(appDir);

  test('page.tsxが少なくとも1件は見つかる（テスト自体が空振りしていないことの確認）', () => {
    expect(pageFiles.length).toBeGreaterThan(0);
  });

  test.each(pageFiles.map((file) => [routeFromFile(appDir, file), file] as const))(
    '%s: FAQPageSchemaを重複なく持つ、または理由付きの例外リストに登録されている',
    (route, file) => {
      const count = countJsxUsages('FAQPageSchema', effectiveContent(file));

      if (count === 0) {
        const exemptReason = FAQ_EXEMPT_ROUTES[route];
        expect(exemptReason).toBeDefined();
        return;
      }

      expect(count).toBe(1);
    },
  );

  test('例外リストの全エントリが実在するルートを指している（死んだ例外の放置防止）', () => {
    const routes = new Set(pageFiles.map((f) => routeFromFile(appDir, f)));
    for (const route of Object.keys(FAQ_EXEMPT_ROUTES)) {
      expect(routes.has(route)).toBe(true);
    }
  });

  test('CANDIDATE_FOR_FAQ_CONTENTの全エントリが例外リストにも存在する（整合性）', () => {
    for (const route of CANDIDATE_FOR_FAQ_CONTENT) {
      expect(FAQ_EXEMPT_ROUTES[route]).toBeDefined();
    }
  });
});
