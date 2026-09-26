/** @jest-environment node */
/**
 * 応援リンク（T-REV2 R5）の契約テスト。
 * - URL未設定の間は何も描画しない（フッターに出ない）
 * - Stripe の Payment Link(https) 以外は受け付けない
 * - 見返りを約束する文言を出さない
 */
import { resolveSupportUrl } from '../support-link';

describe('resolveSupportUrl', () => {
  it('未設定・空・空白は null', () => {
    expect(resolveSupportUrl(undefined)).toBeNull();
    expect(resolveSupportUrl(null)).toBeNull();
    expect(resolveSupportUrl('')).toBeNull();
    expect(resolveSupportUrl('   ')).toBeNull();
  });

  it('Stripe の Payment Link(https) だけを通す', () => {
    expect(resolveSupportUrl('https://buy.stripe.com/test_abc123')).toBe('https://buy.stripe.com/test_abc123');
    expect(resolveSupportUrl(' https://donate.stripe.com/xyz ')).toBe('https://donate.stripe.com/xyz');
  });

  it('http・他ホスト・なりすましホスト・認証情報付き・壊れたURLは null', () => {
    expect(resolveSupportUrl('http://buy.stripe.com/abc')).toBeNull();
    expect(resolveSupportUrl('https://example.com/abc')).toBeNull();
    expect(resolveSupportUrl('https://buy.stripe.com.evil.example/abc')).toBeNull();
    expect(resolveSupportUrl('https://evil.example/buy.stripe.com')).toBeNull();
    expect(resolveSupportUrl('https://user:pw@buy.stripe.com/abc')).toBeNull();
    expect(resolveSupportUrl('javascript:alert(1)')).toBeNull();
    expect(resolveSupportUrl('not a url')).toBeNull();
  });
});

describe('Footer の応援リンク', () => {
  const ORIGINAL = process.env.NEXT_PUBLIC_SUPPORT_URL;
  afterEach(() => {
    if (ORIGINAL === undefined) delete process.env.NEXT_PUBLIC_SUPPORT_URL;
    else process.env.NEXT_PUBLIC_SUPPORT_URL = ORIGINAL;
    jest.resetModules();
  });

  function renderFooter(): string {
    let html = '';
    jest.isolateModules(() => {
      // isolateModules 内で React も読み直す（別インスタンスだとフックが動かない）
      /* eslint-disable @typescript-eslint/no-require-imports */
      const React = require('react');
      const { renderToStaticMarkup } = require('react-dom/server');
      const { Footer } = require('@/components/Footer');
      /* eslint-enable @typescript-eslint/no-require-imports */
      html = renderToStaticMarkup(React.createElement(Footer));
    });
    return html;
  }

  it('URL未設定なら「応援」リンクを描画しない', () => {
    delete process.env.NEXT_PUBLIC_SUPPORT_URL;
    expect(renderFooter()).not.toContain('このサイトを応援する');
  });

  it('不正なURLでも描画しない', () => {
    process.env.NEXT_PUBLIC_SUPPORT_URL = 'https://example.com/pay';
    expect(renderFooter()).not.toContain('このサイトを応援する');
  });

  it('Payment Link が設定されたら、小さなリンクを1つだけ描画し、見返りを約束しない', () => {
    process.env.NEXT_PUBLIC_SUPPORT_URL = 'https://buy.stripe.com/test_abc123';
    const html = renderFooter();
    expect(html.match(/このサイトを応援する/g)).toHaveLength(1);
    expect(html).toContain('href="https://buy.stripe.com/test_abc123"');
    expect(html).toContain('nofollow');
    expect(html).toContain('運営費にあてます');
    // 見返り・特典・限定などの約束をしない
    const supportPart = html.slice(html.indexOf('このサイトを応援する') - 400, html.indexOf('このサイトを応援する') + 100);
    expect(supportPart).not.toMatch(/特典|限定|お礼に|プレゼント|見返り[をが]?[お提]/);
  });
});
