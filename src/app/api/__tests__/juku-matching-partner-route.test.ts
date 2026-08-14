/**
 * @jest-environment node
 *
 * /api/admin/juku-matching/partner（提携塾の新規登録API・Λ-7 build-not-launch）の契約テスト。
 * 同型のadmin認証ゲート+createJukuPartner呼び出しの短絡順序が無テストだった。
 */
jest.mock('@/lib/juku-matching-db', () => ({ createJukuPartner: jest.fn() }));
import { createJukuPartner } from '@/lib/juku-matching-db';
import { POST } from '@/app/api/admin/juku-matching/partner/route';

const mockedCreate = createJukuPartner as jest.MockedFunction<typeof createJukuPartner>;

function req(body: unknown) {
  return new Request('https://my-naishin.com/api/admin/juku-matching/partner', {
    method: 'POST',
    body: JSON.stringify(body),
  }) as never;
}

describe('/api/admin/juku-matching/partner', () => {
  const originalToken = process.env.ADMIN_REPORT_TOKEN;

  beforeEach(() => {
    process.env.ADMIN_REPORT_TOKEN = 'test-admin-token';
    mockedCreate.mockReset();
  });

  afterAll(() => {
    process.env.ADMIN_REPORT_TOKEN = originalToken;
  });

  it('正しいtoken・妥当な入力でcreateJukuPartnerを呼びsuccess:true+idを返す', async () => {
    mockedCreate.mockResolvedValue(12);
    const res = await POST(req({ token: 'test-admin-token', name: 'テスト塾', commissionRateBps: 500 }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, id: 12 });
    expect(mockedCreate).toHaveBeenCalledWith('テスト塾', 500);
  });

  it('tokenが不一致の場合は401を返しcreateJukuPartnerを呼ばない', async () => {
    const res = await POST(req({ token: 'wrong', name: 'テスト塾', commissionRateBps: 500 }));
    expect(res.status).toBe(401);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it('ADMIN_REPORT_TOKEN未設定時はどんなtokenでも401', async () => {
    delete process.env.ADMIN_REPORT_TOKEN;
    const res = await POST(req({ token: 'anything', name: 'テスト塾', commissionRateBps: 500 }));
    expect(res.status).toBe(401);
    expect(mockedCreate).not.toHaveBeenCalled();
  });

  it('nameが文字列でない場合は空文字として渡す', async () => {
    mockedCreate.mockResolvedValue(null);
    await POST(req({ token: 'test-admin-token', name: 12345, commissionRateBps: 500 }));
    expect(mockedCreate).toHaveBeenCalledWith('', 500);
  });

  it('createJukuPartnerがnullを返す場合(塾名/take-rate不正)は400を返す', async () => {
    mockedCreate.mockResolvedValue(null);
    const res = await POST(req({ token: 'test-admin-token', name: '', commissionRateBps: -1 }));
    expect(res.status).toBe(400);
  });

  it('不正なJSONは400を返す', async () => {
    const res = await POST(
      new Request('https://my-naishin.com/api/admin/juku-matching/partner', { method: 'POST', body: '{not json' }) as never
    );
    expect(res.status).toBe(400);
    expect(mockedCreate).not.toHaveBeenCalled();
  });
});
