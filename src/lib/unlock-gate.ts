/**
 * 紹介・解放機構（T-1）の解放状態＝純粋なlocalStorage状態管理。
 *
 * 北極星：「シェアが名簿を連れてくる」構造への転換（G1・8/31・名簿velocity20〜40/週の主エンジン）。
 * 保護者バトン送信（既存 ParentShareLinkButton＝EVENTS.SHARE_TO_PARENT）か、
 * 保護者向けLINE友だち追加（既存 lineAddUrl('parent')＝EVENTS.LINE_FRIEND_CLICK）の
 * どちらかを行うと、成績カードの追加機能・全国統計の先行閲覧（NationalPercentileReveal）が解放される。
 *
 * 実際のLINE友だち追加・共有先での開封はサーバー側で確認できない（webhook無し）ため、
 * ここでの「解放」はクリック（意図表明）をもって成立するベストエフォート設計。
 * StatsOptIn/stats-consent.tsと同じ思想＝window非依存で読めない環境は常に「未解放」。
 *
 * version: 解放条件が実質的に変わった場合はこの値を上げる（保存済みの解放を無効化し再解放を求める）。
 */

export const UNLOCK_GATE_VERSION = 1;

export type UnlockAction = 'share' | 'line';

export interface UnlockGateState {
  granted: boolean;
  /** 解放のきっかけになった行動。granted=falseならnull。 */
  action: UnlockAction | null;
  grantedAt: string | null;
  version: number;
}

const UNLOCK_GATE_KEY = 'my-naishin:unlock-gate';

const DEFAULT_STATE: UnlockGateState = { granted: false, action: null, grantedAt: null, version: UNLOCK_GATE_VERSION };

function sanitize(value: unknown): UnlockGateState {
  if (!value || typeof value !== 'object') return { ...DEFAULT_STATE };
  const obj = value as Record<string, unknown>;

  const version = typeof obj.version === 'number' && Number.isFinite(obj.version) ? obj.version : null;
  if (version !== UNLOCK_GATE_VERSION) return { ...DEFAULT_STATE };

  const granted = obj.granted === true;
  const action = obj.action === 'share' || obj.action === 'line' ? obj.action : null;
  const grantedAt = typeof obj.grantedAt === 'string' && Number.isFinite(Date.parse(obj.grantedAt)) ? obj.grantedAt : null;

  if (!granted || !action || !grantedAt) return { ...DEFAULT_STATE };
  return { granted: true, action, grantedAt, version: UNLOCK_GATE_VERSION };
}

/** 現在の解放状態を読む。localStorageが使えない/壊れている場合は既定値（未解放）を返す（安全側）。 */
export function readUnlockGate(): UnlockGateState {
  if (typeof window === 'undefined') return { ...DEFAULT_STATE };
  try {
    const raw = window.localStorage.getItem(UNLOCK_GATE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return sanitize(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_STATE };
  }
}

/** 解放行動（共有 or LINE友だち追加）を記録する。既に解放済みなら最初の行動を保持する（上書きしない）。 */
export function markUnlockAction(action: UnlockAction, now: Date = new Date()): UnlockGateState {
  const existing = readUnlockGate();
  if (existing.granted) return existing;
  const state: UnlockGateState = { granted: true, action, grantedAt: now.toISOString(), version: UNLOCK_GATE_VERSION };
  if (typeof window === 'undefined') return state;
  try {
    window.localStorage.setItem(UNLOCK_GATE_KEY, JSON.stringify(state));
  } catch {
    // ignore（保存できなくてもメモリ上の状態は反映済みとして返す）
  }
  return state;
}

/** 解放済みかどうかだけを手早く見たいときのヘルパー。 */
export function hasUnlockGranted(): boolean {
  return readUnlockGate().granted;
}
