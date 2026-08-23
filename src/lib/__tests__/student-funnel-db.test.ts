// student-funnel-db.ts: 生徒ファネル(S12-1)のD1一次記録。バインディング未設定(テスト/ビルド)
// 環境ではno-opで例外を投げないことを固定する(parent-funnel-db.test.tsと同型)。

import { getStudentFunnelEventCounts, persistStudentFunnelEvent } from '@/lib/student-funnel-db';

describe('student-funnel-db（Cloudflare D1バインディングが無い環境でのno-op契約）', () => {
  it('persistStudentFunnelEventはfalseを返し例外を投げない', async () => {
    await expect(
      persistStudentFunnelEvent({ event: 'grade_self_identify', grade: 'koukou', tool: 'hyotei-heikin' })
    ).resolves.toBe(false);
  });

  it('getStudentFunnelEventCountsは全イベント種別が0の既定値を返す', async () => {
    const counts = await getStudentFunnelEventCounts(28);
    expect(counts).toEqual({ grade_self_identify: 0, university_bridge_click: 0 });
  });
});
