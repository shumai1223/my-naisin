/**
 * @jest-environment node
 *
 * Stripe連携の契約テスト(priceIdForTier/tierForPriceIdのマッピング + Webhook署名検証)。
 * verifyStripeSignatureの期待値はNode標準のcrypto.createHmac(Web Crypto実装とは独立した経路)で
 * 計算し、実装のHMAC計算自体が正しいことをクロスチェックする(resend-webhook.test.tsと同型)。
 * globalThis.crypto.subtle(Web Crypto)はjsdom既定環境には無くnode環境が必要。
 */
import { createHmac } from 'crypto';
import { priceIdForTier, tierForPriceId, verifyStripeSignature, type StripeEnv } from '../stripe';

const ENV: StripeEnv = {
  secretKey: 'sk_test_dummy',
  webhookSecret: 'whsec_dummy',
  pricePro: 'price_pro_123',
  priceBusiness: 'price_business_789',
  priceScale: 'price_scale_456',
};

function computeSignature(secret: string, timestamp: string, payload: string): string {
  return createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
}

describe('priceIdForTier', () => {
  it('pro/business/scaleはそれぞれ対応するprice IDを返す', () => {
    expect(priceIdForTier('pro', ENV)).toBe('price_pro_123');
    expect(priceIdForTier('business', ENV)).toBe('price_business_789');
    expect(priceIdForTier('scale', ENV)).toBe('price_scale_456');
  });

  it('anonymous/freeはnull(セルフ決済の対象外)', () => {
    expect(priceIdForTier('anonymous', ENV)).toBeNull();
    expect(priceIdForTier('free', ENV)).toBeNull();
  });

  it('envに該当price未設定ならnull', () => {
    expect(priceIdForTier('pro', { ...ENV, pricePro: undefined })).toBeNull();
    expect(priceIdForTier('business', { ...ENV, priceBusiness: undefined })).toBeNull();
    expect(priceIdForTier('scale', { ...ENV, priceScale: undefined })).toBeNull();
  });
});

describe('tierForPriceId', () => {
  it('priceIdForTierとの往復が一致する(pro/business/scale)', () => {
    for (const tier of ['pro', 'business', 'scale'] as const) {
      const priceId = priceIdForTier(tier, ENV);
      expect(priceId).not.toBeNull();
      expect(tierForPriceId(priceId ?? undefined, ENV)).toBe(tier);
    }
  });

  it('未知のpriceIdはnull(不正なWebhookデータで誤ってティアを発行しない)', () => {
    expect(tierForPriceId('price_unknown_999', ENV)).toBeNull();
  });

  it('priceId未指定はnull', () => {
    expect(tierForPriceId(undefined, ENV)).toBeNull();
  });

  it('env側のprice未設定時は一致させない(空文字比較で誤マッチしない)', () => {
    const envNoScale: StripeEnv = { ...ENV, priceScale: undefined };
    expect(tierForPriceId('', envNoScale)).toBeNull();
  });
});

describe('verifyStripeSignature', () => {
  const secret = 'whsec_test_secret_abc';
  const payload = JSON.stringify({ type: 'checkout.session.completed', data: { object: { id: 'cs_test_1' } } });

  it('正しい署名・許容範囲内のタイムスタンプはtrue', async () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const sig = computeSignature(secret, String(nowSec), payload);
    const ok = await verifyStripeSignature(payload, `t=${nowSec},v1=${sig}`, secret, { now: nowSec * 1000 });
    expect(ok).toBe(true);
  });

  it('複数署名(鍵ローテーション想定)のうち一致するものがあればtrue', async () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const sig = computeSignature(secret, String(nowSec), payload);
    const ok = await verifyStripeSignature(payload, `t=${nowSec},v1=wrongsig,v1=${sig}`, secret, { now: nowSec * 1000 });
    expect(ok).toBe(true);
  });

  it('シークレットが違うと署名不一致でfalse(Webhook偽造の防止)', async () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const sig = computeSignature(secret, String(nowSec), payload);
    const ok = await verifyStripeSignature(payload, `t=${nowSec},v1=${sig}`, 'whsec_different_secret', { now: nowSec * 1000 });
    expect(ok).toBe(false);
  });

  it('ペイロードが改ざんされると署名不一致でfalse', async () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const sig = computeSignature(secret, String(nowSec), payload);
    const ok = await verifyStripeSignature(payload + 'tampered', `t=${nowSec},v1=${sig}`, secret, { now: nowSec * 1000 });
    expect(ok).toBe(false);
  });

  it('許容誤差を超えたタイムスタンプはfalse(リプレイ緩和)', async () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const oldTs = nowSec - 600; // 10分前
    const sig = computeSignature(secret, String(oldTs), payload);
    const ok = await verifyStripeSignature(payload, `t=${oldTs},v1=${sig}`, secret, {
      now: nowSec * 1000,
      toleranceSec: 300,
    });
    expect(ok).toBe(false);
  });

  it('ヘッダ・secretが欠けている場合はfalse', async () => {
    const nowSec = Math.floor(Date.now() / 1000);
    const sig = computeSignature(secret, String(nowSec), payload);
    expect(await verifyStripeSignature(payload, null, secret)).toBe(false);
    expect(await verifyStripeSignature(payload, `t=${nowSec},v1=${sig}`, '')).toBe(false);
  });

  it('t=やv1=を含まない不正な形式のヘッダはfalse', async () => {
    expect(await verifyStripeSignature(payload, 'garbage-header', secret)).toBe(false);
    expect(await verifyStripeSignature(payload, 'v1=abc', secret)).toBe(false); // t=欠落
  });

  it('タイムスタンプが数値でない場合はfalse', async () => {
    expect(await verifyStripeSignature(payload, 't=not-a-number,v1=abc', secret)).toBe(false);
  });
});
