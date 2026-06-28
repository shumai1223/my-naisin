/**
 * クリック信頼度分類（ダッシュボードの清浄度）の不変条件。
 * 実ブラウザのCTAクリックは必ず自サイトrefererを伴う＝内部refererの有無が人/botの分離軸。
 */

import { isBotUserAgent, isInternalReferer, classifyClick } from '../bot-filter';

const CHROME = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const SAFARI_IOS = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

describe('isBotUserAgent（拡張トークン含む）', () => {
  test('実ブラウザUAは bot 判定しない', () => {
    expect(isBotUserAgent(CHROME)).toBe(false);
    expect(isBotUserAgent(SAFARI_IOS)).toBe(false);
  });
  test('空/未定義は bot', () => {
    expect(isBotUserAgent('')).toBe(true);
    expect(isBotUserAgent(null)).toBe(true);
    expect(isBotUserAgent(undefined)).toBe(true);
  });
  test('AIクローラ・スキャナ・HTTPクライアントを捕捉', () => {
    for (const ua of [
      'GPTBot/1.0',
      'Mozilla/5.0 (compatible; ClaudeBot/1.0)',
      'CCBot/2.0',
      'PerplexityBot/1.0',
      'Amazonbot/0.1',
      'curl/8.4.0',
      'python-requests/2.31',
      'httpx/0.27',
      'Go-http-client/2.0',
      'node-fetch/1.0',
    ]) {
      expect(isBotUserAgent(ua)).toBe(true);
    }
  });
});

describe('isInternalReferer', () => {
  test('自サイト由来のみ true', () => {
    expect(isInternalReferer('https://my-naishin.com/tokyo/naishin')).toBe(true);
    expect(isInternalReferer('https://www.my-naishin.com/')).toBe(true);
    expect(isInternalReferer('https://my-naishin.com/')).toBe(true);
  });
  test('外部・なりすまし・空は false', () => {
    expect(isInternalReferer('https://www.google.com/')).toBe(false);
    expect(isInternalReferer('https://evil-my-naishin.com/')).toBe(false);
    expect(isInternalReferer('https://my-naishin.com.evil.com/')).toBe(false);
    expect(isInternalReferer(null)).toBe(false);
    expect(isInternalReferer('')).toBe(false);
    expect(isInternalReferer('not a url')).toBe(false);
  });
});

describe('classifyClick', () => {
  test('UA未記録（旧データ）は unknown', () => {
    expect(classifyClick({ userAgent: null, referer: null })).toBe('unknown');
    expect(classifyClick({ userAgent: undefined })).toBe('unknown');
  });
  test('ブラウザUA＋内部referer＝human', () => {
    expect(classifyClick({ userAgent: CHROME, referer: 'https://my-naishin.com/tokyo/naishin' })).toBe('human');
  });
  test('ブラウザUAだが内部referer無し＝suspect（/go直叩き）', () => {
    expect(classifyClick({ userAgent: CHROME, referer: null })).toBe('suspect');
    expect(classifyClick({ userAgent: CHROME, referer: 'https://google.com/' })).toBe('suspect');
  });
  test('botUA・空UAは内部refererでも bot', () => {
    expect(classifyClick({ userAgent: 'curl/8', referer: 'https://my-naishin.com/' })).toBe('bot');
    expect(classifyClick({ userAgent: '', referer: 'https://my-naishin.com/' })).toBe('bot');
    expect(classifyClick({ userAgent: 'GPTBot/1.0', referer: 'https://my-naishin.com/' })).toBe('bot');
  });
});
