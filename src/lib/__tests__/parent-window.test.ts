/**
 * 保護者ウィンドウ判定（Build 1）の境界テスト。
 * 収穫窓は保護者接点が確実に立つ期間だけ＝三者面談・出願の直前。窓の端が仕様どおりか固定する。
 */
import {
  activeParentWindow,
  parentWindowCopy,
  PARENT_WINDOW_COPY,
  isEndOfTermSpikeDay,
  END_OF_TERM_SPIKE_DAY_NOTE,
} from '../parent-window';

const D = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe('activeParentWindow（7月・冬の収穫窓判定）', () => {
  it('7月の窓は 7/1〜7/25（6/30×・7/1○・7/25○・7/26×）', () => {
    expect(activeParentWindow(D('2026-06-30'))).toBeNull();
    expect(activeParentWindow(D('2026-07-01'))).toBe('mendan-july');
    expect(activeParentWindow(D('2026-07-15'))).toBe('mendan-july');
    expect(activeParentWindow(D('2026-07-25'))).toBe('mendan-july');
    expect(activeParentWindow(D('2026-07-26'))).toBeNull();
  });

  it('冬の窓は 11/15〜12/25（11/14×・11/15○・12/25○・12/26×）', () => {
    expect(activeParentWindow(D('2026-11-14'))).toBeNull();
    expect(activeParentWindow(D('2026-11-15'))).toBe('winter');
    expect(activeParentWindow(D('2026-12-25'))).toBe('winter');
    expect(activeParentWindow(D('2026-12-26'))).toBeNull();
  });

  it('入試直前の窓は 1/5〜2/15（S2-2・1/4×・1/5○・2/15○・2/16×）', () => {
    expect(activeParentWindow(D('2027-01-04'))).toBeNull();
    expect(activeParentWindow(D('2027-01-05'))).toBe('final-stretch');
    expect(activeParentWindow(D('2027-01-20'))).toBe('final-stretch');
    expect(activeParentWindow(D('2027-02-15'))).toBe('final-stretch');
    expect(activeParentWindow(D('2027-02-16'))).toBeNull();
  });

  it('窓の外（春・夏休み中・秋・年末年始12/26〜1/4）は null＝ブリッジ非表示', () => {
    expect(activeParentWindow(D('2026-05-10'))).toBeNull();
    expect(activeParentWindow(D('2026-08-01'))).toBeNull();
    expect(activeParentWindow(D('2026-10-31'))).toBeNull();
    expect(activeParentWindow(D('2026-12-26'))).toBeNull();
    expect(activeParentWindow(D('2027-01-04'))).toBeNull();
  });

  it('引数なしでも例外なく null|窓ID を返す（既定 now）', () => {
    const r = activeParentWindow();
    expect(r === null || r === 'mendan-july' || r === 'winter' || r === 'final-stretch').toBe(true);
  });
});

describe('isEndOfTermSpikeDay（S7-1・終業式デー判定）', () => {
  it('12/23×・12/24○・12/25○・12/26×', () => {
    expect(isEndOfTermSpikeDay(D('2026-12-23'))).toBe(false);
    expect(isEndOfTermSpikeDay(D('2026-12-24'))).toBe(true);
    expect(isEndOfTermSpikeDay(D('2026-12-25'))).toBe(true);
    expect(isEndOfTermSpikeDay(D('2026-12-26'))).toBe(false);
  });

  it('年をまたいでも同型で判定できる（純関数・日付非依存のロジック）', () => {
    expect(isEndOfTermSpikeDay(D('2027-12-24'))).toBe(true);
  });

  it('日付・合否を断定しない一文である（捏造ゼロ）', () => {
    expect(END_OF_TERM_SPIKE_DAY_NOTE).not.toMatch(/必ず|絶対|確実に合格/);
    expect(END_OF_TERM_SPIKE_DAY_NOTE.length).toBeGreaterThan(0);
  });
});

describe('parentWindowCopy（表示コピーの単一ソース）', () => {
  it('3つの窓すべてに badge/heading/intro が揃う', () => {
    for (const id of ['mendan-july', 'winter', 'final-stretch'] as const) {
      const c = parentWindowCopy(id);
      expect(c).toBe(PARENT_WINDOW_COPY[id]);
      expect(c.badge).toBeTruthy();
      expect(c.heading).toBeTruthy();
      expect(c.intro).toBeTruthy();
    }
  });

  it('コピーは日付・合否を断定しない（捏造ゼロ＝一般的な時期の言及のみ）', () => {
    for (const id of ['mendan-july', 'winter', 'final-stretch'] as const) {
      const c = parentWindowCopy(id);
      // 「必ず合格」「◯日まで」等の断定は置かない
      expect(c.heading + c.intro).not.toMatch(/必ず|絶対|確実に合格/);
    }
  });
});
