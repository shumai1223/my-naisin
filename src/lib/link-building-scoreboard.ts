/**
 * X'-5 スコアボード（TIER X' 全面再設計・被リンク効果測定）。
 *
 * data/link-building-scoreboard.jsonは週次でGSC実測(gsc_query MCP)を手動追記していく
 * フラットな配列ログ（data/ctr-improvement-log.jsonと同じ形式）。このモジュールは
 * ログを読んで直近2件の差分（順位変化・クリック変化）を計算する純関数のみを提供する。
 * MCP呼び出し自体はスクリプトからは行えない（ツール接続が必要）ため、実測値の追記は
 * 毎回セッション側（loop）がgsc_queryを叩いてこのファイルへ手で追加する運用とする。
 *
 * 対象5KW（X'-5本文で指定）: 内申点 計算／偏差値診断／換算内申 計算／
 * 偏差値計算サイト 中学生／オール3で行ける都立高校
 *
 * 「参照ドメイン数」の追跡はAhrefs等の有料ツール未契約のため現時点では実装しない
 * （捏造ゼロ原則・無い指標を偽装しない。GSCにはリンク元ドメイン一覧のAPIが無い）。
 */

export interface ScoreboardSnapshot {
  date: string;
  keyword: string;
  position: number;
  clicks: number;
  impressions: number;
  windowDays: number;
  note?: string;
}

export interface KeywordTrend {
  keyword: string;
  latest: ScoreboardSnapshot;
  previous?: ScoreboardSnapshot;
  positionDelta?: number;
  clicksDelta?: number;
}

/** キーワードごとに最新スナップショットと直前スナップショットの差分を計算する。 */
export function computeKeywordTrends(snapshots: ScoreboardSnapshot[]): KeywordTrend[] {
  const byKeyword = new Map<string, ScoreboardSnapshot[]>();
  for (const s of snapshots) {
    const list = byKeyword.get(s.keyword) ?? [];
    list.push(s);
    byKeyword.set(s.keyword, list);
  }

  const trends: KeywordTrend[] = [];
  for (const [keyword, list] of byKeyword) {
    const sorted = list.slice().sort((a, b) => a.date.localeCompare(b.date));
    const latest = sorted[sorted.length - 1];
    const previous = sorted.length > 1 ? sorted[sorted.length - 2] : undefined;
    trends.push({
      keyword,
      latest,
      previous,
      positionDelta: previous ? Math.round((latest.position - previous.position) * 100) / 100 : undefined,
      clicksDelta: previous ? latest.clicks - previous.clicks : undefined,
    });
  }
  return trends;
}
