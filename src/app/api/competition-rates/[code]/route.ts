import { gateApiRequest } from '@/lib/api-auth';
import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { competitionRatesForPrefecture } from '@/lib/competition-rate-public-api';

/**
 * 公開データAPI（堀B・T-S13A A-2）— 単一都道府県の再配布許諾済み学校別入試競争率。
 *
 * GET /api/competition-rates/{code}（例: /api/competition-rates/akita）
 *   `redistribution: 'ok'`の都道府県のみ200を返す。それ以外（未回答・拒否・未収録）は404で
 *   全県版（Business+キー限定の /api/schools/{code}）を案内する。
 */
export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  const { code } = await params;
  await logApiHit('competition-rates-detail', request, { code, tier: gate.tier });

  const detail = competitionRatesForPrefecture(code);
  if (!detail) {
    return corsJson(
      {
        error: 'not_found',
        message:
          `都道府県コード「${code}」は再配布許諾済みデータバンクに収録されていません。` +
          `一覧は /api/competition-rates を参照してください。全47都道府県版はBusiness以上のAPIキーで /api/schools/${code} から取得できます。`,
        index: 'https://my-naishin.com/api/competition-rates',
      },
      { status: 404, cacheSeconds: 300, headers: gate.headers }
    );
  }
  return corsJson(detail, { headers: gate.headers, private: gate.cachePrivate });
}

export function OPTIONS() {
  return corsPreflight();
}
