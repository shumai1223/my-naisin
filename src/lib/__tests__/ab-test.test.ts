/**
 * A/Bテスト基盤（決定論バケット）のユニットテスト。
 * 勝者集計の前提＝「同じ人は常に同じ群」「重み付きで概ね期待比率」を保証する。
 */

import { cyrb53, assignVariant, type Variant } from '../ab-test';

describe('cyrb53', () => {
  test('決定論的（同じ入力→同じ出力）', () => {
    expect(cyrb53('tokyo:abc')).toBe(cyrb53('tokyo:abc'));
  });

  test('入力が違えば（ほぼ）違う値', () => {
    expect(cyrb53('a')).not.toBe(cyrb53('b'));
  });

  test('非負の整数を返す', () => {
    const h = cyrb53('experiment:client');
    expect(Number.isInteger(h)).toBe(true);
    expect(h).toBeGreaterThanOrEqual(0);
  });
});

describe('assignVariant', () => {
  const ab: Variant<'a' | 'b'>[] = [{ id: 'a' }, { id: 'b' }];

  test('同じ実験ID×クライアントIDは常に同じ群', () => {
    const first = assignVariant('cta-color', 'client-123', ab);
    const second = assignVariant('cta-color', 'client-123', ab);
    expect(first).toBe(second);
  });

  test('クライアントIDが違えば割当は分散する', () => {
    const counts: Record<string, number> = { a: 0, b: 0 };
    for (let i = 0; i < 2000; i++) {
      counts[assignVariant('cta-color', `client-${i}`, ab)]++;
    }
    // 50/50近辺（±10%程度の幅で十分）
    expect(counts.a).toBeGreaterThan(700);
    expect(counts.b).toBeGreaterThan(700);
  });

  test('重み付き（3:1）はおおむね期待比率になる', () => {
    const weighted: Variant<'big' | 'small'>[] = [
      { id: 'big', weight: 3 },
      { id: 'small', weight: 1 },
    ];
    const counts: Record<string, number> = { big: 0, small: 0 };
    for (let i = 0; i < 4000; i++) {
      counts[assignVariant('weighted-exp', `c-${i}`, weighted)]++;
    }
    // big がおおむね 75%（±8%）
    const ratio = counts.big / (counts.big + counts.small);
    expect(ratio).toBeGreaterThan(0.67);
    expect(ratio).toBeLessThan(0.83);
  });

  test('単一バリアントは必ずそれを返す', () => {
    expect(assignVariant('x', 'y', [{ id: 'only' }])).toBe('only');
  });

  test('空配列はエラー', () => {
    expect(() => assignVariant('x', 'y', [])).toThrow();
  });

  test('clientIdが空でも安定して割り当てる', () => {
    const v1 = assignVariant('exp', '', ab);
    const v2 = assignVariant('exp', '', ab);
    expect(v1).toBe(v2);
  });
});
