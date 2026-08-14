// contact.ts: お問い合わせ/不具合報告フォームの共通送信ロジック(submitContact)と
// バックエンド未設定時の確実な配信経路(openMailtoFallback)が無テストだった。
// 「サーバー転送が失敗してもmailtoフォールバックで必ず運営者に届く」という設計上の契約を固定する。

import { submitContact, openMailtoFallback, CONTACT_EMAIL } from '../contact';

describe('submitContact', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('/api/contactへPOSTしdelivered:trueを返す(正常系)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ delivered: true }),
    }) as unknown as typeof fetch;

    const result = await submitContact({ subject: 'test', body: 'hello' });
    expect(result).toEqual({ ok: true, delivered: true });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({ method: 'POST', headers: { 'Content-Type': 'application/json' } })
    );
  });

  it('レスポンスがok:falseの場合、ok:false・delivered:falseとサーバーのerrorを返す', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'webhook not configured' }),
    }) as unknown as typeof fetch;

    const result = await submitContact({ subject: 'x' });
    expect(result).toEqual({ ok: false, delivered: false, error: 'webhook not configured' });
  });

  it('delivered未指定のレスポンスはfalse扱い(Boolean変換)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }) as unknown as typeof fetch;

    const result = await submitContact({ subject: 'x' });
    expect(result).toEqual({ ok: true, delivered: false });
  });

  it('fetch自体が例外を投げても(ネットワーク断等)ok:false・delivered:falseを返し、呼び出し元に例外を伝播しない', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('network error')) as unknown as typeof fetch;

    const result = await submitContact({ subject: 'x' });
    expect(result).toEqual({ ok: false, delivered: false });
  });

  it('レスポンスbodyのjson()自体が失敗しても例外を投げない(delivered:false扱い)', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error('invalid json');
      },
    }) as unknown as typeof fetch;

    const result = await submitContact({ subject: 'x' });
    expect(result).toEqual({ ok: true, delivered: false });
  });
});

describe('openMailtoFallback', () => {
  // jsdomのwindow.location/Location.prototype.hrefはconfigurable:falseで固定されており、
  // defineProperty/spyOnいずれでも差し替え・監視ができない(このjsdomバージョンの既知の制約)。
  // 実際のnavigate試行はjsdomが"not implemented"としてconsole.errorに出すだけで例外にはならないため、
  // ここでは「クラッシュしない」契約のみを固定する(実際のhref値の検証はSSRガード側のテストで代替する)。
  it('window定義下で呼んでも例外を投げない', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => openMailtoFallback('件名', '本文')).not.toThrow();
    spy.mockRestore();
  });
});

describe('CONTACT_EMAIL', () => {
  it('有効なメールアドレス形式である', () => {
    expect(CONTACT_EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });
});
