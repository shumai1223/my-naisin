import { gateApiRequest } from '@/lib/api-auth';
import { corsJson, corsPreflight, logApiHit } from '@/lib/api-cors';
import { buildPercentileTable } from '@/lib/hensachi';
import { DATASET_META, SITE_URL } from '@/lib/naishin-dataset';

/**
 * 公開データAPI（堀B・E-4）— 偏差値→上位%・順位の対応表（正規分布から数学的に算出）。
 *
 * GET /api/hensachi/percentile-table
 *   既定の代表偏差値（30〜75）で上位%・300人中順位・1000人中順位を返す。
 * GET /api/hensachi/percentile-table?values=45,50,55,60,65
 *   任意の偏差値リストを指定可能（カンマ区切り）。
 */
export async function GET(request: Request) {
  const gate = await gateApiRequest(request);
  if (!gate.allowed) return gate.response;
  logApiHit('hensachi-percentile-table', request, { tier: gate.tier });

  const url = new URL(request.url);
  const valuesRaw = url.searchParams.get('values');
  let values: number[] | undefined;
  if (valuesRaw !== null) {
    const parsed = valuesRaw.split(',').map((v) => Number(v.trim()));
    if (parsed.some((v) => !Number.isFinite(v))) {
      return corsJson(
        { error: 'invalid_params', message: 'values は数値のカンマ区切りで指定してください（例: ?values=45,50,55）。' },
        { status: 400, cacheSeconds: 300, headers: gate.headers },
      );
    }
    values = parsed;
  }

  const table = values ? buildPercentileTable(values) : buildPercentileTable();

  return corsJson(
    {
      meta: {
        name: `${DATASET_META.name}（偏差値→上位%・順位 対応表）`,
        description: '標準正規分布から数学的に算出した偏差値→上位パーセンタイル・母集団順位の対応表。',
        generatedAt: new Date().toISOString(),
        source: SITE_URL + '/hensachi',
      },
      table,
    },
    { headers: gate.headers, private: gate.cachePrivate },
  );
}

export function OPTIONS() {
  return corsPreflight();
}
