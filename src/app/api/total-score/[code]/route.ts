import { gateApiRequest } from '@/lib/api-auth';
import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { getTotalScoreSystem } from '@/lib/total-score/registry';
import { computeTotalScore, requiredAcademicRaw } from '@/lib/total-score/engine';
import { SITE_URL } from '@/lib/naishin-dataset';

/**
 * 公開データAPI（堀B・E-4）— 単一県の総合得点システム詳細 + 実際の計算。
 *
 * GET /api/total-score/{code}（例: /api/total-score/hyogo）
 *   計算式・比率オプション・計算例（examples）・出典を含む詳細。
 * GET /api/total-score/{code}?academicRaw=350&reportRaw=200&ratioOptionId=xxx
 *   実際の学力検査点・内申素点を渡すと、engine.tsのcomputeTotalScoreで総合得点を計算して返す。
 * GET /api/total-score/{code}?targetTotal=450&reportRaw=200
 *   目標総合得点と内申素点から、必要な学力検査点を逆算（requiredAcademicRaw）。
 */
export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  const { code } = await params;
  logApiHit('total-score-detail', request, { code, tier: gate.tier });
  const h = { headers: gate.headers, private: gate.cachePrivate } as const;

  const system = getTotalScoreSystem(code);
  if (!system) {
    return corsJson(
      {
        error: 'not_found',
        message: `都道府県コード「${code}」の総合得点システムは見つかりませんでした。一覧は /api/total-score を参照してください。`,
        index: `${SITE_URL}/api/total-score`,
      },
      { status: 404, cacheSeconds: 300, headers: gate.headers },
    );
  }

  const url = new URL(request.url);
  const academicRawRaw = url.searchParams.get('academicRaw');
  const reportRawRaw = url.searchParams.get('reportRaw');
  const targetTotalRaw = url.searchParams.get('targetTotal');
  const ratioOptionId = url.searchParams.get('ratioOptionId') ?? undefined;

  // ?targetTotal=&reportRaw= → 逆算モード（必要な学力検査点）
  if (targetTotalRaw !== null) {
    const targetTotal = Number(targetTotalRaw);
    const reportRaw = Number(reportRawRaw ?? '0');
    if (!Number.isFinite(targetTotal) || !Number.isFinite(reportRaw)) {
      return corsJson(
        { error: 'invalid_params', message: 'targetTotal・reportRaw は数値で指定してください。' },
        { status: 400, cacheSeconds: 300, headers: gate.headers },
      );
    }
    const result = requiredAcademicRaw(system, { targetTotal, reportRaw, ratioOptionId });
    return corsJson({ mode: 'reverse', code: system.code, name: system.name, ...result }, h);
  }

  // ?academicRaw=&reportRaw= → 通常の総合得点計算
  if (academicRawRaw !== null || reportRawRaw !== null) {
    const academicRaw = Number(academicRawRaw ?? '0');
    const reportRaw = Number(reportRawRaw ?? '0');
    if (!Number.isFinite(academicRaw) || !Number.isFinite(reportRaw)) {
      return corsJson(
        { error: 'invalid_params', message: 'academicRaw・reportRaw は数値で指定してください。' },
        { status: 400, cacheSeconds: 300, headers: gate.headers },
      );
    }
    const result = computeTotalScore(system, { academicRaw, reportRaw, ratioOptionId });
    return corsJson({ mode: 'compute', code: system.code, name: system.name, ...result }, h);
  }

  return corsJson(
    {
      code: system.code,
      name: system.name,
      localTerm: system.localTerm,
      fiscalYear: system.fiscalYear,
      academic: system.academic,
      report: system.report,
      ratioOptions: system.ratioOptions,
      overview: system.overview,
      computeSteps: system.computeSteps,
      examples: system.examples,
      faqs: system.faqs,
      source: system.source,
      toolUrl: `${SITE_URL}/${system.code}/total-score`,
    },
    h,
  );
}

export function OPTIONS() {
  return corsPreflight();
}
