/**
 * @jest-environment node
 *
 * sendApiKeyEmail（2026-08-13新設・課金成立時にAPIキーをメールで届ける）の契約テスト。
 * RESEND_API_KEY未設定でno-opになることと、HTMLエスケープ（tier/apiKeyへの'<','>','&'混入対策）を固定する。
 */
import { sendApiKeyEmail } from '../esp';

describe('sendApiKeyEmail', () => {
  const ORIGINAL_ENV = { ...process.env };
  let fetchMock: jest.Mock;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.RESEND_API_KEY;
    delete process.env.LEAD_FROM_EMAIL;
    fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  test('RESEND_API_KEY未設定ならfalseを返し、fetchを一切呼ばない（no-op）', async () => {
    const result = await sendApiKeyEmail('dev@example.com', 'mnsk_live_dummy', 'pro');
    expect(result).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('RESEND_API_KEY設定済みなら送信し、宛先・件名・本文にAPIキーとtierを含める', async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    fetchMock.mockResolvedValue({ ok: true, text: async () => '' });

    const result = await sendApiKeyEmail('dev@example.com', 'mnsk_live_abcdef', 'business');
    expect(result).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('resend.com');
    expect(init.headers.Authorization).toBe('Bearer re_test_key');

    const payload = JSON.parse(init.body as string);
    expect(payload.to).toEqual(['dev@example.com']);
    expect(payload.subject).toContain('BUSINESS');
    expect(payload.html).toContain('mnsk_live_abcdef');
    expect(payload.html).toContain('BUSINESS');
  });

  test('tierに<>&が混入してもHTMLエスケープされる（XSS対策）', async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    fetchMock.mockResolvedValue({ ok: true, text: async () => '' });

    await sendApiKeyEmail('dev@example.com', 'mnsk_live_dummy', '<script>alert(1)</script>');

    const payload = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    expect(payload.html).not.toContain('<script>alert(1)</script>');
    expect(payload.html).toContain('&lt;SCRIPT&gt;');
  });

  test('Resendがエラーを返してもfalseを返すだけで例外を投げない', async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    fetchMock.mockResolvedValue({ ok: false, status: 403, text: async () => 'domain not verified' });

    const result = await sendApiKeyEmail('dev@example.com', 'mnsk_live_dummy', 'pro');
    expect(result).toBe(false);
  });

  test('fetch自体が例外を投げても握りつぶしてfalseを返す（Webhook ACKへ影響させない）', async () => {
    process.env.RESEND_API_KEY = 're_test_key';
    fetchMock.mockRejectedValue(new Error('network down'));

    const result = await sendApiKeyEmail('dev@example.com', 'mnsk_live_dummy', 'pro');
    expect(result).toBe(false);
  });
});
