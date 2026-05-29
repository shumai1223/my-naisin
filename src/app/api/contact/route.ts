import { NextRequest, NextResponse } from 'next/server';

type ContactPayload = {
  type?: 'general' | 'bug' | 'error-report';
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  device?: string;
  browser?: string;
  description?: string;
  steps?: string;
};

/** Webhook（Discord/Slack）に流す通知本文を整形する。 */
function formatMessage(data: ContactPayload): string {
  if (data.type === 'bug') {
    return [
      '🐛 不具合報告（My Naishin）',
      `端末: ${data.device || '-'}`,
      `ブラウザ: ${data.browser || '-'}`,
      `内容: ${data.description || '-'}`,
      `再現手順: ${data.steps || '-'}`,
      `返信先: ${data.email || '(なし)'}`,
    ].join('\n');
  }
  if (data.type === 'error-report') {
    return [
      '⚠️ 誤り報告（My Naishin）',
      `件名: ${data.subject || '-'}`,
      `内容: ${data.message || '-'}`,
      `返信先: ${data.email || '(なし)'}`,
    ].join('\n');
  }
  return [
    '📩 お問い合わせ（My Naishin）',
    `名前: ${data.name || '-'}`,
    `メール: ${data.email || '-'}`,
    `件名: ${data.subject || '-'}`,
    `内容: ${data.message || '-'}`,
  ].join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as ContactPayload;

    // 簡易バリデーション（空送信を弾く）
    if (data.type === 'bug') {
      if (!data.description?.trim()) {
        return NextResponse.json({ error: '不具合の内容を入力してください。' }, { status: 400 });
      }
    } else if (!data.message?.trim()) {
      return NextResponse.json({ error: 'お問い合わせ内容を入力してください。' }, { status: 400 });
    }

    // CONTACT_WEBHOOK_URL（Discord/Slack互換）が設定されていれば転送する。
    // 未設定なら delivered:false を返し、クライアントが mailto フォールバックする。
    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
    let delivered = false;

    if (webhookUrl) {
      const content = formatMessage(data);
      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // Discordは content、Slackは text を参照するため両方を送る
          body: JSON.stringify({ content, text: content }),
        });
        delivered = res.ok;
      } catch (err) {
        console.error('Contact webhook forward failed:', err);
        delivered = false;
      }
    }

    return NextResponse.json({ success: true, delivered });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ error: 'エラーが発生しました。' }, { status: 500 });
  }
}
