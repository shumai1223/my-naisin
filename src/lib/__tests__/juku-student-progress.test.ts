/**
 * 塾SaaS MVP(ZZ-4c)の生徒別自動計算(志望県切替)+推移グラフの契約テスト。
 * 独自の採点ロジックを持たない設計を検証するため、既存エンジンとの整合を軸に固定する。
 */
import { recomputeNaishinForPrefectures, buildStudentTrend, latestTrendDelta, computeDeclineAlerts } from '../juku-student-progress';
import { calculateTotalScore, calculateMaxScore, calculatePercent } from '../utils';
import type { Scores } from '../types';
import type { ScoreSnapshotRecord } from '../juku-saas-db';

const ALL_FIVE: Scores = {
  japanese: 5, math: 5, english: 5, science: 5, social: 5, music: 5, art: 5, pe: 5, tech: 5,
};
const ALL_THREE: Scores = {
  japanese: 3, math: 3, english: 3, science: 3, social: 3, music: 3, art: 3, pe: 3, tech: 3,
};

describe('recomputeNaishinForPrefectures（志望県切替・既存エンジン再利用）', () => {
  test('既存の計算エンジンと完全に一致する値を返す(独自ロジックを持たない)', () => {
    const [tokyo] = recomputeNaishinForPrefectures(ALL_THREE, ['tokyo']);
    expect(tokyo.total).toBe(calculateTotalScore(ALL_THREE, 'tokyo'));
    expect(tokyo.max).toBe(calculateMaxScore('tokyo'));
    expect(tokyo.percent).toBe(calculatePercent(tokyo.total, tokyo.max));
    expect(tokyo.name).toBe('東京都');
  });

  test('複数県を指定すると入力順にそれぞれ計算する', () => {
    const results = recomputeNaishinForPrefectures(ALL_FIVE, ['tokyo', 'osaka', 'hyogo']);
    expect(results.map((r) => r.code)).toEqual(['tokyo', 'osaka', 'hyogo']);
    expect(results).toHaveLength(3);
    for (const r of results) {
      expect(r.max).toBeGreaterThan(0);
      expect(r.percent).toBeGreaterThanOrEqual(0);
      expect(r.percent).toBeLessThanOrEqual(100);
    }
  });

  test('オール5はどの県でも満点(100%)になる', () => {
    const results = recomputeNaishinForPrefectures(ALL_FIVE, ['tokyo', 'osaka', 'hyogo', 'aichi']);
    for (const r of results) {
      expect(r.percent).toBe(100);
    }
  });

  test('未知のprefectureCodeは静かにスキップする(例外を投げない)', () => {
    const results = recomputeNaishinForPrefectures(ALL_THREE, ['tokyo', 'narnia', 'osaka']);
    expect(results.map((r) => r.code)).toEqual(['tokyo', 'osaka']);
  });

  test('空配列を渡すと空配列を返す', () => {
    expect(recomputeNaishinForPrefectures(ALL_THREE, [])).toEqual([]);
  });
});

function snap(metric: ScoreSnapshotRecord['metric'], value: number, maxValue: number | null, recordedAt: string): ScoreSnapshotRecord {
  return { metric, value, maxValue, recordedAt };
}

describe('buildStudentTrend（推移グラフ用の整形）', () => {
  test('metric別に振り分け、記録日時の古い順に並べ替える(入力順に依存しない)', () => {
    const snapshots: ScoreSnapshotRecord[] = [
      snap('naishin', 55, 65, '2026-07-24'),
      snap('naishin', 45, 65, '2026-04-22'),
      snap('hensachi', 62, null, '2026-06-01'),
    ];
    const trend = buildStudentTrend(snapshots);
    expect(trend.naishin.map((p) => p.recordedAt)).toEqual(['2026-04-22', '2026-07-24']);
    expect(trend.hensachi).toHaveLength(1);
    expect(trend['total-score']).toEqual([]);
  });

  test('maxValueがある行はpercentを算出、無い行(hensachi)はnull', () => {
    const snapshots: ScoreSnapshotRecord[] = [
      snap('naishin', 39, 65, '2026-04-22'),
      snap('hensachi', 58, null, '2026-04-22'),
    ];
    const trend = buildStudentTrend(snapshots);
    expect(trend.naishin[0].percent).toBe(calculatePercent(39, 65));
    expect(trend.hensachi[0].percent).toBeNull();
  });

  test('空配列を渡すと全metricキーが空配列で存在する', () => {
    const trend = buildStudentTrend([]);
    expect(trend).toEqual({ naishin: [], hensachi: [], 'total-score': [] });
  });
});

describe('latestTrendDelta', () => {
  test('1点以下はnull', () => {
    expect(latestTrendDelta([])).toBeNull();
    expect(latestTrendDelta([{ recordedAt: '2026-07-24', value: 50, maxValue: 65, percent: 77 }])).toBeNull();
  });

  test('直近2点の差分(増加はプラス)', () => {
    const points = [
      { recordedAt: '2026-04-22', value: 45, maxValue: 65, percent: 69 },
      { recordedAt: '2026-07-24', value: 55, maxValue: 65, percent: 85 },
    ];
    expect(latestTrendDelta(points)).toBe(10);
  });

  test('直近2点の差分(減少はマイナス)', () => {
    const points = [
      { recordedAt: '2026-04-22', value: 55, maxValue: 65, percent: 85 },
      { recordedAt: '2026-07-24', value: 50, maxValue: 65, percent: 77 },
    ];
    expect(latestTrendDelta(points)).toBe(-5);
  });
});

describe('computeDeclineAlerts（評定低下アラート・ZZ-4d）', () => {
  test('低下しているmetricのみをアラートとして返す', () => {
    const trend = buildStudentTrend([
      snap('naishin', 55, 65, '2026-04-22'),
      snap('naishin', 45, 65, '2026-07-24'), // 低下
      snap('hensachi', 55, null, '2026-04-22'),
      snap('hensachi', 60, null, '2026-07-24'), // 上昇
    ]);
    const alerts = computeDeclineAlerts(trend);
    expect(alerts).toEqual([{ metric: 'naishin', delta: -10 }]);
  });

  test('推移を語れない(1点以下)metricはアラート対象外', () => {
    const trend = buildStudentTrend([snap('naishin', 55, 65, '2026-07-24')]);
    expect(computeDeclineAlerts(trend)).toEqual([]);
  });

  test('全metricとも上昇・横ばいならアラート無し', () => {
    const trend = buildStudentTrend([
      snap('total-score', 400, 500, '2026-04-22'),
      snap('total-score', 400, 500, '2026-07-24'),
    ]);
    expect(computeDeclineAlerts(trend)).toEqual([]);
  });

  test('データが無ければ空配列', () => {
    expect(computeDeclineAlerts(buildStudentTrend([]))).toEqual([]);
  });
});
