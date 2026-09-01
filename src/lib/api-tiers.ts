/**
 * 公開データAPI（堀B）の課金ティア定義 — 純関数のみ（D1非依存・テスト可能）。
 *
 * DDレポート §H：受験データAPIのB2B相場は未成熟。RapidAPI流の4階層
 * （Free / Pro / Scale / Enterprise）＋ Stripe 従量を将来差すための「価格表」を、
 * まずコードの正準データとして固定する。実際の課金（Stripe）は後段だが、
 * レート制限・月次クォータ・出典義務はこの表だけで今すぐ施行できる。
 *
 * 思想（[[north-star-vision-2026-06]]）：
 *  - 匿名freeでも使える（後方互換・GEO被引用を止めない）が、ヘビーな自動利用には
 *    キー＋クォータを課して「誰がどれだけ使うか＝堀の証拠」を可視化し、課金へ橋渡しする。
 */

export type ApiTier = 'anonymous' | 'free' | 'pro' | 'business' | 'scale';

export interface TierPolicy {
  tier: ApiTier;
  label: string;
  /** スライディング窓（秒）あたりの最大リクエスト数＝瞬間バースト上限。 */
  ratePerMinute: number;
  /** 月次クォータ（0 = 実質無制限／Enterprise個別）。 */
  monthlyQuota: number;
  /** 出典明記が必須か（無料系は必須＝有料の差別化点①「出典明記不要」）。 */
  attributionRequired: boolean;
  /** 商用利用が標準で許諾されるか（被引用＝GEOの燃料なので無料でも可）。 */
  commercialUse: boolean;
  /** 優先サポート（SLA保証つき・有料の差別化点②）。 */
  prioritySupport: boolean;
  /** データ再配布ライセンス＋維持されるフィード・更新通知（年額・有料の差別化点③）。 */
  dataLicense: boolean;
  /** 価格表示（円・税別の目安。0=無料、-1=個別見積り）。月額課金のプランのみ使う。 */
  monthlyPriceJpy: number;
  /** 年額課金プランの価格（円）。0=対象外。Business/Enterpriseはここを使う（月額換算ではなく年額契約）。 */
  annualPriceJpy: number;
  /** 想定対象。 */
  audience: string;
  /** SLA文言。 */
  sla: string;
}

/**
 * ティアの正準テーブル。価格は「価値ベース」で設定（自前実装＝エンジニア数十万円＋毎年の要綱改訂保守の代替）。
 * Pro ¥9,800/月（B2B APIの標準入口）、Scale は年額データライセンス（個別）。¥3,000は安すぎて価値を過小評価する
 * シグナルになるため採らない。monthlyPriceJpy は目安表示で、実課金は Stripe 接続後に有効化する。
 */
