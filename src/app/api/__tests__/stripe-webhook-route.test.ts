/**
 * @jest-environment node
 *
 * /api/stripe/webhook（堀B・Stripeループの出口・実際の課金/APIキー発行が絡む最重要ルート）の契約テスト。
 * verifyStripeSignature/readStripeEnv/tierForPriceId自体はstripe.test.tsで既にカバー済みだが、
 * このルート自体のオーケストレーション(署名未設定→503・署名不一致→400・イベント種別ごとの
 * issueApiKey/sendApiKeyEmail/revokeApiKeysBySubscription呼び分け・内部エラーでも常に200を
 * 返してStripeの再送ループを止める設計)は無テストだった。全依存をモックし呼び出し引数を検証する。
 */
jest.mock('@/lib/stripe', () => ({
  readStripeEnv: jest.fn(),
  verifyStripeSignature: jest.fn(),
  tierForPriceId: jest.fn(),
}));
jest.mock('@/lib/api-keys', () => ({
  issueApiKey: jest.fn(),
  revokeApiKeysBySubscription: jest.fn(),
}));
jest.mock('@/lib/esp', () => ({ sendApiKeyEmail: jest.fn() }));

import { readStripeEnv, verifyStripeSignature } from '@/lib/stripe';
import { issueApiKey, revokeApiKeysBySubscription } from '@/lib/api-keys';
import { sendApiKeyEmail } from '@/lib/esp';
import { POST } from '@/app/api/stripe/webhook/route';

const mockedReadEnv = readStripeEnv as jest.MockedFunction<typeof readStripeEnv>;
const mockedVerify = verifyStripeSignature as jest.MockedFunction<typeof verifyStripeSignature>;
const mockedIssue = issueApiKey as jest.MockedFunction<typeof issueApiKey>;
const mockedRevoke = revokeApiKeysBySubscription as jest.MockedFunction<typeof revokeApiKeysBySubscription>;
const mockedSendEmail = sendApiKeyEmail as jest.MockedFunction<typeof sendApiKeyEmail>;

function req(payload: unknown, sig = 'valid-sig') {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return new Request('https://my-naishin.com/api/stripe/webhook', {
    method: 'POST',
    body,
    headers: sig ? { 'stripe-signature': sig } : {},
  });
}

