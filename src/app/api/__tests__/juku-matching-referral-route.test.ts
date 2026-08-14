/**
 * @jest-environment node
 *
 * /api/juku-matching/referral（保護者向け送客ボタンの公開受け口・Λ-7残作業/Ω-6）の契約テスト。
 * 「studentRefはサーバー側で生成する匿名UUIDのみを使い、ユーザー入力からのPII混入を構造的に
 * 防ぐ」という設計・「NEXT_PUBLIC_JUKU_SAAS_ENABLED!=='1'なら旗off・page.tsx側の404と二重に
 * API側でも防御する」という設計がいずれも無テストだった。recordReferralをモックし
 * 呼び出し引数(特にstudentRefの形式)を直接検証する。
 */
jest.mock('@/lib/juku-matching-db', () => ({ recordReferral: jest.fn() }));
import { recordReferral } from '@/lib/juku-matching-db';
import { POST } from '@/app/api/juku-matching/referral/route';

const mockedRecord = recordReferral as jest.MockedFunction<typeof recordReferral>;

let ipCounter = 0;
function freshIp(): string {
  ipCounter += 1;
  return `192.0.2.${ipCounter}`;
}

function postReq(body: unknown, headers: Record<string, string> = {}) {
  return new Request('https://my-naishin.com/api/juku-matching/referral', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'cf-connecting-ip': freshIp(), ...headers },
  }) as never;
}

describe('/api/juku-matching/referral', () => {
  const originalFlag = process.env.NEXT_PUBLIC_JUKU_SAAS_ENABLED;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_JUKU_SAAS_ENABLED = '1';
    mockedRecord.mockReset();
    mockedRecord.mockResolvedValue(42);
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_JUKU_SAAS_ENABLED = originalFlag;
  });

  it('旗off(未設定)ならnot_available・404を返しrecordReferralを呼ばない(page.tsx側の404と二重の防御)', async () => {
    delete process.env.NEXT_PUBLIC_JUKU_SAAS_ENABLED;
    const res = await POST(postReq({ jukuPartnerId: 1 }));
    expect(res.status).toBe(404);
    expect((await res.json()).error).toBe('not_available');
    expect(mockedRecord).not.toHaveBeenCalled();
  });

  it('旗on・妥当な入力でrecordReferralを呼びsuccess:trueを返す', async () => {
    const res = await POST(postReq({ jukuPartnerId: 1, prefectureCode: 'tokyo', format: 'online' }));
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
    expect(mockedRecord).toHaveBeenCalledTimes(1);
  });

  it('studentRefはユーザー入力を一切使わず"web-<UUID>"形式で自動生成される(PII混入の構造的防止)', async () => {
    // ユーザーがstudentRefらしきフィールドを紛れ込ませようとしても無視される
    await POST(postReq({ jukuPartnerId: 1, studentRef: 'attacker-injected-email@example.com' }));
    const passedInput = mockedRecord.mock.calls[0][0];
    expect(passedInput.studentRef).toMatch(/^web-[0-9a-f-]{36}$/);
    expect(passedInput.studentRef).not.toContain('attacker');
    expect(passedInput.studentRef).not.toContain('@example.com');
  });

  it('複数回呼んでもstudentRefは毎回異なる(使い回しによる紐付け防止)', async () => {
    await POST(postReq({ jukuPartnerId: 1 }));
    await POST(postReq({ jukuPartnerId: 1 }));
    const first = mockedRecord.mock.calls[0][0].studentRef;
    const second = mockedRecord.mock.calls[1][0].studentRef;
    expect(first).not.toBe(second);
  });

  it('jukuPartnerIdが数値でない場合は400を返す', async () => {
    const res = await POST(postReq({ jukuPartnerId: 'not-a-number' }));
    expect(res.status).toBe(400);
    expect(mockedRecord).not.toHaveBeenCalled();
  });

  it('formatが未知の値の場合はundefinedとして渡される(online/in-person以外は無視)', async () => {
    await POST(postReq({ jukuPartnerId: 1, format: 'fax' }));
    expect(mockedRecord.mock.calls[0][0].format).toBeUndefined();
  });

  it('prefectureCodeは40文字に切り詰められる', async () => {
    await POST(postReq({ jukuPartnerId: 1, prefectureCode: 'x'.repeat(100) }));
    expect(mockedRecord.mock.calls[0][0].prefectureCode).toHaveLength(40);
  });

  it('recordReferralがnullを返す場合(D1未設定等)は503を返す', async () => {
    mockedRecord.mockResolvedValue(null);
    const res = await POST(postReq({ jukuPartnerId: 1 }));
    expect(res.status).toBe(503);
  });

  it('不正なJSONは400を返す', async () => {
    const res = await POST(
      new Request('https://my-naishin.com/api/juku-matching/referral', {
        method: 'POST',
        body: '{not json',
        headers: { 'cf-connecting-ip': freshIp() },
      }) as never
    );
    expect(res.status).toBe(400);
    expect(mockedRecord).not.toHaveBeenCalled();
  });

  it('ボディが1024バイトを超えると413を返す', async () => {
    const res = await POST(postReq({ jukuPartnerId: 1, prefectureCode: 'x'.repeat(2000) }));
    expect(res.status).toBe(413);
    expect(mockedRecord).not.toHaveBeenCalled();
  });

  it('同一IPから60秒内に6件目を送るとrate_limited相当の429を返す', async () => {
    const ip = freshIp();
    let lastStatus = 0;
    for (let i = 0; i < 6; i++) {
      const res = await POST(postReq({ jukuPartnerId: 1 }, { 'cf-connecting-ip': ip }));
      lastStatus = res.status;
    }
    expect(lastStatus).toBe(429);
  });
});
