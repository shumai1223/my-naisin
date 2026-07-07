/**
 * 名簿velocity＆7/20判定ゲート（Build 3）の純関数群＝受験期の運用を1画面に圧縮する統治装置。
 *
 * 北極星（[[session-2026-07-04-oneshot-revenue-architecture]]）：
 *   今季の桁レバーは C_p（保護者起点クリック/月）のみ。7/20 に「反証ゲート」を置き、
 *   クリックが伸びたか（N倍）・発生が出たか（M件）で go / iterate / pivot を判定する。
 *   ¥予測は書かない（[[no-revenue-projections-guideline]]）＝先行指標だけで採点する。
 *
 * ここはすべて window 非依存の純関数（サーバー/クライアント共通・ユニットテスト可能）：
 *  - weekStartOf / bucketDailyByWeek … 日次カウントを月曜始まりの週次に畳む（velocity可視化）
 *  - evaluateJulyGate ……………………… 7/20 ゲートの判定（now を DI 可能＝境界テスト可能）
 */

/** 7/20 反証ゲートの判定期限（この日を過ぎたら go/iterate/pivot を確定表示）。 */
export const GATE_DEADLINE = '2026-07-20';

/** クリックが「前季比N倍」を満たしたと見なす目安（流入が伸びているかの閾値）。 */
export const GATE_CLICK_MULTIPLE_TARGET = 2;

const DAY_MS = 86_400_000;

/** 月曜始まりの週の開始日（UTC・'YYYY-MM-DD'）を返す。 */
export function weekStartOf(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay(); // 0=Sun..6=Sat
  const offset = (day + 6) % 7; // Mon=0
  d.setUTCDate(d.getUTCDate() - offset);
  return d.toISOString().slice(0, 10);
}

export interface DailyCount {
  /** 'YYYY-MM-DD'（UTC）。 */
  date: string;
  count: number;
}

export interface WeekBucket {
  /** 週の開始日（月曜・'YYYY-MM-DD'）。 */
  weekStart: string;
  /** 表示ラベル（例 '7/6'）。 */
  label: string;
  count: number;
}

/**
 * 日次カウント配列を、直近 weeks 週（月曜始まり）のバケットに畳む（古い→新しい順）。
 * 対象週のバケットは必ず weeks 個そろえる（データが無い週は count:0＝空DBでもゼロ埋めで返る）。
 * 範囲外・不正日付の行は無視する（信頼の堀＝外部入力を信用しない）。
 */
