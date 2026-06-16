/**
 * 配信停止（ワンクリック・改ざん不可）＝名簿（堀A）を「合法に配信できる資産」にする。
 *
 * 日本の特定電子メール法／一般的なメール配信の作法では、受信者がいつでも簡単に配信停止できる導線が必須。
 * 歓迎メール・一斉配信のフッターに署名付きの停止リンクを載せ、/api/unsubscribe で D1 の unsubscribed=1 を立てる。
 *
 * 改ざん対策：メールアドレスを UNSUB_SECRET で HMAC-SHA256 署名し、トークンが一致した時だけ停止を受け付ける
 *（生メールをURLに置くだけでは第三者が任意の人を勝手に停止できてしまうため）。
 * UNSUB_SECRET 未設定なら署名トークンを作れない＝停止リンクをメールに載せない（安全側・現状は無効）。
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

const SITE_URL = 'https://my-naishin.com';

/** メールアドレスの正規化（大小・前後空白を無視して同一視）。 */
function normalize(email: string): string {
  return email.trim().toLowerCase();
}

/** 配信停止トークン（HMAC-SHA256 の先頭32桁）。UNSUB_SECRET 未設定なら null。 */
export function unsubToken(email: string): string | null {
  const secret = process.env.UNSUB_SECRET;
  if (!secret) return null;
  try {
    return createHmac('sha256', secret).update(normalize(email)).digest('hex').slice(0, 32);
  } catch {
    return null;
  }
}

/** トークン検証（定数時間比較）。 */
export function verifyUnsub(email: string, token: string): boolean {
  const expected = unsubToken(email);
  if (!expected || !token) return false;
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(token);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** 署名付きの配信停止URL。UNSUB_SECRET 未設定なら null（メールに載せない）。 */
export function unsubscribeUrl(email: string): string | null {
  const t = unsubToken(email);
  if (!t) return null;
  return `${SITE_URL}/api/unsubscribe?e=${encodeURIComponent(normalize(email))}&t=${t}`;
}
