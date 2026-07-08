/**
 * @jest-environment node
 *
 * Resend Webhook（Svix）署名検証の契約テスト（TIER Q-4）。
 * 期待値はNode標準のcrypto.createHmac（Web Crypto実装とは独立した経路）で計算し、
 * 実装のHMAC計算自体が正しいことをクロスチェックする。
 * globalThis.crypto.subtle（Web Crypto）はjsdom既定環境には無くnode環境が必要。
 */
import { createHmac } from 'crypto';
import { verifyResendWebhookSignature } from '../resend-webhook';

const SECRET_B64 = Buffer.from('test-signing-secret-bytes-0123456789').toString('base64');
const SECRET = `whsec_${SECRET_B64}`;

function computeSignature(id: string, timestamp: string, payload: string): string {
  const keyBytes = Buffer.from(SECRET_B64, 'base64');
  const signedContent = `${id}.${timestamp}.${payload}`;
  return createHmac('sha256', keyBytes).update(signedContent).digest('base64');
}

describe('verifyResendWebhookSignature', () => {
  const payload = JSON.stringify({ type: 'email.opened', data: { email_id: 'abc123' } });
  const svixId = 'msg_test123';

  it('正しい署名・許容範囲内のタイムスタンプはtrue', async () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const svixTimestamp = String(nowSec);
    const sig = computeSignature(svixId, svixTimestamp, payload);

    const ok = await verifyResendWebhookSignature(
      payload,
      { svixId, svixTimestamp, svixSignature: `v1,${sig}` },
      SECRET,
      { now: nowSec * 1000 }
    );
    expect(ok).toBe(true);
  });

  it('複数署名（鍵ローテーション想定）のうち一致するものがあればtrue', async () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const svixTimestamp = String(nowSec);
    const sig = computeSignature(svixId, svixTimestamp, payload);

    const ok = await verifyResendWebhookSignature(
      payload,
      { svixId, svixTimestamp, svixSignature: `v1,wrongsig v1,${sig}` },
      SECRET,
      { now: nowSec * 1000 }
    );
    expect(ok).toBe(true);
  });

  it('シークレットが違うと署名不一致でfalse', async () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const svixTimestamp = String(nowSec);
    const sig = computeSignature(svixId, svixTimestamp, payload);

    const ok = await verifyResendWebhookSignature(
      payload,
      { svixId, svixTimestamp, svixSignature: `v1,${sig}` },
      `whsec_${Buffer.from('different-secret').toString('base64')}`,
      { now: nowSec * 1000 }
    );
    expect(ok).toBe(false);
  });

  it('ペイロードが改ざんされると署名不一致でfalse', async () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const svixTimestamp = String(nowSec);
    const sig = computeSignature(svixId, svixTimestamp, payload);

    const ok = await verifyResendWebhookSignature(
      payload + 'tampered',
      { svixId, svixTimestamp, svixSignature: `v1,${sig}` },
      SECRET,
      { now: nowSec * 1000 }
    );
    expect(ok).toBe(false);
  });

  it('許容誤差を超えたタイムスタンプはfalse（リプレイ緩和）', async () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const oldTimestamp = String(nowSec - 600); // 10分前
    const sig = computeSignature(svixId, oldTimestamp, payload);

    const ok = await verifyResendWebhookSignature(
      payload,
      { svixId, svixTimestamp: oldTimestamp, svixSignature: `v1,${sig}` },
      SECRET,
      { now: nowSec * 1000, toleranceSec: 300 }
    );
    expect(ok).toBe(false);
  });

  it('ヘッダが欠けている・secret未設定はfalse', async () => {
    expect(await verifyResendWebhookSignature(payload, { svixId: null, svixTimestamp: '1', svixSignature: 'v1,x' }, SECRET)).toBe(false);
    expect(await verifyResendWebhookSignature(payload, { svixId: 'a', svixTimestamp: null, svixSignature: 'v1,x' }, SECRET)).toBe(false);
    expect(await verifyResendWebhookSignature(payload, { svixId: 'a', svixTimestamp: '1', svixSignature: null }, SECRET)).toBe(false);
    expect(await verifyResendWebhookSignature(payload, { svixId: 'a', svixTimestamp: '1', svixSignature: 'v1,x' }, '')).toBe(false);
  });

  it('whsec_プレフィックス無しのsecretでも動作する（防御的）', async () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const svixTimestamp = String(nowSec);
    const sig = computeSignature(svixId, svixTimestamp, payload);

    const ok = await verifyResendWebhookSignature(
      payload,
      { svixId, svixTimestamp, svixSignature: `v1,${sig}` },
      SECRET_B64,
      { now: nowSec * 1000 }
    );
    expect(ok).toBe(true);
  });
});
