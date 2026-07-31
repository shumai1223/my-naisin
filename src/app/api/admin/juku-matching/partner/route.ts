import { NextRequest, NextResponse } from 'next/server';

import { isAuthorizedAdminToken } from '@/lib/admin-auth';
import { createJukuPartner } from '@/lib/juku-matching-db';

/**
 * 提携塾の新規登録API（Λ-7・admin/juku-matching専用・内部ツール）。
 * POST /api/admin/juku-matching/partner
 *   body: { token, name, commissionRateBps }
 */

type Body = { token?: unknown; name?: unknown; commissionRateBps?: unknown };

export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    let parsed: Body;
    try {
      parsed = JSON.parse(raw) as Body;
    } catch {
      return NextResponse.json({ error: '不正なリクエストです。' }, { status: 400 });
    }

    const token = typeof parsed.token === 'string' ? parsed.token : undefined;
    if (!(await isAuthorizedAdminToken(token))) {
      return NextResponse.json({ error: '認証に失敗しました。' }, { status: 401 });
    }

    const name = typeof parsed.name === 'string' ? parsed.name : '';
    const commissionRateBps = Number(parsed.commissionRateBps);

    const id = await createJukuPartner(name, commissionRateBps);
    if (id === null) {
      return NextResponse.json({ error: '塾名またはtake-rateが不正です。' }, { status: 400 });
    }
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Juku matching partner create API error:', error);
    return NextResponse.json({ error: 'エラーが発生しました。' }, { status: 500 });
  }
}
