import { NextRequest, NextResponse } from 'next/server';

import {
  BROADCAST_TEMPLATES,
  MONTHLY_CALENDAR,
  type BroadcastTrigger,
  type Audience,
} from '@/lib/broadcast-templates';
import { renderNewsletter, renderMonthlyNewsletter } from '@/lib/newsletter';

/**
 * ニュースレターのブラウザプレビュー（P4-1 / H4）。
 *
 *   GET /api/newsletter/preview                                  … 一覧（index）
 *   GET /api/newsletter/preview?trigger=monthly-checklist&pref=東京都&month=2026年7月
 *       … 季節/トリガー配信のHTMLを表示。
 *   GET /api/newsletter/preview?calMonth=8&audience=parent&month=2026年8月
 *       … 12ヶ月カレンダー（H4）の月×対象のHTMLを表示。
 *
 * 公開POSTではなくGET・noindex・送信は一切しない（純粋なレンダリング確認）。
 */

const VALID = new Set<string>(BROADCAST_TEMPLATES.map((t) => t.trigger));

function indexHtml(): string {
  const items = BROADCAST_TEMPLATES.map(
    (t) =>
      `<li style="margin:6px 0"><a href="/api/newsletter/preview?trigger=${t.trigger}&month=2026年7月" style="color:#4f46e5">${t.trigger}</a> — <span style="color:#64748b">${t.intent}</span></li>`
  ).join('');
  const calItems = MONTHLY_CALENDAR.map(
    (m) =>
      `<li style="margin:6px 0">${m.month}月${m.priority === 'peak' ? ' <span style="color:#dc2626;font-weight:700">[ピーク]</span>' : ''} ${m.theme}<br>
       <a href="/api/newsletter/preview?calMonth=${m.month}&audience=student&month=2026年${m.month}月" style="color:#4f46e5">生徒(LINE)</a> ／
       <a href="/api/newsletter/preview?calMonth=${m.month}&audience=parent&month=2026年${m.month}月" style="color:#4f46e5">保護者(メール)</a></li>`
  ).join('');
  return `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>Newsletter Preview｜My Naishin</title></head>
<body style="font-family:-apple-system,'Segoe UI',sans-serif;background:#f8fafc;margin:0;padding:32px 16px;color:#1e293b">
<div style="max-width:640px;margin:0 auto"><h1 style="font-size:20px">ニュースレター テンプレ プレビュー</h1>
<p style="font-size:14px;color:#475569">配信前の目視QA用。<code>?trigger=</code>（季節/ステップ）または <code>?calMonth=&audience=</code>（12ヶ月カレンダー）で各HTMLを確認できます。</p>
<h2 style="font-size:16px;margin-top:24px">季節・ステップ配信</h2>
<ul style="padding-left:18px;font-size:14px">${items}</ul>
<h2 style="font-size:16px;margin-top:24px">12ヶ月 編集カレンダー（生徒LINE／保護者メール）</h2>
<ul style="padding-left:18px;font-size:14px">${calItems}</ul></div></body></html>`;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const trigger = url.searchParams.get('trigger');
  const calMonth = url.searchParams.get('calMonth');

  // 12ヶ月カレンダー（H4）：月×対象を描画
  if (calMonth) {
    const month = Number(calMonth);
    const audience = (url.searchParams.get('audience') as Audience) || 'student';
    if (!Number.isInteger(month) || month < 1 || month > 12 || (audience !== 'student' && audience !== 'parent')) {
      return NextResponse.json(
        { error: 'invalid_calendar_params', hint: 'calMonth=1..12 & audience=student|parent' },
        { status: 400, headers: { 'X-Robots-Tag': 'noindex' } }
      );
    }
    const renderedCal = renderMonthlyNewsletter(month, audience, {
      prefectureName: url.searchParams.get('pref') || undefined,
      monthLabel: url.searchParams.get('month') || undefined,
      email: url.searchParams.get('email') || undefined,
    });
    if (!renderedCal) {
      return NextResponse.json({ error: 'render_failed' }, { status: 500, headers: { 'X-Robots-Tag': 'noindex' } });
    }
    const calPage = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>${renderedCal.subject}</title></head>
<body style="background:#f1f5f9;margin:0;padding:24px 12px">
<div style="max-width:600px;margin:0 auto">
<div style="font-size:12px;color:#64748b;margin-bottom:8px">${month}月・${audience === 'student' ? '生徒(LINE)' : '保護者(メール)'}／件名：<strong>${renderedCal.subject}</strong></div>
${renderedCal.html}
</div></body></html>`;
    return new NextResponse(calPage, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' },
    });
  }

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
