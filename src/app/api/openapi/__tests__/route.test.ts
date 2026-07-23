/**
 * @jest-environment node
 *
 * OpenAPI仕様書(/api/openapi)の完全性監査(ZZ-6c)。
 *
 * 公開データ系のGETエンドポイントを新設・削除した際に openapi/route.ts の paths 定義を
 * 更新し忘れる drift を機械的に検知する回帰テスト。実際に /api/naishin/csv と /api/status が
 * llms.txt には記載済みなのに openapi の paths から漏れていた(監査で発見・本コミットで修正)。
 *
 * 除外対象(公開データAPIとして文書化しない = このリストに載っているものは監査対象外):
 * - フォーム送信/購読/配信系(副作用がありAI引用向けの「データ取得」ではない)
 * - webhook/admin(外部サービス・運営者専用)
 * - build-not-launch(未launch=未広報の内部機能)
 * - 画像/ICS等の非JSONバイナリ生成
 * - MCP(JSON-RPCで別途 /api/mcp として文書化・OpenAPIのRESTパス対象外)
 * - openapi自身(自己参照は不要)
 */
import fs from 'fs';
import path from 'path';
import { GET } from '@/app/api/openapi/route';

const API_ROOT = path.join(__dirname, '..', '..');

const EXCLUDED_ROUTES = new Set<string>([
  '/api/contact',
  '/api/unsubscribe',
  '/api/calendar',
  '/api/newsletter/preview',
  '/api/push/subscribe',
  '/api/push/unsubscribe',
  '/api/lead',
  '/api/billing/checkout',
  '/api/stripe/webhook',
  '/api/resend/webhook',
  '/api/admin/juku-reviews/moderate',
  '/api/juku-reviews',
  '/api/juku-reviews/submit',
  '/api/stats/submit',
  '/api/card',
  '/api/mcp',
  '/api/openapi',
]);

/** src/app/api配下のroute.tsを再帰列挙し、Next.jsのURLパス形式([code]→{code})に変換する。 */
function listApiRoutePaths(dir: string, prefix = '/api'): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const routes: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === '__tests__') continue;
    const childDir = path.join(dir, entry.name);
    const segment = entry.name.startsWith('[') && entry.name.endsWith(']')
      ? `{${entry.name.slice(1, -1)}}`
      : entry.name;
    const childPrefix = `${prefix}/${segment}`;
    if (fs.existsSync(path.join(childDir, 'route.ts'))) {
      routes.push(childPrefix);
    }
    routes.push(...listApiRoutePaths(childDir, childPrefix));
  }
  return routes;
}

describe('OpenAPI完全性監査(ZZ-6c)', () => {
  test('実在するroute.tsとopenapi.pathsの突合', async () => {
    const res = GET();
    const json = (await (res as Response).json()) as { paths: Record<string, unknown> };
    const specPaths = new Set(Object.keys(json.paths));

    const allRoutes = listApiRoutePaths(API_ROOT);
    const undocumented = allRoutes.filter((r) => !EXCLUDED_ROUTES.has(r) && !specPaths.has(r));

    expect(undocumented).toEqual([]);
  });

  test('除外リストのエントリは実在するroute.tsのみを指す(死んだ除外エントリの検知)', () => {
    const allRoutes = new Set(listApiRoutePaths(API_ROOT));
    const staleExclusions = [...EXCLUDED_ROUTES].filter((r) => !allRoutes.has(r));
    expect(staleExclusions).toEqual([]);
  });
});
