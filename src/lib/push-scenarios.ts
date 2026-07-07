/**
 * Web Push 配信シナリオ（C-3）＝push基盤(H-NEW)は実装済みだが「いつ・誰に・何を送るか」が
 * 都度の手打ちCLI引数任せだった穴を埋める単一ソース。broadcast-templates.ts（メール版）と同じ設計。
 *
 * 2シナリオ：
 *  ① recalc-reminder … 計算（≒購読）から約30日後に「そろそろ再計算しませんか」を送る再訪トリガー。
 *     purchasedAt相当の実測が無いため push_subscriptions.created_at（購読時刻）を代理指標とする
 *     （多くは結果直後にLINE/Push登録するため、created_at≒最終計算時刻に近い）。
 *  ② parent-window-eve … parent-window.ts の窓（7/1-25・11/15-12/25）が開く前日にだけ、
 *     保護者向けに面談準備を促す（窓の断定日付は言わない一般論のコピー・[[parent-window]]と同方針）。
 *
 * すべて window 非依存の純関数（サーバー/CLI/テスト共通）。実際の送信（webpush呼び出し）は
 * scripts/push-send.ts 側の責務。
 */

export type PushScenarioId = 'recalc-reminder' | 'parent-window-eve-july' | 'parent-window-eve-winter';

export interface PushScenario {
  id: PushScenarioId;
  title: string;
  body: string;
  url: string;
}

/** シナリオ別の文面（購入を迫らない・断定日付なし）。 */
export const PUSH_SCENARIOS: Record<PushScenarioId, PushScenario> = {
  'recalc-reminder': {
    id: 'recalc-reminder',
    title: '前回の計算から約1ヶ月。今の内申点は変わっていませんか？',
    body: '定期テストや通知表で数値は変わります。1分で再計算して、目標との差を確認しましょう。',
    url: '/',
  },
  'parent-window-eve-july': {
    id: 'parent-window-eve-july',
    title: '明日から三者面談シーズンです',
    body: '面談の前に、お子さまの今の内申点・偏差値を確認しておきませんか？',
    url: '/mendan',
  },
  'parent-window-eve-winter': {
    id: 'parent-window-eve-winter',
    title: '明日から出願・面談シーズンです',
    body: '出願校を決める前に、今の数値と志望校との差を確認しておきませんか？',
    url: '/mendan',
  },
};

const DAY_MS = 86_400_000;

/** ISO日時文字列から現在までの経過日数（不正値はnull）。 */
export function daysSince(createdAtIso: string | null | undefined, now: Date = new Date()): number | null {
  if (!createdAtIso) return null;
  // D1のdatetime('now')はスペース区切り（YYYY-MM-DD HH:MM:SS）でUTC相当のためTを補って解釈する。
  const iso = createdAtIso.includes('T') ? createdAtIso : createdAtIso.replace(' ', 'T') + 'Z';
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return (now.getTime() - t) / DAY_MS;
}

/**
 * 「約targetDays日前に購読/計算した」購読だけを許容誤差(toleranceDays)付きで絞り込む。
 * 日次実行想定＝毎日±toleranceDaysの窓を通過する購読者に1回ずつ当たる（重複送信は呼び出し側の運用で回避）。
 */
export function isAroundDaysAgo(
  createdAtIso: string | null | undefined,
  targetDays: number,
  toleranceDays: number = 1,
  now: Date = new Date()
): boolean {
  const d = daysSince(createdAtIso, now);
  if (d === null) return false;
  return Math.abs(d - targetDays) <= toleranceDays;
}

/** 対象日(UTC月日)の前日かどうか。窓開始日の"前夜配信"用（[[parent-window]]と同じUTC月日判定）。 */
function isDayBeforeUtc(now: Date, month: number, date: number): boolean {
  const target = new Date(Date.UTC(now.getUTCFullYear(), month - 1, date));
  const eve = new Date(target.getTime() - DAY_MS);
  return now.getUTCMonth() === eve.getUTCMonth() && now.getUTCDate() === eve.getUTCDate();
}

/**
 * 保護者収穫窓（mendan-july=7/1開始・winter=11/15開始）の前日にだけtrueを返す。
 * parent-window.ts の activeParentWindow が使う境界日と揃えている（6/30→7/1、11/14→11/15）。
 */
export function isParentWindowEve(windowId: 'mendan-july' | 'winter', now: Date = new Date()): boolean {
  if (windowId === 'mendan-july') return isDayBeforeUtc(now, 7, 1);
  return isDayBeforeUtc(now, 11, 15);
}

/** 今日が該当する窓前日シナリオ（無ければnull）。日次cron/手動実行での自動判定に使う。 */
export function activeParentWindowEveScenario(now: Date = new Date()): PushScenario | null {
  if (isParentWindowEve('mendan-july', now)) return PUSH_SCENARIOS['parent-window-eve-july'];
  if (isParentWindowEve('winter', now)) return PUSH_SCENARIOS['parent-window-eve-winter'];
  return null;
}
