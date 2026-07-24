/**
 * 塾SaaS MVP「デモできる実物」(ZZ-4e・Ω-8実行層・build-not-launch)のデモ環境シードデータ。
 *
 * なぜ：D1未接続（build-not-launch）でも/juku/dashboard/demoが即座に「完動する実物」として
 * 見せられるようにする。B2B商談・CI Playwrightのスクリーンショット素材化の両方に使う。
 *
 * 設計思想（捏造ゼロの流儀を架空データにも適用）：生徒・塾名は明らかな仮名(生徒01等)にする一方、
 * 内申点/偏差値の数値自体は既存の検証済みエンジン(calculateTotalScore/calculateMaxScore/
 * calcHensachi)にダミーの入力(評定・得点)を通した「実際の計算結果」であり、最終数値を
 * 直接タイプして捏造してはいない。全て決定論（Math.randomは使わない）＝CIで毎回同じ
 * スクリーンショットが撮れる。
 */
import { calculateTotalScore, calculateMaxScore } from '@/lib/utils';
import { calcHensachi, roundHensachi } from '@/lib/hensachi';
import type { Scores } from '@/lib/types';
import type { ScoreSnapshotRecord } from '@/lib/juku-saas-db';
import { buildStudentTrend, computeDeclineAlerts, type DeclineAlert } from '@/lib/juku-student-progress';
import type { StudentTrendByMetric } from '@/lib/juku-student-progress';

export const DEMO_JUKU_NAME = 'デモ塾（サンプル）';
export const DEMO_STUDENT_COUNT = 30;

/** デモで巡回する都道府県(実在の10県・計算方式が確認済みのもののみ)。 */
const DEMO_PREFECTURE_CODES = [
  'tokyo', 'osaka', 'hyogo', 'aichi', 'kanagawa', 'chiba', 'saitama', 'fukuoka', 'hokkaido', 'kyoto',
] as const;

const SUBJECT_KEYS: (keyof Scores)[] = [
  'japanese', 'math', 'english', 'science', 'social', 'music', 'art', 'pe', 'tech',
];

/** i番目の生徒・k回目(0=旧, 1=新)の評定を決定論的に作る。1〜5の範囲に収まるよう剰余で調整。 */
function buildDemoScores(index: number, snapshotIndex: 0 | 1): Scores {
  const growing = index % 2 === 0; // 偶数番の生徒は伸びる想定、奇数番は下がる想定のデモ
  const base = 2 + (index % 3); // 2〜4の基礎評定
  const delta = growing ? snapshotIndex : 1 - snapshotIndex; // 新しい方が高い(growing) or 低い(非growing)
  const scores = {} as Scores;
  SUBJECT_KEYS.forEach((key, si) => {
    const wobble = (index + si) % 2; // 教科ごとに軽くばらつかせる(単調すぎるデモを避ける)
    const grade = base + delta + wobble;
    scores[key] = Math.min(5, Math.max(1, grade));
  });
  return scores;
}

export interface DemoStudentSeed {
  displayName: string;
  prefectureCode: string;
  snapshots: ScoreSnapshotRecord[];
}

/** 30人分のデモ生徒データを決定論的に生成する（Math.random不使用・毎回同じ結果）。 */
export function buildDemoStudents(): DemoStudentSeed[] {
  const students: DemoStudentSeed[] = [];
  for (let i = 0; i < DEMO_STUDENT_COUNT; i++) {
    const displayName = `生徒${String(i + 1).padStart(2, '0')}`;
    const prefectureCode = DEMO_PREFECTURE_CODES[i % DEMO_PREFECTURE_CODES.length];

    const oldScores = buildDemoScores(i, 0);
    const newScores = buildDemoScores(i, 1);
    const naishinOld = calculateTotalScore(oldScores, prefectureCode);
    const naishinNew = calculateTotalScore(newScores, prefectureCode);
    const naishinMax = calculateMaxScore(prefectureCode);

    // 偏差値も既存エンジン(calcHensachi)を通す。得点/平均/標準偏差はデモ用の決定論的な値。
    const avg = 55 + (i % 5);
    const stdDev = 12;
    const hensachiOldRaw = calcHensachi(50 + (i % 10), avg, stdDev);
    const hensachiNewRaw = calcHensachi(50 + (i % 10) + (i % 2 === 0 ? 8 : -6), avg, stdDev);

    const snapshots: ScoreSnapshotRecord[] = [
      { metric: 'naishin', value: naishinOld, maxValue: naishinMax, recordedAt: '2026-04-22' },
      { metric: 'naishin', value: naishinNew, maxValue: naishinMax, recordedAt: '2026-07-24' },
    ];
    if (hensachiOldRaw !== null) {
      snapshots.push({ metric: 'hensachi', value: roundHensachi(hensachiOldRaw), maxValue: null, recordedAt: '2026-04-22' });
    }
    if (hensachiNewRaw !== null) {
      snapshots.push({ metric: 'hensachi', value: roundHensachi(hensachiNewRaw), maxValue: null, recordedAt: '2026-07-24' });
    }

    students.push({ displayName, prefectureCode, snapshots });
  }
  return students;
}

export interface DemoStudentView {
  id: string;
  displayName: string;
  trend: StudentTrendByMetric;
  alerts: DeclineAlert[];
}

/** buildDemoStudents()の生スナップショットを、ダッシュボード表示用のtrend+alertsへ変換する（ZZ-4cの既存エンジン再利用）。 */
export function buildDemoStudentViews(): DemoStudentView[] {
  return buildDemoStudents().map((s) => {
    const trend = buildStudentTrend(s.snapshots);
    const alerts = computeDeclineAlerts(trend);
    return { id: s.displayName, displayName: s.displayName, trend, alerts };
  });
}
