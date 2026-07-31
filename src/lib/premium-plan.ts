/**
 * 保護者向けプレミアムサブスク（Ω-9・Λ-10）の計画定義 — 純関数・データのみ（Stripe非依存・テスト可能）。
 *
 * 👤裁定「既存無料機能は一切有料化しない。新規価値（年次推移分析／PDF出力／複数子供管理等）のみ課金対象」
 * (fable5-fullaccel-backlog-2026-07 Λ-10行)に基づく計画表。api-tiers.tsのTIER_POLICIESと同じ
 * 「価格をコードの正準データとして固定し、実課金はStripe接続後に有効化する」設計を踏襲する。
 *
 * **🚨2026-08-01 着手前調査で発見した設計上の前提条件（次の実装に進む前に👤裁定が必要・
 * loop-question-note参照）**: PREMIUM_FEATURESの3機能（年次推移分析／PDF出力／複数子供管理）は
 * いずれも「同じ利用者の入力・結果を時間を跨いで／複数人分ひも付けて保持する」ことが前提だが、
 * このサイトには保護者向けの永続的な利用者識別の仕組み（ログイン・アカウント）が一切存在しない
 * （既存はadmin-auth.ts=運営者トークン1本・api-auth.ts=B2B APIキーのみで、いずれも一般保護者向けの
 * アカウント機構ではない）。この計画定義（価格表・機能一覧・既存無料機能を変えない不変条件）までは
 * アカウント設計に依存せず今回実装できるが、3機能本体の実装は「アカウントを新設するか」
 * 「ブラウザローカル(localStorage)完結の簡易版にするか」の設計判断が先に必要なため、
 * 本ファイルでは機能を「計画中(planned)」として一覧化するに留める。
 */

export interface PremiumFeature {
  key: 'year-over-year-trends' | 'pdf-export' | 'multi-child-management';
  label: string;
  description: string;
  /** 'planned'=計画定義のみ（本体実装は前提設計待ち）。'implemented'=実際に機能する。 */
  status: 'planned' | 'implemented';
}

export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    key: 'year-over-year-trends',
    label: '年次推移分析',
    description: '内申点・偏差値の計算結果を年度を跨いで記録し、成績の推移をグラフで振り返る。',
    status: 'planned',
  },
  {
    key: 'pdf-export',
    label: 'PDF出力',
    description: '計算結果・推移レポートを印刷・保存しやすいPDF形式で書き出す。',
    status: 'planned',
  },
  {
    key: 'multi-child-management',
    label: '複数子供管理',
    description: '兄弟姉妹など複数の子供の内申点・偏差値を1つの画面でまとめて管理する。',
    status: 'planned',
  },
];

export interface PremiumPlan {
  tier: 'premium';
  label: string;
  /** 価格表示（円・税別の目安）。-1=未定（👤が決定するまでコードに実額を書かない）。 */
  monthlyPriceJpy: number;
  features: PremiumFeature[];
  /** 既存の無料機能は本プランの新設に関わらず永久に無料のまま、という不変条件の明文化。 */
  freeFeaturesRemainFreeForever: true;
}

export const PREMIUM_PLAN: PremiumPlan = {
  tier: 'premium',
  label: 'プレミアム（保護者向け・準備中）',
  monthlyPriceJpy: -1,
  features: PREMIUM_FEATURES,
  freeFeaturesRemainFreeForever: true,
};

export function formatPremiumPriceLabel(plan: PremiumPlan): string {
  if (plan.monthlyPriceJpy < 0) return '価格未定（準備中）';
  return `月額 ¥${plan.monthlyPriceJpy.toLocaleString('ja-JP')}〜（税別目安）`;
}
