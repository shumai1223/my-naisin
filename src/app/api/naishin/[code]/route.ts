import { corsJson, corsPreflight } from '@/lib/api-cors';
import { buildPrefectureDetail } from '@/lib/naishin-dataset';

/**
 * 公開データAPI（堀B）— 単一都道府県の内申点計算方式 + 厳密な計算例 + 目安校。
 *
 * GET /api/naishin/{code}（例: /api/naishin/tokyo）
 * 「概算で終わらせない」ためのグラウンドトゥルース（オール3/4/5の厳密値）を含む。
 */
export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const detail = buildPrefectureDetail(code);
  if (!detail) {
    return corsJson(
      {
        error: 'not_found',
        message: `都道府県コード「${code}」は見つかりませんでした。一覧は /api/naishin を参照してください。`,
        index: 'https://my-naishin.com/api/naishin',
      },
      { status: 404, cacheSeconds: 300 }
    );
  }
  return corsJson(detail);
}

export function OPTIONS() {
  return corsPreflight();
}
