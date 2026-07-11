/**
 * 紹介・解放機構（T-1）の解放状態。localStorage契約テスト（stats-consent.test.tsと同型）。
 */
import { readUnlockGate, markUnlockAction, hasUnlockGranted, UNLOCK_GATE_VERSION } from '../unlock-gate';

const KEY = 'my-naishin:unlock-gate';

beforeEach(() => {
  window.localStorage.clear();
});

describe('readUnlockGate', () => {
  it('未解放（キー無し）は既定でgranted:false・action:null', () => {
    const s = readUnlockGate();
    expect(s.granted).toBe(false);
    expect(s.action).toBeNull();
    expect(s.grantedAt).toBeNull();
    expect(s.version).toBe(UNLOCK_GATE_VERSION);
  });

  it('壊れたJSONは既定値にフォールバック', () => {
    window.localStorage.setItem(KEY, '{not json');
    expect(readUnlockGate().granted).toBe(false);
  });

  it('versionが現行と異なる保存済み解放は無効化される', () => {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ granted: true, action: 'share', grantedAt: new Date().toISOString(), version: UNLOCK_GATE_VERSION - 1 })
    );
    expect(readUnlockGate().granted).toBe(false);
  });

  it('actionが不正な値なら無効化される', () => {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ granted: true, action: 'bogus', grantedAt: new Date().toISOString(), version: UNLOCK_GATE_VERSION })
    );
    expect(readUnlockGate().granted).toBe(false);
  });
});

describe('markUnlockAction', () => {
  it('share/lineどちらの行動でも解放が成立する', () => {
    const now = new Date('2026-07-11T12:00:00Z');
    const state = markUnlockAction('share', now);
    expect(state.granted).toBe(true);
    expect(state.action).toBe('share');
    expect(state.grantedAt).toBe(now.toISOString());

    const read = readUnlockGate();
    expect(read).toEqual(state);
  });

  it('既に解放済みなら最初の行動を保持する（上書きしない）', () => {
    markUnlockAction('share', new Date('2026-07-11T12:00:00Z'));
    const second = markUnlockAction('line', new Date('2026-07-11T13:00:00Z'));
    expect(second.action).toBe('share');
    expect(second.grantedAt).toBe('2026-07-11T12:00:00.000Z');
  });
});

describe('hasUnlockGranted', () => {
  it('解放前はfalse、解放後はtrue', () => {
    expect(hasUnlockGranted()).toBe(false);
    markUnlockAction('line');
    expect(hasUnlockGranted()).toBe(true);
  });
});
