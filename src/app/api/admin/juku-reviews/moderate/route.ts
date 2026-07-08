import { NextRequest, NextResponse } from 'next/server';

import { isAuthorizedAdminToken } from '@/lib/admin-auth';
import { moderateJukuReview } from '@/lib/juku-reviews-db';
import type { ReviewStatus } from '@/lib/juku-reviews';

/**
 * 塾口コミのモデレーション操作API（TIER R-1第3弾・内部ツール）。
 * /admin/juku-reviews ページのモデレーションフォームから呼ばれる。
 *
 * POST /api/admin/juku-reviews/moderate
 *   body: { token, id, currentStatus, nextStatus, moderatorNote? }
 *   ADMIN_REPORT_TOKEN と一致しない場合は401（admin/report等と同じ認証を共有）。
 */

type ModerateBody = {
  token?: unknown;
  id?: unknown;
  currentStatus?: unknown;
  nextStatus?: unknown;
  moderatorNote?: unknown;
};

const VALID_STATUSES: ReviewStatus[] = ['pending', 'approved', 'rejected'];

function isReviewStatus(value: unknown): value is ReviewStatus {
  return typeof value === 'string' && (VALID_STATUSES as string[]).includes(value);
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    let parsed: ModerateBody;
    try {
      parsed = JSON.parse(raw) as ModerateBody;
    } catch {
      return NextResponse.json({ error: '不正なリクエストです。' }, { status: 400 });
    }

    const token = typeof parsed.token === 'string' ? parsed.token : undefined;
    if (!(await isAuthorizedAdminToken(token))) {
      return NextResponse.json({ error: '認証に失敗しました。' }, { status: 401 });
    }

    const id = Number(parsed.id);
    if (!Number.isFinite(id) || id <= 0) {
      return NextResponse.json({ error: 'idが不正です。' }, { status: 400 });
    }
    if (!isReviewStatus(parsed.currentStatus) || !isReviewStatus(parsed.nextStatus)) {
      return NextResponse.json({ error: 'ステータスが不正です。' }, { status: 400 });
    }
    const moderatorNote = typeof parsed.moderatorNote === 'string' ? parsed.moderatorNote.slice(0, 200) : undefined;

    const ok = await moderateJukuReview(id, parsed.currentStatus, parsed.nextStatus, moderatorNote);
    if (!ok) {
      return NextResponse.json({ error: 'この遷移は許可されていないか、保存に失敗しました。' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Juku review moderate API error:', error);
    return NextResponse.json({ error: 'エラーが発生しました。' }, { status: 500 });
  }
}
