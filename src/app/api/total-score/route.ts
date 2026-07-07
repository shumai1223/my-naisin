import { gateApiRequest } from '@/lib/api-auth';
import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { TOTAL_SCORE_SYSTEMS, VERIFIED_TOTAL_SCORE_CODES } from '@/lib/total-score/registry';
import { DATASET_META, SITE_URL } from '@/lib/naishin-dataset';

/**
 * 公開データAPI（堀B・E-4）— 総合得点方式（内申点＋学力検査の統一エンジン）の一覧。
 *
 * GET /api/total-score → 統一エンジン(registry)で計算可能な県の総合得点システム定義一覧。
 * 詳細・実際の計算は /api/total-score/{code} を参照。
 *
 * 注：本エンドポイントは registry.ts の統一エンジン5県のみを対象とする（東京・神奈川・大阪等の
 * 手書き実装8県はここには含まれない＝データの過剰請求を避けるため）。
 */
export async function GET(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  logApiHit('total-score-index', request, { tier: gate.tier });

  const systems = VERIFIED_TOTAL_SCORE_CODES.map((code) => {
    const s = TOTAL_SCORE_SYSTEMS[code];
    return {
      code: s.code,
      name: s.name,
      localTerm: s.localTerm,
      fiscalYear: s.fiscalYear,
      academic: s.academic,
      report: s.report,
      ratioOptions: s.ratioOptions,
      source: s.source,
      apiUrl: `${SITE_URL}/api/total-score/${s.code}`,
      toolUrl: `${SITE_URL}/${s.code}/total-score`,
    };
  });

  return corsJson(
    {
      meta: {
        name: `${DATASET_META.name}（総合得点方式）`,
        version: DATASET_META.version,
        count: systems.length,
        generatedAt: new Date().toISOString(),
        endpoints: {
          index: `${SITE_URL}/api/total-score`,
          detail: `${SITE_URL}/api/total-score/{code}`,
          compute: `${SITE_URL}/api/total-score/{code}?academicRaw={点数}&reportRaw={点数}`,
        },
        license: DATASET_META.license,
      },
      systems,
    },
    { headers: gate.headers, private: gate.cachePrivate },
  );
}

export function OPTIONS() {
  return corsPreflight();
}
