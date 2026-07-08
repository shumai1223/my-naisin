/**
 * @jest-environment node
 *
 * 内部リンクグラフ監査（TIER L-6）: 全静的ページが、実際にレンダリングされるページ・
 * コンポーネントのどこかから文脈的にリンクされているかを検知する回帰テスト。
 *
 * 既存の check-orphans.mjs（報告専用・常にexit 0）は src/lib/page-registry.ts
 * （sitemap.ts が読む全ルートの文字列リテラル配列）自体を参照プールに含んでいたため、
 * 登録さえされていれば「リンクされている」と誤判定し、実際にはどこからもクリックで
 * 辿れない「準孤児」ページを見逃していた（2026-07-08判明・/katei-kyoshi・/partnerが該当）。
 * このテストは登録簿ファイルを参照プールから除外し、真の文脈的リンクの有無を判定する。
 */
import path from 'path';
import { walkSourceFiles, walkPageFiles, pageFileToRoute, countContextualInboundLinks } from '@/lib/internal-link-graph';

/**
 * 文脈的な内部リンクが無くても正当と判断済みの例外。
 * 追加する場合は「なぜ実質孤児で問題ないか」をコメントで残すこと（審査なしの抜け道にしない）。
 */
const NO_INBOUND_LINK_EXEMPT_ROUTES: Record<string, string> = {
  '/': 'ホームページ自体（常にルートとして直接アクセスされる）',
  '/admin/report': '認証必須のnoindex内部ツール（意図的にリンクしない設計）',
  '/admin/worklog': '認証必須のnoindex内部ツール（意図的にリンクしない設計）',
  '/admin/juku-reviews': '認証必須のnoindex内部ツール（意図的にリンクしない設計・R-1第3弾）',
};

describe('内部リンクグラフ監査（L-6）: 準孤児（登録簿のみに存在するページ）の検出', () => {
  const appDir = path.join(__dirname, '..');
  const srcDir = path.join(__dirname, '..', '..');
  const pageFiles = walkPageFiles(appDir);
  const candidateFiles = walkSourceFiles(srcDir);

  test('page.tsxが少なくとも1件は見つかる（テスト自体が空振りしていないことの確認）', () => {
    expect(pageFiles.length).toBeGreaterThan(0);
  });

  test.each(
    pageFiles
      .map((file) => [pageFileToRoute(appDir, file), file] as const)
      .filter((entry): entry is [string, string] => entry[0] !== null),
  )('%s: 実コンテンツからの文脈的な内部リンクを持つ、または理由付きの例外リストに登録されている', (route, file) => {
    const count = countContextualInboundLinks(route, file, candidateFiles);

    if (count === 0) {
      const exemptReason = NO_INBOUND_LINK_EXEMPT_ROUTES[route];
      expect(exemptReason).toBeDefined();
      return;
    }

    expect(count).toBeGreaterThan(0);
  });

  test('例外リストの全エントリが実在するルートを指している（死んだ例外の放置防止）', () => {
    const routes = new Set(
      pageFiles.map((f) => pageFileToRoute(appDir, f)).filter((r): r is string => r !== null),
    );
    for (const route of Object.keys(NO_INBOUND_LINK_EXEMPT_ROUTES)) {
      expect(routes.has(route)).toBe(true);
    }
  });
});
