import { computeKeywordTrends, type ScoreboardSnapshot } from '../link-building-scoreboard';

describe('link-building-scoreboard（X\'-5）', () => {
  it('スナップショット1件のみのキーワードはpreviousがundefined', () => {
    const snapshots: ScoreboardSnapshot[] = [
      { date: '2026-08-01', keyword: '内申点 計算', position: 3.3, clicks: 542, impressions: 6178, windowDays: 28 },
    ];
    const trends = computeKeywordTrends(snapshots);
    expect(trends).toHaveLength(1);
    expect(trends[0].previous).toBeUndefined();
    expect(trends[0].positionDelta).toBeUndefined();
  });

  it('2件のスナップショットがあれば日付順で直近2件の差分を計算する', () => {
    const snapshots: ScoreboardSnapshot[] = [
      { date: '2026-08-01', keyword: '偏差値診断', position: 5.5, clicks: 230, impressions: 3257, windowDays: 28 },
      { date: '2026-08-08', keyword: '偏差値診断', position: 4.5, clicks: 280, impressions: 3300, windowDays: 28 },
    ];
    const trends = computeKeywordTrends(snapshots);
    expect(trends).toHaveLength(1);
    expect(trends[0].latest.date).toBe('2026-08-08');
    expect(trends[0].previous?.date).toBe('2026-08-01');
    expect(trends[0].positionDelta).toBeCloseTo(-1.0, 2);
    expect(trends[0].clicksDelta).toBe(50);
  });

  it('日付が入力順とは逆順でもソートしてから最新を選ぶ', () => {
    const snapshots: ScoreboardSnapshot[] = [
      { date: '2026-08-08', keyword: 'K', position: 4.5, clicks: 10, impressions: 100, windowDays: 28 },
      { date: '2026-08-01', keyword: 'K', position: 5.5, clicks: 5, impressions: 90, windowDays: 28 },
    ];
    const trends = computeKeywordTrends(snapshots);
    expect(trends[0].latest.date).toBe('2026-08-08');
    expect(trends[0].previous?.date).toBe('2026-08-01');
  });

  it('複数キーワードが混在していても独立に集計する', () => {
    const snapshots: ScoreboardSnapshot[] = [
      { date: '2026-08-01', keyword: 'A', position: 3, clicks: 1, impressions: 10, windowDays: 28 },
      { date: '2026-08-01', keyword: 'B', position: 7, clicks: 2, impressions: 20, windowDays: 28 },
    ];
    const trends = computeKeywordTrends(snapshots);
    expect(trends.map((t) => t.keyword).sort()).toEqual(['A', 'B']);
  });
});
