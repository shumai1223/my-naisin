import { gateApiRequest } from '@/lib/api-auth';
import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { buildCompetitionRatesIndex } from '@/lib/competition-rate-public-api';

/**
 * 公開データAPI（堀B・T-S13A A-2）— 再配布許諾済み都道府県の学校別入試競争率インデックス。
 *
 * GET /api/competition-rates → 教委が「出典明記で掲載差し支えない」と個別に回答した都道府県
 * （`redistributableOkPrefectures()`）だけの一覧を機械可読JSONで返す。全47都道府県版は
 * Business+キー限定の /api/schools/{pref} を参照。
 */
export async function GET(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  await logApiHit('competition-rates-index', request, { tier: gate.tier });
  return corsJson(buildCompetitionRatesIndex(), { headers: gate.headers, private: gate.cachePrivate });
}

export function OPTIONS() {
  return corsPreflight();
}
