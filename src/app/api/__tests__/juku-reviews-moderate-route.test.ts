/**
 * @jest-environment node
 *
 * /api/admin/juku-reviews/moderate（塾口コミモデレーションAPI・TIER R-1第3弾）の契約テスト。
 * community-posts/moderateと同型のadmin認証+入力検証ゲートに加え、moderatorNoteの200文字
 * 切り詰めという固有ロジックを持つが無テストだった。moderateJukuReviewをモックし呼び出し
 * 引数を直接検証する。
 */
jest.mock('@/lib/juku-reviews-db', () => ({ moderateJukuReview: jest.fn() }));
import { moderateJukuReview } from '@/lib/juku-reviews-db';
import { POST } from '@/app/api/admin/juku-reviews/moderate/route';

const mockedModerate = moderateJukuReview as jest.MockedFunction<typeof moderateJukuReview>;

function req(body: unknown) {
  return new Request('https://my-naishin.com/api/admin/juku-reviews/moderate', {
    method: 'POST',
    body: JSON.stringify(body),
  }) as never;
}

describe('/api/admin/juku-reviews/moderate', () => {
  const originalToken = process.env.ADMIN_REPORT_TOKEN;

  beforeEach(() => {
    process.env.ADMIN_REPORT_TOKEN = 'test-admin-token';
    mockedModerate.mockReset();
  });

  afterAll(() => {
    process.env.ADMIN_REPORT_TOKEN = originalToken;
  });

  it('正しいtoken・妥当な入力でmoderateJukuReviewを呼びsuccess:trueを返す', async () => {
    mockedModerate.mockResolvedValue(true);
    const res = await POST(req({ token: 'test-admin-token', id: 7, currentStatus: 'pending', nextStatus: 'approved' }));
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
    expect(mockedModerate).toHaveBeenCalledWith(7, 'pending', 'approved', undefined);
  });

  it('moderatorNoteは200文字に切り詰められて渡される', async () => {
    mockedModerate.mockResolvedValue(true);
    const longNote = 'あ'.repeat(300);
    await POST(req({ token: 'test-admin-token', id: 7, currentStatus: 'pending', nextStatus: 'approved', moderatorNote: longNote }));
    const passedNote = mockedModerate.mock.calls[0][3];
    expect(passedNote).toHaveLength(200);
    expect(passedNote).toBe('あ'.repeat(200));
  });

  it('moderatorNoteが文字列でない場合はundefinedとして渡される', async () => {
    mockedModerate.mockResolvedValue(true);
    await POST(req({ token: 'test-admin-token', id: 7, currentStatus: 'pending', nextStatus: 'approved', moderatorNote: 12345 }));
    expect(mockedModerate.mock.calls[0][3]).toBeUndefined();
  });

  it('tokenが不一致の場合は401を返しmoderateJukuReviewを呼ばない', async () => {
    const res = await POST(req({ token: 'wrong', id: 7, currentStatus: 'pending', nextStatus: 'approved' }));
    expect(res.status).toBe(401);
    expect(mockedModerate).not.toHaveBeenCalled();
  });

  it('idが数値でない・0以下の場合は400を返す', async () => {
    for (const badId of ['x', 0, -5]) {
      const res = await POST(req({ token: 'test-admin-token', id: badId, currentStatus: 'pending', nextStatus: 'approved' }));
      expect(res.status).toBe(400);
    }
    expect(mockedModerate).not.toHaveBeenCalled();
  });

  it('未知のstatus値は400を返す(community-postsと違いapproved/rejected/pendingの3値のみ)', async () => {
    const res = await POST(req({ token: 'test-admin-token', id: 7, currentStatus: 'flagged', nextStatus: 'approved' }));
    expect(res.status).toBe(400);
    expect(mockedModerate).not.toHaveBeenCalled();
  });

  it('moderateJukuReviewがfalseを返す場合は400を返す', async () => {
    mockedModerate.mockResolvedValue(false);
    const res = await POST(req({ token: 'test-admin-token', id: 7, currentStatus: 'pending', nextStatus: 'approved' }));
    expect(res.status).toBe(400);
  });

  it('不正なJSONは400を返す', async () => {
    const res = await POST(
      new Request('https://my-naishin.com/api/admin/juku-reviews/moderate', { method: 'POST', body: '{not json' }) as never
    );
    expect(res.status).toBe(400);
    expect(mockedModerate).not.toHaveBeenCalled();
  });
});