export const TIER_POLICIES: Record<ApiTier, TierPolicy> = {
  anonymous: {
    tier: 'anonymous',
    label: 'Anonymous（キー無し）',
    // 2026-07-16: 30→5。AI引用・お試しは数回/分で足りる。自サイトUI(same-origin)は
    // api-auth側で別枠(30)を持つため実ユーザーには影響しない。エッジ側バインディング
    // (wrangler.jsonc の API_RATE_LIMIT_ANON)と数字を揃えること。
    //
    // 2026-09-01(API1-2・👤承認): 5→20。5に絞る根拠が失われたため戻す。
    //  ・守るべきデータはAPI1-1でキー必須にした（/api/schools/[pref] は Business 以上）。
    //    レート制限の役割は「安いエンドポイントの乱用防止」に変わった。
    //  ・/api/naishin は47都道府県を1レスポンスで返すため、回数制限はスクレイパーを止めていない
    //    （5回/分でも全県10分）。止まっていたのは評価しに来た人とAIアシスタントだけだった。
    //  ・AIアシスタントは「単発参照」しない（複数県の比較で容易に5回を超える）。
    //    匿名freeを置く目的がGEO被引用である以上、引用しようとする側を弾くのは目的と矛盾する。
    //  ・自サイトUI(same-origin)は別枠(30)のままなので実ユーザーへの影響は無い。
    ratePerMinute: 20,
    monthlyQuota: 0, // 月次は数えない（IP単位の窓のみ）
    attributionRequired: true,
    commercialUse: true,
    prioritySupport: false,
    dataLicense: false,
    monthlyPriceJpy: 0,
    annualPriceJpy: 0,
    audience: 'お試し・少量の手動利用・AIアシスタントの単発参照',
    sla: 'ベストエフォート（保証なし）',
  },
  free: {
    tier: 'free',
    label: 'Free（登録キー）',
    // 2026-07-16: 120→15。月次1万との整合(120/分は83分で月次到達=2桁の不整合だった)。
    //
    // 2026-09-01(API1-2の随伴修正): 15→30。匿名を20へ上げた結果 anonymous(20) > free(15) となり、
    // 「キーを登録する理由が無くなる」不整合が api-monetization.test.ts の単調増加テストで顕在化した。
    // 匿名だけ上げて放置するとFreeティアが死ぬため、Free側も上げて序列を保つ。
    // 30/分なら月次1万に到達するまで約5.5時間で、月次クォータとの結合も残る
    // （2026-07-16の「120/分＝83分で月次到達」ほどの2桁の不整合にはならない）。
    // ⚠️これはAPI1-2に付随して必要になった修正であり、API1-3(👤が中止を裁定)とは別件。
    ratePerMinute: 30,
    monthlyQuota: 10_000,
    attributionRequired: true,
    commercialUse: true,
    prioritySupport: false,
    dataLicense: false,
    monthlyPriceJpy: 0,
    annualPriceJpy: 0,
    audience: '個人開発・検証・小規模アプリ',
    sla: 'ベストエフォート（保証なし）',
  },
  pro: {
    tier: 'pro',
    label: 'Pro',
    ratePerMinute: 600,
    // 2026-08-13価格決定（ops/PRICING_OPTIONS.md）: 商用利用はBusinessへ誘導するため
    // 月次クォータをFreeと同水準の10,000に統一（旧200,000はBusinessへ移動）。
    monthlyQuota: 10_000,
    attributionRequired: false, // ★出典明記不要
    commercialUse: false, // ★2026-08-13: Proは非商用限定。商用はBusiness（第三者提供する場合はBusiness相当額を遡及請求）
    prioritySupport: true,
    dataLicense: false,
    monthlyPriceJpy: 9_800,
    annualPriceJpy: 117_600,
    audience: '個人開発者・社内利用・検証（非商用）',
    sla: 'SLAとしての保証は行わず、稼働実績を公開（障害時は契約期間相当分の翌月クレジット）',
  },
  business: {
    tier: 'business',
    label: 'Business',
    // 2026-08-13新設（ops/PRICING_OPTIONS.md）。旧Proの月次クォータ(200,000)をここへ移動。
    // ratePerMinuteはpro(600)とscale(3,000)の中間に置き、階層を単調増加に保つ。
    ratePerMinute: 1_200,
    monthlyQuota: 200_000,
    attributionRequired: false,
    commercialUse: true, // ★第三者への提供・自社商品への組み込みが可能
    prioritySupport: true,
    dataLicense: false,
    monthlyPriceJpy: -1, // 年額契約のため月額表示は使わない
    annualPriceJpy: 240_000, // 初年度価格（改定トリガーはops/PRICING_OPTIONS.md修正6）
    audience: '模試会社・塾管理SaaS・中堅塾本部（商用・自社サービス利用者への提供）',
    sla: 'SLAとしての保証は行わず、稼働実績を公開（障害時は契約期間を延長）',
  },
  scale: {
    tier: 'scale',
    label: 'Enterprise',
    ratePerMinute: 3_000,
    monthlyQuota: 0, // 個別
    attributionRequired: false,
    commercialUse: true,
    prioritySupport: true,
    dataLicense: true, // ★データ再配布＋維持フィード＋更新通知（年額ライセンス）
    monthlyPriceJpy: -1, // 年額契約のため月額表示は使わない
    annualPriceJpy: 1_000_000, // 基本料金。実提示は¥100万／¥150万（+再配布権）／¥250万（フル）の3点
    audience: '大規模EdTech・データライセンス（CSV/JSON定期更新の年額契約）',
    sla: '個別SLA・専用サポート（契約条件は個別に定める）',
  },
};

