import { extractRelevantLinks, diffHubLinks } from '../hub-diff';

describe('extractRelevantLinks', () => {
  const baseUrl = 'https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/index.html';

  it('抽出対象: 募集/志願/出願/倍率/進路希望/合格/令和9年度のいずれかを含むpdf/xlsx/htmlリンクのみ拾う', () => {
    const html = `
      <a href="/r9/documents/r9boshuu.pdf">令和9年度募集定員</a>
      <a href="/r9/link-list.pdf">関連リンク集</a>
      <a href="/access.pdf">アクセスマップ</a>
      <a href="/about.html">このサイトについて</a>
    `;
    const links = extractRelevantLinks(html, baseUrl);
    expect(links).toHaveLength(1);
    expect(links[0].href).toBe('https://www.pref.chiba.lg.jp/r9/documents/r9boshuu.pdf');
    expect(links[0].text).toBe('令和9年度募集定員');
  });

  it('2026-09-07実測(4県共通パターン): ハブが直接PDFでなく「令和9年度」を含む年度ページ(.html)へリンクする場合も拾う', () => {
    const html = `
      <a href="/r9/index.html">令和9年度高等学校入学者選抜情報</a>
      <a href="/r8/index.html">令和8年度高等学校入学者選抜情報（旧年度）</a>
      <a href="/access.html">アクセス</a>
    `;
    const links = extractRelevantLinks(html, baseUrl);
    expect(links).toHaveLength(1);
    expect(links[0].href).toBe('https://www.pref.chiba.lg.jp/r9/index.html');
  });

  it('キーワードを含まない一般的なナビゲーション.htmlリンクは拾わない（ノイズ対策）', () => {
    const html = `
      <a href="/index.html">トップページ</a>
      <a href="/sitemap.html">サイトマップ</a>
      <a href="/kojin-jouhou.html">個人情報保護方針</a>
    `;
    expect(extractRelevantLinks(html, baseUrl)).toEqual([]);
  });

  it('リンクテキストでなくURL自体（日本語ファイル名）にキーワードが含まれる場合も拾う（テキストが汎用な県向け）', () => {
    const html = `<a href="/r9/合格者数.pdf">こちら</a>`;
    const links = extractRelevantLinks(html, baseUrl);
    expect(links).toHaveLength(1);
  });

  it('パーセントエンコードされた日本語キーワード（URLのみに含まれるケース）も拾う', () => {
    const html = `<a href="/uploads/20260212_%EF%BC%91%E6%AC%A1%E5%8B%9F%E9%9B%86.pdf">PDF</a>`;
    const links = extractRelevantLinks(html, baseUrl);
    expect(links).toHaveLength(1);
  });

  it('相対パスを baseUrl 基準の絶対URLへ正規化する', () => {
    const html = `<a href="r8/documents/r8boshuu.pdf">令和8年度募集定員</a>`;
    const links = extractRelevantLinks(html, baseUrl);
    expect(links[0].href).toBe('https://www.pref.chiba.lg.jp/kyouiku/shidou/nyuushi/koukou/r8/documents/r8boshuu.pdf');
  });

  it('同一URLへの重複リンクは1件に畳む', () => {
    const html = `
      <a href="/r9/boshuu.pdf">募集定員（表）</a>
      <a href="/r9/boshuu.pdf">募集定員（別掲載）</a>
    `;
    const links = extractRelevantLinks(html, baseUrl);
    expect(links).toHaveLength(1);
  });

  it('クエリ文字列・フラグメント付きでも拡張子判定できる', () => {
    const html = `<a href="/r9/boshuu.pdf?rev=2">令和9年度募集定員</a>`;
    const links = extractRelevantLinks(html, baseUrl);
    expect(links).toHaveLength(1);
  });

  it('該当リンクが無ければ空配列', () => {
    const html = `<a href="/about.html">このサイトについて</a>`;
    expect(extractRelevantLinks(html, baseUrl)).toEqual([]);
  });
});

describe('diffHubLinks', () => {
  it('前回に無く今回あるリンクをnewLinksとして返す', () => {
    const previous = [{ href: 'https://example.jp/r8.pdf', text: '令和8年度募集定員' }];
    const current = [
      { href: 'https://example.jp/r8.pdf', text: '令和8年度募集定員' },
      { href: 'https://example.jp/r9.pdf', text: '令和9年度募集定員' },
    ];
    const result = diffHubLinks(previous, current);
    expect(result.newLinks).toEqual([{ href: 'https://example.jp/r9.pdf', text: '令和9年度募集定員' }]);
    expect(result.removedLinks).toEqual([]);
    expect(result.unchangedCount).toBe(1);
  });

  it('前回にあり今回無いリンクをremovedLinksとして返す', () => {
    const previous = [{ href: 'https://example.jp/r7.pdf', text: '令和7年度募集定員' }];
    const current: typeof previous = [];
    const result = diffHubLinks(previous, current);
    expect(result.removedLinks).toEqual(previous);
    expect(result.newLinks).toEqual([]);
    expect(result.unchangedCount).toBe(0);
  });

  it('初回実行（previousが空配列）は全件newLinksになる', () => {
    const current = [{ href: 'https://example.jp/r9.pdf', text: '令和9年度募集定員' }];
    const result = diffHubLinks([], current);
    expect(result.newLinks).toEqual(current);
  });

  it('変化なしの場合はnewLinks/removedLinksとも空', () => {
    const links = [{ href: 'https://example.jp/r8.pdf', text: '令和8年度募集定員' }];
    const result = diffHubLinks(links, links);
    expect(result.newLinks).toEqual([]);
    expect(result.removedLinks).toEqual([]);
    expect(result.unchangedCount).toBe(1);
  });
});
