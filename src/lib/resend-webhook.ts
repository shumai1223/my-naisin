/**
 * Resend Webhook（Svix採用）の署名検証（TIER Q-4）。stripe.tsのverifyStripeSignatureと同じ
 * 「raw fetch + Web Crypto・SDK不要」方針。実装前にWebSearchでResend/Svixの実仕様を確認済み：
 *
 *  - ヘッダ: svix-id / svix-timestamp / svix-signature
 *  - 署名対象: `${svix-id}.${svix-timestamp}.${payload}`（生ボディ）
 *  - シークレット: `whsec_<base64>` 形式。base64部分をデコードしたバイト列をHMAC-SHA256の鍵にする
 *    （Stripeのように秘密鍵文字列をそのままUTF-8エンコードするのではない点に注意）。
 *  - 署名は base64（Stripeの16進とは異なる）。
 *  - svix-signatureヘッダは空白区切りで複数の `v1,<base64>` を含みうる（鍵ローテーション用）。
 *    いずれか1つが一致すれば検証成功。
 *  - タイムスタンプの許容誤差（既定300秒）でリプレイを緩和。
 *
 * 参照: Resend Verify Webhooks Requests / Svix Verifying Payloads Manually（2026-07-09時点の公開ドキュメント）。
 */

function base64ToBytes(b64: string): Uint8Array | null {
  try {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function hmacSha256Base64(keyBytes: Uint8Array, message: string): Promise<string> {
  const key = await globalThis.crypto.subtle.importKey('raw', keyBytes as BufferSource, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await globalThis.crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return bytesToBase64(new Uint8Array(sig));
}

/** 一定時間比較（タイミング攻撃の緩和）。stripe.tsと同型。 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export interface SvixHeaders {
  svixId: string | null;
  svixTimestamp: string | null;
  svixSignature: string | null;
}

/**
 * Resend（Svix）Webhookの署名を検証する。純粋関数（now注入可・テスト可能）。
 * secretは `whsec_...` 形式を想定するが、プレフィックス無しでも動作する（防御的）。
 */
export async function verifyResendWebhookSignature(
  payload: string,
  headers: SvixHeaders,
  secret: string,
  opts?: { toleranceSec?: number; now?: number }
): Promise<boolean> {
  if (!secret || !headers.svixId || !headers.svixTimestamp || !headers.svixSignature) return false;

  const tolerance = opts?.toleranceSec ?? 300;
  const nowSec = Math.floor((opts?.now ?? Date.now()) / 1000);
  const ts = Number(headers.svixTimestamp);
  if (!Number.isFinite(ts) || Math.abs(nowSec - ts) > tolerance) return false;

  const secretB64 = secret.startsWith('whsec_') ? secret.slice('whsec_'.length) : secret;
  const keyBytes = base64ToBytes(secretB64);
  if (!keyBytes) return false;

  const signedContent = `${headers.svixId}.${headers.svixTimestamp}.${payload}`;
  const expected = await hmacSha256Base64(keyBytes, signedContent);

  const candidates = headers.svixSignature.split(' ').map((s) => s.trim()).filter(Boolean);
  for (const candidate of candidates) {
    const commaIdx = candidate.indexOf(',');
    if (commaIdx === -1) continue;
    const version = candidate.slice(0, commaIdx);
    const sig = candidate.slice(commaIdx + 1);
    if (version !== 'v1' || !sig) continue;
    if (timingSafeEqual(expected, sig)) return true;
  }
  return false;
}
