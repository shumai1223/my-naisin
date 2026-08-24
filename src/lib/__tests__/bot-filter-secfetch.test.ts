/**
 * TH-13 続報（2026-08-24）: `/go` の無効クリック対策に Sec-Fetch-Site を追加した契約テスト。
 *
 * 事故: 8/13〜8/15の3日で829クリック。**1クリック=1個の別IP（比率1.000）**なのに
 *       **distinct UA はわずか8種**（全てデスクトップChrome/Edgeの正規UA文字列）。
 *       ①UA検査・②同一IPバースト・③内部referer必須 を全てすり抜け、
 *       ASP3社（A8 241/もしも200+/アクセストレード180）へ無効クリックが計上されていた。
 *
 * 原因: 「自サイトから来た証拠」を `Referer` だけに頼っていた。**Referer は詐称できる。**
 * 対策: ブラウザが自動付与し JS から上書きできない `Sec-Fetch-Site` を併用する。
 */
import { hasSameOriginNavigation } from '../bot-filter';

const h = (v?: Record<string, string>) => ({
  get: (name: string) => v?.[name.toLowerCase()] ?? null,
});

describe('hasSameOriginNavigation', () => {
  it('自サイト内リンクのクリック（same-origin）は true', () => {
    expect(hasSameOriginNavigation(h({ 'sec-fetch-site': 'same-origin' }))).toBe(true);
  });

  it('サブドメイン間（same-site）も true', () => {
    expect(hasSameOriginNavigation(h({ 'sec-fetch-site': 'same-site' }))).toBe(true);
  });

  it('大文字・前後空白が混ざっていても判定できる', () => {
    expect(hasSameOriginNavigation(h({ 'sec-fetch-site': ' Same-Origin ' }))).toBe(true);
  });

  it('アドレスバー直打ち（none）は false', () => {
    expect(hasSameOriginNavigation(h({ 'sec-fetch-site': 'none' }))).toBe(false);
  });

  it('外部サイトからの流入（cross-site）は false', () => {
    expect(hasSameOriginNavigation(h({ 'sec-fetch-site': 'cross-site' }))).toBe(false);
  });

  it('★ヘッダ自体が無い場合は false（＝今回のbotはここで落ちる）', () => {
    expect(hasSameOriginNavigation(h({}))).toBe(false);
    expect(hasSameOriginNavigation(h({ referer: 'https://my-naishin.com/hensachi' }))).toBe(false);
  });

  it('空文字は false', () => {
    expect(hasSameOriginNavigation(h({ 'sec-fetch-site': '' }))).toBe(false);
  });
});
