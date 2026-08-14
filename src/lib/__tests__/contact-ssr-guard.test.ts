/**
 * @jest-environment node
 *
 * contact.ts openMailtoFallback()の「if (typeof window === 'undefined') return;」ガードを
 * 実際にwindowが存在しない環境(SSR相当)で検証する。jsdom環境ではwindowが常に存在するため、
 * この分岐は@jest-environment nodeでしか直接テストできない。
 */

import { openMailtoFallback } from '../contact';

describe('openMailtoFallback (SSR環境)', () => {
  it('windowが未定義の環境では何もせず例外も投げない', () => {
    expect(typeof window).toBe('undefined');
    expect(() => openMailtoFallback('件名', '本文')).not.toThrow();
    expect(openMailtoFallback('件名', '本文')).toBeUndefined();
  });
});
