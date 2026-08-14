/**
 * @jest-environment node
 *
 * /api/admin/juku-matching/referral-status（送客ログの状態更新API・Λ-7）の契約テスト。
 * このAPIはcontacted/declinedのみを許可し、convertedへの遷移はcommission APIが専任で
 * 自動遷移させる設計(二重の遷移経路を作らない)というビジネスルールが無テストだった。
 */
jest.mock('@/lib/juku-matching-db', () => ({ updateReferralStatus: jest.fn() }));
import { updateReferralStatus } from '@/lib/juku-matching-db';
import { POST } from '@/app/api/admin/juku-matching/referral-status/route';

const mockedUpdate = updateReferralStatus as jest.MockedFunction<typeof updateReferralStatus>;

function req(body: unknown) {
  return new Request('https://my-naishin.com/api/admin/juku-matching/referral-status', {
    method: 'POST',
    body: JSON.stringify(body),
  }) as never;
}

describe('/api/admin/juku-matching/referral-status', () => {
  const originalToken = process.env.ADMIN_REPORT_TOKEN;

  beforeEach(() => {
    process.env.ADMIN_REPORT_TOKEN = 'test-admin-token';
    mockedUpdate.mockReset();
  });

  afterAll(() => {
    process.env.ADMIN_REPORT_TOKEN = originalToken;
  });

  it.each(['contacted', 'declined'])('正しいtoken・status=%sでupdateReferralStatusを呼びsuccess:trueを返す', async (status) => {
    mockedUpdate.mockResolvedValue(true);
    const res = await POST(req({ token: 'test-admin-token', referralId: 8, status }));
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
    expect(mockedUpdate).toHaveBeenCalledWith(8, status);
  });

  it('status=convertedはこのAPIでは拒否される(commission APIが専任で自動遷移させる設計)', async () => {
    const res = await POST(req({ token: 'test-admin-token', referralId: 8, status: 'converted' }));
    expect(res.status).toBe(400);
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it('未知のstatus値は400を返す', async () => {
    const res = await POST(req({ token: 'test-admin-token', referralId: 8, status: 'not-a-real-status' }));
    expect(res.status).toBe(400);
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it('tokenが不一致の場合は401を返しupdateReferralStatusを呼ばない', async () => {
    const res = await POST(req({ token: 'wrong', referralId: 8, status: 'contacted' }));
    expect(res.status).toBe(401);
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it('ADMIN_REPORT_TOKEN未設定時はどんなtokenでも401', async () => {
    delete process.env.ADMIN_REPORT_TOKEN;
    const res = await POST(req({ token: 'anything', referralId: 8, status: 'contacted' }));
    expect(res.status).toBe(401);
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it('referralIdが数値でない・0以下の場合は400を返す', async () => {
    for (const bad of ['x', 0, -1]) {
      const res = await POST(req({ token: 'test-admin-token', referralId: bad, status: 'contacted' }));
      expect(res.status).toBe(400);
    }
    expect(mockedUpdate).not.toHaveBeenCalled();
  });

  it('updateReferralStatusがfalseを返す場合は400を返す', async () => {
    mockedUpdate.mockResolvedValue(false);
    const res = await POST(req({ token: 'test-admin-token', referralId: 8, status: 'contacted' }));
    expect(res.status).toBe(400);
  });

  it('不正なJSONは400を返す', async () => {
    const res = await POST(
      new Request('https://my-naishin.com/api/admin/juku-matching/referral-status', { method: 'POST', body: '{not json' }) as never
    );
    expect(res.status).toBe(400);
    expect(mockedUpdate).not.toHaveBeenCalled();
  });
});
