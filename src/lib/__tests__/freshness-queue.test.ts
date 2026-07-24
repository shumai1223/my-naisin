/**
 * 再検証優先度キュー(ZZ-9b)の契約テスト。
 */
import { PREFECTURES } from '../prefectures';
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

  test('各エントリのdaysSinceVerifiedは実際の日付差分と一致する(検算)', () => {
    const queue = buildFreshnessQueue(FIXED_NOW);
    for (const entry of queue) {
      const pref = PREFECTURES.find((p) => p.code === entry.code)!;
      if (!pref.lastVerified) {
        expect(entry.daysSinceVerified).toBe(Number.POSITIVE_INFINITY);
        continue;
      }
      const expectedDays = Math.floor(
        (FIXED_NOW.getTime() - new Date(`${pref.lastVerified}T00:00:00Z`).getTime()) / 86_400_000
      );
      expect(entry.daysSinceVerified).toBe(expectedDays);
      expect(entry.lastVerified).toBe(pref.lastVerified);
    }
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
