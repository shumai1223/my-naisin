/**
 * @jest-environment node
 *
 * Stripe課金ループ（署名検証・price→tier）、出典信頼度判定、ティア機能マトリクスの不変条件。
 * Web Crypto(HMAC) を使うため node 環境で実行する。
 */

import { createHmac } from 'crypto';

import { verifyStripeSignature, tierForPriceId, priceIdForTier, type StripeEnv } from '../stripe';
import { isOfficialSourceUrl, sourceTrustOf, sourceTrustLabel } from '../source-trust';
import { TIER_POLICIES, TIER_CAPABILITY_MATRIX } from '../api-tiers';

describe('verifyStripeSignature（Webhook署名）', () => {
  const secret = 'whsec_test_secret';
  const payload = '{"id":"evt_1","type":"checkout.session.completed"}';
  const t = 1_700_000_000;
  const validSig = createHmac('sha256', secret).update(`${t}.${payload}`).digest('hex');
  const header = `t=${t},v1=${validSig}`;
  const now = t * 1000;

  test('正しい署名・許容時間内は true', async () => {
    expect(await verifyStripeSignature(payload, header, secret, { now })).toBe(true);
  });
  test('ペイロード改ざんは false', async () => {
    expect(await verifyStripeSignature(payload + 'x', header, secret, { now })).toBe(false);
  });
  test('シークレット違いは false', async () => {
    expect(await verifyStripeSignature(payload, header, 'whsec_wrong', { now })).toBe(false);
  });
  test('古いタイムスタンプ（許容超過）は false（リプレイ緩和）', async () => {
    expect(await verifyStripeSignature(payload, header, secret, { now: (t + 10_000) * 1000 })).toBe(false);
  });
  test('ヘッダ欠落・不正形式は false', async () => {
    expect(await verifyStripeSignature(payload, null, secret, { now })).toBe(false);
    expect(await verifyStripeSignature(payload, 'garbage', secret, { now })).toBe(false);
  });
});

describe('price ↔ tier マッピング', () => {
  const env: StripeEnv = { pricePro: 'price_pro', priceScale: 'price_scale' };
  test('tierForPriceId', () => {
    expect(tierForPriceId('price_pro', env)).toBe('pro');
    expect(tierForPriceId('price_scale', env)).toBe('scale');
    expect(tierForPriceId('price_unknown', env)).toBeNull();
    expect(tierForPriceId(undefined, env)).toBeNull();
  });
  test('priceIdForTier（無料系はnull）', () => {
    expect(priceIdForTier('pro', env)).toBe('price_pro');
    expect(priceIdForTier('scale', env)).toBe('price_scale');
    expect(priceIdForTier('free', env)).toBeNull();
    expect(priceIdForTier('anonymous', env)).toBeNull();
  });
});

describe('source-trust（出典の一次照合判定）', () => {
  test('教委/県公式ドメインのみ official', () => {
    expect(isOfficialSourceUrl('https://www.pref.kanagawa.jp/docs/hr4/senbatsu2024.html')).toBe(true);
    expect(isOfficialSourceUrl('https://www.hyogo-c.ed.jp/~koko-bo/')).toBe(true);
    expect(isOfficialSourceUrl('https://www.kyoiku.metro.tokyo.lg.jp/admission/x.html')).toBe(true);
    expect(isOfficialSourceUrl('https://czemi.benesse.ne.jp/open/nyushi/x')).toBe(false);
    expect(isOfficialSourceUrl('https://jyuke-labo.com/x')).toBe(false);
    expect(isOfficialSourceUrl(undefined)).toBe(false);
  });
  test('sourceTrustOf / sourceTrustLabel', () => {
    expect(sourceTrustOf({ sourceUrl: 'https://www.pref.osaka.lg.jp/x' })).toBe('official');
    expect(sourceTrustOf({ sourceUrl: 'https://czemi.benesse.ne.jp/x' })).toBe('provisional');
    expect(sourceTrustOf({})).toBe('none');

    const official = sourceTrustLabel({ name: '大阪府', sourceUrl: 'https://www.pref.osaka.lg.jp/x' });
    expect(official?.badge).toBe('公式');
    expect(official?.note).toBeUndefined();

    const prov = sourceTrustLabel({ name: '群馬県', sourceUrl: 'https://jyuke-labo.com/x' });
    expect(prov?.badge).toBe('一次照合中');
    expect(prov?.note).toContain('群馬県');

    expect(sourceTrustLabel({ sourceUrl: undefined })).toBeNull();
  });
});

describe('TIER_CAPABILITY_MATRIX（フリーミアムの線引き＝金を払う理由）', () => {
  const cap = (needle: string) => TIER_CAPABILITY_MATRIX.find((c) => c.label.includes(needle))!;
  test('per-query API は全ティアで使える（GEOの燃料を止めない）', () => {
    expect(TIER_CAPABILITY_MATRIX[0].has(TIER_POLICIES.anonymous)).toBe(true);
    expect(TIER_CAPABILITY_MATRIX[0].has(TIER_POLICIES.free)).toBe(true);
  });
  test('出典明記なし は pro/scale のみ（無料は出典必須）', () => {
    const c = cap('出典明記なし');
    expect(c.has(TIER_POLICIES.anonymous)).toBe(false);
    expect(c.has(TIER_POLICIES.free)).toBe(false);
    expect(c.has(TIER_POLICIES.pro)).toBe(true);
    expect(c.has(TIER_POLICIES.scale)).toBe(true);
  });
  test('データ再配布ライセンス は scale のみ', () => {
    const c = cap('再配布');
    expect(c.has(TIER_POLICIES.pro)).toBe(false);
    expect(c.has(TIER_POLICIES.scale)).toBe(true);
  });
  test('優先サポート/SLA は無料側にはない', () => {
    const c = cap('SLA');
    expect(c.has(TIER_POLICIES.free)).toBe(false);
    expect(c.has(TIER_POLICIES.pro)).toBe(true);
  });
});
