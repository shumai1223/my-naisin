/**
 * LINE友だち数の日次記録を読み、G1/G5の「名簿N」と週次velocityを出す純関数群。
 *
 * なぜ手動記録なのか: LINE Messaging APIには友だち数（累計/有効/ブロック）を返すエンドポイントが
 * 無く、Official Account Managerの画面からしか取れない。よって`data/line-friends.json`へ👤が転記し、
 * ここではその値を読むだけにする（推定・補間はしない＝Y-0憲法と同じ原則）。
 *
 * ⚠️2026-08-07までG1/G5は`D1 leads`単独で「名簿N」を判定していた。実測でLINE55人に対しD1 leadsは
 * 6件しかなく、この状態でG1が走ると`N=6`で`behind`＝「名簿レバー縮小・直接契約へ重心移動」が
 * 誤発火する。名簿の実体はLINE側にあるため、必ず合算して判定する。
 */

export interface LineFriendsEntry {
  date: string;
  friends: number;
  active: number;
  blocked: number;
}

export interface LineFriendsFile {
  entries: LineFriendsEntry[];
}

/** 日付昇順に整列したエントリ（入力順に依存しないようにする）。 */
export function sortedEntries(file: LineFriendsFile): LineFriendsEntry[] {
  return [...file.entries].sort((a, b) => a.date.localeCompare(b.date));
}

/** 最新のエントリ。記録が空なら null。 */
export function latestEntry(file: LineFriendsFile): LineFriendsEntry | null {
  const sorted = sortedEntries(file);
  return sorted.length > 0 ? sorted[sorted.length - 1] : null;
}

/**
 * 直近 `days` 日間の増加数（＝velocity）。
 *
 * 起点は「最新日から days 日前**以前**の最も新しい記録」。記録に欠落があっても
 * 補間せず、実在する2点の差だけを返す（欠落日を0増加と誤認しないため）。
 * 十分な記録が無ければ null。
 */
export function velocityOverDays(
  file: LineFriendsFile,
  days: number
): { gained: number; fromDate: string; toDate: string; actualDays: number } | null {
  const sorted = sortedEntries(file);
  if (sorted.length < 2) return null;
  const end = sorted[sorted.length - 1];
  const endMs = Date.parse(`${end.date}T00:00:00Z`);
  if (Number.isNaN(endMs)) return null;
  const cutoffMs = endMs - days * 86_400_000;

  // cutoff以前で最も新しい記録を起点にする（無ければ最古の記録）。
  let start = sorted[0];
  for (const e of sorted) {
    const ms = Date.parse(`${e.date}T00:00:00Z`);
    if (Number.isNaN(ms)) continue;
    if (ms <= cutoffMs) start = e;
  }
  if (start.date === end.date) return null;

  const actualDays = Math.round((endMs - Date.parse(`${start.date}T00:00:00Z`)) / 86_400_000);
  return {
    gained: end.friends - start.friends,
    fromDate: start.date,
    toDate: end.date,
    actualDays,
  };
}

/** 週あたりに正規化した増加ペース（小数第1位まで）。記録不足なら null。 */
export function weeklyPace(file: LineFriendsFile, days = 7): number | null {
  const v = velocityOverDays(file, days);
  if (!v || v.actualDays <= 0) return null;
  return Math.round((v.gained / v.actualDays) * 7 * 10) / 10;
}

/**
 * 記録が古すぎないか（👤の手動転記が止まっていないか）。
 * `staleDays` 日以上更新が無ければ true。朝ブリーフィングでの督促に使う。
 */
export function isStale(file: LineFriendsFile, todayIso: string, staleDays = 7): boolean {
  const latest = latestEntry(file);
  if (!latest) return true;
  const latestMs = Date.parse(`${latest.date}T00:00:00Z`);
  const todayMs = Date.parse(`${todayIso}T00:00:00Z`);
  if (Number.isNaN(latestMs) || Number.isNaN(todayMs)) return true;
  return todayMs - latestMs >= staleDays * 86_400_000;
}
