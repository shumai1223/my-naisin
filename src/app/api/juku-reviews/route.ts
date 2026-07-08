import { gateApiRequest } from '@/lib/api-auth';
import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { isReviewableJuku } from '@/lib/juku-reviews';
import { getApprovedReviews } from '@/lib/juku-reviews-db';

/**
 * 塾口コミの公開読み出しAPI（TIER R-1第2弾）。
 *
 * GET /api/juku-reviews?jukuId=sora-juku-text
 *   承認済み（status='approved'）の口コミのみを返す。未承認・却下は絶対に含めない。
 *
 * ⚠️ 2026-07-09時点、migration 0008未適用のため常に空配列（reviews:[]）。
 * 表示側（塾比較ページ等）もまだこのAPIを呼んでいない＝deployしても実害なし。
 */
export async function GET(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  logApiHit('juku-reviews', request, { tier: gate.tier });

  const url = new URL(request.url);
  const jukuId = url.searchParams.get('jukuId');

  if (!isReviewableJuku(jukuId)) {
    return corsJson(
      { error: 'invalid_params', message: 'jukuId を指定してください（対象は既存の塾ユニバースのみ）。' },
      { status: 400, cacheSeconds: 300, headers: gate.headers }
    );
  }

  const reviews = await getApprovedReviews(jukuId);

  return corsJson(
    {
      meta: {
        jukuId,
        count: reviews.length,
        generatedAt: new Date().toISOString(),
      },
      reviews,
    },
    { headers: gate.headers, private: gate.cachePrivate }
  );
}

export function OPTIONS() {
  return corsPreflight();
}
