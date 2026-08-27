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

  it('affiliateIdを渡すとlocation.replaceの前にsendBeaconで通過を記録する（出血6②）', () => {
    const html = renderClickHopHtml(href, 'zkai-banner');
    expect(html).toContain('navigator.sendBeacon("/api/click-hop-complete"');
    expect(html).toContain('affiliateId:"zkai-banner"');
    const beaconIndex = html.indexOf('sendBeacon');
    const replaceIndex = html.indexOf('location.replace');
    expect(beaconIndex).toBeGreaterThan(-1);
    expect(beaconIndex).toBeLessThan(replaceIndex);
  });

  it('affiliateIdを渡さない場合はsendBeaconを含まない（従来動作のまま）', () => {
    const html = renderClickHopHtml(href);
    expect(html).not.toContain('sendBeacon');
  });
});
