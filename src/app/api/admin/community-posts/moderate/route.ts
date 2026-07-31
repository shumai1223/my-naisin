import { NextRequest, NextResponse } from 'next/server';

import { isAuthorizedAdminToken } from '@/lib/admin-auth';
import { moderateCommunityPost } from '@/lib/community-posts-db';
import type { CommunityPostStatus } from '@/lib/community-posts';

/**
 * 保護者コミュニティ投稿のモデレーション操作API（Λ-14・内部ツール）。
 * /admin/community-posts ページのモデレーションフォームから呼ばれる。
 *
 * POST /api/admin/community-posts/moderate
 *   body: { token, id, currentStatus, nextStatus }
 *   ADMIN_REPORT_TOKEN と一致しない場合は401（admin/juku-reviews等と同じ認証を共有）。
 */

type ModerateBody = {
  token?: unknown;
  id?: unknown;
  currentStatus?: unknown;
  nextStatus?: unknown;
};

const VALID_STATUSES: CommunityPostStatus[] = ['pending', 'flagged', 'approved', 'rejected'];

function isCommunityPostStatus(value: unknown): value is CommunityPostStatus {
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
    if (!isCommunityPostStatus(parsed.currentStatus) || !isCommunityPostStatus(parsed.nextStatus)) {
      return NextResponse.json({ error: 'ステータスが不正です。' }, { status: 400 });
    }

    const ok = await moderateCommunityPost(id, parsed.currentStatus, parsed.nextStatus);
    if (!ok) {
      return NextResponse.json({ error: 'この遷移は許可されていないか、保存に失敗しました。' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Community post moderate API error:', error);
    return NextResponse.json({ error: 'エラーが発生しました。' }, { status: 500 });
  }
}
