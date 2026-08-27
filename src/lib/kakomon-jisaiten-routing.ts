import { PREFECTURES } from './prefectures';
import { VERIFIED_TOTAL_SCORE_CODES } from './total-score/registry';
import { EXPLAINER_CODES } from './total-score/explainers';

/**
 * T-C6: 「過去問を解いた」から「総合得点」までの橋渡し（/kakomon-jisaiten）で、
 * 都道府県ごとにどこへ着地させるかを決める純関数。
 *
 * ★Y-0憲法: 合否判定・ボーダーラインの推定は永久禁止。ここで扱うのは「総合得点という
 * 公表方式に基づく数値」まで。'calculator'は本ページ内で完結する統一エンジン計算、
 * 'link'は既存の専用計算/解説ページへの誘導（どちらも合否は出さない）。
 */
export type KakomonJisaitenRoute =
  | { type: 'calculator'; code: string }
  | { type: 'link'; code: string; url: string; label: string };

/** 個別実装（統一エンジンに未対応・専用ページで計算機を提供）の8県。 */
const INDIVIDUAL_IMPLEMENTATION_URLS: Record<string, string> = {
  tokyo: '/tokyo/total-score',
  kanagawa: '/kanagawa/s-value',
  osaka: '/osaka/total-score',
  aichi: '/aichi/total-score',
  chiba: '/chiba/total-score',
  saitama: '/saitama/total-score',
  fukuoka: '/fukuoka/total-score',
  // hokkaidoは専用の総合得点ページが無いため、ここには含めずgetKakomonJisaitenRoute()の
  // フォールバック（都道府県トップページ）に流す。
};

export function getKakomonJisaitenRoute(code: string): KakomonJisaitenRoute {
  if (VERIFIED_TOTAL_SCORE_CODES.includes(code)) {
    return { type: 'calculator', code };
  }
  const individualUrl = INDIVIDUAL_IMPLEMENTATION_URLS[code];
  if (individualUrl) {
    return { type: 'link', code, url: individualUrl, label: 'この県専用の総合得点計算機を開く' };
  }
  if (EXPLAINER_CODES.includes(code)) {
    return { type: 'link', code, url: `/${code}/total-score`, label: 'この県の総合得点の仕組みを見る' };
  }
  // フォールバック: 統一エンジン・専用計算機・解説のいずれにも未対応の県（例: hokkaido）は、
  // 都道府県トップページ（入試制度の説明を含む）へ誘導し、必ずどこかに着地させる。
  return { type: 'link', code, url: `/${code}`, label: 'この県の入試制度の説明を見る' };
}

/** 全47都道府県ぶんのルーティングを返す（テスト・UIの一覧表示用）。 */
export function getAllKakomonJisaitenRoutes(): KakomonJisaitenRoute[] {
  return PREFECTURES.map((p) => getKakomonJisaitenRoute(p.code));
}
