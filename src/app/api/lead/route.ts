import { NextRequest, NextResponse } from 'next/server';

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
 */

type LeadBody = {
  email?: string;
  consent?: boolean;
  source?: string;
  prefectureCode?: string;
  prefectureName?: string;
  score?: number;
  target?: number;
  gap?: number;
  note?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function formatMessage(data: LeadBody): string {
  return [
    '📇 受験情報の受け取り登録（My Naishin / 名簿）',
    `メール: ${data.email || '-'}`,
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
    const data = (await request.json()) as LeadBody;

    const email = (data.email || '').trim();
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'メールアドレスを正しく入力してください。' }, { status: 400 });
    }
    if (!data.consent) {
      return NextResponse.json({ error: '受け取りへの同意が必要です。' }, { status: 400 });
    }

    const webhookUrl = process.env.LEAD_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL;
    let delivered = false;

    if (webhookUrl) {
      const content = formatMessage({ ...data, email });
      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Discordは content、Slackは text を参照するため両方を送る
          body: JSON.stringify({ content, text: content }),
        });
        delivered = res.ok;
      } catch (err) {
        console.error('Lead webhook forward failed:', err);
        delivered = false;
      }
    }

    return NextResponse.json({ success: true, delivered });
  } catch (error) {
    console.error('Lead API error:', error);
    return NextResponse.json({ error: 'エラーが発生しました。' }, { status: 500 });
  }
}
