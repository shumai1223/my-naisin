import { NextRequest, NextResponse } from 'next/server';

import { sendLeadEmails, espConfigured } from '@/lib/esp';

/**
 * 名簿化（堀A）のリード受け口。
 *
 * 受験期トラフィックを“資産”に変える入口。メール（任意）と文脈（都道府県・内申・目標・ギャップ）を
 * 受け取り、運営者の通知チャンネル（Discord/Slack互換 Webhook）へ転送する。
 *
 * 設計（contact ルートと同方針）：
 *  - LEAD_WEBHOOK_URL（無ければ CONTACT_WEBHOOK_URL）が設定されていれば転送し delivered:true。
 *  - 未設定なら delivered:false を返し、クライアントが mailto フォールバックする（取りこぼし防止）。
 *  - 個人情報はこのサーバーには保存しない（通知転送のみ）。本格CRM/ESPは後段で接続する。
 *
 * スパム耐性（公開POST＝curl直は素通りのため必須）：
 *  - 各フィールドに文字数上限・数値範囲を課し、巨大ボディを弾く（Webhookチャンネルの溢れ防止）。
 *  - IP単位のベストエフォート流量制限。※Workersはアイソレート間でメモリ非共有のため、
 *    これは「同一ウォームアイソレートへの連打」を抑える緩衝で、厳密な制限は KV / Durable Objects が必要。
 */

type LeadBody = {
  email?: unknown;
  consent?: unknown;
  source?: unknown;
  prefectureCode?: unknown;
  prefectureName?: unknown;
  score?: unknown;
  target?: unknown;
  gap?: unknown;
  note?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 上限（Webhook通知の肥大・スパム面の縮小）。
const MAX_BODY_BYTES = 4096;
const LIMITS = { email: 254, source: 40, pref: 60, note: 200 };
const NUM_BOUND = 1000;

// ベストエフォートのIPレート制限（モジュールスコープ＝ウォームアイソレート内のみ有効）。
const RATE = { windowMs: 60_000, max: 6 };
const hits = new Map<string, number[]>();

function clampStr(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  const t = value.trim();
  return t.length > max ? t.slice(0, max) : t;
}

function safeNum(value: unknown): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  if (value < -NUM_BOUND || value > NUM_BOUND) return undefined;
  return Math.round(value);
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

/** true=許可 / false=制限超過。 */
function allow(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE.windowMs);
  if (recent.length >= RATE.max) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  // 肥大防止の簡易掃除
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= RATE.windowMs)) hits.delete(k);
    }
  }
  return true;
}

function formatMessage(data: {
  email: string;
  source: string;
  prefectureName: string;
  prefectureCode: string;
  score?: number;
  target?: number;
  gap?: number;
  note: string;
}): string {
  return [
    '📇 受験情報の受け取り登録（My Naishin / 名簿）',
    `メール: ${data.email}`,
    `経路: ${data.source || '-'}`,
    `都道府県: ${data.prefectureName || data.prefectureCode || '-'}`,
    typeof data.score === 'number' ? `内申: ${data.score}` : '内申: -',
    typeof data.target === 'number' ? `目標: ${data.target}` : '目標: -',
    typeof data.gap === 'number' ? `ギャップ: ${data.gap}` : 'ギャップ: -',
    data.note ? `メモ: ${data.note}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function POST(request: NextRequest) {
  try {
    // 1) 流量制限（ベストエフォート）
    if (!allow(clientIp(request))) {
      return NextResponse.json(
        { error: 'リクエストが多すぎます。少し時間をおいて再度お試しください。' },
        { status: 429 }
      );
    }

    // 2) 巨大ボディを弾く
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'リクエストが大きすぎます。' }, { status: 413 });
    }
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'リクエストが大きすぎます。' }, { status: 413 });
    }

    let parsed: LeadBody;
    try {
      parsed = JSON.parse(raw) as LeadBody;
    } catch {
      return NextResponse.json({ error: '不正なリクエストです。' }, { status: 400 });
    }

    // 3) サニタイズ＋バリデーション
    const email = clampStr(parsed.email, LIMITS.email);
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'メールアドレスを正しく入力してください。' }, { status: 400 });
    }
    if (parsed.consent !== true) {
      return NextResponse.json({ error: '受け取りへの同意が必要です。' }, { status: 400 });
    }

    const data = {
      email,
      source: clampStr(parsed.source, LIMITS.source),
      prefectureCode: clampStr(parsed.prefectureCode, LIMITS.pref),
      prefectureName: clampStr(parsed.prefectureName, LIMITS.pref),
      score: safeNum(parsed.score),
      target: safeNum(parsed.target),
      gap: safeNum(parsed.gap),
      note: clampStr(parsed.note, LIMITS.note),
    };

    // 4) 転送（未設定なら delivered:false → クライアントが mailto フォールバック）
    const webhookUrl = process.env.LEAD_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL;
    let delivered = false;

    if (webhookUrl) {
      const content = formatMessage(data);
      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, text: content }),
        });
        delivered = res.ok;
      } catch (err) {
        console.error('Lead webhook forward failed:', err);
        delivered = false;
      }
    }

    // 5) ESP（Resend）で登録者へ歓迎メール＋運営者へ通知（RESEND_API_KEY 設定時のみ）。
    //    本人に1通届いた＝名簿として有効＝「配信できる名簿」化。歓迎メール成功も delivered とみなし mailto を抑止。
    if (espConfigured()) {
      try {
        const esp = await sendLeadEmails(data);
        delivered = delivered || esp.delivered || esp.owner;
      } catch (err) {
        console.error('Lead ESP send failed:', err);
      }
    }

    return NextResponse.json({ success: true, delivered });
  } catch (error) {
    console.error('Lead API error:', error);
    return NextResponse.json({ error: 'エラーが発生しました。' }, { status: 500 });
  }
}
