/**
 * 匿名統計オプトインの同意状態（TIER N-1）。localStorage契約テスト。
 */
import {
  readStatsConsent,
  grantStatsConsent,
  revokeStatsConsent,
  hasStatsConsent,
  STATS_CONSENT_VERSION,
} from '../stats-consent';

const KEY = 'my-naishin:stats-consent';

beforeEach(() => {
  window.localStorage.clear();
});

describe('readStatsConsent', () => {
  it('未同意（キー無し）は既定で granted:false', () => {
    const s = readStatsConsent();
    expect(s.granted).toBe(false);
    expect(s.consentedAt).toBeNull();
    expect(s.version).toBe(STATS_CONSENT_VERSION);
  });

  it('壊れたJSONは既定値にフォールバック', () => {
    window.localStorage.setItem(KEY, '{not json');
    const s = readStatsConsent();
    expect(s.granted).toBe(false);
  });

  it('versionが現行と異なる保存済み同意は無効化される（再同意を要求）', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ granted: true, consentedAt: new Date().toISOString(), version: STATS_CONSENT_VERSION - 1 }));
    const s = readStatsConsent();
    expect(s.granted).toBe(false);
  });

  it('consentedAtが不正な日時なら無効化される', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ granted: true, consentedAt: 'not-a-date', version: STATS_CONSENT_VERSION }));
    expect(readStatsConsent().granted).toBe(false);
  });
});

describe('grantStatsConsent / revokeStatsConsent', () => {
  it('同意すると granted:true・consentedAtが記録され、readStatsConsentで再現できる', () => {
    const now = new Date('2026-07-09T12:00:00Z');
    const granted = grantStatsConsent(now);
    expect(granted.granted).toBe(true);
    expect(granted.consentedAt).toBe(now.toISOString());

    const read = readStatsConsent();
    expect(read).toEqual(granted);
  });

  it('撤回すると既定値（未同意）に戻る', () => {
    grantStatsConsent();
    expect(hasStatsConsent()).toBe(true);

    const revoked = revokeStatsConsent();
    expect(revoked.granted).toBe(false);
    expect(hasStatsConsent()).toBe(false);
  });
});

describe('hasStatsConsent', () => {
  it('同意前はfalse、同意後はtrue', () => {
    expect(hasStatsConsent()).toBe(false);
    grantStatsConsent();
    expect(hasStatsConsent()).toBe(true);
  });
});
