import { renderClickHopHtml } from '@/lib/click-hop';

describe('renderClickHopHtml', () => {
  const href = 'https://px.a8.net/svt/ejp?a8mat=TEST123';

  it('遷移先URLを平文で含まない（href収集ボットにASP URLを渡さない）', () => {
    const html = renderClickHopHtml(href);
    expect(html).not.toContain(href);
    expect(html).not.toContain('px.a8.net');
  });

  it('base64化したURLをatob付きJSでのみ埋め込む', () => {
    const html = renderClickHopHtml(href);
    const b64 = Buffer.from(href, 'utf8').toString('base64');
    expect(html).toContain(`location.replace(atob("${b64}"))`);
    expect(Buffer.from(b64, 'base64').toString('utf8')).toBe(href);
  });

  it('noindex,nofollow を宣言し、noscriptにはASP URLを出さずトップ誘導のみ', () => {
    const html = renderClickHopHtml(href);
    expect(html).toContain('name="robots" content="noindex,nofollow"');
    expect(html).toMatch(/<noscript>.*href="\/".*<\/noscript>/);
  });
});
