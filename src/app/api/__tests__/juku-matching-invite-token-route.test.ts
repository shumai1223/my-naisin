/**
 * @jest-environment node
 *
 * /api/admin/juku-matching/partner/invite-token（提携塾の招待トークン発行API・Λ-7）の契約テスト。
 * 平文トークンはこのレスポンスでしか取得できない設計(DBにはハッシュのみ保存)のため、
 * 認証ゲートの正確性は特に重要だが無テストだった。
 */
jest.mock('@/lib/juku-matching-db', () => ({ issuePartnerInviteToken: jest.fn() }));
import { issuePartnerInviteToken } from '@/lib/juku-matching-db';
import { POST } from '@/app/api/admin/juku-matching/partner/invite-token/route';

const mockedIssue = issuePartnerInviteToken as jest.MockedFunction<typeof issuePartnerInviteToken>;

function req(body: unknown) {
  return new Request('https://my-naishin.com/api/admin/juku-matching/partner/invite-token', {
    method: 'POST',
    body: JSON.stringify(body),
  }) as never;
}

describe('/api/admin/juku-matching/partner/invite-token', () => {
  const originalToken = process.env.ADMIN_REPORT_TOKEN;

  beforeEach(() => {
    process.env.ADMIN_REPORT_TOKEN = 'test-admin-token';
    mockedIssue.mockReset();
  });

  afterAll(() => {
    process.env.ADMIN_REPORT_TOKEN = originalToken;
  });

  it('正しいtoken・妥当なjukuPartnerIdでissuePartnerInviteTokenを呼びsuccess:true+inviteTokenを返す', async () => {
    mockedIssue.mockResolvedValue('plain-invite-token-abc123');
    const res = await POST(req({ token: 'test-admin-token', jukuPartnerId: 5 }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, inviteToken: 'plain-invite-token-abc123' });
    expect(mockedIssue).toHaveBeenCalledWith(5);
  });

  it('tokenが不一致の場合は401を返しissuePartnerInviteTokenを呼ばない(招待トークン発行の防御)', async () => {
    const res = await POST(req({ token: 'wrong', jukuPartnerId: 5 }));
    expect(res.status).toBe(401);
    expect(mockedIssue).not.toHaveBeenCalled();
  });

  it('ADMIN_REPORT_TOKEN未設定時はどんなtokenでも401', async () => {
    delete process.env.ADMIN_REPORT_TOKEN;
    const res = await POST(req({ token: 'anything', jukuPartnerId: 5 }));
    expect(res.status).toBe(401);
    expect(mockedIssue).not.toHaveBeenCalled();
  });

  it('jukuPartnerIdが数値でない・0以下の場合は400を返す', async () => {
    for (const bad of ['x', 0, -1]) {
      const res = await POST(req({ token: 'test-admin-token', jukuPartnerId: bad }));
      expect(res.status).toBe(400);
    }
    expect(mockedIssue).not.toHaveBeenCalled();
  });

  it('issuePartnerInviteTokenがnullを返す場合(発行失敗)は400を返す', async () => {
    mockedIssue.mockResolvedValue(null);
    const res = await POST(req({ token: 'test-admin-token', jukuPartnerId: 999 }));
    expect(res.status).toBe(400);
  });

  it('不正なJSONは400を返す', async () => {
    const res = await POST(
      new Request('https://my-naishin.com/api/admin/juku-matching/partner/invite-token', {
        method: 'POST',
        body: '{not json',
      }) as never
    );
    expect(res.status).toBe(400);
    expect(mockedIssue).not.toHaveBeenCalled();
  });
});
