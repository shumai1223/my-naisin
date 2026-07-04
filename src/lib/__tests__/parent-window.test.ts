/**
 * 保護者ウィンドウ判定（Build 1）の境界テスト。
 * 収穫窓は保護者接点が確実に立つ期間だけ＝三者面談・出願の直前。窓の端が仕様どおりか固定する。
 */
import { activeParentWindow, parentWindowCopy, PARENT_WINDOW_COPY } from '../parent-window';

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

  it('窓の外（春・夏休み中・秋）は null＝ブリッジ非表示', () => {
    expect(activeParentWindow(D('2026-05-10'))).toBeNull();
    expect(activeParentWindow(D('2026-08-01'))).toBeNull();
    expect(activeParentWindow(D('2026-10-31'))).toBeNull();
    expect(activeParentWindow(D('2027-01-05'))).toBeNull();
  });

  it('引数なしでも例外なく null|窓ID を返す（既定 now）', () => {
    const r = activeParentWindow();
    expect(r === null || r === 'mendan-july' || r === 'winter').toBe(true);
  });
});

describe('parentWindowCopy（表示コピーの単一ソース）', () => {
  it('両方の窓に badge/heading/intro が揃う', () => {
    for (const id of ['mendan-july', 'winter'] as const) {
      const c = parentWindowCopy(id);
      expect(c).toBe(PARENT_WINDOW_COPY[id]);
      expect(c.badge).toBeTruthy();
      expect(c.heading).toBeTruthy();
      expect(c.intro).toBeTruthy();
    }
  });

  it('コピーは日付・合否を断定しない（捏造ゼロ＝一般的な時期の言及のみ）', () => {
    for (const id of ['mendan-july', 'winter'] as const) {
      const c = parentWindowCopy(id);
      // 「必ず合格」「◯日まで」等の断定は置かない
      expect(c.heading + c.intro).not.toMatch(/必ず|絶対|確実に合格/);
    }
  });
});
