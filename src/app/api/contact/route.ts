import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, name, email, subject, message, device, browser, description, steps } = body;

    // ログに出力するだけ（最も簡単）
    console.log('=== お問い合わせ受信 ===');
    console.log('タイプ:', type);
    console.log('名前:', name || '未記入');
    console.log('メール:', email || '未記入');
    console.log('件名:', subject);
    console.log('本文:', message);
    console.log('デバイス:', device);
    console.log('ブラウザ:', browser);
    console.log('詳細:', description);
    console.log('手順:', steps);
    console.log('日時:', new Date().toLocaleString('ja-JP'));
    console.log('IP:', request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '不明');
    console.log('========================');

    return NextResponse.json({ 
      success: true, 
      message: 'お問い合わせを受け付けました。内容を確認しました。' 
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'エラーが発生しました。' },
      { status: 500 }
    );
  }
}
