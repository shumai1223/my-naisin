/**
 * リードマグネット（名簿登録の“即時の見返り”）の純関数群＝A2/A5 の中核。
 *
 * 北極星（[[monetization-reality-2026-06]] / [[fable5-master-plan-2026-06]]）：
 *   最大ボトルネックは lead_submit=0（名簿velocityゼロ）。
 *   従来の SaveResultCTA は登録成功後に「ありがとう」と出すだけで、登録の“見返り”がゼロだった。
 *   登録の瞬間に「結果カード（画像）」「おうちの人に送る導線（橋②）」「次の一手（内部回遊）」を
 *   その場で渡すと、(1)登録の動機（互恵性）が生まれ lead_submit が上がり、(2)同時に橋②バトン
 *   （生徒→保護者）と内部リンク回遊（SEO）も同じ瞬間に発火する＝1アクションで3つの堀を同時に進める。
 *
 * ここはすべて window 非依存の純関数（サーバー/クライアント共通・ユニットテスト可能）。
 * 既存資産を再利用するだけで新しい外部依存は持たない：
 *   - encodeSharePayload / buildParentSharePath（[[share]]）… カードURL・保護者バトンURLを生成
 *   - LeadSource（[[lead]]）……………………………………… 文脈に応じた「次の一手」を決定
 */

import { encodeSharePayload, buildParentSharePath, type ParentShareContext } from '@/lib/share';
import type { LeadSource } from '@/lib/lead';

export interface LeadMagnetContext {
  /** 登録が発生した面（セグメント／次の一手の決定に使う）。 */
  source: LeadSource;
  prefectureCode?: string;
  prefectureName?: string;
  /** 指標値（内申点／偏差値／評定平均／総合得点 …）。 */
  score?: number;
  /** 満点。カード・保護者バトンの生成にはこれが必要。 */
  max?: number;
  /** 目標値。 */
  target?: number;
  /** 目標までの差（正＝不足／0以下＝達成）。 */
  gap?: number;
  /** 学年（1/2/3）。 */
  grade?: number;
  /** 指標ラベル（未指定なら source から既定を導出）。 */
  metricLabel?: string;
}

/** 「次の一手」＝登録直後に渡す内部回遊リンク（広告ではなく“役立つ次の一歩”）。 */
export interface LeadMagnetNextStep {
  href: string;
  label: string;
  description: string;
}

export interface LeadMagnet {
  /** 成功見出し（何が手に入ったかを名指しする）。 */
  headline: string;
  /** 補足（受け取り内容の説明）。 */
  subline: string;
  /** 結果カード画像のパス（/api/card?d=...）。score+max が無ければ null。 */
  cardPath: string | null;
  /** 橋②：おうちの人に送るパス（/hogosha?...）。score+max が無ければ null。 */
  parentSharePath: string | null;
  /** 文脈に応じた次の一手（常に1つ返す＝登録者を必ず次の役立つページへ送る）。 */
  nextStep: LeadMagnetNextStep;
  /** 名簿セグメントの人間可読ラベル（成功メッセージ・運用ログ用）。 */
  segmentLabel: string;
}

function isNum(v: number | null | undefined): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

const HENSACHI_SOURCES: ReadonlySet<LeadSource> = new Set<LeadSource>([
  'hensachi',
  'hensachi-kyoka-betsu',
  'hensachi-shiboukou',
  'hensachi-moshi',
]);

/** source から既定の指標ラベルを導出（呼び出し側が metricLabel を渡さなかったとき）。 */
export function defaultMetricLabel(source: LeadSource): string {
  if (HENSACHI_SOURCES.has(source)) return '偏差値';
  if (source === 'hyotei-heikin') return '評定平均';
  return '内申点';
}

/**
 * 文脈に応じた「次の一手」を決める（純粋・決定論）。
 * 広告ではなく“役立つ内部ページ”へ送る＝登録者の満足度・内部リンク回遊（SEO）の両取り。
 */
