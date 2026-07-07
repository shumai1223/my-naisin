/**
 * 名簿化（堀A）の送信ロジック。
 *
 * 目的：受験期に来る数万人の「使い捨てトラフィック」を、保護者・受験生の“資産（名簿）”へ変える。
 * 受験期(11–2月)に本人が動けない「季節パラドックス」に備え、夏〜秋に set-and-forget で仕込む導線。
 *
 * 配信経路は contact.ts と同じ2段構え（バックエンド不要で必ず運営者に届く設計）：
 *  1) サーバー（/api/lead）が LEAD_WEBHOOK_URL（無ければ CONTACT_WEBHOOK_URL）へ転送できれば delivered:true。
 *  2) 未設定／失敗なら delivered:false を返し、呼び出し側で mailto フォールバックする
 *     → シークレット未設定の今この瞬間でも、登録された見込み客を取りこぼさない。
 */

import { CONTACT_EMAIL } from '@/lib/contact';

export type LeadSource =
  | 'result'
  | 'gap-target'
  | 'hensachi'
  | 'hensachi-kyoka-betsu'
  | 'hensachi-shiboukou'
  | 'hensachi-moshi'
  | 'hensachi-gyakusan'
  | 'hyotei-heikin'
  | 'prefecture'
  | 'juku-shindan'
  | 'home';

export interface LeadPayload {
  email: string;
  /** 同意（必須）。false の場合は送信しない。 */
  consent: boolean;
  /** 文脈（セグメント用）。低い結果直後の高インテント・リードを識別する。 */
  source: LeadSource;
  prefectureCode?: string;
  prefectureName?: string;
  /** 内申点（素点/換算後）。名簿のセグメントに使う。 */
  score?: number;
  /** 目標内申。 */
  target?: number;
  /** 目標までのギャップ（正＝不足）。 */
  gap?: number;
  /** 任意メモ（学年・志望校など）。 */
  note?: string;
}

export type LeadResult = { ok: boolean; delivered: boolean; error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** /api/lead へ送信し、Webhook配信されたか（delivered）を返す。 */
export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  try {
    const res = await fetch('/api/lead', {
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
 * 運営者宛に「登録希望」メールを開く（バックエンド未設定でも届く確実な経路）。
 * delivered:false のときの保険として使う。
 */
export function openLeadMailtoFallback(payload: LeadPayload): void {
  if (typeof window === 'undefined') return;
  const lines = [
    `メール: ${payload.email}`,
    `経路: ${payload.source}`,
    payload.prefectureName ? `都道府県: ${payload.prefectureName}` : '',
    typeof payload.score === 'number' ? `内申: ${payload.score}` : '',
    typeof payload.target === 'number' ? `目標: ${payload.target}` : '',
    typeof payload.gap === 'number' ? `ギャップ: ${payload.gap}` : '',
    payload.note ? `メモ: ${payload.note}` : '',
  ].filter(Boolean);
  const subject = '【My Naishin】受験情報の受け取り登録';
  const body = `以下の内容で受け取り登録を希望します。\n\n${lines.join('\n')}\n`;
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
}
