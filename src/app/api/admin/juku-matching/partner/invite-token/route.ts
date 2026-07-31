import { NextRequest, NextResponse } from 'next/server';

import { isAuthorizedAdminToken } from '@/lib/admin-auth';
import { issuePartnerInviteToken } from '@/lib/juku-matching-db';

/**
 * 提携塾の招待トークン発行API（Λ-7・admin/juku-matching専用・内部ツール）。
 * 発行するたびに古いトークンは無効化される（1塾につき有効なトークンは常に最新の1つ）。
 * 平文トークンはこのレスポンスでしか取得できない（DBにはハッシュのみ保存）。
 * POST /api/admin/juku-matching/partner/invite-token
 *   body: { token, jukuPartnerId }
 */

type Body = { token?: unknown; jukuPartnerId?: unknown };

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

    const jukuPartnerId = Number(parsed.jukuPartnerId);
    if (!Number.isFinite(jukuPartnerId) || jukuPartnerId <= 0) {
      return NextResponse.json({ error: 'jukuPartnerIdが不正です。' }, { status: 400 });
    }

    const inviteToken = await issuePartnerInviteToken(jukuPartnerId);
    if (!inviteToken) {
      return NextResponse.json({ error: '発行に失敗しました。' }, { status: 400 });
    }
    return NextResponse.json({ success: true, inviteToken });
  } catch (error) {
    console.error('Juku matching invite-token API error:', error);
    return NextResponse.json({ error: 'エラーが発生しました。' }, { status: 500 });
  }
}
