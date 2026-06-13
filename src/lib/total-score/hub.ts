// /total-score ハブページ用：全47都道府県の「総合得点／合否の仕組み」ページを一覧化する。
//
// 内訳（合計47）：
//  - 計算機（第1層・計算可能）= 静的手書き8県 ＋ 統一エンジン registry 5県 ＝ 13県
//  - 解説（第2層＋計算確証待ち）= explainers 34県
//
// すべて令和8年度（2026年度）の県教委一次ソース準拠。学校別ボーダーは持たない（信頼の堀）。

import { PREFECTURES } from '@/lib/prefectures';
import { TOTAL_SCORE_SYSTEMS } from './registry';
import { TOTAL_SCORE_EXPLAINERS } from './explainers';

export type HubKind = 'calculator' | 'explainer';

export interface HubEntry {
  code: string;
  name: string;
  /** 公開URL（ハブからのリンク先）。 */
  href: string;
  kind: HubKind;
  /** 方式・現地語の短いラベル（カードに表示）。 */
  term: string;
}

const NAME_BY_CODE: Record<string, string> = Object.fromEntries(
  PREFECTURES.map((p) => [p.code, p.name]),
);

/**
 * 統一エンジン以前から手書きで存在する総合得点・合否ツール（独自スラッグを含む）。
 * これらも「計算できる県」としてハブに並べる。
 */
const STATIC_CALCULATORS: { code: string; slug: string; term: string }[] = [
  { code: 'tokyo', slug: 'total-score', term: '換算内申＋学力（1020点）' },
  { code: 'kanagawa', slug: 's-value', term: 'S値（a値・f値）' },
  { code: 'osaka', slug: 'total-score', term: 'ボーダーゾーン・タイプⅠ〜Ⅲ' },
  { code: 'aichi', slug: 'total-score', term: '評価方法Ⅰ〜Ⅴ' },
  { code: 'chiba', slug: 'total-score', term: 'K値（0.5〜2）' },
  { code: 'saitama', slug: 'total-score', term: '学年比率・換算内申' },
  { code: 'fukuoka', slug: 'total-score', term: '内申（中3）＋学力300' },
  { code: 'hokkaido', slug: 'rank', term: 'ランク（A〜M）' },
];

const STATIC_CODES = new Set(STATIC_CALCULATORS.map((s) => s.code));

/** 計算機がある県（静的8 ＋ registry 5）。重複は除く。 */
export const HUB_CALCULATORS: HubEntry[] = [
  ...STATIC_CALCULATORS.map((s) => ({
    code: s.code,
    name: NAME_BY_CODE[s.code] ?? s.code,
    href: `/${s.code}/${s.slug}`,
    kind: 'calculator' as const,
    term: s.term,
  })),
  ...Object.values(TOTAL_SCORE_SYSTEMS)
    .filter((sys) => !STATIC_CODES.has(sys.code))
    .map((sys) => ({
      code: sys.code,
      name: sys.name,
      href: `/${sys.code}/total-score`,
      kind: 'calculator' as const,
      term: sys.localTerm,
    })),
];

/** 解説ページの県（explainers 34）。 */
export const HUB_EXPLAINERS: HubEntry[] = Object.values(TOTAL_SCORE_EXPLAINERS).map((e) => ({
  code: e.code,
  name: e.name,
  href: `/${e.code}/total-score`,
  kind: 'explainer' as const,
  term: e.method,
}));

export const HUB_ALL: HubEntry[] = [...HUB_CALCULATORS, ...HUB_EXPLAINERS];
