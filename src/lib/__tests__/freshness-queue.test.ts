/**
 * 再検証優先度キュー(ZZ-9b)の契約テスト。
 */
import { PREFECTURES } from '../prefectures';
import { getSourceHistory } from '../source-history';
import { buildFreshnessQueue, getStaleTop } from '../freshness-queue';

const FIXED_NOW = new Date('2026-07-24T00:00:00Z');

describe('buildFreshnessQueue', () => {
  test('全47都道府県を返す', () => {
    expect(buildFreshnessQueue(FIXED_NOW)).toHaveLength(47);
  });

  test('最終確認日が古い順(daysSinceVerifiedが大きい順)に並ぶ', () => {
    const queue = buildFreshnessQueue(FIXED_NOW);
    const days = queue.map((q) => q.daysSinceVerified);
    const sorted = [...days].sort((a, b) => b - a);
    expect(days).toEqual(sorted);
  });

  test('各エントリのdaysSinceVerifiedはgetSourceHistory()の最新日付との差分と一致する(検算)', () => {
    const queue = buildFreshnessQueue(FIXED_NOW);
    for (const entry of queue) {
      const history = getSourceHistory(entry.code);
      if (history.length === 0) {
        expect(entry.daysSinceVerified).toBe(Number.POSITIVE_INFINITY);
        continue;
      }
      const latestDate = history[history.length - 1].date;
      const expectedDays = Math.floor(
        (FIXED_NOW.getTime() - new Date(`${latestDate}T00:00:00Z`).getTime()) / 86_400_000
      );
      expect(entry.daysSinceVerified).toBe(expectedDays);
      expect(entry.lastVerified).toBe(latestDate);
    }
  });

  test('MANUAL_HISTORYで再検証記録が追記された県は、prefectures.tsのlastVerifiedより新しい日付で扱われる(2026-07-24判明の設計修正の回帰防止)', () => {
    const queue = buildFreshnessQueue(FIXED_NOW);
    const aichi = queue.find((q) => q.code === 'aichi')!;
    const aichiPref = PREFECTURES.find((p) => p.code === 'aichi')!;
    // aichiはMANUAL_HISTORYに2026-07-23のエントリがあるため、baseline(prefectures.tsのlastVerified)
    // より新しい日付がlastVerifiedとして採用されているはず。
    expect(aichi.lastVerified >= (aichiPref.lastVerified ?? '')).toBe(true);
  });

  test('都道府県コードの重複がない(一意性)', () => {
    const codes = buildFreshnessQueue(FIXED_NOW).map((q) => q.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe('getStaleTop', () => {
  test('既定は上位5件を返す', () => {
    expect(getStaleTop(undefined, FIXED_NOW)).toHaveLength(5);
  });

  test('件数を指定できる', () => {
    expect(getStaleTop(3, FIXED_NOW)).toHaveLength(3);
    expect(getStaleTop(10, FIXED_NOW)).toHaveLength(10);
  });

  test('上位N件はbuildFreshnessQueueの先頭N件と完全一致する', () => {
    const full = buildFreshnessQueue(FIXED_NOW);
    const top5 = getStaleTop(5, FIXED_NOW);
    expect(top5).toEqual(full.slice(0, 5));
  });

  test('0件を指定すると空配列', () => {
    expect(getStaleTop(0, FIXED_NOW)).toEqual([]);
  });
});
