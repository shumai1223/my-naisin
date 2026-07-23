/**
 * 塾SaaS MVP「デモできる実物」(ZZ-4c・Ω-8実行層・build-not-launch)の生徒別自動計算+推移。
 *
 * なぜ：塾担当者が生徒の評定を入力したら、①志望県を切り替えるだけで即座に内申点を
 * 再計算できる ②記録してきたスコアの推移をグラフで見られる、の2つが「デモできる実物」の核。
 *
 * 設計思想（捏造ゼロ）：本モジュールは独自の採点ロジックを一切持たない。
 * 志望県切替は既存の calculateTotalScore/calculateMaxScore/calculatePercent
 * （47都道府県の計算機・API・MCPと同一の正準ソース）をそのまま呼ぶだけ。
 * 推移グラフはD1に保存済みのスナップショット（既存エンジンで計算済みの値）を並べ替えるだけ。
 */
import { getPrefectureByCode } from '@/lib/prefectures';
import { calculateTotalScore, calculateMaxScore, calculatePercent } from '@/lib/utils';
import type { Scores } from '@/lib/types';
import type { ScoreSnapshotRecord, SnapshotMetric } from '@/lib/juku-saas-db';

export interface PrefectureNaishinResult {
  code: string;
  name: string;
  total: number;
  max: number;
  percent: number;
}

/**
 * 生徒の9教科評定(Scores)から、指定した複数県の内申点を一括計算する（志望県切替）。
 * 既存エンジンをそのまま呼ぶだけ＝47都道府県の他の計算機・API・MCPと常に同じ結果になる。
 * 未知のprefectureCodeは静かに無視する（呼び出し側の入力ミスで例外にしない）。
 */
export function recomputeNaishinForPrefectures(scores: Scores, prefectureCodes: string[]): PrefectureNaishinResult[] {
  const results: PrefectureNaishinResult[] = [];
  for (const code of prefectureCodes) {
    const pref = getPrefectureByCode(code);
    if (!pref) continue;
    const total = calculateTotalScore(scores, code);
    const max = calculateMaxScore(code);
    results.push({ code, name: pref.name, total, max, percent: calculatePercent(total, max) });
  }
  return results;
}

export interface StudentTrendPoint {
  recordedAt: string;
  value: number;
  maxValue: number | null;
  /** naishin/total-score(maxValueあり)のみ算出。hensachi(スカラー・満点概念なし)はnull。 */
  percent: number | null;
}

export type StudentTrendByMetric = Record<SnapshotMetric, StudentTrendPoint[]>;

/**
 * 生徒のスコアスナップショット一覧を metric 別・記録日時の古い順にグラフ用の系列へ整形する（推移グラフ）。
 * 入力の順序に依存しない（呼び出し側でのソート漏れを気にしなくてよい）。
 */
export function buildStudentTrend(snapshots: ScoreSnapshotRecord[]): StudentTrendByMetric {
  const grouped: StudentTrendByMetric = { naishin: [], hensachi: [], 'total-score': [] };
  for (const s of snapshots) {
    grouped[s.metric].push({
      recordedAt: s.recordedAt,
      value: s.value,
      maxValue: s.maxValue,
      percent: s.maxValue !== null && s.maxValue > 0 ? calculatePercent(s.value, s.maxValue) : null,
    });
  }
  for (const metric of Object.keys(grouped) as SnapshotMetric[]) {
    grouped[metric].sort((a, b) => a.recordedAt.localeCompare(b.recordedAt));
  }
  return grouped;
}

/**
 * 推移系列の直近2点から増減を判定する（ダッシュボードの矢印表示用）。
 * 1点以下（推移を語れない）はnull。
 */
export function latestTrendDelta(points: StudentTrendPoint[]): number | null {
  if (points.length < 2) return null;
  const last = points[points.length - 1];
  const prev = points[points.length - 2];
  return last.value - prev.value;
}
