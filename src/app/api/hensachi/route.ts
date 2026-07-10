import { gateApiRequest } from '@/lib/api-auth';
import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { calcHensachi, requiredScoreForHensachi, rankToHensachi, hensachiToRank, roundHensachi } from '@/lib/hensachi';
import { DATASET_META, SITE_URL } from '@/lib/naishin-dataset';

/**
 * 公開データAPI（堀B・S-5）— 偏差値の計算・逆算・順位変換。
 *
 * 統一エンジン（lib/hensachi.ts）をそのまま公開するAPI版。/hensachi の各計算機（差分/満点変換/逆算等）と
 * 同一の式を使うため、UIとAPIで計算結果がズレることはない。既存の /api/hensachi/percentile-table
 * （偏差値→上位%早見表）とは別軸（こちらは点数⇄偏差値・順位⇄偏差値の相互変換）。
 *
 * GET /api/hensachi?score=70&average=60&stdDev=10
 *   得点・平均点・標準偏差から偏差値を計算。
 * GET /api/hensachi?targetHensachi=65&average=60&stdDev=10
 *   目標偏差値から、必要な得点を逆算。
 * GET /api/hensachi?rank=50&population=300
 *   母集団中の順位から偏差値を逆算（正規分布近似）。
 * GET /api/hensachi?hensachi=65&population=300
 *   偏差値から母集団中の順位を算出（正規分布近似）。
 */
export async function GET(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  logApiHit('hensachi-calc', request, { tier: gate.tier });
  const h = { headers: gate.headers, private: gate.cachePrivate } as const;

  const url = new URL(request.url);
  const scoreRaw = url.searchParams.get('score');
  const averageRaw = url.searchParams.get('average');
  const stdDevRaw = url.searchParams.get('stdDev');
  const targetHensachiRaw = url.searchParams.get('targetHensachi');
  const rankRaw = url.searchParams.get('rank');
  const hensachiRaw = url.searchParams.get('hensachi');
  const populationRaw = url.searchParams.get('population');

  // ?rank=&population= → 順位→偏差値
  if (rankRaw !== null) {
    const rank = Number(rankRaw);
    const population = Number(populationRaw ?? '0');
    if (!Number.isFinite(rank) || !Number.isFinite(population) || population <= 0) {
      return corsJson(
        { error: 'invalid_params', message: 'rank・population（>0）は数値で指定してください。' },
        { status: 400, cacheSeconds: 300, headers: gate.headers },
      );
    }
    const result = rankToHensachi(rank, population);
    if (result === null) {
      return corsJson(
        { error: 'invalid_params', message: '計算できませんでした（rank は 1〜population の範囲で指定してください）。' },
        { status: 400, cacheSeconds: 300, headers: gate.headers },
      );
    }
    return corsJson({ mode: 'rank_to_hensachi', rank, population, hensachi: roundHensachi(result) }, h);
  }

  // ?hensachi=&population= → 偏差値→順位
  if (hensachiRaw !== null) {
    const hensachi = Number(hensachiRaw);
    const population = Number(populationRaw ?? '0');
    if (!Number.isFinite(hensachi) || !Number.isFinite(population) || population <= 0) {
      return corsJson(
        { error: 'invalid_params', message: 'hensachi・population（>0）は数値で指定してください。' },
        { status: 400, cacheSeconds: 300, headers: gate.headers },
      );
    }
    return corsJson(
      { mode: 'hensachi_to_rank', hensachi, population, rank: hensachiToRank(hensachi, population) },
      h,
    );
  }

  // ?targetHensachi=&average=&stdDev= → 目標偏差値から必要点数を逆算
  if (targetHensachiRaw !== null) {
    const targetHensachi = Number(targetHensachiRaw);
    const average = Number(averageRaw ?? '0');
    const stdDev = Number(stdDevRaw ?? '0');
    const result = requiredScoreForHensachi(targetHensachi, average, stdDev);
    if (result === null) {
      return corsJson(
        { error: 'invalid_params', message: 'targetHensachi・average・stdDev（stdDev>0）は数値で指定してください。' },
        { status: 400, cacheSeconds: 300, headers: gate.headers },
      );
    }
    return corsJson(
      { mode: 'reverse', targetHensachi, average, stdDev, requiredScore: Math.round(result * 10) / 10 },
      h,
    );
  }

  // ?score=&average=&stdDev= → 通常の偏差値計算
  if (scoreRaw !== null) {
    const score = Number(scoreRaw);
    const average = Number(averageRaw ?? '0');
    const stdDev = Number(stdDevRaw ?? '0');
    const result = calcHensachi(score, average, stdDev);
    if (result === null) {
      return corsJson(
        { error: 'invalid_params', message: 'score・average・stdDev（stdDev>0）は数値で指定してください。' },
        { status: 400, cacheSeconds: 300, headers: gate.headers },
      );
    }
    return corsJson({ mode: 'compute', score, average, stdDev, hensachi: roundHensachi(result) }, h);
  }

  return corsJson(
    {
      meta: {
        name: `${DATASET_META.name}（偏差値の計算・逆算・順位変換）`,
        description: '偏差値 = 50 + 10×(得点−平均点)÷標準偏差 の統一エンジンをそのまま公開するAPI。',
        version: DATASET_META.version,
        license: DATASET_META.license,
        endpoints: {
          compute: `${SITE_URL}/api/hensachi?score={点数}&average={平均点}&stdDev={標準偏差}`,
          reverse: `${SITE_URL}/api/hensachi?targetHensachi={目標偏差値}&average={平均点}&stdDev={標準偏差}`,
          rankToHensachi: `${SITE_URL}/api/hensachi?rank={順位}&population={母集団数}`,
          hensachiToRank: `${SITE_URL}/api/hensachi?hensachi={偏差値}&population={母集団数}`,
          percentileTable: `${SITE_URL}/api/hensachi/percentile-table`,
        },
        toolUrl: `${SITE_URL}/hensachi`,
      },
    },
    h,
  );
}

export function OPTIONS() {
  return corsPreflight();
}
