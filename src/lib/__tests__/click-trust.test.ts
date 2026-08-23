/**
 * クリック信頼度分類（ダッシュボードの清浄度）の不変条件。
 * 実ブラウザのCTAクリックは必ず自サイトrefererを伴う＝内部refererの有無が人/botの分離軸。
 */

import {
  isBotUserAgent,
  isInternalReferer,
  isRootOnlyReferer,
  isPlacementConsistentWithReferer,
  classifyClick,
} from '../bot-filter';

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

describe('isRootOnlyReferer', () => {
  test('refererがちょうど https://my-naishin.com/ のときのみ true', () => {
    expect(isRootOnlyReferer('https://my-naishin.com/')).toBe(true);
  });
  test('パス付き・null・他ホストは false', () => {
    expect(isRootOnlyReferer('https://my-naishin.com/hogosha')).toBe(false);
    expect(isRootOnlyReferer(null)).toBe(false);
    expect(isRootOnlyReferer(undefined)).toBe(false);
    expect(isRootOnlyReferer('https://www.my-naishin.com/')).toBe(false);
  });
});

describe('isPlacementConsistentWithReferer（S9-4・root_only×placementの自己矛盾検出）', () => {
  test('root_only referer で home/home-percentile は整合', () => {
    expect(isPlacementConsistentWithReferer('https://my-naishin.com/', 'home')).toBe(true);
    expect(isPlacementConsistentWithReferer('https://my-naishin.com/', 'home-percentile')).toBe(true);
  });
  test('root_only referer で parent-lp 等（ホームページに実在しないplacement）は不整合', () => {
    expect(isPlacementConsistentWithReferer('https://my-naishin.com/', 'parent-lp')).toBe(false);
    expect(isPlacementConsistentWithReferer('https://my-naishin.com/', 'naishin-up')).toBe(false);
    expect(isPlacementConsistentWithReferer('https://my-naishin.com/', 'prefecture')).toBe(false);
    expect(isPlacementConsistentWithReferer('https://my-naishin.com/', 'hensachi')).toBe(false);
  });
  test('root_only 以外のreferer・placement未設定は判定材料が無いため常に整合扱い', () => {
    expect(isPlacementConsistentWithReferer('https://my-naishin.com/hogosha', 'parent-lp')).toBe(true);
    expect(isPlacementConsistentWithReferer('https://my-naishin.com/', null)).toBe(true);
    expect(isPlacementConsistentWithReferer('https://my-naishin.com/', undefined)).toBe(true);
  });
});

describe('classifyClick with placement（S9-4）', () => {
  test('root_only referer × 実在しないplacement は bot（自己矛盾）', () => {
    expect(classifyClick({ userAgent: CHROME, referer: 'https://my-naishin.com/', placement: 'parent-lp' })).toBe(
      'bot'
    );
    expect(classifyClick({ userAgent: CHROME, referer: 'https://my-naishin.com/', placement: 'naishin-up' })).toBe(
      'bot'
    );
  });
  test('root_only referer × home/home-percentile は human のまま', () => {
    expect(classifyClick({ userAgent: CHROME, referer: 'https://my-naishin.com/', placement: 'home' })).toBe(
      'human'
    );
    expect(
      classifyClick({ userAgent: CHROME, referer: 'https://my-naishin.com/', placement: 'home-percentile' })
    ).toBe('human');
  });
  test('placement未指定の既存呼び出しは従来どおり human（後方互換）', () => {
    expect(classifyClick({ userAgent: CHROME, referer: 'https://my-naishin.com/' })).toBe('human');
  });
  test('パス付きrefererではplacementの整合性を判定しない（human のまま）', () => {
    expect(
      classifyClick({ userAgent: CHROME, referer: 'https://my-naishin.com/tokyo/naishin', placement: 'parent-lp' })
    ).toBe('human');
  });
});