export function bucketDailyByWeek(daily: DailyCount[], weeks = 8, now: Date = new Date()): WeekBucket[] {
  const w = Math.max(1, Math.min(52, Math.round(weeks)));
  const base = new Date(`${weekStartOf(now)}T00:00:00Z`);

  const starts: string[] = [];
  for (let i = w - 1; i >= 0; i--) {
    const dt = new Date(base.getTime() - i * 7 * DAY_MS);
    starts.push(dt.toISOString().slice(0, 10));
  }

  const counts = new Map<string, number>(starts.map((s) => [s, 0]));
  for (const row of daily) {
    if (!row || !row.date) continue;
    const parsed = new Date(`${row.date}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) continue;
    const ws = weekStartOf(parsed);
    if (counts.has(ws)) counts.set(ws, (counts.get(ws) ?? 0) + (Number(row.count) || 0));
  }

  return starts.map((s) => {
    const dt = new Date(`${s}T00:00:00Z`);
    return { weekStart: s, label: `${dt.getUTCMonth() + 1}/${dt.getUTCDate()}`, count: counts.get(s) ?? 0 };
  });
}

export type GateVerdict = 'pending' | 'go' | 'iterate' | 'pivot';

export interface JulyGateInput {
  /** 判定日（既定 now）。 */
  now?: Date;
  /** 判定期限（既定 GATE_DEADLINE=7/20）。8/20・9/20等の月次ゲートにも同じ関数を再利用できる（I-3）。 */
  deadlineIso?: string;
  /** 今季（直近N日）の信頼クリック実数。 */
  clicks: number;
  /** 前季（そのさらに前N日）の信頼クリック実数。 */
  clicksPrev: number;
  /** 配信可能な本物リード累計（名簿）。 */
  leads: number;
  /** ASP実測の発生件数（分からなければ0）。 */
  conversions: number;
}

export interface JulyGate {
  deadline: string;
  /** 判定日まで残り日数（過ぎていたら0）。 */
  daysLeft: number;
  /** 期限を過ぎた＝判定確定フェーズか。 */
  decided: boolean;
  /** クリックの前季比（clicks/clicksPrev）。前季0はnull（倍率を出せない）。 */
  clickMultiple: number | null;
  clickMultipleLabel: string;
  clicks: number;
  clicksPrev: number;
  leads: number;
  conversions: number;
  verdict: GateVerdict;
  verdictLabel: string;
  rationale: string;
}

function endOfDayMs(iso: string): number {
  return new Date(`${iso}T00:00:00Z`).getTime();
}

/**
 * 7/20 反証ゲートを判定する。
 *  - 期限前は 'pending'（まだ判定しない）。
 *  - 期限後：発生が1件でも出ていれば 'go'（モデル成立）。
 *            発生0でもクリックが前季比 target 倍以上なら 'iterate'（流入は伸びた＝律速はオファー側）。
 *            どちらも無ければ 'pivot'（仮説の見直し）。
 * ¥予測はしない＝クリック倍率・発生件数・名簿という先行指標だけで採点する。
 */
export function evaluateJulyGate(input: JulyGateInput): JulyGate {
  const now = input.now ?? new Date();
  const deadline = input.deadlineIso ?? GATE_DEADLINE;
  const deadlineMs = endOfDayMs(deadline);
  const decided = now.getTime() >= deadlineMs;
  const daysLeft = Math.max(0, Math.ceil((deadlineMs - now.getTime()) / DAY_MS));

  const clickMultiple = input.clicksPrev > 0 ? input.clicks / input.clicksPrev : null;
  const clickMultipleLabel = clickMultiple === null ? '—' : `${clickMultiple.toFixed(1)}倍`;

  let verdict: GateVerdict;
  let verdictLabel: string;
  let rationale: string;

  if (!decided) {
    verdict = 'pending';
    verdictLabel = '判定前';
    rationale = `${deadline}まであと${daysLeft}日。クリック倍率と発生件数を貯めて当日に判定する。`;
  } else if (input.conversions > 0) {
    verdict = 'go';
    verdictLabel = 'GO（モデル成立）';
    rationale = `発生が${input.conversions}件出た＝保護者起点の換金が成立。この面を増やす。`;
  } else if (clickMultiple !== null && clickMultiple >= GATE_CLICK_MULTIPLE_TARGET) {
    verdict = 'iterate';
    verdictLabel = 'ITERATE（オファー側が律速）';
    rationale = `クリックは前季比${clickMultipleLabel}に伸びたが発生0＝律速はオファー側。導線でなく送客先（案件）を差し替える。`;
  } else {
    verdict = 'pivot';
    verdictLabel = 'PIVOT（仮説の見直し）';
    rationale = 'クリックも発生も動かず＝保護者接点の仮説を見直す（面・コピー・タイミング）。';
  }

  return {
    deadline,
    daysLeft,
    decided,
    clickMultiple,
    clickMultipleLabel,
    clicks: input.clicks,
    clicksPrev: input.clicksPrev,
    leads: input.leads,
    conversions: input.conversions,
    verdict,
    verdictLabel,
    rationale,
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * 月次ゲート定例化：7/20→8/20→9/20（I-3）。
 * 9/30出荷凍結までの3回のチェックポイントと、各回のPIVOT条件を今のうちに明文化しておく。
 * 判定ロジック自体はevaluateJulyGateと完全に同一（GO/ITERATE/PIVOTの基準を使い回す＝
 * 8月・9月になってから基準を再発明・再議論する必要が無い）。deadlineIsoを渡して呼べば良い。
 * ──────────────────────────────────────────────────────────────────────── */

export interface GateMilestone {
  id: string;
  /** 判定期限（'YYYY-MM-DD'）。evaluateJulyGateのdeadlineIsoにそのまま渡せる。 */
  deadlineIso: string;
  label: string;
  /** この回で確認すること・前回からの変化点（運用メモ）。 */
  focus: string;
}

/** 9/30出荷凍結までの月次ゲート日程（正準・単一ソース）。 */
export const GATE_SCHEDULE: GateMilestone[] = [
  {
    id: 'july-20',
    deadlineIso: GATE_DEADLINE,
    label: '7/20 初速ゲート',
    focus: '保護者接点（C_p）の反証。発生1件でGO、クリック前季比2倍以上でITERATE、どちらも無ければPIVOT。',
  },
  {
    id: 'august-20',
    deadlineIso: '2026-08-20',
    label: '8/20 中間ゲート',
    focus: '同じGO/ITERATE/PIVOT基準を再適用。7/20からの1ヶ月で発生・クリックが伸びたかを確認し、9/30出荷凍結に向けた残りタスクの優先度を調整する。',
  },
  {
    id: 'september-20',
    deadlineIso: '2026-09-20',
    label: '9/20 最終ゲート',
    focus: '9/30新規開発凍結の10日前の最終チェック。同基準で判定し、10月以降の特単交渉（D-1）・my-shingaku仕上げへの工数配分を確定する。',
  },
];

/**
 * 現在時刻からみて「次に評価すべき」マイルストーンを返す（未到来の最初のもの）。
 * 全て過ぎていれば最後（9/20）を返す＝週次KPIレポート等が常にどれかを指せるようにする。
 */
export function activeGateMilestone(now: Date = new Date()): GateMilestone {
  for (const m of GATE_SCHEDULE) {
    if (now.getTime() <= endOfDayMs(m.deadlineIso)) return m;
  }
  return GATE_SCHEDULE[GATE_SCHEDULE.length - 1];
}

/* ────────────────────────────────────────────────────────────────────────
 * 名簿3,000逆算velocity＋週次ボトルネック特定（C-1）。
 * 「必要velocity≈20登録/日」は固定値ではなく、目標名簿数(3,000)と冬窓オープン(11/15＝
 * 新規開発凍結・収穫オペ移行日)までの残日数から逆算する。実測(現velocity)との差分と、
 * ファネルのどの遷移が一番歪んでいるか（ボトルネック）を機械的に特定する。
 * ──────────────────────────────────────────────────────────────────────── */

/** 名簿逆算の既定目標（[[fable5-fullaccel-backlog-2026-07]] TIER C）。 */
export const ROSTER_TARGET = 3000;
/** 冬窓オープン＝この日までに名簿を積み上げる（以降は新規開発凍結・収穫オペのみ）。 */
export const ROSTER_TARGET_DEADLINE = '2026-11-15';

export interface RosterVelocityInput {
  now?: Date;
  /** 名簿累計（現在値）。 */
  currentRoster: number;
  /** 目標名簿数（既定 ROSTER_TARGET=3000）。 */
  targetRoster?: number;
  /** 目標期限（既定 ROSTER_TARGET_DEADLINE=冬窓オープン）。 */
  deadlineIso?: string;
  /** 直近の実測ペース（1日あたりのlead_submit件数）。省略時は達成率を出さない。 */
  observedDailyVelocity?: number;
}

export interface RosterVelocityGate {
  targetRoster: number;
  currentRoster: number;
  /** 目標までの残り件数（達成済みなら0）。 */
  gap: number;
  /** 期限までの残日数（最低1＝ゼロ除算回避）。 */
  daysLeft: number;
  /** 逆算した必要日次velocity（gap/daysLeft）。 */
  requiredDailyVelocity: number;
  requiredWeeklyVelocity: number;
  observedDailyVelocity: number | null;
  /** 実測/必要（1.0が「必要ペースちょうど」）。observedDailyVelocity省略時はnull。 */
  paceRatio: number | null;
  onTrack: boolean | null;
}

/** 名簿3,000逆算ゲート（C-1）：必要velocityを固定値でなく目標・期限・現在値から都度算出する。 */
export function evaluateRosterVelocityTarget(input: RosterVelocityInput): RosterVelocityGate {
  const now = input.now ?? new Date();
  const targetRoster = input.targetRoster ?? ROSTER_TARGET;
  const deadlineIso = input.deadlineIso ?? ROSTER_TARGET_DEADLINE;
  const daysLeft = Math.max(1, Math.ceil((endOfDayMs(deadlineIso) - now.getTime()) / DAY_MS));
  const gap = Math.max(0, targetRoster - input.currentRoster);
  const requiredDailyVelocity = gap / daysLeft;
  const observedDailyVelocity = input.observedDailyVelocity ?? null;
  const paceRatio =
    observedDailyVelocity !== null && requiredDailyVelocity > 0 ? observedDailyVelocity / requiredDailyVelocity : null;

  return {
    targetRoster,
    currentRoster: input.currentRoster,
    gap,
    daysLeft,
    requiredDailyVelocity,
    requiredWeeklyVelocity: requiredDailyVelocity * 7,
    observedDailyVelocity,
    paceRatio,
    onTrack: paceRatio === null ? null : paceRatio >= 1,
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * Consent捕捉率の定点観測（I-5）。
 * GA4はConsent Mode未同意者を計測できず、GSC実クリックの一部しかGA4に現れない
 * （[[ga4-data-snapshot-2026-06]]の実測比 約5.6x）。この比率が急変したら、トラフィックの
 * 実態変化ではなく計測側の事故（GTM崩れ・同意バナー破損・GA4タグ抜け等）を疑う合図にする。
 * ──────────────────────────────────────────────────────────────────────── */

/** Consent捕捉率（GSCクリック / GA4 organicセッション）の実測基準値。 */
export const CONSENT_CAPTURE_RATIO_BASELINE = 5.6;
/** 基準からの許容乖離（相対値。0.5=±50%）。これを超えたら計測事故を疑って要確認。 */
export const CONSENT_CAPTURE_RATIO_TOLERANCE = 0.5;

export interface ConsentCaptureInput {
  /** GSCの実クリック数（信頼できる一次値）。 */
  gscClicks: number;
  /** GA4のOrganic Searchセッション数（Consent Mode下の過少計測値）。 */
  ga4OrganicSessions: number;
}

export interface ConsentCaptureResult {
  /** gscClicks / ga4OrganicSessions。セッション0はnull（判定不可）。 */
  ratio: number | null;
  baseline: number;
  /** (ratio-baseline)/baseline。ratioがnullならnull。 */
  deviation: number | null;
  /** |deviation| が許容乖離を超えたか＝計測事故の疑い。 */
  triggered: boolean;
  detail: string;
}

/** Consent捕捉率が基準から乖離していないかを判定する（純粋関数・I-5）。 */
export function evaluateConsentCapture(
  input: ConsentCaptureInput,
  baseline: number = CONSENT_CAPTURE_RATIO_BASELINE,
  tolerance: number = CONSENT_CAPTURE_RATIO_TOLERANCE
): ConsentCaptureResult {
  if (input.ga4OrganicSessions <= 0) {
    return {
      ratio: null,
      baseline,
      deviation: null,
      triggered: false,
      detail: 'GA4 organicセッションが0件のため判定不可',
    };
  }
  const ratio = input.gscClicks / input.ga4OrganicSessions;
  const deviation = (ratio - baseline) / baseline;
  const triggered = Math.abs(deviation) > tolerance;
  return {
    ratio,
    baseline,
    deviation,
    triggered,
    detail: `実測比 ${ratio.toFixed(1)}x（基準${baseline}x・乖離${(deviation * 100).toFixed(0)}%）`,
  };
}

export interface FunnelStage {
  id: string;
  label: string;
  count: number;
}

export interface FunnelBottleneck {
  fromLabel: string;
  toLabel: string;
  fromCount: number;
  toCount: number;
  /** (fromCount - toCount) / fromCount。負のドロップ（増加）は0に丸める。 */
  dropRatio: number;
}

/**
 * 隣接するファネル段階のうち、相対ドロップ率が最大の遷移（＝ボトルネック）を返す。
 * fromCount<=0の遷移は比較不能として除外。stagesが2件未満はnull。
 * 週次でこれを回せば「どこで落ちているか」を毎回機械的に特定できる（C-1）。
 */
export function findFunnelBottleneck(stages: FunnelStage[]): FunnelBottleneck | null {
  let worst: FunnelBottleneck | null = null;
  for (let i = 1; i < stages.length; i += 1) {
    const prev = stages[i - 1];
    const cur = stages[i];
    if (prev.count <= 0) continue;
    const dropRatio = Math.max(0, (prev.count - cur.count) / prev.count);
    if (!worst || dropRatio > worst.dropRatio) {
      worst = { fromLabel: prev.label, toLabel: cur.label, fromCount: prev.count, toCount: cur.count, dropRatio };
    }
  }
  return worst;
}

/* ────────────────────────────────────────────────────────────────────────
 * トリップワイヤー4本（I-1：週次KPIレポートの常設監視項目）。
 * 戦略決定 §1-3（[[fable5-fullaccel-backlog-2026-07]]）で定義された、Google一点依存下で
 * 「悪化を検知したら即座に気づく」ための閾値ベースの純関数。¥予測はしない＝先行指標のみ。
 * ──────────────────────────────────────────────────────────────────────── */

/** /hensachi のCTRがこの値未満だと「悪化」とみなす閾値（%）。通常CTR4.5%からの−30%目安。 */
export const HENSACHI_CTR_ALERT_THRESHOLD = 3.2;

/** ai_referral のシェア（%）がこれを超えたら要観察（AI検索への依存度上昇）。 */
export const AI_REFERRAL_SHARE_ALERT_THRESHOLD = 10;

export interface WeeklyCtr {
  /** 週の開始日（'YYYY-MM-DD'）。古い→新しい順で渡す。 */
  weekStart: string;
  /** その週のCTR（%、0-100）。 */
  ctrPercent: number;
}

export interface TripwireInput {
  /** /hensachi の週次CTR履歴（古い→新しい順・直近4週以上が理想）。 */
  hensachiWeeklyCtr: WeeklyCtr[];
  /** ツール面（複数ページ合算）の表示回数・クリック数（今週 vs 前週）。 */
  toolPages: { impNow: number; impPrev: number; clicksNow: number; clicksPrev: number };
  /** ai_referral（AI検索・回答エンジン経由の着地）が全トラフィックに占めるシェア（%）。 */
  aiReferralSharePercent: number;
  /** 「内申点 計算」ヘッドクエリのCTR（%、今週 vs 前週）。 */
  headQueryCtrNow: number;
  headQueryCtrPrev: number;
}

export interface TripwireResult {
  id: 'hensachi-ctr' | 'tool-imp-click-divergence' | 'ai-referral-share' | 'head-query-ctr-halved';
  label: string;
  triggered: boolean;
  detail: string;
}

/**
 * トリップワイヤー4本を評価する。
 *  ①/hensachi CTRが4週連続で閾値未満（構造的な悪化・一時的な揺れではない）
 *  ②ツール面：表示回数は増えているのにクリックが横ばい＝タイトル/スニペットの劣化 or 検索意図とのズレ
 *  ③ai_referralシェアが閾値超＝AI検索への依存度が上がっている（Google一点依存の中の新リスク）
 *  ④「内申点 計算」ヘッドクエリのCTRが半減＝最重要語の競合悪化 or AI Overview吸収の兆候
 */
export function evaluateTripwires(input: TripwireInput): TripwireResult[] {
  const last4 = input.hensachiWeeklyCtr.slice(-4);
  const hensachiTriggered =
    last4.length === 4 && last4.every((w) => w.ctrPercent < HENSACHI_CTR_ALERT_THRESHOLD);

  const { impNow, impPrev, clicksNow, clicksPrev } = input.toolPages;
  const impGrowth = impPrev > 0 ? (impNow - impPrev) / impPrev : 0;
  const clickGrowth = clicksPrev > 0 ? (clicksNow - clicksPrev) / clicksPrev : 0;
  // 表示は10%以上伸びたのにクリックは5%未満の伸び（乖離）＝CTRが実質悪化している。
  const toolDivergenceTriggered = impPrev > 0 && impGrowth >= 0.1 && clickGrowth < 0.05;

  const aiReferralTriggered = input.aiReferralSharePercent > AI_REFERRAL_SHARE_ALERT_THRESHOLD;

  const headQueryTriggered =
    input.headQueryCtrPrev > 0 && input.headQueryCtrNow <= input.headQueryCtrPrev / 2;

  return [
    {
      id: 'hensachi-ctr',
      label: '/hensachi CTR 4週連続低下',
      triggered: hensachiTriggered,
      detail:
        last4.length < 4
          ? `週次データが${last4.length}週分しかなく判定不可（4週分必要）`
          : `直近4週のCTR: ${last4.map((w) => `${w.ctrPercent.toFixed(1)}%`).join(' → ')}（閾値${HENSACHI_CTR_ALERT_THRESHOLD}%）`,
    },
    {
      id: 'tool-imp-click-divergence',
      label: 'ツール面：表示増×クリック横ばいの乖離',
      triggered: toolDivergenceTriggered,
      detail: `表示 ${(impGrowth * 100).toFixed(0)}% / クリック ${(clickGrowth * 100).toFixed(0)}%（今週 imp${impNow.toLocaleString('ja-JP')}/click${clicksNow.toLocaleString('ja-JP')}）`,
    },
    {
      id: 'ai-referral-share',
      label: 'ai_referral シェア上昇',
      triggered: aiReferralTriggered,
      detail: `シェア ${input.aiReferralSharePercent.toFixed(1)}%（閾値${AI_REFERRAL_SHARE_ALERT_THRESHOLD}%）`,
    },
    {
      id: 'head-query-ctr-halved',
      label: '「内申点 計算」ヘッドクエリCTR半減',
      triggered: headQueryTriggered,
      detail: `今週${input.headQueryCtrNow.toFixed(1)}% / 前週${input.headQueryCtrPrev.toFixed(1)}%`,
    },
  ];
}
