/**
 * Λ-21（留守番モード・第1層）のDiscord webhook通知。
 * webhook URL未設定時は安全にno-op（D1未バインド時の既存パターンと同じ設計）を固定する。
 */
import { postDiscordWebhook } from '../discord-notify';

describe('postDiscordWebhook', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('webhook URLが未設定(undefined)ならfetchせずskipを返す', async () => {
    const fetchSpy = jest.fn();
    global.fetch = fetchSpy as unknown as typeof fetch;

    const result = await postDiscordWebhook(undefined, 'test message');

    expect(result).toEqual({ ok: false, skipped: true });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('webhook URLが空文字/nullでもskipを返す', async () => {
    const fetchSpy = jest.fn();
    global.fetch = fetchSpy as unknown as typeof fetch;

    expect(await postDiscordWebhook('', 'msg')).toEqual({ ok: false, skipped: true });
    expect(await postDiscordWebhook(null, 'msg')).toEqual({ ok: false, skipped: true });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('webhook URLが設定済みならJSON POSTしてok:trueを返す', async () => {
    const fetchSpy = jest.fn().mockResolvedValue({ ok: true, status: 204 });
    global.fetch = fetchSpy as unknown as typeof fetch;

    const result = await postDiscordWebhook('https://discord.com/api/webhooks/xxx', 'hello');

    expect(result).toEqual({ ok: true, skipped: false });
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://discord.com/api/webhooks/xxx',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'hello' }),
      })
    );
  });

  it('Discordが非200を返したらok:falseとエラー内容を返す（例外を投げない）', async () => {
    const fetchSpy = jest.fn().mockResolvedValue({ ok: false, status: 404 });
    global.fetch = fetchSpy as unknown as typeof fetch;

    const result = await postDiscordWebhook('https://discord.com/api/webhooks/xxx', 'hello');

    expect(result.ok).toBe(false);
    expect(result.skipped).toBe(false);
    expect(result.error).toContain('404');
  });

  it('fetch自体が例外を投げても捕捉してok:falseを返す（監視スクリプト全体を落とさない）', async () => {
    const fetchSpy = jest.fn().mockRejectedValue(new Error('network down'));
    global.fetch = fetchSpy as unknown as typeof fetch;

    const result = await postDiscordWebhook('https://discord.com/api/webhooks/xxx', 'hello');

    expect(result.ok).toBe(false);
    expect(result.skipped).toBe(false);
    expect(result.error).toBe('network down');
  });
});
