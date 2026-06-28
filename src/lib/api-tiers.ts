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

export type ApiTier = 'anonymous' | 'free' | 'pro' | 'scale';

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
  /** 価格表示（円・税別の目安。0=無料、-1=個別見積り）。 */
  monthlyPriceJpy: number;
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
    ratePerMinute: 30,
    monthlyQuota: 0, // 月次は数えない（IP単位の窓のみ）
    attributionRequired: true,
    commercialUse: true,
    prioritySupport: false,
    dataLicense: false,
    monthlyPriceJpy: 0,
    audience: 'お試し・少量の手動利用・AIアシスタントの単発参照',
    sla: 'ベストエフォート（保証なし）',
  },
  free: {
    tier: 'free',
    label: 'Free（登録キー）',
    ratePerMinute: 120,
    monthlyQuota: 10_000,
    attributionRequired: true,
    commercialUse: true,
    prioritySupport: false,
    dataLicense: false,
    monthlyPriceJpy: 0,
    audience: '個人開発・検証・小規模アプリ',
    sla: 'ベストエフォート（保証なし）',
  },
  pro: {
    tier: 'pro',
    label: 'Pro',
    ratePerMinute: 600,
    monthlyQuota: 200_000,
    attributionRequired: false, // ★出典明記不要（商用アプリの実需）
    commercialUse: true,
    prioritySupport: true, // ★SLA・優先サポート
    dataLicense: false,
    monthlyPriceJpy: 9_800,
    audience: '受験アプリ・進路SaaS・塾チェーンの本番組み込み',
    sla: '99.9%（ベストエフォート・障害時は翌月クレジット）',
  },
  scale: {
    tier: 'scale',
    label: 'Scale / Enterprise',
    ratePerMinute: 3_000,
    monthlyQuota: 0, // 個別
    attributionRequired: false,
    commercialUse: true,
    prioritySupport: true,
    dataLicense: true, // ★データ再配布＋維持フィード＋更新通知（年額ライセンス）
    monthlyPriceJpy: -1, // 個別見積り（年額データライセンス含む）
    audience: '大規模EdTech・データライセンス（CSV/JSON定期更新の年額契約）',
    sla: '個別SLA・専用サポート',
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
  { label: '高レート上限', has: (p) => p.ratePerMinute >= 600 },
  { label: '大量月次クォータ', has: (p) => p.monthlyQuota === 0 || p.monthlyQuota >= 200_000 },
  { label: '出典明記なしで利用', has: (p) => !p.attributionRequired },
  { label: '優先サポート / SLA', has: (p) => p.prioritySupport },
  { label: 'データ再配布ライセンス・更新通知フィード', has: (p) => p.dataLicense },
];

/** DBに保存される tier 文字列（free/pro/scale）を安全に正規化する。 */
export function normalizeTier(raw: string | null | undefined): Exclude<ApiTier, 'anonymous'> {
  if (raw === 'pro' || raw === 'scale') return raw;
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

/** 価格表示の人間可読フォーマット。 */
export function formatTierPrice(tier: ApiTier): string {
  const policy = getTierPolicy(tier);
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
