/**
 * 匿名統計オプトインの同意状態（TIER N-1）。
 *
 * A-12/TIER N（一次データ堀）の入口。計算結果画面で「匿名で統計に協力する」への
 * 同意/撤回をlocalStorageに保持する純粋な状態管理のみをここに実装する。
 *
 * ⚠️ 現時点でこのモジュールを参照する送信先API（N-3）・集計スキーマ（N-2）は未実装。
 * 同意してもまだ何のデータも収集・送信されない（実際に集計に使われるのはN-2migration適用＋
 * N-3 API実装後）。ユーザーに実体のない同意を求める見せかけの機能にしないため、
 * このモジュール・StatsOptInコンポーネントはN-3実装まで意図的にどのページにも
 * マウントしない（build-not-launch。[[fable5-fullaccel-backlog-2026-07]] TIER Rと同じ思想）。
 *
 * version: 収集する項目や同意文言が実質的に変わった場合はこの値を上げる。
 * 保存済みのversionと不一致なら同意を無効化し、再度同意を求める（暗黙の同意の使い回し防止）。
 */

export const STATS_CONSENT_VERSION = 1;

export interface StatsConsentState {
  granted: boolean;
  /** 同意した日時（ISO）。granted=falseならnull。 */
  consentedAt: string | null;
  version: number;
}

const STATS_CONSENT_KEY = 'my-naishin:stats-consent';

const DEFAULT_STATE: StatsConsentState = { granted: false, consentedAt: null, version: STATS_CONSENT_VERSION };

function sanitize(value: unknown): StatsConsentState {
  if (!value || typeof value !== 'object') return { ...DEFAULT_STATE };
  const obj = value as Record<string, unknown>;

  const version = typeof obj.version === 'number' && Number.isFinite(obj.version) ? obj.version : null;
  // 保存時のバージョンが現行と異なる同意文言に基づくものなら、無効化して再同意を求める。
  if (version !== STATS_CONSENT_VERSION) return { ...DEFAULT_STATE };

  const granted = obj.granted === true;
  const consentedAt = typeof obj.consentedAt === 'string' && Number.isFinite(Date.parse(obj.consentedAt)) ? obj.consentedAt : null;

  if (!granted || !consentedAt) return { ...DEFAULT_STATE };
  return { granted: true, consentedAt, version: STATS_CONSENT_VERSION };
}

/** 現在の同意状態を読む。localStorageが使えない/壊れている場合は既定値（未同意）を返す（安全側）。 */
export function readStatsConsent(): StatsConsentState {
  if (typeof window === 'undefined') return { ...DEFAULT_STATE };
  try {
    const raw = window.localStorage.getItem(STATS_CONSENT_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    return sanitize(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_STATE };
  }
}

/** 統計協力に同意したことを記録する。 */
export function grantStatsConsent(now: Date = new Date()): StatsConsentState {
  const state: StatsConsentState = { granted: true, consentedAt: now.toISOString(), version: STATS_CONSENT_VERSION };
  if (typeof window === 'undefined') return state;
  try {
    window.localStorage.setItem(STATS_CONSENT_KEY, JSON.stringify(state));
  } catch {
    // ignore（保存できなくても同意状態はメモリ上では反映済みとして返す）
  }
  return state;
}

/** 統計協力の同意を撤回する（撤回導線）。 */
export function revokeStatsConsent(): StatsConsentState {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(STATS_CONSENT_KEY);
    } catch {
      // ignore
    }
  }
  return { ...DEFAULT_STATE };
}

/** 同意済みかどうかだけを手早く見たいときのヘルパー。 */
export function hasStatsConsent(): boolean {
  return readStatsConsent().granted;
}
