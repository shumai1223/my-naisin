import { corsJson, corsPreflight } from '@/lib/api-cors';
import { buildDatasetIndex } from '@/lib/naishin-dataset';

/**
 * 公開データAPI（堀B）— 全国47都道府県の内申点計算方式インデックス。
 *
 * GET /api/naishin → 47都道府県の計算方式（対象学年・倍率・満点・出典）を機械可読JSONで返す。
 * AIエージェント・開発者が「正解の一次データ」を呼びにくる入口。利用条件は meta.license を参照。
 */
export function GET() {
  return corsJson(buildDatasetIndex());
}

export function OPTIONS() {
  return corsPreflight();
}
