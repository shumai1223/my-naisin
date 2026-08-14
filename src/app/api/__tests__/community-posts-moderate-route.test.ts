/**
 * @jest-environment node
 *
 * /api/admin/community-posts/moderate（保護者コミュニティ投稿モデレーションAPI・Λ-14）の契約テスト。
 * canTransitionCommunityPostStatus自体はcommunity-posts.test.tsで、no-op安全設計は
 * community-posts-db側のパターンで既にカバー済みと推定されるが、このルート自体が持つ
 * 認証(ADMIN_REPORT_TOKEN一致)・入力検証(JSON parse/id/status enum)の短絡順序は無テストだった。
 * moderateCommunityPostをモックし、認証を通過した後の呼び出し引数・successレスポンスまで確認する。
 */
jest.mock('@/lib/community-posts-db', () => ({ moderateCommunityPost: jest.fn() }));
import { moderateCommunityPost } from '@/lib/community-posts-db';
import { POST } from '@/app/api/admin/community-posts/moderate/route';

const mockedModerate = moderateCommunityPost as jest.MockedFunction<typeof moderateCommunityPost>;

function req(body: unknown) {
  return new Request('https://my-naishin.com/api/admin/community-posts/moderate', {
    method: 'POST',
    body: JSON.stringify(body),
  }) as never;
}

describe('/api/admin/community-posts/moderate', () => {
  const originalToken = process.env.ADMIN_REPORT_TOKEN;

  beforeEach(() => {
    process.env.ADMIN_REPORT_TOKEN = 'test-admin-token';
    mockedModerate.mockReset();
  });

  afterAll(() => {
    process.env.ADMIN_REPORT_TOKEN = originalToken;
  });

  it('正しいtoken・妥当なid/statusでmoderateCommunityPostを呼びsuccess:trueを返す', async () => {
    mockedModerate.mockResolvedValue(true);
    const res = await POST(req({ token: 'test-admin-token', id: 42, currentStatus: 'pending', nextStatus: 'approved' }));
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
    expect(mockedModerate).toHaveBeenCalledWith(42, 'pending', 'approved');
  });

  it('tokenが不一致の場合は401を返しmoderateCommunityPostを呼ばない', async () => {
    const res = await POST(req({ token: 'wrong-token', id: 42, currentStatus: 'pending', nextStatus: 'approved' }));
    expect(res.status).toBe(401);
    expect(mockedModerate).not.toHaveBeenCalled();
  });

  it('tokenが未指定の場合は401を返す', async () => {
    const res = await POST(req({ id: 42, currentStatus: 'pending', nextStatus: 'approved' }));
    expect(res.status).toBe(401);
  });

  it('ADMIN_REPORT_TOKEN未設定(サーバ側)の場合、どんなtokenでも401(可用性よりセキュリティ優先)', async () => {
    delete process.env.ADMIN_REPORT_TOKEN;
    const res = await POST(req({ token: 'anything', id: 42, currentStatus: 'pending', nextStatus: 'approved' }));
    expect(res.status).toBe(401);
    expect(mockedModerate).not.toHaveBeenCalled();
  });

  it('idが数値でない・0以下の場合は認証OKでも400を返す', async () => {
    for (const badId of ['not-a-number', 0, -1]) {
      const res = await POST(req({ token: 'test-admin-token', id: badId, currentStatus: 'pending', nextStatus: 'approved' }));
      expect(res.status).toBe(400);
    }
    expect(mockedModerate).not.toHaveBeenCalled();
  });

  it('currentStatus/nextStatusが未知の値の場合は400を返す', async () => {
    const res = await POST(
      req({ token: 'test-admin-token', id: 42, currentStatus: 'not-a-real-status', nextStatus: 'approved' })
    );
    expect(res.status).toBe(400);
    expect(mockedModerate).not.toHaveBeenCalled();
  });

  it('moderateCommunityPostがfalseを返す場合(遷移不許可/保存失敗)は400を返す', async () => {
    mockedModerate.mockResolvedValue(false);
    const res = await POST(req({ token: 'test-admin-token', id: 42, currentStatus: 'pending', nextStatus: 'approved' }));
    expect(res.status).toBe(400);
  });

  it('不正なJSONは400を返し、認証すら試みない前に弾く', async () => {
    const res = await POST(new Request('https://my-naishin.com/api/admin/community-posts/moderate', {
      method: 'POST',
      body: '{not json',
    }) as never);
    expect(res.status).toBe(400);
    expect(mockedModerate).not.toHaveBeenCalled();
  });
});
