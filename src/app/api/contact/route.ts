import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await request.json();

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
