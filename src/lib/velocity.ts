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
  const deadlineMs = endOfDayMs(GATE_DEADLINE);
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
    rationale = `7/20まであと${daysLeft}日。クリック倍率と発生件数を貯めて当日に判定する。`;
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
    deadline: GATE_DEADLINE,
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
