/**
 * 月1ニュースレター／季節配信の HTML レンダラ（堀A＝名簿を「配信できる資産」にする・P4-1）。
 *
 * 北極星（[[fable5-master-plan-2026-06]]）：名簿velocity がKPI。配信の“中身”は broadcast-templates.ts に
 * 単一ソース化済み。本モジュールはそれを ESP（Resend）で送れる HTML/件名/プレーン本文に変換する純関数群。
 *  - 県名・配信月で軽くパーソナライズ（差し込み）。
 *  - 特定電子メール法に必要な「配信停止リンク」をフッターに必ず載せる（unsubscribe.ts の署名URL）。
 *  - 数値・断定的な期日は持たない（県・年度で変わる＝捏造ゼロ）。
 *
 * 使い手：
 *  - /api/newsletter/preview（ブラウザでテンプレを確認）
 *  - scripts/newsletter.ts（D1の購読者へ Resend batch 配信）
 *  - esp.ts と同じく RESEND_API_KEY が無ければ送信は no-op（レンダリングは常に可能）。
 */

import {
  getBroadcastTemplate,
  getMonthlyMessage,
  type BroadcastTemplate,
  type BroadcastTrigger,
  type Audience,
} from '@/lib/broadcast-templates';
import { unsubscribeUrl } from '@/lib/unsubscribe';

/**
 * レンダラが必要とする最小形（件名・本文・CTA）。
 * BroadcastTemplate も MONTHLY_CALENDAR の AudienceMessage も、これを満たすのでそのまま描画できる。
 */
export type RenderableBroadcast = Pick<BroadcastTemplate, 'subject' | 'body' | 'cta'>;

const SITE_URL = 'https://my-naishin.com';

export interface NewsletterContext {
  /** 県名（差し込み・任意）。指定すると冒頭に地域向けの一文を添える。 */
  prefectureName?: string;
  /** 配信月ラベル（例: '2026年7月'）。件名の先頭に付ける。 */
  monthLabel?: string;
  /** 配信停止リンク用のメール（あればフッターに署名付きリンクを載せる）。 */
  email?: string;
}

function esc(s: string): string {
  return s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string));
}

/** 件名（配信月ラベルがあれば先頭に付ける）。 */
export function renderNewsletterSubject(template: RenderableBroadcast, ctx: NewsletterContext = {}): string {
  const prefix = ctx.monthLabel ? `[${ctx.monthLabel}] ` : '';
  return `${prefix}${template.subject}`;
}

/** プレーンテキスト本文（HTML非対応クライアント向けフォールバック）。 */
export function renderNewsletterText(template: RenderableBroadcast, ctx: NewsletterContext = {}): string {
  const lead = ctx.prefectureName ? `${ctx.prefectureName}にお住まいの方へ。\n\n` : '';
  const unsub = ctx.email ? unsubscribeUrl(ctx.email) : null;
  return [
    `My Naishin（内申点 計算サイト）`,
    '',
    `${lead}${template.body}`,
    '',
    `▼ ${template.cta.label}`,
    `${SITE_URL}${template.cta.path}`,
    '',
    '———',
    unsub ? `配信停止: ${unsub}` : '配信停止をご希望の場合はこのメールにそのまま返信してください。',
  ].join('\n');
}

/** ブランド付き HTML メール。esp.ts の歓迎メールとトーンを揃える。 */
export function renderNewsletterHtml(template: RenderableBroadcast, ctx: NewsletterContext = {}): string {
  const lead = ctx.prefectureName
    ? `<p style="background:#eef2ff;border-radius:10px;padding:10px 14px;font-size:14px;color:#3730a3;margin:0 0 14px">${esc(ctx.prefectureName)}にお住まいの方へ</p>`
    : '';
  const unsub = ctx.email ? unsubscribeUrl(ctx.email) : null;
  const monthBadge = ctx.monthLabel
    ? `<div style="font-size:12px;opacity:.85">${esc(ctx.monthLabel)} のお便り</div>`
    : `<div style="font-size:12px;opacity:.85">受験のお便り</div>`;

  return `
<div style="font-family:-apple-system,'Segoe UI',Roboto,'Hiragino Kaku Gothic ProN',sans-serif;max-width:560px;margin:0 auto;color:#1e293b;line-height:1.7">
  <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:24px;border-radius:16px 16px 0 0;color:#fff">
    ${monthBadge}
    <div style="font-size:20px;font-weight:700;margin-top:4px">${esc(template.subject)}</div>
  </div>
  <div style="border:1px solid #e2e8f0;border-top:0;border-radius:0 0 16px 16px;padding:24px">
    ${lead}
    <p style="margin:0 0 18px">${esc(template.body)}</p>
    <p style="text-align:center;margin:22px 0">
      <a href="${SITE_URL}${esc(template.cta.path)}" style="display:inline-block;background:#4f46e5;color:#fff;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:12px">${esc(template.cta.label)} →</a>
    </p>
    <p style="font-size:12px;color:#94a3b8;margin-top:22px;border-top:1px solid #f1f5f9;padding-top:14px">
      My Naishin（${SITE_URL}）／ 高校受験の内申点・偏差値・志望校との差を無料で計算。<br>
      このメールに心当たりがない場合は破棄してください。
      ${unsub ? `配信を停止する場合は<a href="${unsub}" style="color:#94a3b8">こちら</a>、またはこのメールに返信してください。` : '配信の停止をご希望の場合は、このメールにそのまま返信してください。'}
    </p>
  </div>
</div>`.trim();
}

/** トリガーからまとめてレンダリング（見つからなければ null）。 */
export function renderNewsletter(
  trigger: BroadcastTrigger,
  ctx: NewsletterContext = {}
): { subject: string; html: string; text: string } | null {
  const template = getBroadcastTemplate(trigger);
  if (!template) return null;
  return {
    subject: renderNewsletterSubject(template, ctx),
    html: renderNewsletterHtml(template, ctx),
    text: renderNewsletterText(template, ctx),
  };
}

/**
 * 12ヶ月カレンダー（H4）から、月×対象（生徒/保護者）で1通ぶんをレンダリングする。
 * LINE名簿は student、メール名簿は parent を渡す。見つからなければ null。
 */
export function renderMonthlyNewsletter(
  month: number,
  audience: Audience,
  ctx: NewsletterContext = {}
): { subject: string; html: string; text: string } | null {
  const message = getMonthlyMessage(month, audience);
  if (!message) return null;
  return {
    subject: renderNewsletterSubject(message, ctx),
    html: renderNewsletterHtml(message, ctx),
    text: renderNewsletterText(message, ctx),
  };
}
