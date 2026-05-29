/**
 * お問い合わせ・不具合報告・誤り報告フォームの共通送信ロジック。
 *
 * 配信経路は2段構え：
 *  1) サーバー（/api/contact）が CONTACT_WEBHOOK_URL（Discord/Slack互換）へ転送できれば delivered:true。
 *  2) 転送先が未設定／失敗なら delivered:false を返し、呼び出し側で mailto フォールバックする。
 * これにより「シークレット未設定でも必ず運営者に届く（メールアプリ経由）」を担保する。
 */

export const CONTACT_EMAIL = 'naishin.dev@gmail.com';

export type ContactResult = { ok: boolean; delivered: boolean; error?: string };

/** /api/contact へ送信し、Webhook配信されたか（delivered）を返す。 */
export async function submitContact(payload: Record<string, unknown>): Promise<ContactResult> {
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = (await res.json().catch(() => ({}))) as { delivered?: boolean; error?: string };
    if (!res.ok) return { ok: false, delivered: false, error: data?.error };
    return { ok: true, delivered: Boolean(data?.delivered) };
  } catch {
    return { ok: false, delivered: false };
  }
}

/**
 * ユーザーのメールアプリで運営者宛メールを開く（バックエンド不要の確実な配信経路）。
 * メールアプリが未設定の環境向けに、画面側でも CONTACT_EMAIL を併記すること。
 */
export function openMailtoFallback(subject: string, body: string): void {
  if (typeof window === 'undefined') return;
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
}
