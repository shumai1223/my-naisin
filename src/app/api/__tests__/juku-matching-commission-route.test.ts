/**
 * @jest-environment node
 *
 * /api/admin/juku-matching/commission（送客の成約報告API・Λ-7 build-not-launch）の契約テスト。
 * recordCommissionEntry自体の金額計算ロジックはjuku-matching-db側で別途カバーされるべきだが、
 * このルート自体が持つadmin認証+referralId検証+recordCommissionEntry呼び出しの短絡順序は
 * 無テストだった。金銭が絡む記録APIのためadmin認証ゲートの堅牢性は特に重要。
 */
jest.mock('@/lib/juku-matching-db', () => ({ recordCommissionEntry: jest.fn() }));
import { recordCommissionEntry } from '@/lib/juku-matching-db';
import { POST } from '@/app/api/admin/juku-matching/commission/route';

const mockedRecord = recordCommissionEntry as jest.MockedFunction<typeof recordCommissionEntry>;

function req(body: unknown) {
  return new Request('https://my-naishin.com/api/admin/juku-matching/commission', {
    method: 'POST',
    body: JSON.stringify(body),
  }) as never;
}

describe('/api/admin/juku-matching/commission', () => {
  const originalToken = process.env.ADMIN_REPORT_TOKEN;

  beforeEach(() => {
    process.env.ADMIN_REPORT_TOKEN = 'test-admin-token';
    mockedRecord.mockReset();
  });

  afterAll(() => {
    process.env.ADMIN_REPORT_TOKEN = originalToken;
  });

  it('正しいtoken・妥当な入力でrecordCommissionEntryを呼びsuccess:true+結果を返す', async () => {
    mockedRecord.mockResolvedValue({ commissionEntryId: 99, commissionAmountYen: 15000 });
    const res = await POST(req({ token: 'test-admin-token', referralId: 3, grossAmountYen: 300000, billingPeriod: '2026-08' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ success: true, commissionEntryId: 99, commissionAmountYen: 15000 });
    expect(mockedRecord).toHaveBeenCalledWith({ referralId: 3, grossAmountYen: 300000, billingPeriod: '2026-08' });
  });

  it('tokenが不一致の場合は401を返しrecordCommissionEntryを呼ばない(金銭記録の防御)', async () => {
    const res = await POST(req({ token: 'wrong-token', referralId: 3, grossAmountYen: 300000, billingPeriod: '2026-08' }));
    expect(res.status).toBe(401);
    expect(mockedRecord).not.toHaveBeenCalled();
  });

  it('ADMIN_REPORT_TOKEN未設定時はどんなtokenでも401', async () => {
    delete process.env.ADMIN_REPORT_TOKEN;
    const res = await POST(req({ token: 'anything', referralId: 3, grossAmountYen: 300000, billingPeriod: '2026-08' }));
    expect(res.status).toBe(401);
    expect(mockedRecord).not.toHaveBeenCalled();
  });

  it('referralIdが数値でない・0以下の場合は400を返す', async () => {
    for (const bad of ['x', 0, -1]) {
      const res = await POST(req({ token: 'test-admin-token', referralId: bad, grossAmountYen: 300000, billingPeriod: '2026-08' }));
      expect(res.status).toBe(400);
    }
    expect(mockedRecord).not.toHaveBeenCalled();
  });

  it('recordCommissionEntryがnullを返す場合(金額/請求月不正・見つからない)は400を返す', async () => {
    mockedRecord.mockResolvedValue(null);
    const res = await POST(req({ token: 'test-admin-token', referralId: 3, grossAmountYen: -100, billingPeriod: 'invalid' }));
    expect(res.status).toBe(400);
  });

  it('billingPeriodが文字列でない場合は空文字として渡す', async () => {
    mockedRecord.mockResolvedValue(null);
    await POST(req({ token: 'test-admin-token', referralId: 3, grossAmountYen: 300000, billingPeriod: 12345 }));
    expect(mockedRecord).toHaveBeenCalledWith({ referralId: 3, grossAmountYen: 300000, billingPeriod: '' });
  });

  it('不正なJSONは400を返す', async () => {
    const res = await POST(
      new Request('https://my-naishin.com/api/admin/juku-matching/commission', { method: 'POST', body: '{not json' }) as never
    );
    expect(res.status).toBe(400);
    expect(mockedRecord).not.toHaveBeenCalled();
  });
});
