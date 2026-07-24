/**
 * 都道府県別・最終確認日の再検証優先度キュー（ZZ-9b・自己改善メタループ）。
 *
 * なぜ：これまでX-12/X-14の再検証対象は「たまたま見つけた変更予告」から選んでおり、
 * 「本当に確認が古い県から順に見る」という体系だったキューが無かった。source-history.tsの
 * 台帳(lastVerified)を最終確認日の古い順に並べ替えるだけの薄い層を作ることで、
 * loopが自分で「次に確認すべき県」を機械的に選べるようにする。
 *
 * 全ての値はprefectures.tsの既存lastVerifiedから機械的に導出するのみ（捏造ゼロ）。
 */
import { PREFECTURES } from '@/lib/prefectures';

export interface FreshnessQueueEntry {
  code: string;
  name: string;
  region: string;
  lastVerified: string;
  /** now時点での経過日数。lastVerified欠落（未確認）はInfinity（最優先）。 */
  daysSinceVerified: number;
}

/**
 * 47都道府県を最終確認日の古い順（＝再検証の優先度が高い順）に並べる。
 * nowを引数で受け取ることでテストが日付を固定できる（Date.now()を直接読まない）。
 */
export function buildFreshnessQueue(now: Date = new Date()): FreshnessQueueEntry[] {
  return PREFECTURES.map((p) => {
    const days = p.lastVerified
      ? Math.floor((now.getTime() - new Date(`${p.lastVerified}T00:00:00Z`).getTime()) / 86_400_000)
      : Number.POSITIVE_INFINITY;
    return {
      code: p.code,
      name: p.name,
      region: p.region,
      lastVerified: p.lastVerified ?? '(未確認)',
      daysSinceVerified: days,
    };
  }).sort((a, b) => b.daysSinceVerified - a.daysSinceVerified || a.name.localeCompare(b.name, 'ja'));
}

/** 再検証優先度トップN件（既定5件）。 */
export function getStaleTop(n = 5, now: Date = new Date()): FreshnessQueueEntry[] {
  return buildFreshnessQueue(now).slice(0, Math.max(0, n));
}
