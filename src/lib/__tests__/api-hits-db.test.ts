// api-hits-db.ts: API/MCP匿名利用ログ(S13-A A-5)のD1一次記録。バインディング未設定(テスト/ビルド)
// 環境ではno-opで例外を投げないことを固定する(click-hop-db.test.ts/student-funnel-db.test.tsと同型)。

import { getApiHitsDailyRollup, getApiHitsTotalCount, persistApiHit } from '@/lib/api-hits-db';

describe('api-hits-db（Cloudflare D1バインディングが無い環境でのno-op契約）', () => {
  it('persistApiHitはfalseを返し例外を投げない', async () => {
    await expect(persistApiHit('mcp', 'test-agent', 'https://example.com/')).resolves.toBe(false);
  });

  it('空文字のendpointはfalseを返す', async () => {
    await expect(persistApiHit('   ')).resolves.toBe(false);
  });

  it('ua/refererが無くても例外を投げない', async () => {
    await expect(persistApiHit('naishin-index')).resolves.toBe(false);
  });

  it('getApiHitsDailyRollupは空配列を返す', async () => {
    await expect(getApiHitsDailyRollup(30)).resolves.toEqual([]);
  });

  it('getApiHitsTotalCountは0を返す', async () => {
    await expect(getApiHitsTotalCount(30)).resolves.toBe(0);
  });
});
