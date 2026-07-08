/**
 * @jest-environment node
 *
 * Resend Webhook受け口（/api/resend/webhook）の契約テスト（TIER Q-4）。
 * getCloudflareContextはWorkers外（テスト環境）では例外を投げてprocess.envにフォールバックする
 * （resend-webhook route/email-events-db.tsの実装と同じ経路）ため、process.envで環境変数を設定する。
 */
import { createHmac } from 'crypto';
import { POST } from '@/app/api/resend/webhook/route';

const SECRET_B64 = Buffer.from('test-webhook-secret-bytes-0123456789').toString('base64');
const SECRET = `whsec_${SECRET_B64}`;

function computeSignature(id: string, timestamp: string, payload: string): string {
  const keyBytes = Buffer.from(SECRET_B64, 'base64');
  const signedContent = `${id}.${timestamp}.${payload}`;
  return createHmac('sha256', keyBytes).update(signedContent).digest('base64');
}

function webhookReq(payload: string, headers: Record<string, string>) {
  return new Request('https://my-naishin.com/api/resend/webhook', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: payload,
  });
}

describe('/api/resend/webhook 契約', () => {
  const originalSecret = process.env.RESEND_WEBHOOK_SECRET;

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.RESEND_WEBHOOK_SECRET;
    else process.env.RESEND_WEBHOOK_SECRET = originalSecret;
  });

  test('RESEND_WEBHOOK_SECRET未設定は503', async () => {
    delete process.env.RESEND_WEBHOOK_SECRET;
    const res = await POST(webhookReq('{}', { 'svix-id': 'a', 'svix-timestamp': '1', 'svix-signature': 'v1,x' }));
    expect(res.status).toBe(503);
  });

  test('署名不正は400', async () => {
    process.env.RESEND_WEBHOOK_SECRET = SECRET;
    const res = await POST(webhookReq('{}', { 'svix-id': 'a', 'svix-timestamp': String(Math.floor(Date.now() / 1000)), 'svix-signature': 'v1,wrongsig' }));
    expect(res.status).toBe(400);
  });

  test('署名が正当なら200・received:true', async () => {
    process.env.RESEND_WEBHOOK_SECRET = SECRET;
    const svixId = 'msg_1';
    const svixTimestamp = String(Math.floor(Date.now() / 1000));
    const payload = JSON.stringify({
      type: 'email.opened',
      data: { email_id: 'em_1', to: ['a@b.com'], tags: [{ name: 'course_step', value: '3' }] },
    });
    const sig = computeSignature(svixId, svixTimestamp, payload);

    const res = await POST(webhookReq(payload, { 'svix-id': svixId, 'svix-timestamp': svixTimestamp, 'svix-signature': `v1,${sig}` }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.received).toBe(true);
  });

  test('署名が正当でもJSONが不正なら400', async () => {
    process.env.RESEND_WEBHOOK_SECRET = SECRET;
    const svixId = 'msg_2';
    const svixTimestamp = String(Math.floor(Date.now() / 1000));
    const payload = 'not-json{';
    const sig = computeSignature(svixId, svixTimestamp, payload);

    const res = await POST(webhookReq(payload, { 'svix-id': svixId, 'svix-timestamp': svixTimestamp, 'svix-signature': `v1,${sig}` }));
    expect(res.status).toBe(400);
  });
});
