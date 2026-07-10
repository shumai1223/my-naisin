import { gateApiRequest } from '@/lib/api-auth';
import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { calcApplicationRatio, calcActualRatio, roundRatio } from '@/lib/bairitsu';
import { DATASET_META, SITE_URL } from '@/lib/naishin-dataset';

/**
 * 公開データAPI（堀B・S-5）— 高校入試の倍率計算（志願倍率・実質倍率）。
 *
 * 学校別の実際の倍率（志願者数・合格者数）は年度・学校ごとに変動し県教委の一次情報でしか正確な値が
 * 分からないため（捏造ゼロ方針・/koukou-bairitsu と同じ設計）、本APIは純粋な比率計算のみを提供する。
 *
 * GET /api/bairitsu?applicants=120&capacity=80
 *   志願倍率 = 志願者数 ÷ 募集人員。
 * GET /api/bairitsu?testTakers=110&passers=80
 *   実質倍率 = 受験者数 ÷ 合格者数。
 */
export async function GET(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  logApiHit('bairitsu-calc', request, { tier: gate.tier });
  const h = { headers: gate.headers, private: gate.cachePrivate } as const;

  const url = new URL(request.url);
  const applicantsRaw = url.searchParams.get('applicants');
  const capacityRaw = url.searchParams.get('capacity');
  const testTakersRaw = url.searchParams.get('testTakers');
  const passersRaw = url.searchParams.get('passers');

  // ?testTakers=&passers= → 実質倍率
  if (testTakersRaw !== null || passersRaw !== null) {
    const testTakers = Number(testTakersRaw ?? '0');
    const passers = Number(passersRaw ?? '0');
    const result = calcActualRatio(testTakers, passers);
    if (result === null) {
      return corsJson(
        { error: 'invalid_params', message: 'testTakers（受験者数）・passers（合格者数>0）は数値で指定してください。' },
        { status: 400, cacheSeconds: 300, headers: gate.headers },
      );
    }
    return corsJson({ mode: 'actual_ratio', testTakers, passers, ratio: roundRatio(result) }, h);
  }

  // ?applicants=&capacity= → 志願倍率
  if (applicantsRaw !== null || capacityRaw !== null) {
    const applicants = Number(applicantsRaw ?? '0');
    const capacity = Number(capacityRaw ?? '0');
    const result = calcApplicationRatio(applicants, capacity);
    if (result === null) {
      return corsJson(
        { error: 'invalid_params', message: 'applicants（志願者数）・capacity（募集人員>0）は数値で指定してください。' },
        { status: 400, cacheSeconds: 300, headers: gate.headers },
      );
    }
    return corsJson({ mode: 'application_ratio', applicants, capacity, ratio: roundRatio(result) }, h);
  }

  return corsJson(
    {
      meta: {
        name: `${DATASET_META.name}（高校入試の倍率計算）`,
        description:
          '志願倍率（志願者数÷募集人員）・実質倍率（受験者数÷合格者数）の比率計算。学校別・年度別の実データは県教委一次情報のみが正確なため、本APIは計算式のみを提供する。',
        version: DATASET_META.version,
        license: DATASET_META.license,
        endpoints: {
          applicationRatio: `${SITE_URL}/api/bairitsu?applicants={志願者数}&capacity={募集人員}`,
          actualRatio: `${SITE_URL}/api/bairitsu?testTakers={受験者数}&passers={合格者数}`,
        },
        toolUrl: `${SITE_URL}/koukou-bairitsu`,
      },
    },
    h,
  );
}

export function OPTIONS() {
  return corsPreflight();
}
