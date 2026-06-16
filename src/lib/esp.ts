/**
 * メール配信基盤（ESP）＝堀A（名簿）の「配信できる」化。
 *
 * 北極星（[[fable5-master-plan-2026-06]]）：「配信できない名簿は資産でない」。
 * これまでは /api/lead が運営者へ Webhook 通知するだけで、登録者本人へ1通も届かなかった
 *（＝名簿velocity が測れず、再収穫もできない）。本モジュールは Resend（ESP）で
 *  ① 登録者へ歓迎メール（最初の接点＝到達性の確立＋即時の再接触）
 *  ② 運営者へ通知メール
 * を送る。RESEND_API_KEY 未設定なら全て no-op（既存の Webhook/mailto 経路はそのまま）。
 *
 * env：
 *  - RESEND_API_KEY   … Resend の API キー（設定された瞬間に配信が点火）
 *  - LEAD_FROM_EMAIL  … 差出人（例: 'My Naishin <info@my-naishin.com>'）。未設定は noreply 既定。
 *  - CONTACT_EMAIL    … 運営者宛通知の宛先（contact.ts）。
 *
 * Cloudflare Workers の fetch で動く（追加SDK不要）。失敗はユーザー体験に影響させない（握りつぶす）。
 */

import { CONTACT_EMAIL } from '@/lib/contact';
import { LIST_BENEFITS } from '@/lib/broadcast-templates';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const SITE_URL = 'https://my-naishin.com';

export interface LeadEmailData {
  email: string;
  source: string;
  prefectureCode: string;
  prefectureName: string;
  score?: number;
  target?: number;
  gap?: number;
  note?: string;
}

/** ESP（Resend）が設定済みか。 */
export function espConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function fromAddress(): string {
  return process.env.LEAD_FROM_EMAIL || 'My Naishin <noreply@my-naishin.com>';
}

interface ResendPayload {
  from: string;
  to: string[];
  subject: string;
  html: string;
  reply_to?: string;
}

async function sendViaResend(payload: ResendPayload): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error('Resend send failed:', err);
    return false;
  }
}

function esc(s: string): string {
  return s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string));
}

/** 登録者の文脈（県・内申・目標）を1行に。空なら省略。 */
function contextLine(d: LeadEmailData): string {
  const parts: string[] = [];
  if (d.prefectureName) parts.push(`${esc(d.prefectureName)}`);
  if (typeof d.score === 'number') parts.push(`現在の内申 ${d.score}`);
  if (typeof d.target === 'number') parts.push(`目標 ${d.target}`);
  if (typeof d.gap === 'number' && d.gap > 0) parts.push(`あと ${d.gap}点`);
  return parts.join('・');
}

/** 登録者への歓迎メール（最初の接点＝到達性の確立）。 */
export async function sendLeadWelcome(d: LeadEmailData): Promise<boolean> {
  const ctx = contextLine(d);
  const prefPath = d.prefectureCode ? `${SITE_URL}/${esc(d.prefectureCode)}/naishin` : `${SITE_URL}/`;
  const html = `
<div style="font-family:-apple-system,'Segoe UI',Roboto,'Hiragino Kaku Gothic ProN',sans-serif;max-width:560px;margin:0 auto;color:#1e293b;line-height:1.7">
  <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:24px;border-radius:16px 16px 0 0;color:#fff">
    <div style="font-size:13px;opacity:.85">My Naishin（内申点 計算サイト）</div>
    <div style="font-size:20px;font-weight:700;margin-top:4px">受け取り登録ありがとうございます</div>
  </div>
  <div style="border:1px solid #e2e8f0;border-top:0;border-radius:0 0 16px 16px;padding:24px">
    <p>受験本番まで、お子さまの受験を後押しする情報を無料でお届けします。受け取れるのは：</p>
    <ul style="padding-left:18px;margin:8px 0 14px">
      ${LIST_BENEFITS.map((b) => `<li>${esc(b)}</li>`).join('')}
    </ul>
    ${ctx ? `<p style="background:#f1f5f9;border-radius:10px;padding:12px 14px;font-size:14px">あなたの記録：<strong>${ctx}</strong></p>` : ''}
    <p style="margin-top:18px;font-weight:700">まずはここから</p>
    <ul style="padding-left:18px">
      <li><a href="${prefPath}" style="color:#4f46e5">内申点を計算・確認する</a></li>
      <li><a href="${SITE_URL}/reverse" style="color:#4f46e5">志望校から必要な当日点を逆算する</a></li>
      <li><a href="${SITE_URL}/hiyou" style="color:#4f46e5">高校〜大学の教育費・支援制度を確認する</a></li>
    </ul>
    <p style="font-size:12px;color:#94a3b8;margin-top:22px">
      このメールに心当たりがない場合は破棄してください。配信の停止をご希望の場合は、このメールにそのまま返信してください。
    </p>
  </div>
</div>`.trim();

  return sendViaResend({
    from: fromAddress(),
    to: [d.email],
    subject: '【My Naishin】受け取り登録ありがとうございます（受験情報をお届けします）',
    html,
    reply_to: CONTACT_EMAIL,
  });
}

/** 運営者への通知メール（Webhook と二重でも可・取りこぼし防止）。 */
export async function sendOwnerNotify(d: LeadEmailData): Promise<boolean> {
  const ctx = contextLine(d) || '-';
  const html = `
<div style="font-family:sans-serif;line-height:1.6">
  <h3>📇 新規リード（My Naishin / 名簿）</h3>
  <ul>
    <li>メール: <strong>${esc(d.email)}</strong></li>
    <li>経路: ${esc(d.source) || '-'}</li>
    <li>文脈: ${ctx}</li>
    ${d.note ? `<li>メモ: ${esc(d.note)}</li>` : ''}
  </ul>
</div>`.trim();

  return sendViaResend({
    from: fromAddress(),
    to: [CONTACT_EMAIL],
    subject: `【My Naishin】新規リード: ${d.email}`,
    html,
    reply_to: d.email,
  });
}

/**
 * 登録者への歓迎＋運営者への通知をまとめて送る。
 * 返り値 delivered=歓迎メール送信成功（=本人に1通届いた＝名簿として有効）。
 */
export async function sendLeadEmails(d: LeadEmailData): Promise<{ delivered: boolean; owner: boolean }> {
  if (!espConfigured()) return { delivered: false, owner: false };
  const [welcome, owner] = await Promise.all([sendLeadWelcome(d), sendOwnerNotify(d)]);
  return { delivered: welcome, owner };
}
