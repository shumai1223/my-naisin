// push-config.ts: Web Push(H-NEW)のVAPID公開鍵。WebPushOptIn.tsxの表示ゲート
// (Boolean(VAPID_PUBLIC_KEY)が偽ならUI自体を描画しない)として使われるが無テストだった。
// VAPID_PUBLIC_KEYはモジュール読み込み時に一度だけenvを評価するため、line.test.tsと同じく
// jest.resetModules()+require()でenv切り替えごとに再読み込みする。

describe('VAPID_PUBLIC_KEY', () => {
  const ORIGINAL_ENV = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    delete process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('env未設定時はハードコードの既定鍵を返す(空文字にはならずWebPushOptInが常に表示可能)', () => {
    const { VAPID_PUBLIC_KEY } = require('../push-config');
    expect(typeof VAPID_PUBLIC_KEY).toBe('string');
    expect(VAPID_PUBLIC_KEY.length).toBeGreaterThan(0);
  });

  it('NEXT_PUBLIC_VAPID_PUBLIC_KEYを設定すると既定値を上書きする', () => {
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = 'override-vapid-key';
    const { VAPID_PUBLIC_KEY } = require('../push-config');
    expect(VAPID_PUBLIC_KEY).toBe('override-vapid-key');
  });

  it('envが空文字の場合は既定値にフォールバックする(||演算子の仕様どおり)', () => {
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = '';
    const { VAPID_PUBLIC_KEY } = require('../push-config');
    expect(VAPID_PUBLIC_KEY.length).toBeGreaterThan(0);
    expect(VAPID_PUBLIC_KEY).not.toBe('');
  });
});
