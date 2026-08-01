/**
 * Λ-21（留守番モード・第1層）実装項目3: デプロイ後スモークチェックの判定ロジックを固定する。
 */
import {
  buildSmokeCheckMessage,
  evaluateSmokeCheck,
  toSmokeCheckResult,
  DEFAULT_SMOKE_CHECK_TARGETS,
  type SmokeCheckResult,
} from '../smoke-check';

describe('toSmokeCheckResult', () => {
  it('200番台はok:trueを返す', () => {
    const r = toSmokeCheckResult({ name: 'home', url: 'https://example.com/' }, { status: 200 });
    expect(r).toEqual({ name: 'home', url: 'https://example.com/', ok: true, status: 200 });
  });

  it('404等の非2xxはok:falseを返す', () => {
    const r = toSmokeCheckResult({ name: 'home', url: 'https://example.com/' }, { status: 404 });
    expect(r.ok).toBe(false);
    expect(r.status).toBe(404);
  });

  it('fetch自体が例外を投げた場合(error)はok:falseかつerrorを保持する', () => {
    const r = toSmokeCheckResult({ name: 'home', url: 'https://example.com/' }, { error: 'timeout' });
    expect(r.ok).toBe(false);
    expect(r.error).toBe('timeout');
  });
});

describe('evaluateSmokeCheck', () => {
  const OK: SmokeCheckResult = { name: 'a', url: 'https://example.com/a', ok: true, status: 200 };
  const FAIL: SmokeCheckResult = { name: 'b', url: 'https://example.com/b', ok: false, status: 500 };

  it('全件okならallOk:true・failuresは空', () => {
    const summary = evaluateSmokeCheck([OK, { ...OK, name: 'c' }]);
    expect(summary.allOk).toBe(true);
    expect(summary.failures).toHaveLength(0);
  });

  it('1件でも失敗があれば全体をallOk:falseにする（安全側）', () => {
    const summary = evaluateSmokeCheck([OK, FAIL]);
    expect(summary.allOk).toBe(false);
    expect(summary.failures).toEqual([FAIL]);
  });
});

describe('buildSmokeCheckMessage', () => {
  it('全件okなら🟢の短いメッセージ', () => {
    const summary = evaluateSmokeCheck([{ name: 'a', url: 'https://example.com/a', ok: true, status: 200 }]);
    const msg = buildSmokeCheckMessage(summary, '2026-08-01T00:00:00.000Z');
    expect(msg).toContain('🟢');
    expect(msg).toContain('全1件');
  });

  it('失敗があれば🔴と失敗詳細（URL・ステータスまたはエラー）を含む', () => {
    const summary = evaluateSmokeCheck([
      { name: 'ホームページ', url: 'https://example.com/', ok: false, status: 500 },
    ]);
    const msg = buildSmokeCheckMessage(summary, '2026-08-01T00:00:00.000Z');
    expect(msg).toContain('🔴');
    expect(msg).toContain('ホームページ');
    expect(msg).toContain('HTTP 500');
  });

  it('エラー(ネットワーク例外等)の場合はエラーメッセージを含む', () => {
    const summary = evaluateSmokeCheck([
      { name: 'API稼働ステータス', url: 'https://example.com/api/status', ok: false, error: 'timeout' },
    ]);
    const msg = buildSmokeCheckMessage(summary, '2026-08-01T00:00:00.000Z');
    expect(msg).toContain('エラー: timeout');
  });
});

describe('DEFAULT_SMOKE_CHECK_TARGETS', () => {
  it('ページ層とAPI層の両方を1回で確認する（ホームページ+/api/status）', () => {
    expect(DEFAULT_SMOKE_CHECK_TARGETS.length).toBeGreaterThanOrEqual(2);
    expect(DEFAULT_SMOKE_CHECK_TARGETS.some((t) => t.url === 'https://my-naishin.com/')).toBe(true);
    expect(DEFAULT_SMOKE_CHECK_TARGETS.some((t) => t.url.endsWith('/api/status'))).toBe(true);
  });
});
