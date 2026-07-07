/**
 * @jest-environment node
 *
 * 動的ルート（[param]）のgenerateStaticParams必須チェック（H-7）。
 *
 * 背景（[[opennext-ssg-1102-gotcha]]）：`[param]`ページにgenerateStaticParamsが無いと
 * 毎リクエスト/毎クロールでフルSSRになり、Worker CPU/メモリ超過（Error 1102）がトラフィック増で
 * 経時的にエスカレートする。過去に実際に本番で多発した障害クラスの再発防止。
 * 新しい`[param]`ページを追加した瞬間にこのテストが失敗する＝レビュー無しでも機械的に検知する。
 */
import fs from 'fs';
import path from 'path';

/**
 * generateStaticParamsが無くても1102リスクが無いと判断済みの例外。
 * 追加する場合は「なぜ安全か」をコメントで残すこと（審査なしの抜け道にしない）。
 */
const SSG_EXEMPT_ROUTES: Record<string, string> = {
  // 軽量なリダイレクトのみ（重い計算・DBアクセス無し）。next.configのエッジredirectでも保護済み。
  '/[prefecture]/reverse': 'permanentRedirectのみのリダイレクトページ（[[opennext-ssg-1102-gotcha]]で対象外と確認済み）',
};

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      walk(full, acc);
    } else if (entry.name === 'page.tsx') {
      acc.push(full);
    }
  }
  return acc;
}

function routeFromFile(appDir: string, file: string): string {
  const rel = path.relative(appDir, file).replace(/\\/g, '/').replace(/\/?page\.tsx$/, '');
  return '/' + rel;
}

const GENERATE_STATIC_PARAMS_RE = /export\s+(async\s+)?function\s+generateStaticParams|export\s+const\s+generateStaticParams\s*[:=]/;

describe('動的ルートのgenerateStaticParams必須チェック（H-7）', () => {
  const appDir = path.join(__dirname, '..');
  const dynamicPageFiles = walk(appDir).filter((f) => f.includes('['));

  test('動的ルート（[param]）のpage.tsxが少なくとも1件は見つかる（テスト自体が空振りしていないことの確認）', () => {
    expect(dynamicPageFiles.length).toBeGreaterThan(0);
  });

  test.each(dynamicPageFiles.map((file) => [routeFromFile(appDir, file), file] as const))(
    '%s: generateStaticParamsを持つ、または理由付きの例外リストに登録されている',
    (route, file) => {
      const content = fs.readFileSync(file, 'utf8');
      const hasGenerateStaticParams = GENERATE_STATIC_PARAMS_RE.test(content);
      if (hasGenerateStaticParams) return;

      const exemptReason = SSG_EXEMPT_ROUTES[route];
      expect(exemptReason).toBeDefined();
      // 例外は「なぜ安全か」を裏付ける実装（リダイレクトのみ等）になっているか最低限確認する。
      expect(content).toMatch(/permanentRedirect|redirect\(/);
    }
  );

  test('例外リストの全エントリが実在するルートを指している（死んだ例外の放置防止）', () => {
    const routes = new Set(dynamicPageFiles.map((f) => routeFromFile(appDir, f)));
    for (const route of Object.keys(SSG_EXEMPT_ROUTES)) {
      expect(routes.has(route)).toBe(true);
    }
  });
});
