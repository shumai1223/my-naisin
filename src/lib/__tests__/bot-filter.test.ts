import { isBotUserAgent, isPrefetchRequest } from '@/lib/bot-filter';

describe('isBotUserAgent', () => {
  it('実ブラウザ(PC/モバイル)は bot 扱いしない', () => {
    const browsers = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    ];
    for (const ua of browsers) expect(isBotUserAgent(ua)).toBe(false);
  });

  it('クローラ/スクレイパ/スキャナ/スクリプトは bot 扱い', () => {
    const bots = [
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)',
      'facebookexternalhit/1.1',
      'curl/8.4.0',
      'python-requests/2.31.0',
      'node-fetch/1.0',
      'Mozilla/5.0 (X11; Linux x86_64) HeadlessChrome/120.0.0.0',
    ];
    for (const ua of bots) expect(isBotUserAgent(ua)).toBe(true);
  });

  it('UA が空/未指定はスクリプト直叩きとみなして bot 扱い', () => {
    expect(isBotUserAgent('')).toBe(true);
    expect(isBotUserAgent('   ')).toBe(true);
    expect(isBotUserAgent(null)).toBe(true);
    expect(isBotUserAgent(undefined)).toBe(true);
  });

  it('化石UA(iOS13.2.3偽装スクレイパ)は bot 扱い・現行iOSは通す', () => {
    expect(
      isBotUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
      )
    ).toBe(true);
    expect(
      isBotUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      )
    ).toBe(false);
  });
});

describe('isPrefetchRequest', () => {
  const headersOf = (map: Record<string, string>) => ({
    get: (name: string) => map[name.toLowerCase()] ?? null,
  });

  it('Sec-Purpose/Purpose/X-Moz の先読みを検出する', () => {
    expect(isPrefetchRequest(headersOf({ 'sec-purpose': 'prefetch' }))).toBe(true);
    expect(isPrefetchRequest(headersOf({ 'sec-purpose': 'prefetch;prerender' }))).toBe(true);
    expect(isPrefetchRequest(headersOf({ purpose: 'prefetch' }))).toBe(true);
    expect(isPrefetchRequest(headersOf({ 'x-moz': 'prefetch' }))).toBe(true);
  });

  it('通常リクエストは先読み扱いしない', () => {
    expect(isPrefetchRequest(headersOf({}))).toBe(false);
    expect(isPrefetchRequest(headersOf({ 'sec-purpose': '' }))).toBe(false);
  });
});
