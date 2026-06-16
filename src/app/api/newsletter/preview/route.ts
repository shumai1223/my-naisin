import { NextRequest, NextResponse } from 'next/server';

import { BROADCAST_TEMPLATES, type BroadcastTrigger } from '@/lib/broadcast-templates';
import { renderNewsletter } from '@/lib/newsletter';

/**
 * ニュースレターのブラウザプレビュー（P4-1）。
 *
 *   GET /api/newsletter/preview                         … トリガー一覧（index）
 *   GET /api/newsletter/preview?trigger=monthly-checklist&pref=東京都&month=2026年7月
 *       … 実際に配信される HTML をそのまま表示（noindex）。配信前の目視QA用。
 *
 * 公開POSTではなくGET・noindex・送信は一切しない（純粋なレンダリング確認）。
 */

const VALID = new Set<string>(BROADCAST_TEMPLATES.map((t) => t.trigger));

function indexHtml(): string {
  const items = BROADCAST_TEMPLATES.map(
    (t) =>
      `<li style="margin:6px 0"><a href="/api/newsletter/preview?trigger=${t.trigger}&month=2026年7月" style="color:#4f46e5">${t.trigger}</a> — <span style="color:#64748b">${t.intent}</span></li>`
  ).join('');
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>Newsletter Preview｜My Naishin</title></head>
<body style="font-family:-apple-system,'Segoe UI',sans-serif;background:#f8fafc;margin:0;padding:32px 16px;color:#1e293b">
<div style="max-width:640px;margin:0 auto"><h1 style="font-size:20px">ニュースレター テンプレ プレビュー</h1>
<p style="font-size:14px;color:#475569">配信前の目視QA用。<code>?trigger=</code> で各テンプレのHTMLを確認できます。</p>
<ul style="padding-left:18px;font-size:14px">${items}</ul></div></body></html>`;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const trigger = url.searchParams.get('trigger');

  if (!trigger) {
    return new NextResponse(indexHtml(), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' },
    });
  }

  if (!VALID.has(trigger)) {
    return NextResponse.json(
      { error: 'unknown_trigger', valid: [...VALID] },
      { status: 400, headers: { 'X-Robots-Tag': 'noindex' } }
    );
  }

  const rendered = renderNewsletter(trigger as BroadcastTrigger, {
    prefectureName: url.searchParams.get('pref') || undefined,
    monthLabel: url.searchParams.get('month') || undefined,
    // プレビューでは実メールを使わない（停止リンクは UNSUB_SECRET 設定時のサンプル）。
    email: url.searchParams.get('email') || undefined,
  });

  if (!rendered) {
    return NextResponse.json({ error: 'render_failed' }, { status: 500 });
  }

  // 件名を上部に添えて HTML を表示。
  const page = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>${rendered.subject}</title></head>
<body style="background:#f1f5f9;margin:0;padding:24px 12px">
<div style="max-width:600px;margin:0 auto">
<div style="font-size:12px;color:#64748b;margin-bottom:8px">件名：<strong>${rendered.subject}</strong></div>
${rendered.html}
</div></body></html>`;

  return new NextResponse(page, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' },
  });
}
