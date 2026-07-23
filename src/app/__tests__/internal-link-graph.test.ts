/**
 * @jest-environment node
 *
 * 内部リンクグラフ監査（TIER L-6→S-8で「薄い面」ゲートに昇格）: 全静的ページが、実際に
 * レンダリングされるページ・コンポーネントのどこかから文脈的にリンクされているかを検知する回帰テスト。
 *
 * 既存の check-orphans.mjs（報告専用・常にexit 0）は src/lib/page-registry.ts
 * （sitemap.ts が読む全ルートの文字列リテラル配列）自体を参照プールに含んでいたため、
 * 登録さえされていれば「リンクされている」と誤判定し、実際にはどこからもクリックで
 * 辿れない「準孤児」ページを見逃していた（2026-07-08判明・/katei-kyoshi・/partnerが該当）。
 * このテストは登録簿ファイルを参照プールから除外し、真の文脈的リンクの有無を判定する。
 *
 * S-8（2026-07-11）: scripts/link-graph-report.ts による実測で「被リンク1件以下」を
 * バックログ上の「薄い面」の定義としていたため、しきい値を0件超→1件超（=2件以上）へ引き上げ、
 * 新規ページが薄いまま追加されるのを機械的に防ぐハードゲートへ昇格した。
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
  '/juken-chokuzen-check': 'ZZ-8d：季節限定の予約公開ページ（resolveSeason()がwinter/last-minuteの時のみ公開・それ以外はnotFound()）。公開前は意図的にどこからもリンクしない設計。11月の公開解禁時に他ページからの内部リンクも追加する',
  '/advisor': 'ZZ-3c：旗付きUI（NEXT_PUBLIC_ADVISOR_ENABLED=1になるまでnotFound()・noindex）。build-not-launchのため公開判断前は意図的にどこからもリンクしない',
};

/** 「薄い面」判定のしきい値（この件数以下は例外リスト登録が必須）。scripts/link-graph-report.tsと同じ定義。 */
const THIN_THRESHOLD = 1;

describe('内部リンクグラフ監査（L-6→S-8）: 準孤児・薄い面（登録簿のみ/被リンク1件以下）の検出', () => {
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
  )(`%s: 被リンク数が${THIN_THRESHOLD}件を超える、または理由付きの例外リストに登録されている`, (route, file) => {
    const count = countContextualInboundLinks(route, file, candidateFiles);

    if (count <= THIN_THRESHOLD) {
      const exemptReason = NO_INBOUND_LINK_EXEMPT_ROUTES[route];
      expect(exemptReason).toBeDefined();
      return;
    }

    expect(count).toBeGreaterThan(THIN_THRESHOLD);
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
