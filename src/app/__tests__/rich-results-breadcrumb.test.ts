/**
 * @jest-environment node
 *
 * リッチリザルト全面監査（TIER L-2）第一弾: BreadcrumbSchema網羅チェック。
 *
 * 全page.tsxがBreadcrumbSchemaを持つ、または理由付きの例外リストに登録されているかを
 * 機械的に検知する。新しいページを追加した瞬間にこのテストが失敗する＝
 * パンくずリッチリザルトの取りこぼしをレビュー無しでも防げる
 * ([[opennext-ssg-1102-gotcha]]のH-7 dynamic-route-ssg.test.tsと同じ回帰テストパターン)。
 *
 * FAQPageSchema/HowToSchema/DatasetSchemaの網羅監査は rich-results-faq.test.ts 等に分割。
 */
import path from 'path';
import { walkPageFiles, routeFromFile, effectiveContent, countJsxUsages } from '@/lib/rich-results-audit';

/**
 * BreadcrumbSchemaが無くても正当と判断済みの例外。
 * 追加する場合は「なぜ不要か」をコメントで残すこと（審査なしの抜け道にしない）。
 */
const BREADCRUMB_EXEMPT_ROUTES: Record<string, string> = {
  '/': 'ホーム自体がパンくずの起点＝BreadcrumbList不要',
  '/admin/juku-reviews': 'noindex・トークン認証必須の内部ツール（リッチリザルト対象外・R-1第3弾）',
  '/admin/report': 'noindex・トークン認証必須の内部ツール（リッチリザルト対象外）',
  '/admin/worklog': 'noindex・トークン認証必須の内部ツール（リッチリザルト対象外）',
  '/contact': '問い合わせページ（リッチリザルト価値が低い定型ページ）',
  '/privacy': 'プライバシーポリシー（リッチリザルト価値が低い定型ページ）',
  '/terms': '利用規約（リッチリザルト価値が低い定型ページ）',
  '/[prefecture]/reverse': 'permanentRedirectのみのリダイレクトページ（実コンテンツ無し）',
};

describe('BreadcrumbSchema網羅チェック（L-2）', () => {
  const appDir = path.join(__dirname, '..');
  const pageFiles = walkPageFiles(appDir);

  test('page.tsxが少なくとも1件は見つかる（テスト自体が空振りしていないことの確認）', () => {
    expect(pageFiles.length).toBeGreaterThan(0);
  });

  test.each(pageFiles.map((file) => [routeFromFile(appDir, file), file] as const))(
    '%s: BreadcrumbSchemaを重複なく持つ、または理由付きの例外リストに登録されている',
    (route, file) => {
      const count = countJsxUsages('BreadcrumbSchema', effectiveContent(file));

      if (count === 0) {
        const exemptReason = BREADCRUMB_EXEMPT_ROUTES[route];
        expect(exemptReason).toBeDefined();
        return;
      }

      // 重複使用（page.tsxとClient.tsxの両方に実装、等）を検知する。
      expect(count).toBe(1);
    },
  );

  test('例外リストの全エントリが実在するルートを指している（死んだ例外の放置防止）', () => {
    const routes = new Set(pageFiles.map((f) => routeFromFile(appDir, f)));
    for (const route of Object.keys(BREADCRUMB_EXEMPT_ROUTES)) {
      expect(routes.has(route)).toBe(true);
    }
  });
});