/**
 * 「金を払う理由」を機械可読に（フリーミアムの罠回避）。
 * 無料(anonymous/free)は被引用＝GEOの燃料なので per-query は開放するが、
 * 高レート・大量クォータ・出典明記不要・SLA・データ再配布は有料側にのみ置く。
 */
export interface TierCapability {
  label: string;
  /** 各ティアで使えるか。 */
  has: (p: TierPolicy) => boolean;
}
export const TIER_CAPABILITY_MATRIX: TierCapability[] = [
  { label: '内申点API（都度クエリ・AI被引用）', has: () => true },
  { label: 'CSV/JSON スナップショット取得', has: () => true },
  { label: '商用利用（第三者への提供・自社商品への組み込み）', has: (p) => p.commercialUse },
  { label: '高レート上限', has: (p) => p.ratePerMinute >= 600 },
  { label: '大量月次クォータ', has: (p) => p.monthlyQuota === 0 || p.monthlyQuota >= 200_000 },
  { label: '出典明記なしで利用', has: (p) => !p.attributionRequired },
  { label: '優先サポート / SLA', has: (p) => p.prioritySupport },
  { label: 'データ再配布ライセンス・更新通知フィード', has: (p) => p.dataLicense },
];

/** ティアの序列（低→高）。requireMinTier の判定に使う。 */
export const TIER_ORDER: readonly ApiTier[] = ['anonymous', 'free', 'pro', 'business', 'scale'];

/** ティアの序列インデックス（0=anonymous）。未知値は0扱い。 */
export function tierRank(tier: ApiTier): number {
  const i = TIER_ORDER.indexOf(tier);
  return i === -1 ? 0 : i;
}

/** tier が min 以上の序列かどうか。 */
export function tierAtLeast(tier: ApiTier, min: ApiTier): boolean {
  return tierRank(tier) >= tierRank(min);
}

/** DBに保存される tier 文字列（free/pro/business/scale）を安全に正規化する。 */
export function normalizeTier(raw: string | null | undefined): Exclude<ApiTier, 'anonymous'> {
  if (raw === 'pro' || raw === 'business' || raw === 'scale') return raw;
  return 'free';
}

export function getTierPolicy(tier: ApiTier): TierPolicy {
  return TIER_POLICIES[tier] ?? TIER_POLICIES.anonymous;
}

/** スライディング窓は1分固定。窓内の許容数を返す。 */
export const RATE_WINDOW_MS = 60_000;

/** 月次クォータの判定。quota=0（無制限）は常に true。 */
export function isWithinMonthlyQuota(used: number, tier: ApiTier): boolean {
  const policy = getTierPolicy(tier);
  if (policy.monthlyQuota <= 0) return true;
  return used < policy.monthlyQuota;
}

/** レート制限ヘッダ用の残数（窓内）。 */
export function remainingInWindow(usedInWindow: number, tier: ApiTier): number {
  const policy = getTierPolicy(tier);
  return Math.max(0, policy.ratePerMinute - usedInWindow);
}

/** 価格表示の人間可読フォーマット。年額契約プラン（annualPriceJpy>0）はそちらを優先表示する。 */
export function formatTierPrice(tier: ApiTier): string {
  const policy = getTierPolicy(tier);
  if (policy.annualPriceJpy > 0) {
    const monthlyEquivalent = Math.round(policy.annualPriceJpy / 12);
    return `年額 ¥${policy.annualPriceJpy.toLocaleString('ja-JP')}〜（月${monthlyEquivalent.toLocaleString('ja-JP')}円相当）`;
  }
  if (policy.monthlyPriceJpy < 0) return '個別見積り';
  if (policy.monthlyPriceJpy === 0) return '無料';
  return `月額 ¥${policy.monthlyPriceJpy.toLocaleString('ja-JP')}〜`;
}

/** 'YYYY-MM' 形式の当月キー（UTC基準・テスト可能なよう日付注入可）。 */
export function periodKey(now: Date = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}