describe('/api/stripe/webhook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedReadEnv.mockResolvedValue({
      secretKey: 'sk_test',
      webhookSecret: 'whsec_test',
      pricePro: 'price_pro',
      priceScale: 'price_scale',
    });
    mockedVerify.mockResolvedValue(true);
  });

  it('webhookSecret未設定なら503を返し署名検証すら試みない', async () => {
    mockedReadEnv.mockResolvedValue({ secretKey: undefined, webhookSecret: undefined, pricePro: undefined, priceScale: undefined });
    const res = await POST(req({ type: 'checkout.session.completed', data: { object: {} } }));
    expect(res.status).toBe(503);
    expect(mockedVerify).not.toHaveBeenCalled();
  });

  it('署名検証に失敗した場合は400を返し、以降の処理を一切行わない', async () => {
    mockedVerify.mockResolvedValue(false);
    const res = await POST(req({ type: 'checkout.session.completed', data: { object: { metadata: { tier: 'pro' } } } }));
    expect(res.status).toBe(400);
    expect(mockedIssue).not.toHaveBeenCalled();
  });

  it('署名検証OKでも不正なJSONは400を返す', async () => {
    const res = await POST(req('{not json'));
    expect(res.status).toBe(400);
    expect(mockedIssue).not.toHaveBeenCalled();
  });

  it('checkout.session.completed: metadata.tier・customer_email・stripe IDを正しくissueApiKeyへ渡す', async () => {
    mockedIssue.mockResolvedValue({ apiKey: 'plain-key-abc', tier: 'scale', keyPrefix: 'pfx', id: 1 } as never);
    const res = await POST(
      req({
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: { tier: 'scale' },
            customer_email: 'buyer@example.com',
            customer: 'cus_123',
            subscription: 'sub_456',
          },
        },
      })
    );
    expect(res.status).toBe(200);
    expect(mockedIssue).toHaveBeenCalledWith({
      tier: 'scale',
      email: 'buyer@example.com',
      label: 'stripe:scale',
      stripeCustomerId: 'cus_123',
      stripeSubscriptionId: 'sub_456',
    });
    expect(mockedSendEmail).toHaveBeenCalledWith('buyer@example.com', 'plain-key-abc', 'scale');
  });

  it('checkout.session.completed: metadata.tier未指定はproが既定になる', async () => {
    mockedIssue.mockResolvedValue(null);
    await POST(req({ type: 'checkout.session.completed', data: { object: { customer_email: 'x@example.com' } } }));
    expect(mockedIssue).toHaveBeenCalledWith(expect.objectContaining({ tier: 'pro' }));
  });

  it('checkout.session.completed: customer_details.emailからもメールを拾える(customer_email優先だが両方無ければこちら)', async () => {
    mockedIssue.mockResolvedValue({ apiKey: 'k', tier: 'pro' } as never);
    await POST(
      req({
        type: 'checkout.session.completed',
        data: { object: { customer_details: { email: 'fallback@example.com' } } },
      })
    );
    expect(mockedIssue).toHaveBeenCalledWith(expect.objectContaining({ email: 'fallback@example.com' }));
    expect(mockedSendEmail).toHaveBeenCalledWith('fallback@example.com', 'k', 'pro');
  });

  it('checkout.session.completed: issueApiKeyがnullを返す場合はsendApiKeyEmailを呼ばない(発行失敗時のメール誤送信防止)', async () => {
    mockedIssue.mockResolvedValue(null);
    const res = await POST(req({ type: 'checkout.session.completed', data: { object: { customer_email: 'x@example.com' } } }));
    expect(res.status).toBe(200);
    expect(mockedSendEmail).not.toHaveBeenCalled();
  });

  it('checkout.session.completed: emailが無い場合はキー発行してもsendApiKeyEmailを呼ばない', async () => {
    mockedIssue.mockResolvedValue({ apiKey: 'k', tier: 'pro' } as never);
    await POST(req({ type: 'checkout.session.completed', data: { object: {} } }));
    expect(mockedSendEmail).not.toHaveBeenCalled();
  });

  it('customer.subscription.deleted: obj.idをrevokeApiKeysBySubscriptionへ渡す', async () => {
    mockedRevoke.mockResolvedValue(true);
    const res = await POST(req({ type: 'customer.subscription.deleted', data: { object: { id: 'sub_789' } } }));
    expect(res.status).toBe(200);
    expect(mockedRevoke).toHaveBeenCalledWith('sub_789');
  });

  it('customer.subscription.deleted: idが無い場合はrevokeApiKeysBySubscriptionを呼ばない', async () => {
    await POST(req({ type: 'customer.subscription.deleted', data: { object: {} } }));
    expect(mockedRevoke).not.toHaveBeenCalled();
  });

  it('未知のevent.typeはissueApiKey/revokeApiKeysBySubscriptionいずれも呼ばず200を返す(素通し)', async () => {
    const res = await POST(req({ type: 'some.other.event', data: { object: {} } }));
    expect(res.status).toBe(200);
    expect(mockedIssue).not.toHaveBeenCalled();
    expect(mockedRevoke).not.toHaveBeenCalled();
  });

  it('ハンドラ内部でissueApiKeyが例外を投げても常に200を返す(Stripeの再送ループを止める設計)', async () => {
    mockedIssue.mockRejectedValue(new Error('D1 down'));
    const res = await POST(req({ type: 'checkout.session.completed', data: { object: { customer_email: 'x@example.com' } } }));
    expect(res.status).toBe(200);
    expect((await res.json())).toEqual({ received: true });
  });
});