export function leadMagnetNextStep(ctx: LeadMagnetContext): LeadMagnetNextStep {
  const { source, gap } = ctx;

  // 偏差値ツール経由：偏差値の上げ方へ。
  if (HENSACHI_SOURCES.has(source)) {
    return {
      href: '/hensachi/agekata',
      label: '偏差値の上げ方を見る',
      description: '今の偏差値から、効率よく伸ばすための手順をまとめています。',
    };
  }

  // 評定平均ツール経由：推薦・併願優遇の基準確認へ（評定が効く意思決定）。
  if (source === 'hyotei-heikin') {
    return {
      href: '/hyotei-heikin/suisen-kijun',
      label: '推薦・併願優遇の評定基準を見る',
      description: '評定平均でどの推薦・私立併願優遇が狙えるか、基準を確認できます。',
    };
  }

  // 内申点系（result / gap-target / prefecture / home）：ギャップで出し分け。
  if (isNum(gap) && gap > 0) {
    return {
      href: '/naishin-age-kata',
      label: `あと${gap}点を埋める内申点の上げ方`,
      description: '残りの定期テストと提出物で内申点を動かす、具体的な手順を見られます。',
    };
  }
  if (isNum(gap) && gap <= 0) {
    return {
      href: '/koukou-hiyou',
      label: '高校3年間の費用を試算する',
      description: '合格圏が見えたら、次は進学後の費用。公立・私立の3年間を試算できます。',
    };
  }
  return {
    href: '/naishin-age-kata',
    label: '内申点の上げ方を見る',
    description: '今の内申点から、効率よく上げるための手順をまとめています。',
  };
}

/** 登録の文脈から ParentShareContext（共有ペイロード）を組む。score+max が揃わなければ null。 */
function shareContext(ctx: LeadMagnetContext): ParentShareContext | null {
  if (!isNum(ctx.score) || !isNum(ctx.max)) return null;
  return {
    prefectureCode: ctx.prefectureCode,
    prefectureName: ctx.prefectureName,
    score: ctx.score,
    max: ctx.max,
    target: isNum(ctx.target) ? ctx.target : null,
    gap: isNum(ctx.gap) ? ctx.gap : null,
    grade: isNum(ctx.grade) ? ctx.grade : null,
    metricLabel: ctx.metricLabel ?? defaultMetricLabel(ctx.source),
  };
}

/** 名簿セグメントの人間可読ラベル。 */
function segmentLabelFor(ctx: LeadMagnetContext): string {
  const metric = ctx.metricLabel ?? defaultMetricLabel(ctx.source);
  const parts = [ctx.prefectureName, isNum(ctx.grade) ? `中${ctx.grade}` : undefined, metric].filter(
    Boolean
  ) as string[];
  return parts.join('・');
}

/**
 * 登録成功直後に渡す“見返り”一式を組み立てる（純粋・決定論）。
 * - cardPath / parentSharePath は score+max が揃ったときだけ（情報ページの登録では null＝次の一手のみ）。
 * - nextStep は常に1つ返す（登録者を必ず役立つ内部ページへ送る）。
 */
export function buildLeadMagnet(ctx: LeadMagnetContext): LeadMagnet {
  const share = shareContext(ctx);
  const cardPath = share ? `/api/card?d=${encodeSharePayload(share)}` : null;
  const parentSharePath = share ? buildParentSharePath(share) : null;
  const metric = ctx.metricLabel ?? defaultMetricLabel(ctx.source);

  const hasGapUnmet = isNum(ctx.gap) && ctx.gap > 0;
  const headline = cardPath
    ? `登録完了！この${metric}を「成績カード」で受け取れます`
    : '登録完了！受験情報をお届けします';
  const subline = hasGapUnmet
    ? `「あと${ctx.gap}点」を受験本番まで一緒に追いかけます。まずは下から成績カードを保存し、おうちの人にも共有しておきましょう。`
    : '受験本番まで、対策のコツと志望校の最新情報を無料でお届けします。下から成績カードの保存・共有ができます。';

  return {
    headline,
    subline,
    cardPath,
    parentSharePath,
    nextStep: leadMagnetNextStep(ctx),
    segmentLabel: segmentLabelFor(ctx),
  };
}
