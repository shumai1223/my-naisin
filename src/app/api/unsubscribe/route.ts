import { NextRequest, NextResponse } from 'next/server';

import { verifyUnsub } from '@/lib/unsubscribe';
import { markUnsubscribed } from '@/lib/leads-db';

/**
 * 配信停止（ワンクリック）。歓迎メール/一斉配信のフッターの署名付きリンクから来る。
 *  GET /api/unsubscribe?e=<email>&t=<hmac>
 *
 * 署名（HMAC）が一致したときだけ D1 の unsubscribed=1 を立てる。第三者が他人を勝手に停止できないようにする。
 * D1 未バインドでも、利用者には常に「受け付けました」を返す（体験を壊さない・名簿が無ければ実害なし）。
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function page(title: string, body: string): NextResponse {
  const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${title}｜My Naishin</title></head>
<body style="font-family:-apple-system,'Segoe UI',sans-serif;background:#f8fafc;margin:0;padding:40px 16px;color:#1e293b">
<div style="max-width:480px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px">
<div style="font-size:13px;color:#6366f1;font-weight:700">My Naishin</div>
<h1 style="font-size:20px;margin:8px 0 12px">${title}</h1>
<p style="font-size:14px;line-height:1.7;color:#475569">${body}</p>
<a href="https://my-naishin.com/" style="display:inline-block;margin-top:16px;color:#4f46e5;font-weight:700;text-decoration:none">トップに戻る →</a>
</div></body></html>`;
  return new NextResponse(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = (searchParams.get('e') || '').trim().toLowerCase();
  const token = (searchParams.get('t') || '').trim();

  if (!email || !EMAIL_RE.test(email) || !token || !verifyUnsub(email, token)) {
    return page(
      'リンクが無効です',
      '配信停止リンクが正しくないか、期限切れの可能性があります。お手数ですが、配信メールに直接ご返信いただければ確実に停止します。'
    );
  }

  // 署名OK：D1 にフラグを立てる（未バインドでも体験は同じ）。
  await markUnsubscribed(email);

  return page(
    '配信を停止しました',
    '今後、受験情報メールの配信を停止しました。ご利用ありがとうございました。再開したい場合は、サイトからいつでも登録できます。'
  );
}
