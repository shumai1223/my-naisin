/**
 * 学期トラッキング（terms.ts）と、履歴への学期タグ後付け（persistence.updateHistoryTerm）の契約テスト。
 * ダッシュボードの「中1→中3 学期順」表示はこの2つの正しさに依存する。
 */

import { TERM_OPTIONS, isValidTerm, getTermLabel, getTermOrder } from '../terms';
import {
  appendHistoryEntry,
  updateHistoryTerm,
  readHistory,
  clearHistory,
} from '../persistence';
import { DEFAULT_SCORES } from '../constants';

describe('terms', () => {
  test('学期は中1→中3で order が単調増加し重複しない', () => {
    const orders = TERM_OPTIONS.map((t) => t.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    expect(new Set(orders).size).toBe(orders.length);
    expect(TERM_OPTIONS).toHaveLength(9); // 3学年 × 3区切り
  });

  test('value は一意で grade と order の対応が整合', () => {
    const values = TERM_OPTIONS.map((t) => t.value);
    expect(new Set(values).size).toBe(values.length);
    // grade=1 の order は 1..3、grade=3 の order は 7..9
    expect(TERM_OPTIONS.filter((t) => t.grade === 1).every((t) => t.order <= 3)).toBe(true);
    expect(TERM_OPTIONS.filter((t) => t.grade === 3).every((t) => t.order >= 7)).toBe(true);
  });

  test('isValidTerm / getTermLabel / getTermOrder', () => {
    expect(isValidTerm('g3-t2')).toBe(true);
    expect(isValidTerm('nope')).toBe(false);
    expect(isValidTerm(undefined)).toBe(false);
    expect(getTermLabel('g1-t1')).toBe('中1・1学期');
    expect(getTermLabel('bad')).toBeUndefined();
    expect(getTermOrder('g1-t1')).toBeLessThan(getTermOrder('g3-t3'));
    expect(getTermOrder('bad')).toBe(Number.POSITIVE_INFINITY);
  });
});

describe('updateHistoryTerm', () => {
  beforeEach(() => {
    clearHistory();
  });

  test('履歴エントリに学期を後付けでき、永続化される', () => {
    const entry = appendHistoryEntry({ scores: { ...DEFAULT_SCORES }, prefectureCode: 'tokyo' });
    expect(entry).not.toBeNull();
    const updated = updateHistoryTerm(entry!.id, 'g3-t2');
    expect(updated?.term).toBe('g3-t2');
    // 再読込しても残る（writeHistory のサニタイズを通過する）
    expect(readHistory().find((e) => e.id === entry!.id)?.term).toBe('g3-t2');
  });

  test('不正な学期は解除扱い（term を持たない）', () => {
    const entry = appendHistoryEntry({ scores: { ...DEFAULT_SCORES }, prefectureCode: 'osaka' });
    updateHistoryTerm(entry!.id, 'g2-t1');
    const cleared = updateHistoryTerm(entry!.id, 'invalid-term');
    expect(cleared?.term).toBeUndefined();
    expect(readHistory().find((e) => e.id === entry!.id)?.term).toBeUndefined();
  });

  test('存在しないIDでは null', () => {
    expect(updateHistoryTerm('no-such-id', 'g1-t1')).toBeNull();
  });
});
