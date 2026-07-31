import { NextRequest, NextResponse } from 'next/server';

import { isAuthorizedAdminToken } from '@/lib/admin-auth';
import { recordCommissionEntry } from '@/lib/juku-matching-db';

/**
 * 送客の成約報告API（Λ-7・admin/juku-matching専用・内部ツール）。
 * 呼ぶと該当referralのstatusが'converted'へ自動遷移する(recordCommissionEntry内部で実施)。
 * POST /api/admin/juku-matching/commission
 *   body: { token, referralId, grossAmountYen, billingPeriod }
 */

type Body = { token?: unknown; referralId?: unknown; grossAmountYen?: unknown; billingPeriod?: unknown };

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
    const grossAmountYen = Number(parsed.grossAmountYen);
    const billingPeriod = typeof parsed.billingPeriod === 'string' ? parsed.billingPeriod : '';

    if (!Number.isFinite(referralId) || referralId <= 0) {
      return NextResponse.json({ error: 'referralIdが不正です。' }, { status: 400 });
    }

    const result = await recordCommissionEntry({ referralId, grossAmountYen, billingPeriod });
    if (!result) {
      return NextResponse.json({ error: '成約金額または請求月が不正か、送客/提携塾が見つかりません。' }, { status: 400 });
    }
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Juku matching commission API error:', error);
    return NextResponse.json({ error: 'エラーが発生しました。' }, { status: 500 });
  }
}
