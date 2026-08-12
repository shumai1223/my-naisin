import { TIER_POLICIES } from './api-tiers';

/**
 * 見積書（/mitsumori）・料金ページ（/developers）が共通で参照するプラン定義。
 * 2026-08-13価格決定（ops/PRICING_OPTIONS.md）の確定額をここに単一ソース化し、
 * ページ間で金額がずれることを防ぐ。Business は api-tiers.ts の annualPriceJpy から取得し、
 * Enterprise の3構成（基本／＋再配布権／フル）はここで定義する。
 */
export interface QuotePlan {
  id: 'business' | 'enterprise-base' | 'enterprise-redistribute' | 'enterprise-full';
  label: string;
  /** 年額（税込・円）。 */
  annualPriceJpy: number;
  /** 見積書・料金ページに列挙する内容。 */
  features: string[];
}

export const QUOTE_PLANS: QuotePlan[] = [
  {
    id: 'business',
    label: 'Business',
    annualPriceJpy: TIER_POLICIES.business.annualPriceJpy,
    features: [
      '月次クォータ 200,000回',
      '出典明記不要',
      '優先サポート（平日2営業日以内）',
      '商用利用（第三者への提供・自社商品への組み込み）可',
    ],
  },
  {
    id: 'enterprise-base',
    label: 'Enterprise（基本）',
    annualPriceJpy: 1_000_000,
    features: [
      'CSV / JSON の一括納品（月次・全47県）',
      '優先サポート（平日1営業日以内）',
      '年次更新の事前通知',
      'データ再配布ライセンス（自社サービスへの組み込み）',
    ],
  },
  {
    id: 'enterprise-redistribute',
    label: 'Enterprise（＋再配布権）',
    annualPriceJpy: 1_500_000,
    features: ['Enterprise（基本）の内容に加え', '再配布権（自社の顧客へデータそのものを提供可）'],
  },
  {
    id: 'enterprise-full',
    label: 'Enterprise（フル）',
    annualPriceJpy: 2_500_000,
    features: ['再配布権を含むEnterpriseの内容に加え', 'DB納品（SQLite / PostgreSQLダンプ）'],
  },
];

export function getQuotePlan(id: QuotePlan['id']): QuotePlan {
  const plan = QUOTE_PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`unknown quote plan: ${id}`);
  return plan;
}
