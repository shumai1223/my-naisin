/**
 * @jest-environment node
 *
 * lead.ts openLeadMailtoFallback()の「if (typeof window === 'undefined') return;」ガードを
 * 実際にwindowが存在しない環境(SSR相当)で検証する([[contact-ssr-guard]]と同型)。
 */

import { openLeadMailtoFallback } from '../lead';

describe('openLeadMailtoFallback (SSR環境)', () => {
  it('windowが未定義の環境では何もせず例外も投げない', () => {
    expect(typeof window).toBe('undefined');
    expect(() =>
      openLeadMailtoFallback({ email: 'parent@example.com', consent: true, source: 'result' })
    ).not.toThrow();
    expect(
      openLeadMailtoFallback({ email: 'parent@example.com', consent: true, source: 'result' })
    ).toBeUndefined();
  });
});
