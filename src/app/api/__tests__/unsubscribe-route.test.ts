/**
 * @jest-environment node
 *
 * /api/unsubscribe（ワンクリック配信停止）の契約テスト。verifyUnsub自体は
 * unsubscribe.test.tsで既にカバー済みだが、ルートハンドラの「署名不一致・メール形式不正・
 * トークン欠落はいずれもmarkUnsubscribedを呼ばずにエラーページを返す」というセキュリティ上
 * 重要な短絡ロジック(第三者が他人を勝手に配信停止できないようにする防御線)は無テストだった。
 * markUnsubscribedをモックし、呼び出しの有無を直接検証する。
 */
import { unsubToken } from '@/lib/unsubscribe';

jest.mock('@/lib/leads-db', () => ({ markUnsubscribed: jest.fn() }));
import { markUnsubscribed } from '@/lib/leads-db';
import { GET } from '@/app/api/unsubscribe/route';

const mockedMarkUnsubscribed = markUnsubscribed as jest.MockedFunction<typeof markUnsubscribed>;

describe('/api/unsubscribe', () => {
  const originalSecret = process.env.UNSUB_SECRET;

  beforeEach(() => {
    process.env.UNSUB_SECRET = 'test-secret-for-unsubscribe-route';
    mockedMarkUnsubscribed.mockReset();
    mockedMarkUnsubscribed.mockResolvedValue(true);
  });

  afterAll(() => {
    process.env.UNSUB_SECRET = originalSecret;
  });

  function req(email: string, token: string) {
    return new Request(
      `https://my-naishin.com/api/unsubscribe?e=${encodeURIComponent(email)}&t=${encodeURIComponent(token)}`
    ) as never;
  }

  it('正しい署名の場合、markUnsubscribedを呼び「配信を停止しました」ページを返す', async () => {
    const email = 'parent@example.com';
    const token = unsubToken(email)!;
    const res = await GET(req(email, token));
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('配信を停止しました');
    expect(mockedMarkUnsubscribed).toHaveBeenCalledWith(email);
  });

  it('署名が一致しない場合、markUnsubscribedを呼ばずエラーページを返す(第三者による勝手な停止を防ぐ)', async () => {
    const email = 'parent@example.com';
    const res = await GET(req(email, 'totally-wrong-token'));
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('リンクが無効です');
    expect(mockedMarkUnsubscribed).not.toHaveBeenCalled();
  });

  it('別人のメールアドレス宛のトークンでは検証に失敗し、markUnsubscribedを呼ばない', async () => {
    const victimEmail = 'victim@example.com';
    const attackerToken = unsubToken('attacker@example.com')!;
    const res = await GET(req(victimEmail, attackerToken));
    const html = await res.text();
    expect(html).toContain('リンクが無効です');
    expect(mockedMarkUnsubscribed).not.toHaveBeenCalled();
  });

  it('不正な形式のメールアドレスはトークン検証すら行わずエラーページを返す', async () => {
    const res = await GET(req('not-an-email', 'anything'));
    const html = await res.text();
    expect(html).toContain('リンクが無効です');
    expect(mockedMarkUnsubscribed).not.toHaveBeenCalled();
  });

  it('トークンパラメータが欠落している場合もエラーページを返す', async () => {
    const res = await GET(new Request('https://my-naishin.com/api/unsubscribe?e=parent%40example.com') as never);
    const html = await res.text();
    expect(html).toContain('リンクが無効です');
    expect(mockedMarkUnsubscribed).not.toHaveBeenCalled();
  });
});
