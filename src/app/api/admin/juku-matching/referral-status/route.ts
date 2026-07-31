import { NextRequest, NextResponse } from 'next/server';

import { isAuthorizedAdminToken } from '@/lib/admin-auth';
import { updateReferralStatus } from '@/lib/juku-matching-db';
import type { JukuReferralStatus } from '@/lib/juku-matching-db';

/**
 * 送客ログの状態更新API（Λ-7・admin/juku-matching専用・内部ツール）。
 * 招待フロー（塾側ログイン）が未実装のため、現時点では管理者がこの画面から代行操作する。
 * POST /api/admin/juku-matching/referral-status
 *   body: { token, referralId, status } ('contacted' | 'declined' のみ許可。'converted'はcommission APIが自動遷移させる)
 */

type Body = { token?: unknown; referralId?: unknown; status?: unknown };

const ALLOWED_STATUSES: JukuReferralStatus[] = ['contacted', 'declined'];

function isAllowedStatus(value: unknown): value is JukuReferralStatus {
  return typeof value === 'string' && (ALLOWED_STATUSES as string[]).includes(value);
}

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

    const referralId = Number(parsed.referralId);
    if (!Number.isFinite(referralId) || referralId <= 0) {
      return NextResponse.json({ error: 'referralIdが不正です。' }, { status: 400 });
    }
    if (!isAllowedStatus(parsed.status)) {
      return NextResponse.json({ error: 'このステータスへの変更はこのAPIでは許可されていません。' }, { status: 400 });
    }

    const ok = await updateReferralStatus(referralId, parsed.status);
    if (!ok) {
      return NextResponse.json({ error: '更新に失敗しました。' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Juku matching referral-status API error:', error);
    return NextResponse.json({ error: 'エラーが発生しました。' }, { status: 500 });
  }
}
