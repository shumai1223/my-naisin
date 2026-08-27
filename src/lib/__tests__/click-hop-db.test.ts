// click-hop-db.ts: クリックホップ通過率(出血6②)のD1一次記録。バインディング未設定(テスト/ビルド)
// 環境ではno-opで例外を投げないことを固定する(student-funnel-db.test.tsと同型)。

import { getClickHopCompletionCounts, persistClickHopCompletion } from '@/lib/click-hop-db';

describe('click-hop-db（Cloudflare D1バインディングが無い環境でのno-op契約）', () => {
  it('persistClickHopCompletionはfalseを返し例外を投げない', async () => {
    await expect(persistClickHopCompletion('zkai-banner')).resolves.toBe(false);
  });

  it('空文字のaffiliateIdはfalseを返す', async () => {
    await expect(persistClickHopCompletion('   ')).resolves.toBe(false);
  });

  it('getClickHopCompletionCountsは空オブジェクトを返す', async () => {
    await expect(getClickHopCompletionCounts(28)).resolves.toEqual({});
  });
});
