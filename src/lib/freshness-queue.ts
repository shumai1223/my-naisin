/**
 * 都道府県別・最終確認日の再検証優先度キュー（ZZ-9b・自己改善メタループ）。
 *
 * なぜ：これまでX-12/X-14の再検証対象は「たまたま見つけた変更予告」から選んでおり、
 * 「本当に確認が古い県から順に見る」という体系だったキューが無かった。source-history.tsの
 * 台帳を最終確認日の古い順に並べ替えるだけの薄い層を作ることで、loopが自分で
 * 「次に確認すべき県」を機械的に選べるようにする。
 *
 * 最終確認日は getSourceHistory() の最新エントリ（＝prefectures.tsのlastVerified「または」
 * その後X-14で追記されたMANUAL_HISTORYのうち最も新しい日付）を使う。prefectures.tsの
 * lastVerified単体だけを見ると、再検証後にMANUAL_HISTORYへ記録を追記しても
 * （＝prefectures.ts自体は意図的に上書きしない＝最初の検証日という履歴を保持するため）
 * このキューが「再検証済み」を認識できず同じ県を無限に最優先扱いし続けてしまう
 * （2026-07-24判明・大阪県の再検証時に発見）。
 *
 * 全ての値はsource-history.ts経由でprefectures.ts/MANUAL_HISTORYから機械的に導出するのみ
 * （捏造ゼロ）。
 */
import { PREFECTURES } from '@/lib/prefectures';
import { getSourceHistory } from '@/lib/source-history';

export interface FreshnessQueueEntry {
  code: string;
  name: string;
  region: string;
  /** getSourceHistory()の最新エントリの日付（再検証済みならその日付に更新される）。 */
  lastVerified: string;
  /** now時点での経過日数。確認記録が無い（未確認）場合はInfinity（最優先）。 */
  daysSinceVerified: number;
}

/**
 * 47都道府県を最終確認日の古い順（＝再検証の優先度が高い順）に並べる。
 * nowを引数で受け取ることでテストが日付を固定できる（Date.now()を直接読まない）。
 */
export function buildFreshnessQueue(now: Date = new Date()): FreshnessQueueEntry[] {
  return PREFECTURES.map((p) => {
    const history = getSourceHistory(p.code);
    const latestDate = history.length > 0 ? history[history.length - 1].date : undefined;
    const days = latestDate
      ? Math.floor((now.getTime() - new Date(`${latestDate}T00:00:00Z`).getTime()) / 86_400_000)
      : Number.POSITIVE_INFINITY;
    return {
      code: p.code,
      name: p.name,
      region: p.region,
      lastVerified: latestDate ?? '(未確認)',
      daysSinceVerified: days,
    };
  }).sort((a, b) => b.daysSinceVerified - a.daysSinceVerified || a.name.localeCompare(b.name, 'ja'));
}

/** 再検証優先度トップN件（既定5件）。 */
export function getStaleTop(n = 5, now: Date = new Date()): FreshnessQueueEntry[] {
  return buildFreshnessQueue(now).slice(0, Math.max(0, n));
}
